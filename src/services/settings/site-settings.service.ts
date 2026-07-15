import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import {
  resolveLocalizedInlineText,
  resolveLocalizedLines,
  resolveLocalizedRichText,
} from "@/lib/content-localization";
import type { SiteLocale } from "@/lib/locale";

const SITE_SETTINGS_KEY = "site_settings";
const HOMEPAGE_HERO_SETTINGS_KEY = "homepage_hero_settings";

export type SiteSettings = {
  brandName: string;
  subtitle: string;
  description: string;
  footerText: string;
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
  badge: string;
  title: string;
  description: string;
  miniHighlights: string;
  highlights: string;
  primaryAction: string;
  secondaryAction: string;
  trusted: string;
  curriculum: string;
  teachers: string;
  stats: Array<{ label: string; value: string }>;
  certificate: string;
  certificateDetail: string;
  liveClasses: string;
  liveDetail: string;
  verified: string;
  imageAlt: string;
  imageSrc: string;
};

const defaultSiteSettings: SiteSettings = {
  brandName: siteConfig.name,
  subtitle:
    "English\nIslamic Learning Platform\n\nUrdu\nاسلامی تعلیمی پلیٹ فارم\n\nArabic\nمنصة تعليمية إسلامية",
  description: siteConfig.description,
  footerText:
    "English\nQuran, Hadith, Fiqh, Tafseer, and guided Islamic learning in a more refined online experience for students and families.\n\nUrdu\nقرآن، حدیث، فقہ، تفسیر، اور طلبہ و خاندانوں کے لیے بہتر آن لائن اسلامی رہنمائی۔",
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
  badge:
    "English\nPremium Online Islamic Academy\n\nUrdu\nپریمیم آن لائن اسلامی اکیڈمی\n\nArabic\nأكاديمية إسلامية متميزة عبر الإنترنت",
  title:
    "English\nLearn Quran Online With Authentic Islamic Guidance\n\nUrdu\nمستند اسلامی رہنمائی کے ساتھ آن لائن قرآن سیکھیں\n\nArabic\nتعلّم القرآن عبر الإنترنت بإرشاد إسلامي موثوق",
  description:
    "English\nBuild a strong foundation in Quran, Hadith and Islamic knowledge through structured online courses designed for children, adults and advanced learners.\n\nUrdu\nبچوں، بڑوں، اور سنجیدہ طلبہ کے لیے ترتیب دیے گئے آن لائن کورسز کے ذریعے قرآن، حدیث، اور اسلامی علوم میں مضبوط بنیاد قائم کریں۔\n\nArabic\nابنِ أساساً قوياً في القرآن والحديث والعلوم الإسلامية من خلال دورات منظمة للأطفال والكبار والدارسين المتقدمين.",
  miniHighlights:
    "English\nOne-to-one live classes\nFlexible worldwide timings\nFree trial available\n\nUrdu\nون ٹو ون لائیو کلاسز\nدنیا بھر کے اوقات کے مطابق سہولت\nفری ٹرائل دستیاب\n\nArabic\nدروس مباشرة فردية\nمواعيد مرنة عالمياً\nحصة تجريبية مجانية",
  highlights:
    "English\nQaida\nNazra\nHifz\nTajweed\nTarjuma\nTafseer\nHadith\n\nUrdu\nقاعدہ\nناظرہ\nحفظ\nتجوید\nترجمہ\nتفسیر\nحدیث\n\nArabic\nالقاعدة\nالنظرة\nالحفظ\nالتجويد\nالترجمة\nالتفسير\nالحديث",
  primaryAction:
    "English\nApply for Admission\n\nUrdu\nداخلے کے لیے اپلائی کریں\n\nArabic\nقدّم للقبول",
  secondaryAction:
    "English\nExplore Courses\n\nUrdu\nکورسز دیکھیں\n\nArabic\nاستكشف الدورات",
  trusted:
    "English\nTrusted Learning\n\nUrdu\nقابل اعتماد تعلیم\n\nArabic\nتعلم موثوق",
  curriculum:
    "English\nAuthentic Curriculum\n\nUrdu\nمستند نصاب\n\nArabic\nمنهج موثوق",
  teachers:
    "English\nExpert Teachers\n\nUrdu\nماہر اساتذہ\n\nArabic\nمعلمون خبراء",
  stats: [
    {
      label: "English\nCourses\n\nUrdu\nکورسز\n\nArabic\nالدورات",
      value: "12+",
    },
    {
      label: "English\nStudents\n\nUrdu\nطلبہ\n\nArabic\nالطلاب",
      value: "500+",
    },
    {
      label: "English\nAuthentic\n\nUrdu\nمستند\n\nArabic\nموثوق",
      value: "100%",
    },
  ],
  certificate:
    "English\nCertificate\n\nUrdu\nسرٹیفکیٹ\n\nArabic\nشهادة",
  certificateDetail:
    "English\nAfter Course Completion\n\nUrdu\nکورس مکمل ہونے کے بعد\n\nArabic\nبعد إكمال الدورة",
  liveClasses:
    "English\nLive Classes\n\nUrdu\nلائیو کلاسز\n\nArabic\nدروس مباشرة",
  liveDetail:
    "English\nQuran • Hadith • Tafseer\n\nUrdu\nقرآن • حدیث • تفسیر\n\nArabic\nالقرآن • الحديث • التفسير",
  verified:
    "English\nVerified Islamic Learning\n\nUrdu\nتصدیق شدہ اسلامی تعلیم\n\nArabic\nتعلم إسلامي موثق",
  imageAlt:
    "English\nOnline Quran and Islamic learning\n\nUrdu\nآن لائن قرآن اور اسلامی تعلیم\n\nArabic\nتعلم القرآن والعلوم الإسلامية عبر الإنترنت",
  imageSrc: "/images/hero.webp",
};

