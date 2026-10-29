import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import {
  PLANS,
  type PlanKey,
  verifyTransaction,
  verifyWhatsAppPayment,
} from "~/lib/paychangu";
import { activateWhatsAppPayment } from "~/lib/whatsapp-payments";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    console.log("Paychangu webhook received:", rawBody);

    const body = JSON.parse(rawBody) as {
      event_type?: string;
      event?: string;
      status?: string;
      type?: string;
      charge_id?: string;
      tx_ref?: string;
      amount?: number;
      data?: {
        tx_ref?: string;
        charge_id?: string;
        status?: string;
        amount?: number;
        type?: string;
      };
    };

    console.log("Parsed webhook body:", JSON.stringify(body));

    // Determine event type
    const eventType = body.event_type ?? body.event ?? "";
    const isDirectCharge =
      eventType === "api.charge.payment" ||
      body.type === "Direct API Payment" ||
      body.data?.type === "Direct API Payment";

    console.log("Event type:", eventType);
    console.log("Is direct charge:", isDirectCharge);

    // Handle Direct Charge (WhatsApp mobile money)
    if (isDirectCharge) {
      const chargeId = body.charge_id ?? body.data?.charge_id;
      if (!chargeId) {
        return NextResponse.json({ status: "no charge_id" }, { status: 200 });
      }
      const result = await activateWhatsAppPayment(chargeId);
      console.log(`Direct charge ${chargeId}: ${result}`);
      return NextResponse.json({ status: result }, { status: 200 });
    }

    // Handle Hosted Checkout (web payments)
    const txRef = body.tx_ref ?? body.data?.tx_ref;
    console.log("TX Ref:", txRef);

    if (!txRef) {
      return NextResponse.json({ status: "no tx_ref" }, { status: 200 });
    }

    const payment = await db.payment.findUnique({ where: { txRef } });
    console.log("Web payment found:", JSON.stringify(payment));

    if (!payment || payment.status === "completed") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const verification = await verifyTransaction(txRef);
    console.log("Web verification:", JSON.stringify(verification));

    if (
      verification.status !== "success" ||
      verification.data?.status !== "successful"
    ) {
      await db.payment.update({
        where: { txRef },
        data: { status: "failed" },
      });
      return NextResponse.json(
        { status: "verification failed" },
        { status: 200 },
      );
    }

    const planKey = payment.tier as PlanKey;
    const plan = PLANS[planKey];

    if (!plan) {
      return NextResponse.json({ status: "unknown plan" }, { status: 200 });
    }

    await db.user.update({
      where: { id: payment.userId },
      data: {
        tier: planKey,
        generationsLimit: plan.generationsLimit,
        generationsUsed: 0,
        tierResetDate: new Date(),
      },
    });

    await db.payment.update({
      where: { txRef },
      data: { status: "completed" },
    });

    console.log(`User ${payment.userId} upgraded to ${planKey}`);
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Paychangu webhook error:", error);
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}
