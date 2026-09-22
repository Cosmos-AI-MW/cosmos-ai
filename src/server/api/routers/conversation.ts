import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const conversationRouter = createTRPCRouter({
  // Get all conversations for the logged in user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.conversation.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true, role: true },
        },
      },
    });
  }),

  // Get a single conversation with all messages
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.conversation.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }),

  // Create a new conversation
  create: protectedProcedure
    .input(z.object({ title: z.string().default("New Conversation") }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.conversation.create({
        data: {
          userId: ctx.session.user.id,
          title: input.title,
        },
      });
    }),

  // Add a message to a conversation
  addMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify conversation belongs to user
      const conversation = await ctx.db.conversation.findFirst({
        where: { id: input.conversationId, userId: ctx.session.user.id },
      });

      if (!conversation) throw new Error("Conversation not found");

      // Add message
      const message = await ctx.db.conversationMessage.create({
        data: {
          conversationId: input.conversationId,
          role: input.role,
          content: input.content,
        },
      });

      // Update conversation updatedAt and auto-title from first user message
      if (input.role === "user" && conversation.title === "New Conversation") {
        await ctx.db.conversation.update({
          where: { id: input.conversationId },
          data: {
            updatedAt: new Date(),
            title:
              input.content.slice(0, 50) +
              (input.content.length > 50 ? "..." : ""),
          },
        });
      } else {
        await ctx.db.conversation.update({
          where: { id: input.conversationId },
          data: { updatedAt: new Date() },
        });
      }

      return message;
    }),

  // Delete a conversation
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.conversation.deleteMany({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      return { success: true };
    }),

  // Update conversation title
  updateTitle: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.conversation.update({
        where: { id: input.id },
        data: { title: input.title },
      });
      return { success: true };
    }),
});
