import { db } from "~/server/db";
import { PLANS, type PlanKey, verifyTransaction } from "~/lib/paychangu";

export type WebActivationResult =
  | "activated"
  | "already"
  | "pending"
  | "failed"
  | "not_found";

export async function activateWebPayment(
  txRef: string,
): Promise<WebActivationResult> {
  const payment = await db.payment.findUnique({ where: { txRef } });
  if (!payment) return "not_found";
  if (payment.status === "completed") return "already";

  const verification = await verifyTransaction(txRef);
  const status = verification.data?.status;
  console.log(`Verify web ${txRef}: top=${verification.status} data=${status}`);

  if (status === "failed") {
    await db.payment.update({ where: { txRef }, data: { status: "failed" } });
    return "failed";
  }

  if (status !== "success" && status !== "successful") return "pending";

  const plan = PLANS[payment.tier as PlanKey];
  if (!plan) return "failed";

  // Claim first so the browser return and the webhook cannot both credit it
  const claimed = await db.payment.updateMany({
    where: { txRef, status: { not: "completed" } },
    data: { status: "completed" },
  });
  if (claimed.count === 0) return "already";

  try {
    await db.user.update({
      where: { id: payment.userId },
      data: {
        tier: payment.tier,
        generationsLimit: plan.generationsLimit,
        generationsUsed: 0,
        tierResetDate: new Date(),
      },
    });
  } catch (error) {
    // Crediting failed: release the claim so it can be retried
    await db.payment.update({ where: { txRef }, data: { status: "pending" } });
    throw error;
  }

  return "activated";
}
