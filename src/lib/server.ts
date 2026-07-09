import { getSiteUrl } from "@/lib/site-url";

export function isDatabaseConfigured() {
  return Boolean(
    process.env.POSTGRES_PRISMA_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL_UNPOOLED
  );
}

export function buildAbsoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

export function getBaseUrl() {
  return getSiteUrl();
}
