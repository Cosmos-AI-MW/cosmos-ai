import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// --- GET: Meta verification handshake ---
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// --- POST: Incoming messages / status updates ---
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry ?? []) {
        for (const change of entry.changes ?? []) {
          const value = change.value;

          if (value.messages) {
            for (const msg of value.messages) {
              console.log("New message from:", msg.from, "->", msg.text?.body);
              // TODO: save to DB via Prisma, or trigger a reply
            }
          }

          if (value.statuses) {
            for (const status of value.statuses) {
              console.log("Status update:", status.status, "for", status.id);
            }
          }
        }
      }
      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    }

    return new NextResponse("Not Found", { status: 404 });
  } catch (err) {
    console.error("Webhook POST error:", err);
    return new NextResponse("Server Error", { status: 500 });
  }
}
