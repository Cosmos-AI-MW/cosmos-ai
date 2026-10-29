import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { detectNetwork, initiateWhatsAppPayment } from "~/lib/paychangu";
import { db } from "~/server/db";
// import { CHICHEWA_REFERENCE } from "~/lib/chichewa-reference";
import { activateWhatsAppPayment } from "~/lib/whatsapp-payments";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

async function getWhatsAppPrompt(): Promise<string> {
  try {
    const prompt = await db.systemPrompt.findUnique({
      where: { name: "whatsapp" },
    });
    return (
      prompt?.content ??
      "You are Cosmos AI, an AI assistant created by Cosmos AI — a Malawian artificial intelligence company based in Lilongwe, Malawi."
    );
  } catch {
    return "You are Cosmos AI, an AI assistant created by Cosmos AI — a Malawian artificial intelligence company based in Lilongwe, Malawi.";
  }
}

// Get or create WhatsApp user record
async function getOrCreateWhatsAppUser(phoneNumber: string) {
  let user = await db.whatsAppUser.findUnique({
    where: { phoneNumber },
  });

  if (!user) {
    const now = new Date();
    // Reset at midnight CAT (UTC+2)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    // Adjust for CAT (UTC+2) — subtract 2 hours to get UTC midnight CAT
    tomorrow.setTime(tomorrow.getTime() - 2 * 60 * 60 * 1000);

    user = await db.whatsAppUser.create({
      data: {
        phoneNumber,
        dailyCount: 0,
        dailyLimit: 5,
        dailyResetAt: tomorrow,
        monthlyCount: 0,
        monthlyLimit: 0,
        monthlyResetAt: null,
        isPaid: false,
      },
    });
  }

  return user;
}

// Check and reset daily/monthly limits
async function checkAndResetLimits(phoneNumber: string) {
  const user = await getOrCreateWhatsAppUser(phoneNumber);
  const now = new Date();

  // Reset daily count if past midnight
  if (user.dailyResetAt && now >= user.dailyResetAt) {
    // Reset at midnight CAT (UTC+2)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    // Adjust for CAT (UTC+2) — subtract 2 hours to get UTC midnight CAT
    tomorrow.setTime(tomorrow.getTime() - 2 * 60 * 60 * 1000);

    await db.whatsAppUser.update({
      where: { phoneNumber },
      data: {
        dailyCount: 0,
        dailyResetAt: tomorrow,
      },
    });
    user.dailyCount = 0;
  }

  // Reset monthly count if past reset date
  if (user.isPaid && user.monthlyResetAt && now >= user.monthlyResetAt) {
    await db.whatsAppUser.update({
      where: { phoneNumber },
      data: {
        isPaid: false,
        monthlyCount: 0,
        monthlyLimit: 0,
        monthlyResetAt: null,
        dailyLimit: 5,
      },
    });
    user.isPaid = false;
    user.monthlyCount = 0;
    user.monthlyLimit = 0;
    user.monthlyResetAt = null;
  }

  return user;
}

// Check if user can generate
async function canGenerate(phoneNumber: string): Promise<{
  allowed: boolean;
  remaining: number;
  isPaid: boolean;
  message?: string;
}> {
  const user = await checkAndResetLimits(phoneNumber);

  if (user.isPaid) {
    const remaining = Math.max(0, user.monthlyLimit - user.monthlyCount);
    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        isPaid: true,
        message: `You have used all ${user.monthlyLimit} of your prompts this month.\n\nTo get 50 more prompts for MWK 500, reply with your Airtel Money or TNM Mpamba number.\nExample: 0991234567`,
      };
    }
    return { allowed: true, remaining, isPaid: true };
  } else {
    const remaining = Math.max(0, user.dailyLimit - user.dailyCount);
    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        isPaid: false,
        message: `You have used your 5 free prompts for today.\n\nYour free prompts reset at midnight.\n\nOr get 50 prompts for MWK 500 — valid for one month.\n\nTo pay, reply with your Airtel Money or TNM Mpamba number.\nExample: 0991234567`,
      };
    }
    return { allowed: true, remaining, isPaid: false };
  }
}

