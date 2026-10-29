import { db } from "~/server/db";
import { verifyWhatsAppPayment } from "~/lib/paychangu";

export type ActivationResult =
  | "activated"
  | "already"
  | "pending"
  | "failed"
  | "not_found";

export async function activateWhatsAppPayment(
  chargeId: string,
): Promise<ActivationResult> {
  const payment = await db.whatsAppPayment.findUnique({ where: { chargeId } });
  if (!payment) return "not_found";
  if (payment.status === "completed") return "already";

  const verification = await verifyWhatsAppPayment(chargeId);
  const status = verification.data?.status;
  console.log(`Verify ${chargeId}: top=${verification.status} data=${status}`);

  if (status === "failed") {
    await db.whatsAppPayment.update({
      where: { chargeId },
      data: { status: "failed" },
    });
    return "failed";
  }

  if (status !== "success" && status !== "successful") return "pending";

  // Claim the payment first so two callers cannot both credit it
  const claimed = await db.whatsAppPayment.updateMany({
    where: { chargeId, status: { not: "completed" } },
    data: { status: "completed" },
  });
  if (claimed.count === 0) return "already";

  const now = new Date();
  const resetDate = new Date(now);
  resetDate.setDate(resetDate.getDate() + 30);

  const existing = await db.whatsAppUser.findUnique({
    where: { phoneNumber: payment.phoneNumber },
  });
  const stillActive =
    existing?.isPaid &&
    existing.monthlyResetAt &&
    existing.monthlyResetAt > now;

  if (existing && stillActive) {
    // Stack: add 50 more prompts and extend the period
    await db.whatsAppUser.update({
      where: { phoneNumber: payment.phoneNumber },
      data: {
        monthlyLimit: { increment: 50 },
        monthlyResetAt: resetDate,
      },
    });
  } else {
    await db.whatsAppUser.upsert({
      where: { phoneNumber: payment.phoneNumber },
      update: {
        isPaid: true,
        monthlyCount: 0,
        monthlyLimit: 50,
        monthlyResetAt: resetDate,
      },
      create: {
        phoneNumber: payment.phoneNumber,
        isPaid: true,
        dailyCount: 0,
        dailyLimit: 5,
        dailyResetAt: now,
        monthlyCount: 0,
        monthlyLimit: 50,
        monthlyResetAt: resetDate,
      },
    });
  }

  return "activated";
}
