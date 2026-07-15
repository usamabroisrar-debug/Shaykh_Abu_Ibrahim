import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Clock3, Star, Users } from "lucide-react";
import type { Course } from "@/data/courses";
import { resolveLocalizedInlineText, resolveLocalizedRichText } from "@/lib/content-localization";
import type { SiteLocale } from "@/lib/locale";
import { getCourseImagePath } from "@/utils/course-image";
import styles from "./CourseCard.module.css";

type CourseCardProps = {
  course: Course;
  locale: SiteLocale;
};

type CourseCardLocale = Partial<
  Record<
    SiteLocale,
    {
      title?: string;
      category?: string;
      description?: string;
      designation?: string;
    }
  >
>;

function normalizeInstructorName(name?: string | null) {
  const value = name?.trim();

  if (!value) {
    return "Shaykh Abu Ibrahim";
  }

  if (/shayk?h?\s+abdul\s+hadi/i.test(value)) {
    return "Shaykh Abu Ibrahim";
  }

  return value;
}

const courseCardLabels = {
  en: {
    popular: "Popular",
    free: "Free enrollment",
    students: "students",
    rating: "rating",
    certificate: "Certificate included",
    assessment: "Assessment included",
    explore: "Explore",
  },
  ur: {
    popular: "مقبول",
    free: "مفت داخلہ",
    students: "طلبہ",
    rating: "ریٹنگ",
    certificate: "سرٹیفکیٹ شامل ہے",
    assessment: "اسیسمنٹ شامل ہے",
    explore: "مزید دیکھیں",
  },
  ar: {
    popular: "شائع",
    free: "تسجيل مجاني",
    students: "طالب",
    rating: "تقييم",
    certificate: "الشهادة مشمولة",
    assessment: "التقييم مشمول",
    explore: "استكشف",
  },
} as const;

const courseCategoryLabels: Record<string, Partial<Record<SiteLocale, string>>> = {
  Qaida: { ur: "قاعدہ", ar: "القاعدة" },
  Nazra: { ur: "ناظرہ", ar: "النظرة" },
  Hifz: { ur: "حفظ", ar: "الحفظ" },
  Tajweed: { ur: "تجوید", ar: "التجويد" },
  Tarjuma: { ur: "ترجمہ", ar: "الترجمة" },
  Tafseer: { ur: "تفسیر", ar: "التفسير" },
  Hadith: { ur: "حدیث", ar: "الحديث" },
  Fiqh: { ur: "فقہ", ar: "الفقه" },
  Arabic: { ur: "عربی", ar: "العربية" },
  Kids: { ur: "بچوں کے لیے", ar: "للأطفال" },
};

