import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";

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
        if (
          credentials?.email === process.env.ADMIN_EMAIL &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "admin",
            email: process.env.ADMIN_EMAIL ?? "",
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

        // Reset monthly generations if needed
        const now = new Date();
        const resetDate = new Date(user.tierResetDate);
        const monthPassed =
          now.getMonth() !== resetDate.getMonth() ||
          now.getFullYear() !== resetDate.getFullYear();

        if (monthPassed) {
          await db.user.update({
            where: { id: user.id },
            data: {
              generationsUsed: 0,
              tierResetDate: now,
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.email,
          tier: user.tier,
          generationsUsed: monthPassed ? 0 : user.generationsUsed,
          generationsLimit: user.generationsLimit,
          isAdmin: false,
        };
      },
    }),
  ],

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    signOut: "/",
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tier = (user as { tier?: string }).tier ?? "free";
        token.generationsUsed =
          (user as { generationsUsed?: number }).generationsUsed ?? 0;
        token.generationsLimit =
          (user as { generationsLimit?: number }).generationsLimit ?? 10;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          tier: token.tier as string,
          generationsUsed: token.generationsUsed as number,
          generationsLimit: token.generationsLimit as number,
          isAdmin: token.isAdmin as boolean,
        },
      };
    },
  },
} satisfies NextAuthConfig;
