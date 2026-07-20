import { siteConfig } from "@/config/site";
import {
  resolveLocalizedInlineText,
  resolveLocalizedLines,
  resolveLocalizedRichText,
  type LocalizedTextValue,
} from "@/lib/content-localization";
import type { SiteLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

const SITE_SETTINGS_KEY = "site_settings";
const HOMEPAGE_HERO_SETTINGS_KEY = "homepage_hero_settings";

type LocaleText = Partial<Record<SiteLocale | "default", string>>;

export type SiteSettings = {
  brandName: LocalizedTextValue;
  subtitle: LocalizedTextValue;
  description: LocalizedTextValue;
  footerText: LocalizedTextValue;
  logoSrc: string;
  socials: {
    youtube: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    whatsapp: string;
    whatsappChat: string;
  };
};

export type HomepageHeroSettings = {
  badge: LocalizedTextValue;
  title: LocalizedTextValue;
  description: LocalizedTextValue;
  miniHighlights: LocalizedTextValue;
  highlights: LocalizedTextValue;
  primaryAction: LocalizedTextValue;
  secondaryAction: LocalizedTextValue;
  trusted: LocalizedTextValue;
  curriculum: LocalizedTextValue;
  teachers: LocalizedTextValue;
  stats: Array<{ label: LocalizedTextValue; value: string }>;
  certificate: LocalizedTextValue;
  certificateDetail: LocalizedTextValue;
  liveClasses: LocalizedTextValue;
  liveDetail: LocalizedTextValue;
  verified: LocalizedTextValue;
  imageAlt: LocalizedTextValue;
  imageSrc: string;
};

function localized(en: string, ur: string, ar: string): LocaleText {
  return { en, ur, ar };
}

const defaultSiteSettings: SiteSettings = {
  brandName: localized(siteConfig.name, siteConfig.name, siteConfig.name),
  subtitle: localized(
    "Islamic Learning Platform",
    "اسلامی تعلیمی پلیٹ فارم",
    "منصة تعليمية إسلامية"
  ),
  description: localized(
    "Join Shaykh Abu Ibrahim Islamic Academy for Quran, Tajweed, Tafseer, Hadith, Fiqh, and online Islamic classes for children, adults, and families worldwide.",
    "شیخ ابو ابراہیم اسلامی اکیڈمی میں قرآن، تجوید، تفسیر، حدیث، فقہ، اور بچوں، بڑوں، اور خاندانوں کے لیے آن لائن اسلامی کلاسز میں شامل ہوں۔",
    "انضم إلى أكاديمية شيخ أبو إبراهيم الإسلامية لتعلم القرآن والتجويد والتفسير والحديث والفقه والدروس الإسلامية عبر الإنترنت."
  ),
  footerText: localized(
    "Quran, Hadith, Fiqh, Tafseer, and guided Islamic learning in a refined online experience for students and families.",
    "قرآن، حدیث، فقہ، تفسیر، اور طلبہ و خاندانوں کے لیے منظم آن لائن اسلامی رہنمائی۔",
    "تعلم القرآن والحديث والفقه والتفسير بإرشاد إسلامي ضمن تجربة تعليمية منظمة."
  ),
  logoSrc: "/images/logo-transparent.webp",
  socials: {
    youtube: siteConfig.socials.youtube,
    facebook: siteConfig.socials.facebook,
    instagram: siteConfig.socials.instagram,
    tiktok: siteConfig.socials.tiktok,
    whatsapp: siteConfig.socials.whatsapp,
    whatsappChat: siteConfig.socials.whatsappChat,
  },
};

const defaultHomepageHeroSettings: HomepageHeroSettings = {
  badge: localized(
    "Premium Online Islamic Academy",
    "پریمیم آن لائن اسلامی اکیڈمی",
    "أكاديمية إسلامية متميزة عبر الإنترنت"
  ),
  title: localized(
    "Learn Quran Online With Authentic Islamic Guidance",
    "مستند اسلامی رہنمائی کے ساتھ آن لائن قرآن سیکھیں",
    "تعلّم القرآن عبر الإنترنت بإرشاد إسلامي موثوق"
  ),
  description: localized(
    "Build a strong foundation in Quran, Hadith and Islamic knowledge through structured online courses designed for children, adults and advanced learners.",
    "بچوں، بڑوں، اور سنجیدہ طلبہ کے لیے ترتیب دیے گئے آن لائن کورسز کے ذریعے قرآن، حدیث، اور اسلامی علوم میں مضبوط بنیاد قائم کریں۔",
    "ابن أساساً قوياً في القرآن والحديث والعلوم الإسلامية من خلال دورات منظمة للأطفال والكبار والدارسين المتقدمين."
  ),
  miniHighlights: localized(
    "One-to-one live classes\nFlexible worldwide timings\nFree trial available",
    "ون ٹو ون لائیو کلاسز\nدنیا بھر کے اوقات کے مطابق سہولت\nفری ٹرائل دستیاب",
    "دروس مباشرة فردية\nمواعيد مرنة عالمياً\nحصة تجريبية مجانية"
  ),
  highlights: localized(
    "Qaida\nNazra\nHifz\nTajweed\nTarjuma\nTafseer\nHadith",
    "قاعدہ\nناظرہ\nحفظ\nتجوید\nترجمہ\nتفسیر\nحدیث",
    "القاعدة\nالنظرة\nالحفظ\nالتجويد\nالترجمة\nالتفسير\nالحديث"
  ),
  primaryAction: localized("Apply for Admission", "داخلے کے لیے اپلائی کریں", "قدّم للقبول"),
  secondaryAction: localized("Explore Courses", "کورسز دیکھیں", "استكشف الدورات"),
  trusted: localized("Trusted Learning", "قابل اعتماد تعلیم", "تعلم موثوق"),
  curriculum: localized("Authentic Curriculum", "مستند نصاب", "منهج موثوق"),
  teachers: localized("Expert Teachers", "ماہر اساتذہ", "معلمون خبراء"),
  stats: [
    { label: localized("Courses", "کورسز", "الدورات"), value: "12+" },
    { label: localized("Students", "طلبہ", "الطلاب"), value: "500+" },
    { label: localized("Authentic", "مستند", "موثوق"), value: "100%" },
  ],
  certificate: localized("Certificate", "سرٹیفکیٹ", "شهادة"),
  certificateDetail: localized(
    "After Course Completion",
    "کورس مکمل ہونے کے بعد",
    "بعد إكمال الدورة"
  ),
  liveClasses: localized("Live Classes", "لائیو کلاسز", "دروس مباشرة"),
  liveDetail: localized(
    "Quran • Hadith • Tafseer",
    "قرآن • حدیث • تفسیر",
    "القرآن • الحديث • التفسير"
  ),
  verified: localized(
    "Verified Islamic Learning",
    "تصدیق شدہ اسلامی تعلیم",
    "تعلم إسلامي موثوق"
  ),
  imageAlt: localized(
    "Online Quran and Islamic learning",
    "آن لائن قرآن اور اسلامی تعلیم",
    "تعلم القرآن والعلوم الإسلامية عبر الإنترنت"
  ),
  imageSrc: "/images/hero.webp",
};

async function readSetting<T>(key: string, fallback: T) {
  try {
    const entry = await prisma.setting.findUnique({
      where: { key },
    });

    if (!entry) {
      return fallback;
    }

    return mergeSettingValue(fallback, entry.value) as T;
  } catch {
    return fallback;
  }
}

function hasCorruptedEncoding(value: string) {
  return /(?:Ø|Ù|Û|Ú|â€¢|ï¼|Ã)/.test(value);
}

function mergeSettingValue(fallback: unknown, value: unknown): unknown {
  if (typeof value === "string") {
    return hasCorruptedEncoding(value) ? fallback : value;
  }

  if (Array.isArray(value)) {
    if (!Array.isArray(fallback)) {
      return value;
    }

    return value.map((item, index) => mergeSettingValue(fallback[index], item));
  }

  if (!value || typeof value !== "object") {
    return value ?? fallback;
  }

  if (!fallback || typeof fallback !== "object" || Array.isArray(fallback)) {
    return value;
  }

  const merged: Record<string, unknown> = { ...(fallback as Record<string, unknown>) };

  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    merged[key] = mergeSettingValue((fallback as Record<string, unknown>)[key], item);
  }

  return merged;
}

