export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function buildAbsoluteUrl(path: string) {
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  return new URL(path, baseUrl).toString();
}

export function getBaseUrl() {
  return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "";
}
