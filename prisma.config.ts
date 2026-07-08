import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      env("POSTGRES_PRISMA_URL") ||
      env("DATABASE_URL") ||
      env("POSTGRES_URL_NON_POOLING") ||
      env("DATABASE_URL_UNPOOLED"),
  },
});