function isUnavailableLocaleCopy(value: string) {
  const normalized = value.trim().toLowerCase();

  return (
    normalized.includes("content is not available") ||
    normalized.includes("مواد ابھی دستیاب نہیں") ||
    normalized.includes("غير متاح")
  );
}

function resolveBrandName(value: LocalizedTextValue, locale: SiteLocale) {
  const localizedBrandName = resolveLocalizedInlineText(value, locale).trim();

  if (!localizedBrandName || isUnavailableLocaleCopy(localizedBrandName)) {
    return siteConfig.name;
  }

  return localizedBrandName;
}

export async function getSiteSettings() {
  return readSetting(SITE_SETTINGS_KEY, defaultSiteSettings);
}

export async function getHomepageHeroSettings() {
  return readSetting(HOMEPAGE_HERO_SETTINGS_KEY, defaultHomepageHeroSettings);
}

export async function getLocalizedSiteSettings(locale: SiteLocale) {
  const settings = await getSiteSettings();

  return {
    ...settings,
    brandName: resolveBrandName(settings.brandName, locale),
    subtitle: resolveLocalizedRichText(settings.subtitle, locale),
    description: resolveLocalizedRichText(settings.description, locale),
    footerText: resolveLocalizedRichText(settings.footerText, locale),
  };
}

