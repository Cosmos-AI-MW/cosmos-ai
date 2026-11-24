import { z } from "zod";
import { after } from "next/server";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { processContactSubmission } from "~/lib/contact-process";

export const contactRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, "Name is required").max(120),
        organisation: z.string().trim().max(160).optional(),
        email: z.string().trim().email("Valid email required").max(254),
        phone: z.string().trim().max(40).optional(),
        service: z.string().trim().max(120).optional(),
        message: z.string().trim().min(1, "Message is required").max(5000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Save first, always.
      const submission = await ctx.db.contactSubmission.create({
        data: {
          name: input.name,
          organisation: input.organisation,
          email: input.email,
          phone: input.phone,
          service: input.service,
          message: input.message,
        },
      });

      // Summary, priority and the admin email happen after the response.
      const work = () =>
        processContactSubmission(submission.id).catch((err) =>
          console.error("Contact processing failed:", err),
        );
      try {
        after(work);
      } catch {
        void work();
      }

      return { success: true };
    }),

  markRead: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.contactSubmission.update({
        where: { id: input.id },
        data: { read: true },
      });
      return { success: true };
    }),

  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
});
