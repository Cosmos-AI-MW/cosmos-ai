import { z } from "zod";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Valid email required"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if email already exists
      const existing = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        throw new Error("An account with this email already exists.");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 12);

      // Create user
      await ctx.db.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          tier: "free",
          generationsUsed: 0,
          generationsLimit: 10,
          tierResetDate: new Date(),
        },
      });

      return { success: true };
    }),
});
