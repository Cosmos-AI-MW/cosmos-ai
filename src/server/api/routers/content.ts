import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const contentRouter = createTRPCRouter({
  // ── SERVICES ─────────────────────────────────────────────────
  getServices: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.service.findMany({ orderBy: { order: "asc" } });
  }),

  updateService: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        tagline: z.string().min(1),
        description: z.string().min(1),
        deliverables: z.array(z.string()),
        pricing: z.string().min(1),
        ideal: z.string().min(1),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.service.update({ where: { id }, data });
    }),

  // ── ABOUT CONTENT ────────────────────────────────────────────
  getAboutContent: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.aboutContent.findMany();
  }),

  updateAboutContent: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.aboutContent.update({
        where: { key: input.key },
        data: { value: input.value },
      });
    }),

  // ── VALUES ───────────────────────────────────────────────────
  getValues: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.value.findMany({ orderBy: { order: "asc" } });
  }),

  updateValue: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.value.update({ where: { id }, data });
    }),

  // ── SEARCH ───────────────────────────────────────────────────
  search: protectedProcedure
    .input(z.object({ q: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const q = input.q.toLowerCase();
      const [services, aboutContent, values] = await Promise.all([
        ctx.db.service.findMany({
          where: {
            published: true,
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { tagline: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { pricing: { contains: q, mode: "insensitive" } },
              { ideal: { contains: q, mode: "insensitive" } },
            ],
          },
          orderBy: { order: "asc" },
        }),
        ctx.db.aboutContent.findMany({
          where: { value: { contains: q, mode: "insensitive" } },
        }),
        ctx.db.value.findMany({
          where: {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          },
          orderBy: { order: "asc" },
        }),
      ]);
      return { services, aboutContent, values };
    }),

  // ── USER TIER MANAGEMENT ─────────────────────────────────────
  upgradeUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        tier: z.enum(["free", "starter", "professional"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const limits: Record<string, number> = {
        free: 10,
        starter: 50,
        professional: 999999,
      };

      await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          tier: input.tier,
          generationsLimit: limits[input.tier] ?? 10,
          generationsUsed: 0,
          tierResetDate: new Date(),
        },
      });

      return { success: true };
    }),

  // ── SYSTEM PROMPTS ───────────────────────────────────────────────
  updatePrompt: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.systemPrompt.upsert({
        where: { name: input.name },
        update: { content: input.content },
        create: { name: input.name, content: input.content },
      });
      return { success: true };
    }),

  // ── CREATE SERVICE ───────────────────────────────────────────────
  createService: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        tagline: z.string().min(1),
        description: z.string().min(1),
        deliverables: z.array(z.string()),
        pricing: z.string().min(1),
        ideal: z.string().min(1),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.db.service.count();
      const number = String(count + 1).padStart(2, "0");
      return ctx.db.service.create({
        data: {
          ...input,
          number,
          order: count + 1,
        },
      });
    }),

  // ── DELETE SERVICE ───────────────────────────────────────────────
  deleteService: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.service.delete({ where: { id: input.id } });
      return { success: true };
    }),

  // ── PAYMENTS ─────────────────────────────────────────────────────
  initiatePayment: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["starter", "professional"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const email = ctx.session.user.email ?? "";
      const isAdmin = (ctx.session.user as { isAdmin?: boolean }).isAdmin;

      if (isAdmin) throw new Error("Admin cannot purchase plans");

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new Error("User not found");

      const plans = {
        starter: {
          name: "Starter",
          amount: 5000,
          currency: "MWK",
          generationsLimit: 50,
          description: "Cosmos AI Starter Plan — 50 generations per month",
        },
        professional: {
          name: "Professional",
          amount: 15000,
          currency: "MWK",
          generationsLimit: 999999,
          description: "Cosmos AI Professional Plan — Unlimited generations",
        },
      };

      const plan = plans[input.plan];
      const txRef = `COSMOS-${userId.slice(0, 8)}-${Date.now()}`;
      const baseUrl = process.env.NEXTAUTH_URL ?? "https://cosmosai.mw";

      // Create pending payment record
      await ctx.db.payment.create({
        data: {
          userId,
          txRef,
          amount: plan.amount,
          currency: plan.currency,
          tier: input.plan,
          status: "pending",
        },
      });

      // Initiate Paychangu hosted checkout
      const response = await fetch("https://api.paychangu.com/payment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY ?? ""}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          amount: plan.amount.toString(),
          currency: plan.currency,
          tx_ref: txRef,
          first_name: email.split("@")[0] ?? "Customer",
          last_name: "",
          email,
          callback_url: `${baseUrl}/api/webhooks/paychangu`,
          return_url: `${baseUrl}/account?payment=cancelled`,
          customization: {
            title: `Cosmos AI — ${plan.name} Plan`,
            description: plan.description,
          },
          meta: [{ plan: input.plan }],
        }),
      });

      const data = (await response.json()) as {
        status: string;
        message: string;
        data?: { checkout_url?: string };
      };

      if (!response.ok || data.status !== "success") {
        throw new Error(
          typeof data.message === "string"
            ? data.message
            : "Payment initiation failed. Please try again.",
        );
      }

      return { checkoutUrl: data.data?.checkout_url ?? "" };
    }),
});
