function cleanConnectionString(value?: string) {
  if (!value) {
    return undefined;
  }

  return value.trim().replace(/^['"]|['"]$/g, "").trim();
}

export function normalizeDatabaseUrl(value?: string) {
  const cleaned = cleanConnectionString(value);

  if (!cleaned) {
    return undefined;
  }

  try {
    const url = new URL(cleaned);
    const sslMode = url.searchParams.get("sslmode");

    if (sslMode === "prefer" || sslMode === "require" || sslMode === "verify-ca") {
      url.searchParams.set("sslmode", "verify-full");
    }

    return url.toString();
  } catch {
    return cleaned.replace(/sslmode=(prefer|require|verify-ca)\b/i, "sslmode=verify-full");
  }
}

export function getDatabaseUrl() {
  return (
    normalizeDatabaseUrl(process.env.POSTGRES_URL_NON_POOLING) ||
    normalizeDatabaseUrl(process.env.DATABASE_URL_UNPOOLED) ||
    normalizeDatabaseUrl(process.env.POSTGRES_PRISMA_URL) ||
    normalizeDatabaseUrl(process.env.DATABASE_URL)
  );
}