async function readSetting<T>(key: string, fallback: T) {
  try {
    const entry = await prisma.setting.findUnique({
      where: {
        key,
      },
    });

    if (!entry) {
      return fallback;
    }

    return { ...fallback, ...(entry.value as Record<string, unknown>) } as T;
  } catch {
    return fallback;
  }
}

function isUnavailableLocaleCopy(value: string) {
  const normalized = value.trim().toLowerCase();

  return (
    normalized.includes("content is not available") ||
    normalized.includes("دستیاب نہیں") ||
    normalized.includes("غير متاح") ||
    normalized.includes("Ø¯Ø³ØªÛŒØ§Ø¨")
  );
}

function resolveBrandName(value: string, locale: SiteLocale) {
  const normalized = value.trim();

  if (!normalized) {
    return siteConfig.name;
  }

  const hasLocaleMarkers =
    /\s+\/\s+/.test(normalized) || /(^|\n)\s*(english|urdu|arabic)\s*(\n|$)/i.test(normalized);

  if (!hasLocaleMarkers) {
    return normalized;
  }

  const localizedBrandName = resolveLocalizedInlineText(normalized, locale).trim();

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
      label: resolveLocalizedRichText(stat.label, locale),
      value: stat.value,
    })),
    certificate: resolveLocalizedRichText(settings.certificate, locale),
    certificateDetail: resolveLocalizedRichText(settings.certificateDetail, locale),
    liveClasses: resolveLocalizedRichText(settings.liveClasses, locale),
    liveDetail: resolveLocalizedRichText(settings.liveDetail, locale),
    verified: resolveLocalizedRichText(settings.verified, locale),
    imageAlt: resolveLocalizedRichText(settings.imageAlt, locale),
    imageSrc: settings.imageSrc,
  };
}

export async function updateSiteSettings(input: SiteSettings) {
  return prisma.setting.upsert({
    where: {
      key: SITE_SETTINGS_KEY,
    },
    update: {
      value: input,
    },
    create: {
      key: SITE_SETTINGS_KEY,
      value: input,
    },
  });
}

export async function updateHomepageHeroSettings(input: HomepageHeroSettings) {
  return prisma.setting.upsert({
    where: {
      key: HOMEPAGE_HERO_SETTINGS_KEY,
    },
    update: {
      value: input,
    },
    create: {
      key: HOMEPAGE_HERO_SETTINGS_KEY,
      value: input,
    },
  });
}