// Increment usage count
async function incrementUsage(phoneNumber: string) {
  const user = await db.whatsAppUser.findUnique({ where: { phoneNumber } });
  if (!user) return;

  if (user.isPaid) {
    await db.whatsAppUser.update({
      where: { phoneNumber },
      data: { monthlyCount: { increment: 1 } },
    });
  } else {
    await db.whatsAppUser.update({
      where: { phoneNumber },
      data: { dailyCount: { increment: 1 } },
    });
  }
}

// Get balance message
async function getBalanceMessage(phoneNumber: string): Promise<string> {
  const user = await checkAndResetLimits(phoneNumber);

  if (user.isPaid) {
    const remaining = Math.max(0, user.monthlyLimit - user.monthlyCount);
    const resetDate = user.monthlyResetAt
      ? new Date(user.monthlyResetAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "end of month";
    return `Your Cosmos AI balance ✴\n\nPlan: Paid (50 prompts/month)\nUsed: ${user.monthlyCount}\nRemaining: ${remaining}\nResets: ${resetDate}\n\nReply *help* to see what I can help with.`;
  } else {
    const remaining = Math.max(0, user.dailyLimit - user.dailyCount);
    const resetTime = user.dailyResetAt
      ? new Date(user.dailyResetAt).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "midnight";
    return `Your Cosmos AI balance ✴\n\nPlan: Free (5 prompts/day)\nUsed today: ${user.dailyCount}\nRemaining today: ${remaining}\nResets at: ${resetTime}\n\nGet 50 prompts for MWK 500 — lasts one month.\nReply *help* to see what I can help with.`;
  }
}

// Track users awaiting payment number input
const awaitingPaymentNumber = new Set<string>();

async function handlePaymentNumber(
  phoneNumber: string,
  mobileNumber: string,
): Promise<string> {
  const network = detectNetwork(mobileNumber);

  const recent = await db.whatsAppPayment.findFirst({
    where: {
      phoneNumber,
      status: "pending",
      createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
    },
  });
  if (recent) {
    return "You already have a payment request waiting for approval.\n\nPlease check your phone and enter your PIN, or wait a few minutes before trying again.";
  }

  if (!network) {
    return `That does not look like a valid Malawian mobile number.\n\nPlease send your Airtel Money or TNM Mpamba number.\nExample: 0991234567`;
  }

  const networkName = network === "airtel" ? "Airtel Money" : "TNM Mpamba";
  const chargeId = `WA-${phoneNumber.slice(-9)}-${Date.now()}`;

  try {
    await initiateWhatsAppPayment({
      mobile: mobileNumber,
      chargeId,
      amount: 500,
    });

    // Save pending payment to database
    await db.whatsAppPayment.create({
      data: {
        phoneNumber,
        chargeId,
        amount: 500,
        status: "pending",
      },
    });

    awaitingPaymentNumber.delete(phoneNumber);

    return `A payment request of MWK 500 has been sent to ${mobileNumber} via ${networkName}.\n\nCheck your phone for a prompt and enter your PIN to confirm.\n\nYour 50 prompts will be activated automatically once payment is confirmed.`;
  } catch (error) {
    awaitingPaymentNumber.delete(phoneNumber);
    const message =
      error instanceof Error ? error.message : "Payment request failed";
    return `Sorry, the payment request failed.\n\n${message}\n\nPlease try again or contact us at hello@cosmosai.mw`;
  }
}

async function generateResponse(
  userMessage: string,
  phoneNumber: string,
): Promise<string> {
  // Load last 10 messages from database for context
  const history = await db.whatsAppMessage.findMany({
    where: { phoneNumber },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Reverse to get chronological order
  const messages = history.reverse().map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Add current user message
  messages.push({ role: "user", content: userMessage });

  try {
    const systemPrompt = await getWhatsAppPrompt();

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const assistantMessage = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("\n");

    // Save both messages to database — fire and forget
    void Promise.all([
      db.whatsAppMessage.create({
        data: { phoneNumber, role: "user", content: userMessage },
      }),
      db.whatsAppMessage.create({
        data: { phoneNumber, role: "assistant", content: assistantMessage },
      }),
    ]).catch((err) => console.error("Failed to save WhatsApp message:", err));

    return assistantMessage;
  } catch (error) {
    console.error("Claude API error:", error);
    return "Sorry, I am having trouble right now. Please try again in a moment.";
  }
}

async function sendWhatsAppMessage(to: string, message: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  const response = await fetch(
    `https://graph.facebook.com/v26.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("WhatsApp send error:", error);
  }
}

// GET — webhook verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// POST — receive messages
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      object: string;
      entry: Array<{
        changes: Array<{
          value: {
            messages?: Array<{
              from: string;
              type: string;
              text?: { body: string };
              id: string;
            }>;
          };
        }>;
      }>;
    };

    if (body.object !== "whatsapp_business_account") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    for (const entry of body.entry) {
      for (const change of entry.changes) {
        const messages = change.value.messages;
        if (!messages?.length) continue;

        for (const message of messages) {
          if (message.type !== "text" || !message.text?.body) continue;

          const phoneNumber = message.from;
          const userMessage = message.text.body.trim().toLowerCase();

          // Fallback: verify ALL recent pending payments for this number
          const pendingPayments = await db.whatsAppPayment.findMany({
            where: {
              phoneNumber,
              status: "pending",
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
            orderBy: { createdAt: "asc" },
          });

          let activatedCount = 0;
          for (const p of pendingPayments) {
            const result = await activateWhatsAppPayment(p.chargeId);
            if (result === "activated") activatedCount++;
          }

          if (activatedCount > 0) {
            await sendWhatsAppMessage(
              phoneNumber,
              `Payment confirmed ✴\n\n${activatedCount} payment(s) received. Your prompts are now active for 30 days.\n\nReply balance to check your prompts, then send your request.`,
            );
            continue;
          }

          // Handle commands
          // Check if user is in payment flow
          if (awaitingPaymentNumber.has(phoneNumber)) {
            const response = await handlePaymentNumber(
              phoneNumber,
              message.text.body.trim(),
            );
            await sendWhatsAppMessage(phoneNumber, response);
            continue;
          }

          // Detect if user sent a mobile number (payment intent)
          const mobileNumberPattern = /^(\+?265|0)(99|98|77|88|89)\d{7}$/;
          if (
            mobileNumberPattern.test(
              message.text.body.trim().replace(/\s/g, ""),
            )
          ) {
            const response = await handlePaymentNumber(
              phoneNumber,
              message.text.body.trim(),
            );
            await sendWhatsAppMessage(phoneNumber, response);
            continue;
          }

          // Handle commands
          if (userMessage === "*balance*" || userMessage === "balance") {
            const balanceMsg = await getBalanceMessage(phoneNumber);
            await sendWhatsAppMessage(phoneNumber, balanceMsg);
            continue;
          }

          if (
            userMessage === "*help*" ||
            userMessage === "help" ||
            userMessage === "menu" ||
            userMessage === "*menu*"
          ) {
            const response = await generateResponse(
              "Show me the help menu",
              phoneNumber,
            );
            await sendWhatsAppMessage(phoneNumber, response);
            continue;
          }

          // Check limits
          const limitCheck = await canGenerate(phoneNumber);
          if (!limitCheck.allowed) {
            awaitingPaymentNumber.add(phoneNumber);
            await sendWhatsAppMessage(phoneNumber, limitCheck.message!);
            continue;
          }

          // Generate response
          const originalMessage = message.text.body.trim();
          const response = await generateResponse(originalMessage, phoneNumber);
          await sendWhatsAppMessage(phoneNumber, response);

          // Increment usage
          await incrementUsage(phoneNumber);
        }
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}
