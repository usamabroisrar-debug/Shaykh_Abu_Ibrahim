import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Badge, Card, Container, Section } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { resolveLocalizedInlineText, resolveLocalizedRichText } from "@/lib/content-localization";
import { getLocaleFromCookies } from "@/lib/locale";
import { getPublicCourses } from "@/services/course/course.service";
import { getCourseImagePath } from "@/utils/course-image";
import styles from "./CoursesPage.module.css";

const courseCategoryLabels: Record<string, Partial<Record<"en" | "ur" | "ar", string>>> = {
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

const courseLevelLabels: Record<string, Partial<Record<"en" | "ur" | "ar", string>>> = {
  Beginner: { ur: "ابتدائی", ar: "مبتدئ" },
  Intermediate: { ur: "درمیانی", ar: "متوسط" },
  Advanced: { ur: "اعلیٰ", ar: "متقدم" },
  "All Levels": { ur: "تمام سطحیں", ar: "كل المستويات" },
};

function isUnavailableCopy(value: string) {
  return (
    value.includes("Content is not available") ||
    value.includes("دستیاب نہیں") ||
    value.includes("غير متاح")
  );
}

function localizedInline(value: Parameters<typeof resolveLocalizedInlineText>[0], locale: "en" | "ur" | "ar") {
  const resolved = resolveLocalizedInlineText(value, locale).trim();
  return resolved && !isUnavailableCopy(resolved)
    ? resolved
    : resolveLocalizedInlineText(value, "en").trim() || String(value || "");
}

function localizedRich(value: Parameters<typeof resolveLocalizedRichText>[0], locale: "en" | "ur" | "ar") {
  const resolved = resolveLocalizedRichText(value, locale).trim();
  return resolved && !isUnavailableCopy(resolved)
    ? resolved
    : resolveLocalizedRichText(value, "en").trim() || String(value || "");
}

export async function CoursesPage() {
  const locale = getLocaleFromCookies(await cookies());
  const courses = await getPublicCourses();
  const copy = {
    en: {
      eyebrow: "Courses",
      title: "Structured programs for Quran recitation, memorization, understanding, and Islamic growth",
      description:
        "Browse the academy's signature learning tracks designed for beginners, families, and committed students seeking depth with consistent guidance.",
      primaryCta: "Apply For Admission",
      detailsCta: "View Course Details",
      lessons: "lessons",
      students: "students",
    },
    ur: {
      eyebrow: "کورسز",
      title: "قرآن قرأت، حفظ، فہم، اور اسلامی ترقی کے لیے منظم پروگرام",
      description:
        "ابتدائی طلبہ، خاندانوں، اور سنجیدہ طلبہ کے لیے تیار کردہ اکیڈمی کے نمایاں تعلیمی راستے دیکھیں۔",
      primaryCta: "داخلے کے لیے اپلائی کریں",
      detailsCta: "کورس کی تفصیل دیکھیں",
      lessons: "اسباق",
      students: "طلبہ",
    },
    ar: {
      eyebrow: "الدورات",
      title: "برامج منظمة لتلاوة القرآن والحفظ والفهم والنمو الإسلامي",
      description:
        "تصفح مسارات الأكاديمية التعليمية المصممة للمبتدئين والعائلات والطلاب الجادين مع توجيه مستمر.",
      primaryCta: "قدّم للقبول",
      detailsCta: "عرض تفاصيل الدورة",
      lessons: "دروس",
      students: "طلاب",
    },
  }[locale];

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        primaryCta={{ label: copy.primaryCta, href: "/admission" }}
      />

      <Section variant="white">
        <Container>
          <div className={styles.grid}>
            {courses.map((course) => (
              <Card key={course.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image
                    src={getCourseImagePath(course.image)}
                    alt={localizedInline(course.title, locale)}
                    width={860}
                    height={520}
                    className={styles.image}
                  />
                </div>
                <div className={styles.topRow}>
                  <Badge variant="green">
                    {courseCategoryLabels[course.category]?.[locale] ||
                      localizedInline(course.category, locale)}
                  </Badge>
                  <span className={styles.level}>
                    {courseLevelLabels[course.level]?.[locale] ||
                      localizedInline(course.level, locale)}
                  </span>
                </div>
                <h2>{localizedInline(course.title, locale)}</h2>
                <p className={styles.description}>
                  {localizedRich(course.rawDescription || course.description, locale)}
                </p>
                <div className={styles.meta}>
                  <span>{course.duration}</span>
                  <span>
                    {course.lessons} {copy.lessons}
                  </span>
                  <span>
                    {course.students}+ {copy.students}
                  </span>
                </div>
                <Link href={`/courses/${course.slug}`} className={styles.link}>
                  {copy.detailsCta}
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
