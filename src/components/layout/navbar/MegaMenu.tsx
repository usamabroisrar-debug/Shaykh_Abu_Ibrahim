import Link from "next/link";
import { courseNavigation } from "@/data/navigation";
import { type SiteLocale } from "@/lib/locale";
import styles from "./MegaMenu.module.css";

const courseLabels = {
  en: {
    "/courses/qaida-course": "Qaida",
    "/courses/nazra-quran": "Nazra Quran",
    "/courses/hifz-ul-quran": "Hifz ul Quran",
    "/courses/tajweed-course": "Tajweed",
    "/courses/quran-translation": "Quran Translation",
    "/courses/hadith-studies": "Hadith Studies",
  },
  ur: {
    "/courses/qaida-course": "قاعدہ",
    "/courses/nazra-quran": "ناظرہ قرآن",
    "/courses/hifz-ul-quran": "حفظ القرآن",
    "/courses/tajweed-course": "تجوید",
    "/courses/quran-translation": "ترجمہ قرآن",
    "/courses/hadith-studies": "حدیث",
  },
  ar: {
    "/courses/qaida-course": "القاعدة",
    "/courses/nazra-quran": "نظرة القرآن",
    "/courses/hifz-ul-quran": "حفظ القرآن",
    "/courses/tajweed-course": "التجويد",
    "/courses/quran-translation": "ترجمة القرآن",
    "/courses/hadith-studies": "الحديث",
  },
} as const;

export function MegaMenu({ locale }: { locale: SiteLocale }) {
  const labels = courseLabels[locale];

  return (
    <div className={styles.menu}>
      {courseNavigation.map((course) => (
        <Link key={course.href} href={course.href} className={styles.item}>
          {labels[course.href as keyof typeof labels] || course.title}
        </Link>
      ))}
    </div>
  );
}
