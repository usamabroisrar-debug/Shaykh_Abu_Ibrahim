import Link from "next/link";
import {
  BookOpen,
  BookMarked,
  GraduationCap,
  Languages,
  Landmark,
  Mic2,
  ScrollText,
} from "lucide-react";
import { courseNavigation } from "@/data/navigation";
import { type SiteLocale } from "@/lib/locale";
import styles from "./MegaMenu.module.css";

const icons = [BookOpen, BookMarked, GraduationCap, Mic2, Languages, Landmark];

const menuCopy = {
  en: {
    eyebrow: "Islamic Courses",
    title: "Choose your learning path",
    items: {
      "/courses/qaida-course": {
        title: "Qaida",
        text: "Master the reading foundations of Quran",
      },
      "/courses/nazra-quran": {
        title: "Nazra Quran",
        text: "Build fluency with guided correction",
      },
      "/courses/hifz-ul-quran": {
        title: "Hifz ul Quran",
        text: "Memorize with revision-led structure",
      },
      "/courses/tajweed-course": {
        title: "Tajweed",
        text: "Refine recitation through rules and practice",
      },
      "/courses/quran-translation": {
        title: "Translation",
        text: "Understand meanings with vocabulary support",
      },
      "/courses/hadith-studies": {
        title: "Hadith Studies",
        text: "Study authentic narrations with context",
      },
    },
  },
  ur: {
    eyebrow: "اسلامی کورسز",
    title: "اپنا تعلیمی راستہ منتخب کریں",
    items: {
      "/courses/qaida-course": {
        title: "قائدہ",
        text: "قرآن پڑھنے کی مضبوط بنیاد حاصل کریں",
      },
      "/courses/nazra-quran": {
        title: "ناظرہ قرآن",
        text: "اصلاح کے ساتھ روانی پیدا کریں",
      },
      "/courses/hifz-ul-quran": {
        title: "حفظ القرآن",
        text: "منظم ریویژن کے ساتھ حفظ کریں",
      },
      "/courses/tajweed-course": {
        title: "تجوید",
        text: "قواعد اور مشق سے قرأت بہتر بنائیں",
      },
      "/courses/quran-translation": {
        title: "ترجمہ قرآن",
        text: "الفاظ اور مفہوم کے ساتھ سمجھ پیدا کریں",
      },
      "/courses/hadith-studies": {
        title: "حدیث اسٹڈیز",
        text: "مستند احادیث کو سیاق کے ساتھ پڑھیں",
      },
    },
  },
  ar: {
    eyebrow: "الدورات الإسلامية",
    title: "اختر مسارك التعليمي",
    items: {
      "/courses/qaida-course": {
        title: "القاعدة",
        text: "أتقن أساسيات قراءة القرآن",
      },
      "/courses/nazra-quran": {
        title: "نظرة القرآن",
        text: "ابنِ الطلاقة مع تصحيح موجّه",
      },
      "/courses/hifz-ul-quran": {
        title: "حفظ القرآن",
        text: "احفظ مع مراجعة منظمة",
      },
      "/courses/tajweed-course": {
        title: "التجويد",
        text: "حسّن التلاوة بالقواعد والتطبيق",
      },
      "/courses/quran-translation": {
        title: "ترجمة القرآن",
        text: "افهم المعاني بدعم المفردات",
      },
      "/courses/hadith-studies": {
        title: "دراسات الحديث",
        text: "ادرس الأحاديث الصحيحة مع السياق",
      },
    },
  },
} as const;

export function MegaMenu({ locale }: { locale: SiteLocale }) {
  const copy = menuCopy[locale];

  return (
    <div className={styles.menu}>
      <div className={styles.header}>
        <span>{copy.eyebrow}</span>
        <strong>{copy.title}</strong>
      </div>

      <div className={styles.grid}>
        {courseNavigation.map((course, index) => {
          const Icon = icons[index] ?? ScrollText;
          const localizedCourse = copy.items[course.href as keyof typeof copy.items];

          return (
            <Link key={course.href} href={course.href} className={styles.item}>
              <div className={styles.icon}>
                <Icon size={20} />
              </div>
              <div>
                <h4>{localizedCourse?.title || course.title}</h4>
                <p>{localizedCourse?.text || course.text}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
