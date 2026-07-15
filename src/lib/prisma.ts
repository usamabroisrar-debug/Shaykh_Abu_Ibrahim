import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "@/lib/database-url";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const connectionString =
  getDatabaseUrl() ||
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
