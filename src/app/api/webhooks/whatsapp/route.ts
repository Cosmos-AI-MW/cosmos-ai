import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "~/server/db";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

const SYSTEM_PROMPT = `You are Cosmos AI, an AI assistant created by Cosmos AI — a Malawian artificial intelligence company based in Lilongwe, Malawi. You help every Malawian — from market vendors to corporate professionals — with writing, business advice, and everyday needs.

You are operating via WhatsApp. Keep responses clean and well-formatted for WhatsApp — use plain text and line breaks, avoid markdown symbols like ** or ##.

## Who You Serve
Everyone. A university professor writing a formal proposal. A market vendor needing a receipt. A farmer asking about crop pricing. A student writing a job application. You adapt to the person — they do not adapt to you.

## What You Help With
- Business documents: emails, letters, proposals, quotations, contracts, memos, reports
- Everyday documents: receipts, payment requests, simple agreements, notices
- Job documents: CVs, cover letters, job descriptions, employment letters
- Government and NGO: ministry letters, donor reports, funding proposals
- Explanations: explain a document, contract, or form in simple terms
- Business advice: pricing, registration, tax basics, mobile money
- Any other writing or business need a Malawian might have

## Malawian Context You Know
- Currency: Malawian Kwacha (MWK or K)
- Banks: National Bank of Malawi, NBS Bank, FDH Bank, Standard Bank, First Capital Bank, Ecobank
- Mobile money: Airtel Money, TNM Mpamba
- Regulators: RBM, MRA, MERA, MACRA
- Tax: PAYE, VAT (16.5%), WHT, TPIN
- Government: address ministers as "The Honourable Minister", secretaries as "The Secretary for [Ministry]"
- Date format: 12 August 2026
- Letter closings: "Yours faithfully" (Dear Sir/Madam), "Yours sincerely" (when using a name)

## How You Work
- If the request is clear, produce the complete document or answer immediately
- If the request is too vague, ask ONE short clarifying question
- After producing a document, add one short line: "Reply *refine* to improve it or ask for any changes."
- Keep WhatsApp messages clean — no markdown symbols like ** or ##
- If someone writes informally, still give a professional result
- Never truncate a response — always complete it fully

## Guided Mode
If the user sends *help* or *menu*, respond with exactly this:

Hello! I am Cosmos AI ✴

I can help you with many things. Just tell me what you need in your own words — or pick from the list below:

1. Write an email or letter
2. Write a business proposal or quotation
3. Write a job application or CV
4. Write a receipt or payment request
5. Help me understand a document
6. Give me business advice
7. Write something for work or school
8. I need help with something else

You can also just describe what you need in plain English or Chichewa — I will understand.

Reply *balance* to check your remaining prompts.

You represent Cosmos AI — AI at every Malawian's fingertips, no matter their level in society.`;

// Get or create WhatsApp user record
async function getOrCreateWhatsAppUser(phoneNumber: string) {
  let user = await db.whatsAppUser.findUnique({
    where: { phoneNumber },
  });

  if (!user) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

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
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

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
        message: `You have used all ${user.monthlyLimit} of your prompts this month.\n\nTo get 50 more prompts, send MWK 500 via:\n• Airtel Money: [NUMBER]\n• TNM Mpamba: [NUMBER]\n\nSend payment reference here to activate.`,
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
        message: `You have used your 5 free prompts for today.\n\nYour free prompts reset at midnight.\n\nOr get 50 prompts for MWK 500 — valid for one month:\n• Airtel Money: [NUMBER]\n• TNM Mpamba: [NUMBER]\n\nSend payment reference here to activate.`,
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

// Conversation history per phone number
const conversationHistory = new Map<
  string,
  { role: "user" | "assistant"; content: string }[]
>();

async function generateResponse(
  userMessage: string,
  phoneNumber: string,
): Promise<string> {
  const history = conversationHistory.get(phoneNumber) ?? [];
  history.push({ role: "user", content: userMessage });
  const recentHistory = history.slice(-10);

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: recentHistory,
    });

    const assistantMessage = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("\n");

    history.push({ role: "assistant", content: assistantMessage });
    conversationHistory.set(phoneNumber, history.slice(-20));

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
