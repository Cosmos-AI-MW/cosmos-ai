import { contactRouter } from "~/server/api/routers/contact";
import { contentRouter } from "~/server/api/routers/content";
import { writeRouter } from "~/server/api/routers/write";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  contact: contactRouter,
  content: contentRouter,
  write: writeRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