export async function getLocalizedHomepageHeroSettings(locale: SiteLocale) {
  const settings = await getHomepageHeroSettings();

  return {
    ...settings,
    badge: resolveLocalizedRichText(settings.badge, locale),
    title: resolveLocalizedRichText(settings.title, locale),
    description: resolveLocalizedRichText(settings.description, locale),
    miniHighlights: resolveLocalizedLines(settings.miniHighlights, locale),
    highlights: resolveLocalizedLines(settings.highlights, locale),
    primaryAction: resolveLocalizedRichText(settings.primaryAction, locale),
    secondaryAction: resolveLocalizedRichText(settings.secondaryAction, locale),
    trusted: resolveLocalizedRichText(settings.trusted, locale),
    curriculum: resolveLocalizedRichText(settings.curriculum, locale),
    teachers: resolveLocalizedRichText(settings.teachers, locale),
    stats: settings.stats.map((stat) => ({
      ...stat,
      label: resolveLocalizedRichText(stat.label, locale),
    })),
    certificate: resolveLocalizedRichText(settings.certificate, locale),
    certificateDetail: resolveLocalizedRichText(settings.certificateDetail, locale),
    liveClasses: resolveLocalizedRichText(settings.liveClasses, locale),
    liveDetail: resolveLocalizedRichText(settings.liveDetail, locale),
    verified: resolveLocalizedRichText(settings.verified, locale),
    imageAlt: resolveLocalizedRichText(settings.imageAlt, locale),
  };
}

export async function updateSiteSettings(input: SiteSettings) {
  return prisma.setting.upsert({
    where: { key: SITE_SETTINGS_KEY },
    create: {
      key: SITE_SETTINGS_KEY,
      value: input,
    },
    update: {
      value: input,
    },
  });
}

export async function updateHomepageHeroSettings(input: HomepageHeroSettings) {
  return prisma.setting.upsert({
    where: { key: HOMEPAGE_HERO_SETTINGS_KEY },
    create: {
      key: HOMEPAGE_HERO_SETTINGS_KEY,
      value: input,
    },
    update: {
      value: input,
    },
  });
}
