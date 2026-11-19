import { db } from "~/server/db";
import { triageEnquiry } from "~/lib/triage";
import { sendContactEmail } from "~/lib/contact-email";
import type { Triage } from "~/lib/triage-parse";

// Stops a flood of messages from running up the AI bill.
const AI_DAILY_LIMIT = 40;

// Runs after the visitor has already been told "Message received".
export async function processContactSubmission(id: string) {
  const s = await db.contactSubmission.findUnique({ where: { id } });
  if (!s) return;

  let triage: Triage | null = null;

  try {
    const usedToday = await db.contactSubmission.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        priority: { not: null },
      },
    });

    if (usedToday < AI_DAILY_LIMIT) {
      triage = await triageEnquiry({
        message: s.message,
        service: s.service,
        organisation: s.organisation,
      });

      if (triage) {
        await db.contactSubmission.update({
          where: { id },
          data: {
            summary: triage.summary,
            priority: triage.priority,
            category: triage.category,
          },
        });
      }
    } else {
      console.warn("Contact triage skipped: daily limit reached");
    }
  } catch (error) {
    console.error("Contact triage step failed:", error);
  }

  // The email goes out whether or not the AI step worked.
  try {
    await sendContactEmail(
      {
        id: s.id,
        name: s.name,
        organisation: s.organisation,
        email: s.email,
        phone: s.phone,
        service: s.service,
        message: s.message,
      },
      triage,
    );
  } catch (error) {
    console.error("Contact notification failed:", error);
  }
}
