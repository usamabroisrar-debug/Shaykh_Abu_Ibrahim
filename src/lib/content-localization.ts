import type { SiteLocale } from "@/lib/locale";

type LocaleBucket = Partial<Record<SiteLocale | "default", string>>;
export type LocalizedTextValue =
  | string
  | null
  | undefined
  | Partial<Record<SiteLocale | "default", string>>;

const sectionLocaleMatchers: Array<{ locale: SiteLocale; pattern: RegExp }> = [
  { locale: "en", pattern: /^english\b/i },
  { locale: "ur", pattern: /^urdu\b/i },
  { locale: "ar", pattern: /^arabic\b/i },
];

const unavailableCopy: Record<SiteLocale, string> = {
  en: "Content is not available in this language yet.",
  ur: "اس زبان میں مواد ابھی دستیاب نہیں ہے۔",
  ar: "المحتوى غير متاح بهذه اللغة بعد.",
};

function getUnavailableCopy(locale: SiteLocale) {
  return unavailableCopy[locale] || unavailableCopy.en;
}

export function hasArabicScript(value: string) {
  return /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/.test(value);
}

function parseSectionedContent(value: string): LocaleBucket {
  const normalized = value.trim();

  if (!normalized) {
    return {};
  }

  const lines = normalized.split(/\r?\n/);
  const buckets: LocaleBucket = {};
  let currentLocale: keyof LocaleBucket = "default";
  let sawLocaleHeading = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (buckets[currentLocale]) {
        buckets[currentLocale] = `${buckets[currentLocale]}\n`;
      }
      continue;
    }

    const localeMatch = sectionLocaleMatchers.find(({ pattern }) => pattern.test(line));

    if (localeMatch) {
      currentLocale = localeMatch.locale;
      sawLocaleHeading = true;
      continue;
    }

    buckets[currentLocale] = buckets[currentLocale]
      ? `${buckets[currentLocale]}\n${rawLine}`
      : rawLine;
  }

  return sawLocaleHeading ? buckets : {};
}

function detectInlineLocaleParts(value: string) {
  const parts = value
    .split(/\s+\/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (parts.length < 2) {
    return {} as LocaleBucket;
  }

  const buckets: LocaleBucket = {};

  for (const part of parts) {
    if (hasArabicScript(part)) {
      if (!buckets.ur) {
        buckets.ur = part;
      } else if (!buckets.ar) {
        buckets.ar = part;
      }
    } else if (!buckets.en) {
      buckets.en = part;
    }
  }

  return buckets;
}

function normalizeLocalizedObject(value: Exclude<LocalizedTextValue, string | null | undefined>) {
  const bucket: LocaleBucket = {};

  for (const key of ["en", "ur", "ar", "default"] as const) {
    const entry = value[key];

    if (typeof entry === "string" && entry.trim()) {
      bucket[key] = entry.trim();
    }
  }

  return bucket;
}

function pickBestLocalizedValue(
  bucket: LocaleBucket,
  locale: SiteLocale,
  options?: { allowDefault?: boolean }
) {
  const value = bucket[locale]?.trim();

  if (value) {
    return value;
  }

  if (options?.allowDefault) {
    return bucket.default?.trim() || "";
  }

  return "";
}

function resolveStructuredValue(value: LocalizedTextValue, locale: SiteLocale) {
  if (typeof value === "object" && value !== null) {
    const bucket = normalizeLocalizedObject(value);
    return pickBestLocalizedValue(bucket, locale, { allowDefault: locale === "en" });
  }

  return "";
}

export function getLocalizedSectionValues(value: string | null | undefined) {
  const normalized = value?.trim() || "";

  if (!normalized) {
    return {
      en: "",
      ur: "",
      ar: "",
      default: "",
    };
  }

  const sectioned = parseSectionedContent(normalized);

  return {
    en: sectioned.en?.trim() || "",
    ur: sectioned.ur?.trim() || "",
    ar: sectioned.ar?.trim() || "",
    default: sectioned.default?.trim() || normalized,
  };
}

export function resolveLocalizedInlineText(value: LocalizedTextValue, locale: SiteLocale) {
  const structured = resolveStructuredValue(value, locale);

  if (structured) {
    return structured;
  }

  if (typeof value === "object" && value !== null) {
    return getUnavailableCopy(locale);
  }

  const normalized = value?.trim() || "";

  if (!normalized) {
    return "";
  }

  const inlineParts = detectInlineLocaleParts(normalized);
  const hasInlineLocaleParts = Object.values(inlineParts).some(Boolean);
  const localized = pickBestLocalizedValue(inlineParts, locale);

  if (localized) {
    return localized;
  }

  if (hasInlineLocaleParts) {
    return getUnavailableCopy(locale);
  }

  return locale === "en" ? normalized : getUnavailableCopy(locale);
}

export function resolveLocalizedRichText(value: LocalizedTextValue, locale: SiteLocale) {
  const structured = resolveStructuredValue(value, locale);

  if (structured) {
    return structured;
  }

  if (typeof value === "object" && value !== null) {
    return getUnavailableCopy(locale);
  }

  const normalized = value?.trim() || "";

  if (!normalized) {
    return "";
  }

  const sectioned = parseSectionedContent(normalized);
  const hasSectionedContent = Object.values(sectioned).some(Boolean);
  const localized = pickBestLocalizedValue(sectioned, locale);

  if (localized) {
    return localized;
  }

  if (hasSectionedContent) {
    return getUnavailableCopy(locale);
  }

  return locale === "en" ? normalized : getUnavailableCopy(locale);
}

export function resolveLocalizedParagraphs(
  value: string | null | undefined,
  locale: SiteLocale
) {
  return resolveLocalizedRichText(value, locale)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function resolveLocalizedLines(value: string | null | undefined, locale: SiteLocale) {
  return resolveLocalizedRichText(value, locale)
    .split(/\r?\n/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}
