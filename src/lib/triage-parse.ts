import { z } from "zod";

export const PRIORITIES = ["high", "medium", "low", "spam"] as const;
export type Priority = (typeof PRIORITIES)[number];

export type Triage = {
  priority: Priority;
  category: string;
  summary: string;
  keyFacts: string[];
  suggestedReply: string | null;
};

const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

const rawSchema = z.object({
  priority: z.string(),
  category: z.string().optional(),
  summary: z.string(),
  keyFacts: z.array(z.string()).optional(),
  suggestedReply: z.string().nullable().optional(),
});

// Turns the model's reply into a safe, bounded Triage, or null if anything is off.
export function parseTriage(text: string): Triage | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;

  let json: unknown;
  try {
    json = JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }

  const parsed = rawSchema.safeParse(json);
  if (!parsed.success) return null;
  const d = parsed.data;

  const priority = d.priority.toLowerCase().trim();
  if (!(PRIORITIES as readonly string[]).includes(priority)) return null;

  const summary = d.summary.trim().slice(0, 700);
  if (!summary) return null;

  const reply = d.suggestedReply?.trim().slice(0, 900);

  return {
    priority: priority as Priority,
    category: oneLine(d.category ?? "other").slice(0, 40) || "other",
    summary,
    keyFacts: (d.keyFacts ?? [])
      .map((f) => oneLine(f).slice(0, 160))
      .filter(Boolean)
      .slice(0, 6),
    suggestedReply: priority === "spam" || !reply ? null : reply,
  };
}
