import "dotenv/config";
import { defineConfig } from "prisma/config";

function normalizeConnectionString(value?: string) {
  if (!value) {
    return undefined;
  }

  return value.trim().replace(/^['"]|['"]$/g, "").trim();
}

const datasourceUrl =
  normalizeConnectionString(process.env.POSTGRES_URL_NON_POOLING) ||
  normalizeConnectionString(process.env.DATABASE_URL_UNPOOLED) ||
  normalizeConnectionString(process.env.POSTGRES_PRISMA_URL) ||
  normalizeConnectionString(process.env.DATABASE_URL);

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: datasourceUrl
    ? {
        url: datasourceUrl,
      }
    : undefined,
});
