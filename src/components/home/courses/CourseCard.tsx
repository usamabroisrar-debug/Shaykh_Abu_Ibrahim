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

const courseCardLocaleMap: Record<
  string,
  Partial<Record<SiteLocale, { title?: string; category?: string; description?: string; designation?: string }>>
> = {
  "qaida-course": {
    ur: {
      title: "قائدہ کورس",
      category: "قائدہ",
      description: "نورانی قائدہ درست تلفظ اور مرحلہ وار رہنمائی کے ساتھ سیکھیں۔",
      designation: "قرآن و اسلامیات کے استاد",
    },
    ar: {
      title: "دورة القاعدة",
      category: "القاعدة",
      description: "تعلم القاعدة النورانية مع نطق صحيح وإرشاد خطوة بخطوة.",
      designation: "معلم القرآن والدراسات الإسلامية",
    },
  },
  "nazra-quran": {
    ur: {
      title: "ناظرہ قرآن",
      category: "قرآن خوانی",
      description: "روانی، اعتماد اور روزانہ اصلاح کے ساتھ قرآن پڑھنا سیکھیں۔",
      designation: "قرآن قراءت کے استاد",
    },
    ar: {
      title: "نظرة القرآن",
      category: "قراءة القرآن",
      description: "ابنِ الطلاقة والثقة مع تصحيح يومي وتوجيه مباشر في التلاوة.",
      designation: "معلم تلاوة القرآن",
    },
  },
  "hifz-ul-quran": {
    ur: {
      title: "حفظ القرآن",
      category: "حفظ",
      description: "منظم حفظ، روزانہ سبق، سبقی اور منزل کی نگرانی کے ساتھ۔",
      designation: "حفظ سپروائزر",
    },
    ar: {
      title: "حفظ القرآن",
      category: "الحفظ",
      description: "حفظ منظم مع متابعة يومية للسبق والمراجعة وخطة تقدم واضحة.",
      designation: "مشرف الحفظ",
    },
  },
};

function getLocalizedCourseCardData(course: Course, locale: SiteLocale) {
  const override = courseCardLocaleMap[course.slug]?.[locale];

  return {
    title: override?.title || resolveLocalizedInlineText(course.title, locale),
    category: override?.category || resolveLocalizedInlineText(course.category, locale),
    description:
      override?.description ||
      resolveLocalizedRichText(course.rawDescription || course.shortDescription, locale),
    designation:
      override?.designation || resolveLocalizedInlineText(course.teacher.designation, locale),
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
