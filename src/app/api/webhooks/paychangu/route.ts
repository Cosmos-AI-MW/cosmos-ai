import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import {
  PLANS,
  type PlanKey,
  verifyTransaction,
  verifyWhatsAppPayment,
} from "~/lib/paychangu";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      event_type?: string;
      event?: string;
      data?: {
        tx_ref?: string;
        charge_id?: string;
        status?: string;
        amount?: number;
        type?: string;
      };
      charge?: {
        charge_id?: string;
        status?: string;
        type?: string;
      };
    };

    // Determine event type
    const eventType = body.event_type ?? body.event ?? "";
    const isDirectCharge =
      eventType === "api.charge.payment" ||
      body.data?.type === "Direct API Payment";
    const isHostedCheckout = !isDirectCharge;

    // Handle Direct Charge (WhatsApp mobile money)
    if (isDirectCharge) {
      const chargeId = body.data?.charge_id ?? body.charge?.charge_id;

      if (!chargeId) {
        return NextResponse.json({ status: "no charge_id" }, { status: 200 });
      }

      // Find WhatsApp payment record
      const whatsappPayment = await db.whatsAppPayment.findUnique({
        where: { chargeId },
      });

      if (!whatsappPayment) {
        return NextResponse.json(
          { status: "not a whatsapp payment" },
          { status: 200 },
        );
      }

      if (whatsappPayment.status === "completed") {
        return NextResponse.json(
          { status: "already processed" },
          { status: 200 },
        );
      }

      // Verify with Paychangu
      const verification = await verifyWhatsAppPayment(chargeId);

      if (
        verification.status !== "success" ||
        verification.data?.status !== "success"
      ) {
        await db.whatsAppPayment.update({
          where: { chargeId },
          data: { status: "failed" },
        });
        return NextResponse.json(
          { status: "verification failed" },
          { status: 200 },
        );
      }

      // Unlock 50 prompts for 30 days
      const now = new Date();
      const resetDate = new Date(now);
      resetDate.setDate(resetDate.getDate() + 30);

      await db.whatsAppUser.upsert({
        where: { phoneNumber: whatsappPayment.phoneNumber },
        update: {
          isPaid: true,
          monthlyCount: 0,
          monthlyLimit: 50,
          monthlyResetAt: resetDate,
          dailyLimit: 50,
        },
        create: {
          phoneNumber: whatsappPayment.phoneNumber,
          isPaid: true,
          dailyCount: 0,
          dailyLimit: 50,
          dailyResetAt: new Date(),
          monthlyCount: 0,
          monthlyLimit: 50,
          monthlyResetAt: resetDate,
        },
      });

      // Mark payment completed
      await db.whatsAppPayment.update({
        where: { chargeId },
        data: { status: "completed" },
      });

      console.log(
        `WhatsApp user ${whatsappPayment.phoneNumber} unlocked 50 prompts`,
      );
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    // Handle Hosted Checkout (web payments)
    if (isHostedCheckout) {
      const txRef = body.data?.tx_ref;

      if (!txRef) {
        return NextResponse.json({ status: "no tx_ref" }, { status: 200 });
      }

      const payment = await db.payment.findUnique({ where: { txRef } });

      if (!payment || payment.status === "completed") {
        return NextResponse.json({ status: "ignored" }, { status: 200 });
      }

      // Verify with Paychangu
      const verification = await verifyTransaction(txRef);

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

      console.log(
        `User ${payment.userId} upgraded to ${planKey} via Paychangu`,
      );
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    return NextResponse.json({ status: "ignored" }, { status: 200 });
  } catch (error) {
    console.error("Paychangu webhook error:", error);
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}
