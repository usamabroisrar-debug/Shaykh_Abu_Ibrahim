import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

function normalizeConnectionString(value?: string) {
  if (!value) {
    return undefined;
  }

  return value.trim().replace(/^['"]|['"]$/g, "").trim();
}

const connectionString =
  normalizeConnectionString(process.env.POSTGRES_URL_NON_POOLING) ||
  normalizeConnectionString(process.env.DATABASE_URL_UNPOOLED) ||
  normalizeConnectionString(process.env.POSTGRES_PRISMA_URL) ||
  normalizeConnectionString(process.env.DATABASE_URL) ||
  "postgresql://postgres:postgres@localhost:5432/shaykh_abu_ibrahim";

const adapter = new PrismaPg({
  connectionString,
});

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
