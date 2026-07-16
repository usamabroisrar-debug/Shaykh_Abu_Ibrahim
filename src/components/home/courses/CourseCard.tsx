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

const labels = {
  en: {
    popular: "Popular",
    free: "Free enrollment",
    students: "students",
    rating: "rating",
    certificate: "Certificate included",
    details: "Details",
    apply: "Apply",
  },
  ur: {
    popular: "مقبول",
    free: "مفت داخلہ",
    students: "طلبہ",
    rating: "ریٹنگ",
    certificate: "سرٹیفکیٹ شامل ہے",
    details: "تفصیل",
    apply: "داخلہ",
  },
  ar: {
    popular: "شائع",
    free: "تسجيل مجاني",
    students: "طالب",
    rating: "تقييم",
    certificate: "الشهادة مشمولة",
    details: "التفاصيل",
    apply: "التسجيل",
  },
} as const;

const categoryLabels: Record<string, Partial<Record<SiteLocale, string>>> = {
  Qaida: { ur: "قاعدہ", ar: "القاعدة" },
  Nazra: { ur: "ناظرہ", ar: "القراءة" },
  Hifz: { ur: "حفظ", ar: "الحفظ" },
  Tajweed: { ur: "تجوید", ar: "التجويد" },
  Tarjuma: { ur: "ترجمہ", ar: "الترجمة" },
  Tafseer: { ur: "تفسیر", ar: "التفسير" },
  Hadith: { ur: "حدیث", ar: "الحديث" },
  Fiqh: { ur: "فقہ", ar: "الفقه" },
  Arabic: { ur: "عربی", ar: "العربية" },
  Kids: { ur: "بچوں کے لیے", ar: "للأطفال" },
};

const titleOverrides: Record<string, Partial<Record<SiteLocale, string>>> = {
  "qaida-course": { ur: "قاعدہ کورس", ar: "دورة القاعدة" },
  "qaida-foundation-program": { ur: "قاعدہ فاؤنڈیشن پروگرام", ar: "برنامج تأسيس القاعدة" },
  "nazra-quran": { ur: "ناظرہ قرآن", ar: "قراءة القرآن" },
  "nazra-quran-program": { ur: "ناظرہ قرآن پروگرام", ar: "برنامج قراءة القرآن" },
  "hifz-ul-quran": { ur: "حفظ القرآن", ar: "حفظ القرآن" },
  "hifz-support-revision-circle": { ur: "حفظ اور دہرائی", ar: "الحفظ والمراجعة" },
  "tajweed-course": { ur: "تجوید کورس", ar: "دورة التجويد" },
  "tajweed-improvement-track": { ur: "تجوید امپروومنٹ ٹریک", ar: "مسار تحسين التجويد" },
  "quran-translation": { ur: "قرآن ترجمہ", ar: "ترجمة القرآن" },
  "tafseer-course": { ur: "تفسیر کورس", ar: "دورة التفسير" },
  "tafseer-guidance-program": { ur: "تفسیر رہنمائی پروگرام", ar: "برنامج إرشاد التفسير" },
  "hadith-studies": { ur: "حدیث اسٹڈیز", ar: "دراسات الحديث" },
  "fiqh-essentials": { ur: "فقہ ضروریات", ar: "أساسيات الفقه" },
  "dars-e-nizami": { ur: "درسِ نظامی", ar: "درس نظامي" },
  "dars-e-nizami-program": { ur: "درسِ نظامی پروگرام", ar: "برنامج درس نظامي" },
};

function normalizeInstructorName(name?: string | null) {
  const value = name?.trim();

  if (!value || /shayk?h?\s+abdul\s+hadi/i.test(value)) {
    return "Shaykh Abu Ibrahim";
  }

  return value;
}

function hasUnavailableCopy(value: string) {
  return (
    value.includes("Content is not available") ||
    value.includes("مواد ابھی دستیاب نہیں") ||
    value.includes("غير متاح")
  );
}

function resolveText(
  value: string | null | undefined,
  locale: SiteLocale,
  resolver: typeof resolveLocalizedInlineText | typeof resolveLocalizedRichText
) {
  const resolved = resolver(value, locale).trim();

  if (resolved && !hasUnavailableCopy(resolved)) {
    return resolved;
  }

  return resolver(value, "en").trim() || value?.trim() || "";
}

export function CourseCard({ course, locale }: CourseCardProps) {
  const copy = labels[locale];
  const title =
    titleOverrides[course.slug]?.[locale] ||
    resolveText(course.title, locale, resolveLocalizedInlineText);
  const category = categoryLabels[course.category]?.[locale] || course.category;
  const description = resolveText(
    course.rawDescription || course.shortDescription,
    locale,
    resolveLocalizedRichText
  );
  const priceLabel = course.price === 0 ? copy.free : `$${course.price.toFixed(0)}`;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={getCourseImagePath(course.image)}
          alt={title}
          width={720}
          height={420}
          className={styles.image}
        />
      </div>

      <div className={styles.topRow}>
        <span className={styles.category}>{category}</span>
        {course.isPopular ? <span className={styles.popular}>{copy.popular}</span> : null}
      </div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      <div className={styles.teacher}>
        <strong>{normalizeInstructorName(course.teacher.name)}</strong>
        <span>{resolveText(course.teacher.designation, locale, resolveLocalizedInlineText)}</span>
      </div>

      <div className={styles.metaGrid}>
        <span>
          <Clock3 size={15} />
          {course.duration}
        </span>
        <span>
          <Users size={15} />
          {course.students}+ {copy.students}
        </span>
        <span>
          <Star size={15} />
          {course.rating} {copy.rating}
        </span>
      </div>

      <div className={styles.footer}>
        <div>
          <strong className={styles.price}>{priceLabel}</strong>
          <p className={styles.certificate}>
            <Award size={14} />
            {copy.certificate}
          </p>
        </div>

        <div className={styles.cardActions}>
          <Link href={`/courses/${course.slug}`} className={styles.link}>
            {copy.details} <ArrowRight size={16} />
          </Link>
          <Link href="/admission" className={styles.applyLink}>
            {copy.apply}
          </Link>
        </div>
      </div>
    </article>
  );
}
