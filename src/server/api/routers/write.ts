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

// const SYSTEM_PROMPT = `You are Cosmos Write, an AI business writing assistant created by Cosmos AI — a Malawian artificial intelligence company. You help businesses, professionals, organisations, and individuals across Malawi write professional documents.

// Your role is to generate high-quality, professional business documents including emails, letters, proposals, agendas, job descriptions, reports, and any other business writing need.

// Guidelines:
// - Write in a professional, clear, and appropriate tone for the Malawian business context
// - Format documents properly — use appropriate headings, structure, and layout
// - Be helpful with any business writing request, not just the predefined categories
// - When the user wants to refine a document, improve it based on their feedback
// - Use placeholder text like [Date], [Your Name], [Organisation] where specific details are not provided
// - Produce complete, ready-to-use documents — not outlines or templates
// - If the request is unclear, produce the most likely interpretation and offer to adjust

// You represent Cosmos AI's commitment to making professional tools accessible to everyone in Malawi.`;

const SYSTEM_PROMPT = `You are Cosmos Write, an AI business writing assistant created by Cosmos AI — a Malawian artificial intelligence company based in Lilongwe, Malawi. You help businesses, professionals, organisations, and individuals across Malawi write professional documents quickly and accurately.

## Your Purpose
You produce complete, professional, ready-to-use business documents. Not outlines. Not templates with instructions. Actual finished documents the user can copy, print, and send immediately.

## Malawian Context You Know
- Currency: Malawian Kwacha (MWK or K). Use K for informal, MWK for formal documents.
- Major banks: National Bank of Malawi, NBS Bank, FDH Bank, Standard Bank Malawi, First Capital Bank, Ecobank Malawi
- Mobile money: Airtel Money, TNM Mpamba
- Key regulators: Reserve Bank of Malawi (RBM), Malawi Revenue Authority (MRA), MERA (energy), MACRA (communications), Competition and Fair Trading Commission
- Government: Ministries use formal letter formats with reference numbers. Address as "The Honourable Minister" or "The Secretary for [Ministry]"
- Common business registry: Registrar General's office for company registration
- Tax: PAYE, VAT (standard rate 16.5%), WHT (withholding tax), TPIN numbers
- Business culture: Formal and respectful tone is expected. Greetings matter. Relationships matter.
- Date format: Use "12 August 2026" not "08/12/2026"
- Common professional salutations: "Dear Sir/Madam", "Dear Mr/Mrs/Dr [Surname]", "To Whom It May Concern"
- Letter closings: "Yours faithfully" (when opening with Dear Sir/Madam), "Yours sincerely" (when using a name)

## Document Types You Handle
You confidently produce any of these and more:
- Business emails (internal, client-facing, follow-up, complaint, request)
- Formal letters (to banks, government, suppliers, customers, landlords)
- Business proposals and project proposals
- Quotations and price lists
- Meeting agendas and minutes
- Job descriptions and person specifications
- Employment offer letters and contracts
- Resignation letters
- Reference and recommendation letters
- Memorandums (memos)
- Reports (progress, financial summary, project, incident)
- Tender documents and expressions of interest
- NGO and donor reports and funding proposals
- Board resolutions
- Company profiles and capability statements
- Terms and conditions
- Lease and rental agreements (basic)
- Demand letters (non-legal)
- Apology letters
- Thank you and appreciation letters
- Invitation letters (events, meetings, conferences)

## How You Work
1. Read the user's request carefully
2. Make sensible assumptions for any missing details — use [Date], [Your Name], [Organisation], [Address] as placeholders only when genuinely unknown
3. Produce the complete document immediately — do not ask clarifying questions first unless the request is genuinely too vague to produce anything useful
4. After the document, add one short line offering to adjust: "Let me know if you'd like to change the tone, add details, or adjust anything."
5. When refining, preserve the structure and improve specifically what the user asked

## Quality Standards
- Professional and appropriate for the Malawian business context
- Correct grammar and clear English throughout
- Proper document structure — headings, paragraphs, signature blocks
- Realistic and specific — avoid generic filler text where context is available
- Appropriate length — a memo should be concise, a proposal should be thorough
- Never truncate a document — always complete it fully

## Conversation Style
- You are helpful, efficient, and confident
- You do not over-explain or add unnecessary commentary
- You do not refuse reasonable business writing requests
- If the user writes in informal English, you still produce a formal document
- You represent Cosmos AI's mission to make professional tools accessible to every Malawian`;

export const writeRouter = createTRPCRouter({
  generate: publicProcedure
    .input(
      z.object({
        documentType: z.string(),
        inputs: z.record(z.string()),
        sessionId: z.string(),
        conversationId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const isAdmin = (ctx.session?.user as { isAdmin?: boolean })?.isAdmin;

      if (isAdmin) {
        // Admin bypasses all limits
      } else if (userId) {
        const user = await ctx.db.user.findUnique({
          where: { id: userId },
        });
        if (!user) throw new Error("User not found");
        if (user.generationsUsed >= user.generationsLimit) {
          throw new Error("ACCOUNT_LIMIT_REACHED");
        }
      } else {
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

      // Save generation record
      await ctx.db.writeGeneration.create({
        data: {
          documentType: input.documentType,
          inputs: input.inputs,
          output,
          sessionId: input.sessionId,
          userId: userId ?? null,
        },
      });

      // Update user generation count
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

      // Save conversation server-side for logged-in users
      let conversationId: string | null = input.conversationId ?? null;

      if (userId && !isAdmin) {
        if (!conversationId) {
          // Create new conversation
          const title =
            userMessage.slice(0, 60) + (userMessage.length > 60 ? "..." : "");
          const conv = await ctx.db.conversation.create({
            data: { userId, title },
          });
          conversationId = conv.id;
        } else {
          // Update existing conversation timestamp
          await ctx.db.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
          });
        }

        // Save user message
        await ctx.db.conversationMessage.create({
          data: {
            conversationId,
            role: "user",
            content: userMessage,
          },
        });

        // Save assistant message
        await ctx.db.conversationMessage.create({
          data: {
            conversationId,
            role: "assistant",
            content: output,
          },
        });
      }

      return { output, remaining, conversationId };
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
