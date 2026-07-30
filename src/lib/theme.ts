export const themeCookieName = "site_theme";
export const supportedThemes = ["light", "dark"] as const;

export type SiteTheme = (typeof supportedThemes)[number];

export function getThemeFromCookies(cookieStore: { get(name: string): { value: string } | undefined }): SiteTheme {
  const value = cookieStore.get(themeCookieName)?.value;
  return value === "dark" ? "dark" : "light";
}
