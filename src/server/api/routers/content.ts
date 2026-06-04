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
});
