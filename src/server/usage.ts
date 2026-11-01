import { db } from "~/server/db";

export function addOneMonth(date: Date): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  return d;
}

export function isResetDue(tierResetDate: Date, now: Date): boolean {
  return addOneMonth(tierResetDate) <= now;
}

// Returns the user, resetting their monthly usage first if the month is up.
export async function resetMonthlyIfDue(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const now = new Date();
  if (!isResetDue(user.tierResetDate, now)) return user;

  // Only one request can win this update, so no double resets
  const claimed = await db.user.updateMany({
    where: { id: userId, tierResetDate: user.tierResetDate },
    data: { generationsUsed: 0, tierResetDate: now },
  });

  if (claimed.count === 0) {
    return db.user.findUnique({ where: { id: userId } });
  }
  return { ...user, generationsUsed: 0, tierResetDate: now };
}
