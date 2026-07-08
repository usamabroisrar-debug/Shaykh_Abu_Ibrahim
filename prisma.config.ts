import "dotenv/config";
import { defineConfig } from "prisma/config";

const datasourceUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED;

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: datasourceUrl
    ? {
        url: datasourceUrl,
      }
    : undefined,
});
