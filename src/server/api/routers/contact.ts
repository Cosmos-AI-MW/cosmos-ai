import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const contactRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        organisation: z.string().optional(),
        email: z.string().email("Valid email required"),
        phone: z.string().optional(),
        service: z.string().optional(),
        message: z.string().min(1, "Message is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.contactSubmission.create({
        data: {
          name: input.name,
          organisation: input.organisation,
          email: input.email,
          phone: input.phone,
          service: input.service,
          message: input.message,
        },
      });
      return { success: true };
    }),

  markRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.contactSubmission.update({
        where: { id: input.id },
        data: { read: true },
      });
      return { success: true };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
});
