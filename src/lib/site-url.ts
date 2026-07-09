function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl() {
  const explicitUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (explicitUrl) {
    const normalized = explicitUrl.startsWith("http")
      ? explicitUrl
      : `https://${explicitUrl}`;

    return trimTrailingSlash(normalized);
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  return "https://shaykhabuibrahim.com";
}

export function getSiteOriginForMetadata() {
  const siteUrl = getSiteUrl();

  if (siteUrl.startsWith("http://localhost")) {
    return "https://shaykhabuibrahim.com";
  }

  return siteUrl;
}
