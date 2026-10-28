import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { PLANS, type PlanKey, verifyTransaction } from "~/lib/paychangu";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      event: string;
      data?: {
        tx_ref: string;
        status: string;
        amount: number;
        currency: string;
        meta?: string;
      };
    };

    // Only process successful payments
    if (
      body.event !== "payment.success" &&
      body.data?.status !== "successful"
    ) {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const txRef = body.data?.tx_ref;
    if (!txRef) {
      return NextResponse.json({ status: "no tx_ref" }, { status: 200 });
    }

    // Find the payment record
    const payment = await db.payment.findUnique({
      where: { txRef },
    });

    if (!payment) {
      console.error(`Payment record not found for tx_ref: ${txRef}`);
      return NextResponse.json(
        { status: "payment not found" },
        { status: 200 },
      );
    }

    if (payment.status === "completed") {
      return NextResponse.json(
        { status: "already processed" },
        { status: 200 },
      );
    }

    // Verify with Paychangu API
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

    // Get plan details
    const planKey = payment.tier as PlanKey;
    const plan = PLANS[planKey];

    if (!plan) {
      console.error(`Unknown plan: ${planKey}`);
      return NextResponse.json({ status: "unknown plan" }, { status: 200 });
    }

    // Upgrade user tier
    await db.user.update({
      where: { id: payment.userId },
      data: {
        tier: planKey,
        generationsLimit: plan.generationsLimit,
        generationsUsed: 0,
        tierResetDate: new Date(),
      },
    });

    // Mark payment as completed
    await db.payment.update({
      where: { txRef },
      data: { status: "completed" },
    });

    console.log(`User ${payment.userId} upgraded to ${planKey} via Paychangu`);

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Paychangu webhook error:", error);
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}
