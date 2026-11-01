import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import { resetMonthlyIfDue } from "~/server/usage";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      tier: string;
      generationsUsed: number;
      generationsLimit: number;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  providers: [
    // Admin credentials — checks env vars, no database
    Credentials({
      id: "admin",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const adminEmails = [
          process.env.ADMIN_EMAIL,
          process.env.ADMIN_EMAIL_2,
        ].filter(Boolean) as string[];

        const isValidEmail = adminEmails.includes(email);
        const isValidPassword = password === process.env.ADMIN_PASSWORD;

        if (isValidEmail && isValidPassword) {
          return {
            id: "admin",
            email,
            name: "Cosmos AI Admin",
            isAdmin: true,
          };
        }
        return null;
      },
    }),

    // User credentials — checks database
    Credentials({
      id: "user",
      name: "User",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!valid) return null;

        // Reset monthly usage if the month is up
        const current = (await resetMonthlyIfDue(user.id)) ?? user;

        return {
          id: user.id,
          email: user.email,
          name: user.email,
          tier: current.tier,
          generationsUsed: current.generationsUsed,
          generationsLimit: current.generationsLimit,
          emailVerified: user.emailVerified,
          isAdmin: false,
        };
      },
    }),
  ],

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8 hours
  pages: {
    signIn: "/auth/login",
    signOut: "/",
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (!token.id && token.sub) token.id = token.sub;

      if (user) {
        token.id = user.id;
        token.tier = (user as { tier?: string }).tier ?? "free";
        token.generationsUsed =
          (user as { generationsUsed?: number }).generationsUsed ?? 0;
        token.generationsLimit =
          (user as { generationsLimit?: number }).generationsLimit ?? 10;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
        token.emailVerified =
          (user as { emailVerified?: Date | null }).emailVerified ?? null;
        token.refreshedAt = Date.now();
        return token;
      }

      // Refresh plan details from the database at most once a minute
      const isAdmin = token.isAdmin === true;
      const lastRefresh =
        typeof token.refreshedAt === "number" ? token.refreshedAt : 0;
      const stale = Date.now() - lastRefresh > 60_000;

      if (
        !isAdmin &&
        typeof token.id === "string" &&
        (stale || trigger === "update")
      ) {
        try {
          const fresh = await db.user.findUnique({
            where: { id: token.id },
            select: {
              tier: true,
              generationsUsed: true,
              generationsLimit: true,
              emailVerified: true,
            },
          });
          if (fresh) {
            token.tier = fresh.tier;
            token.generationsUsed = fresh.generationsUsed;
            token.generationsLimit = fresh.generationsLimit;
            token.emailVerified = fresh.emailVerified;
          }
          token.refreshedAt = Date.now();
        } catch (error) {
          console.error("Session refresh failed:", error);
        }
      }

      return token;
    },

    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: (token.id ?? token.sub) as string,
          tier: token.tier as string,
          generationsUsed: token.generationsUsed as number,
          generationsLimit: token.generationsLimit as number,
          isAdmin: token.isAdmin as boolean,
          emailVerified: token.emailVerified as Date | null,
        },
      };
    },
  },
} satisfies NextAuthConfig;
