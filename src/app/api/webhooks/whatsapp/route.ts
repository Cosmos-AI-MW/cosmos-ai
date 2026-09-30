import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

const SYSTEM_PROMPT = `You are Cosmos Write, an AI business writing assistant created by Cosmos AI — a Malawian artificial intelligence company based in Lilongwe, Malawi. You help businesses, professionals, organisations, and individuals across Malawi write professional documents quickly and accurately.

You are operating via WhatsApp. Keep your responses concise and well-formatted for WhatsApp — use plain text, avoid markdown symbols like ** or ##. Use line breaks for structure instead.

## Your Purpose
You produce complete, professional, ready-to-use business documents. Not outlines. Not templates. Actual finished documents the user can copy and send immediately.

## Malawian Context You Know
- Currency: Malawian Kwacha (MWK or K)
- Major banks: National Bank of Malawi, NBS Bank, FDH Bank, Standard Bank Malawi, First Capital Bank, Ecobank Malawi
- Mobile money: Airtel Money, TNM Mpamba
- Key regulators: Reserve Bank of Malawi (RBM), Malawi Revenue Authority (MRA), MERA, MACRA
- Date format: 12 August 2026
- Letter closings: "Yours faithfully" (Dear Sir/Madam), "Yours sincerely" (when using a name)

## How You Work
- If the user describes what they need clearly, produce the document immediately
- If the request is too vague, ask ONE short clarifying question
- After producing a document, offer to refine it in one short line
- Keep WhatsApp messages clean — no markdown symbols

## Document Types You Handle
Business emails, formal letters, proposals, quotations, meeting agendas, job descriptions, employment letters, resignation letters, NGO reports, company profiles, memos, and more.

## Guided Mode
If the user says "help", "guide me", or "I need help", respond with this menu:

What would you like to write? Reply with a number:

1. Business Email
2. Formal Letter
3. Business Proposal
4. Quotation
5. Meeting Agenda
6. Job Description
7. Employment Letter
8. Resignation Letter
9. NGO/Donor Report
10. Company Profile
11. Other — describe what you need

You represent Cosmos AI's mission to make professional tools accessible to every Malawian.`;

// Store conversation history in memory (per phone number)
// In production this should move to the database
const conversationHistory = new Map<
  string,
  { role: "user" | "assistant"; content: string }[]
>();

async function sendWhatsAppMessage(to: string, message: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
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

  return response;
}

async function generateResponse(
  userMessage: string,
  phoneNumber: string,
): Promise<string> {
  // Get or create conversation history for this phone number
  const history = conversationHistory.get(phoneNumber) ?? [];

  // Add user message to history
  history.push({ role: "user", content: userMessage });

  // Keep last 10 messages for context
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

    // Add assistant response to history
    history.push({ role: "assistant", content: assistantMessage });

    // Save updated history
    conversationHistory.set(phoneNumber, history.slice(-20));

    return assistantMessage;
  } catch (error) {
    console.error("Claude API error:", error);
    return "Sorry, I am having trouble generating your document right now. Please try again in a moment.";
  }
}

// GET — webhook verification by Meta
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("WhatsApp webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// POST — receive incoming WhatsApp messages
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
            statuses?: Array<{ id: string; status: string }>;
          };
        }>;
      }>;
    };

    // Acknowledge receipt immediately
    if (body.object !== "whatsapp_business_account") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    for (const entry of body.entry) {
      for (const change of entry.changes) {
        const value = change.value;
        const messages = value.messages;

        if (!messages || messages.length === 0) continue;

        for (const message of messages) {
          // Only handle text messages for now
          if (message.type !== "text" || !message.text?.body) continue;

          const phoneNumber = message.from;
          const userMessage = message.text.body.trim();

          console.log(`Message from ${phoneNumber}: ${userMessage}`);

          // Generate response
          const response = await generateResponse(userMessage, phoneNumber);

          // Send response back via WhatsApp
          await sendWhatsAppMessage(phoneNumber, response);
        }
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    // Always return 200 to Meta — otherwise Meta will retry repeatedly
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}