const courseCardLocaleMap: Record<string, CourseCardLocale> = {
  "qaida-course": {
    ur: {
      title: "قاعدہ کورس",
      category: "قاعدہ",
      description: "نورانی قاعدہ درست تلفظ اور مرحلہ وار رہنمائی کے ساتھ سیکھیں۔",
      designation: "قرآن و اسلامیات کے استاد",
    },
    ar: {
      title: "دورة القاعدة",
      category: "القاعدة",
      description: "تعلم القاعدة النورانية مع نطق صحيح وإرشاد خطوة بخطوة.",
      designation: "معلم القرآن والدراسات الإسلامية",
    },
  },
  "qaida-foundation-program": {
    ur: {
      title: "قاعدہ فاؤنڈیشن پروگرام",
      category: "قاعدہ",
      description: "عربی حروف، درست تلفظ، اور قرآن پڑھنے کی مضبوط بنیاد کے لیے ابتدائی کورس۔",
    },
    ar: {
      title: "برنامج تأسيس القاعدة",
      category: "القاعدة",
      description: "دورة للمبتدئين في الحروف العربية والنطق والانتقال السلس إلى قراءة القرآن.",
    },
  },
  "nazra-quran": {
    ur: {
      title: "ناظرہ قرآن",
      category: "قرآن خوانی",
      description: "روانی، اعتماد، اور روزانہ اصلاح کے ساتھ قرآن پڑھنا سیکھیں۔",
      designation: "قرآن قراءت کے استاد",
    },
    ar: {
      title: "قراءة القرآن نظراً",
      category: "قراءة القرآن",
      description: "ابنِ الطلاقة والثقة مع تصحيح يومي وتوجيه مباشر في التلاوة.",
      designation: "معلم تلاوة القرآن",
    },
  },
  "nazra-quran-program": {
    ur: {
      title: "ناظرہ قرآن پروگرام",
      category: "ناظرہ",
      description: "روانی، اصلاح، اور نگرانی کے ساتھ قرآن خوانی کا رہنمائی والا کورس۔",
    },
    ar: {
      title: "برنامج قراءة القرآن نظراً",
      category: "قراءة القرآن",
      description: "دورة قراءة قرآنية موجهة مع الطلاقة والتصحيح والإشراف.",
    },
  },
  "hifz-ul-quran": {
    ur: {
      title: "حفظ القرآن",
      category: "حفظ",
      description: "منظم حفظ، روزانہ سبق، سبقی، اور منزل کی نگرانی کے ساتھ۔",
      designation: "حفظ سپروائزر",
    },
    ar: {
      title: "حفظ القرآن",
      category: "الحفظ",
      description: "حفظ منظم مع متابعة يومية للدرس والمراجعة وخطة تقدم واضحة.",
      designation: "مشرف الحفظ",
    },
  },
  "hifz-support-revision-circle": {
    ur: {
      title: "حفظ سپورٹ اور دہرائی حلقہ",
      category: "حفظ",
      description: "سبق پلاننگ، دہرائی نظم، اور استاد کی نگرانی کے ساتھ حفظ کی معاونت۔",
    },
    ar: {
      title: "حلقة دعم الحفظ والمراجعة",
      category: "الحفظ",
      description: "دعم الحفظ من خلال تخطيط الدرس والانضباط في المراجعة ومتابعة المعلم.",
    },
  },
  "tajweed-course": {
    ur: {
      title: "تجوید ماسٹر کورس",
      category: "تجوید",
      description: "مخارج، صفات، غنہ، مد، اور قرآنی تلاوت کے قواعد سیکھیں۔",
    },
    ar: {
      title: "دورة إتقان التجويد",
      category: "التجويد",
      description: "تعلم المخارج والصفات والغنة والمد وأحكام التلاوة القرآنية.",
    },
  },
  "tajweed-improvement-track": {
    ur: {
      title: "تجوید امپروومنٹ ٹریک",
      category: "تجوید",
      description: "بہتر قراءت اور مضبوط تجویدی اطلاق کے لیے منظم اصلاحی راستہ۔",
    },
    ar: {
      title: "مسار تحسين التجويد",
      category: "التجويد",
      description: "مسار تصحيح منظم لتلاوة أوضح وتطبيق أقوى للتجويد.",
    },
  },
  "quran-translation": {
    ur: {
      title: "قرآن ترجمہ",
      category: "ترجمہ",
      description: "الفاظ، ترجمہ، وضاحت، اور عملی اسباق کے ذریعے قرآن کے معانی سمجھیں۔",
    },
    ar: {
      title: "ترجمة القرآن",
      category: "الترجمة",
      description: "افهم معاني القرآن من خلال المفردات والترجمة والشرح والدروس العملية.",
    },
  },
  "tafseer-course": {
    ur: {
      title: "تفسیر کورس",
      category: "تفسیر",
      description: "قرآن کی وضاحت، پس منظر، حکمت، اور عملی رہنمائی کا منظم مطالعہ۔",
    },
    ar: {
      title: "دورة التفسير",
      category: "التفسير",
      description: "دراسة منظمة لشرح القرآن وسياقه وحكمه وهداياته العملية.",
    },
  },
  "tafseer-guidance-program": {
    ur: {
      title: "تفسیر رہنمائی پروگرام",
      category: "تفسیر",
      description: "منتخب قرآنی مقامات کے موضوعات، پس منظر، اور عملی رہنمائی کا منظم کورس۔",
    },
    ar: {
      title: "برنامج إرشاد التفسير",
      category: "التفسير",
      description: "دورة منظمة لفهم الموضوعات والسياق والهداية العملية من القرآن.",
    },
  },
  "hadith-studies": {
    ur: {
      title: "حدیث اسٹڈیز",
      category: "حدیث",
      description: "منتخب مستند احادیث کو معنی، پس منظر، شرح، اور عملی اسباق کے ساتھ پڑھیں۔",
    },
    ar: {
      title: "دراسات الحديث",
      category: "الحديث",
      description: "ادرس أحاديث صحيحة مختارة مع المعنى والسياق والشرح والدروس العملية.",
    },
  },
  "fiqh-essentials": {
    ur: {
      title: "فقہ ضروریات",
      category: "فقہ",
      description: "عبادات، روزمرہ زندگی، اور اسلامی آداب کے ضروری فقہی مسائل سیکھیں۔",
    },
    ar: {
      title: "أساسيات الفقه",
      category: "الفقه",
      description: "تعلم الأحكام الفقهية الأساسية للعبادة والحياة اليومية والآداب الإسلامية.",
    },
  },
  "dars-e-nizami": {
    ur: {
      title: "درس نظامی",
      category: "درس نظامی",
      description: "عربی، فقہ، اصول، تفسیر، اور کلاسیکی متون کا منظم اسلامی تعلیمی راستہ۔",
    },
    ar: {
      title: "درس نظامي",
      category: "درس نظامي",
      description: "مسار منظم في العربية والفقه والأصول والتفسير والمتون الكلاسيكية.",
    },
  },
  "dars-e-nizami-program": {
    ur: {
      title: "درس نظامی پروگرام",
      category: "درس نظامی",
      description: "عربی، فقہ، اصول، اور متنی تعلیم کے ساتھ کلاسیکی اسلامی علوم کا پروگرام۔",
    },
    ar: {
      title: "برنامج درس نظامي",
      category: "درس نظامي",
      description: "مسار منظم في العلوم الإسلامية الكلاسيكية يشمل العربية والفقه والأصول.",
    },
  },
};

