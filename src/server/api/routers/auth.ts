import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { sendVerificationEmail } from "~/lib/email";

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

      // Create verification token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await ctx.db.emailVerificationToken.create({
        data: { email: input.email, token, expires },
      });

      // Send verification email
      const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      await sendVerificationEmail(input.email, token, baseUrl);

      return { success: true };
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const verificationToken = await ctx.db.emailVerificationToken.findUnique({
        where: { token: input.token },
      });

      if (!verificationToken) {
        throw new Error("Invalid or expired verification link.");
      }

      if (new Date() > verificationToken.expires) {
        await ctx.db.emailVerificationToken.delete({
          where: { token: input.token },
        });
        throw new Error(
          "Verification link has expired. Please register again.",
        );
      }

      // Mark user as verified
      await ctx.db.user.update({
        where: { email: verificationToken.email },
        data: { emailVerified: new Date() },
      });

      // Delete used token
      await ctx.db.emailVerificationToken.delete({
        where: { token: input.token },
      });

      return { success: true };
    }),
});
