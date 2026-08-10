import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { env } from "~/env";

const client = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY ?? "",
});

const SYSTEM_PROMPT = `You are Cosmos Write, an AI business writing assistant created by Cosmos AI — a Malawian artificial intelligence company. You help businesses, professionals, organisations, and individuals across Malawi write professional documents.

Your role is to generate high-quality, professional business documents including emails, letters, proposals, agendas, job descriptions, reports, and any other business writing need.

Guidelines:
- Write in a professional, clear, and appropriate tone for the Malawian business context
- Format documents properly — use appropriate headings, structure, and layout
- Be helpful with any business writing request, not just the predefined categories
- When the user wants to refine a document, improve it based on their feedback
- Use placeholder text like [Date], [Your Name], [Organisation] where specific details are not provided
- Produce complete, ready-to-use documents — not outlines or templates
- If the request is unclear, produce the most likely interpretation and offer to adjust

You represent Cosmos AI's commitment to making professional tools accessible to everyone in Malawi.`;

export const writeRouter = createTRPCRouter({
  generate: publicProcedure
    .input(
      z.object({
        documentType: z.string(),
        inputs: z.record(z.string()),
        sessionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const isAdmin = (ctx.session?.user as { isAdmin?: boolean })?.isAdmin;

      if (isAdmin) {
        // Admin bypasses all limits — do nothing
      } else if (userId) {
        // Logged in user — check account generations
        const user = await ctx.db.user.findUnique({
          where: { id: userId },
        });

        if (!user) throw new Error("User not found");

        if (user.generationsUsed >= user.generationsLimit) {
          throw new Error("ACCOUNT_LIMIT_REACHED");
        }
      } else {
        // Anonymous session — max 3 free generations
        const sessionCount = await ctx.db.writeGeneration.count({
          where: { sessionId: input.sessionId, userId: null },
        });

        if (sessionCount >= 3) {
          throw new Error("FREE_LIMIT_REACHED");
        }
      }

      // Build conversation history
      type HistoryMessage = { role: "user" | "assistant"; content: string };
      let history: HistoryMessage[] = [];
      try {
        history = JSON.parse(input.inputs.history ?? "[]") as HistoryMessage[];
      } catch {
        history = [];
      }

      const userMessage = input.inputs.message ?? "";
      const messages: { role: "user" | "assistant"; content: string }[] = [
        ...history,
        { role: "user", content: userMessage },
      ];

      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages,
      });

      const output = response.content
        .filter((block) => block.type === "text")
        .map((block) => (block as { type: "text"; text: string }).text)
        .join("\n");

      // Save generation
      await ctx.db.writeGeneration.create({
        data: {
          documentType: input.documentType,
          inputs: input.inputs,
          output,
          sessionId: input.sessionId,
          userId: userId ?? null,
        },
      });

      // Update user generation count if logged in
      if (userId && !isAdmin) {
        await ctx.db.user.update({
          where: { id: userId },
          data: { generationsUsed: { increment: 1 } },
        });
      }

      // Calculate remaining
      let remaining = 0;
      if (isAdmin) {
        remaining = 999;
      } else if (userId) {
        const updated = await ctx.db.user.findUnique({ where: { id: userId } });
        remaining = Math.max(
          0,
          (updated?.generationsLimit ?? 10) - (updated?.generationsUsed ?? 0),
        );
      } else {
        const sessionCount = await ctx.db.writeGeneration.count({
          where: { sessionId: input.sessionId, userId: null },
        });
        remaining = Math.max(0, 3 - sessionCount);
      }

      return { output, remaining };
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [total, byType, recent] = await Promise.all([
      ctx.db.writeGeneration.count(),
      ctx.db.writeGeneration.groupBy({
        by: ["documentType"],
        _count: { documentType: true },
        orderBy: { _count: { documentType: "desc" } },
      }),
      ctx.db.writeGeneration.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          documentType: true,
          createdAt: true,
          sessionId: true,
        },
      }),
    ]);

    return { total, byType, recent };
  }),
});