function isUnavailableCopy(value: string) {
  return (
    value.includes("Content is not available") ||
    value.includes("دستیاب نہیں") ||
    value.includes("غير متاح")
  );
}

function resolveWithFallback(
  value: string | null | undefined,
  locale: SiteLocale,
  resolver: typeof resolveLocalizedInlineText | typeof resolveLocalizedRichText
) {
  const resolved = resolver(value, locale).trim();

  if (resolved && !isUnavailableCopy(resolved)) {
    return resolved;
  }

  return resolver(value, "en").trim() || value?.trim() || "";
}

function getLocalizedCourseCardData(course: Course, locale: SiteLocale) {
  const override = courseCardLocaleMap[course.slug]?.[locale];

  return {
    title: override?.title || resolveWithFallback(course.title, locale, resolveLocalizedInlineText),
    category:
      override?.category ||
      courseCategoryLabels[course.category]?.[locale] ||
      resolveWithFallback(course.category, locale, resolveLocalizedInlineText),
    description:
      override?.description ||
      resolveWithFallback(
        course.rawDescription || course.shortDescription,
        locale,
        resolveLocalizedRichText
      ),
    designation:
      override?.designation ||
      resolveWithFallback(course.teacher.designation, locale, resolveLocalizedInlineText),
  };
}

export function CourseCard({ course, locale }: CourseCardProps) {
  const labels = courseCardLabels[locale];
  const localized = getLocalizedCourseCardData(course, locale);
  const priceLabel = course.price === 0 ? labels.free : `$${course.price.toFixed(0)}`;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={getCourseImagePath(course.image)}
          alt={localized.title}
          width={720}
          height={420}
          className={styles.image}
        />
      </div>

      <div className={styles.topRow}>
        <span className={styles.category}>{localized.category}</span>
        {course.isPopular ? <span className={styles.popular}>{labels.popular}</span> : null}
      </div>

      <h3 className={styles.title}>{localized.title}</h3>

      <p className={styles.description}>{localized.description}</p>

      <div className={styles.teacher}>
        <strong>{normalizeInstructorName(course.teacher.name)}</strong>
        <span>{localized.designation}</span>
      </div>

      <div className={styles.metaGrid}>
        <span>
          <Clock3 size={15} />
          {course.duration}
        </span>

        <span>
          <Users size={15} />
          {course.students}+ {labels.students}
        </span>

        <span>
          <Star size={15} />
          {course.rating} {labels.rating}
        </span>
      </div>

      <div className={styles.footer}>
        <div>
          <strong className={styles.price}>{priceLabel}</strong>
          <p className={styles.certificate}>
            <Award size={14} />
            {course.certificate ? labels.certificate : labels.assessment}
          </p>
        </div>

        <Link href={`/courses/${course.slug}`} className={styles.link}>
          {labels.explore} <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
