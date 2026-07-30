import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma", // adjust path if your schema lives elsewhere
  datasource: {
    url: env("DATABASE_URL"),
  },
});
