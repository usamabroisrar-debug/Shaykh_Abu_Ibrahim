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

function cleanInlineSegment(value: string) {
  return value
    .replace(/^[\s:：\-–—|/]+/, "")
    .replace(/[\s:：\-–—|/]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getInlineLanguageLabelValues(value: string | null | undefined) {
  const normalized = value?.trim() || "";

  if (!normalized) {
    return {} as LocaleBucket;
  }

  const matches = Array.from(normalized.matchAll(/\b(English|Urdu|Arabic)\b/gi));

  if (matches.length < 2) {
    return {} as LocaleBucket;
  }

  const usefulMatches = matches.filter((match, index) => {
    const label = match[1]?.toLowerCase();

    if (label !== "arabic") {
      return true;
    }

    const start = (match.index || 0) + match[0].length;
    const nextStart = matches[index + 1]?.index ?? normalized.length;
    const segment = normalized.slice(start, nextStart);

    return hasArabicScript(segment);
  });

  if (usefulMatches.length < 2) {
    return {} as LocaleBucket;
  }

  const buckets: LocaleBucket = {};

  usefulMatches.forEach((match, index) => {
    const label = match[1]?.toLowerCase();
    const locale = label === "urdu" ? "ur" : label === "arabic" ? "ar" : "en";
    const start = (match.index || 0) + match[0].length;
    const end = usefulMatches[index + 1]?.index ?? normalized.length;
    const segment = cleanInlineSegment(normalized.slice(start, end));

    if (segment) {
      buckets[locale] = segment;
    }
  });

  return buckets;
}

function cleanMixedLanguageLabelText(value: string, locale: SiteLocale) {
  const bucket = getInlineLanguageLabelValues(value);
  return pickBestLocalizedValue(bucket, locale) || pickFallbackLocalizedValue(bucket) || value;
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

function pickBestLocalizedValue(bucket: LocaleBucket, locale: SiteLocale) {
  return bucket[locale]?.trim() || "";
}

function pickFallbackLocalizedValue(bucket: LocaleBucket) {
  return (
    bucket.en?.trim() ||
    bucket.default?.trim() ||
    bucket.ur?.trim() ||
    bucket.ar?.trim() ||
    ""
  );
}

function resolveStructuredValue(value: LocalizedTextValue, locale: SiteLocale) {
  if (typeof value === "object" && value !== null) {
    const bucket = normalizeLocalizedObject(value);
    const selected = pickBestLocalizedValue(bucket, locale) || pickFallbackLocalizedValue(bucket);
    return selected ? cleanMixedLanguageLabelText(selected, locale) : "";
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

  const normalized = typeof value === "string" ? value.trim() : "";

  if (!normalized) {
    return "";
  }

  const sectioned = parseSectionedContent(normalized);
  const sectionedValue = pickBestLocalizedValue(sectioned, locale);

  if (sectionedValue) {
    return sectionedValue.replace(/\s+/g, " ").trim();
  }

  const inlineParts = detectInlineLocaleParts(normalized);
  const localized = pickBestLocalizedValue(inlineParts, locale);

  if (localized) {
    return localized;
  }

  const languageLabelParts = getInlineLanguageLabelValues(normalized);
  const languageLabelValue = pickBestLocalizedValue(languageLabelParts, locale);

  if (languageLabelValue) {
    return languageLabelValue;
  }

  return pickFallbackLocalizedValue(inlineParts) || pickFallbackLocalizedValue(languageLabelParts) || normalized;
}

export function resolveLocalizedRichText(value: LocalizedTextValue, locale: SiteLocale) {
  const structured = resolveStructuredValue(value, locale);

  if (structured) {
    return structured;
  }

  const normalized = typeof value === "string" ? value.trim() : "";

  if (!normalized) {
    return "";
  }

  const sectioned = parseSectionedContent(normalized);
  const localized = pickBestLocalizedValue(sectioned, locale);

  if (localized) {
    return localized;
  }

  return pickFallbackLocalizedValue(sectioned) || normalized;
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
