import { cookies } from "next/headers";
import { ArrowRight } from "lucide-react";
import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import { getPublicCourses } from "@/services/course/course.service";
import { CourseCard } from "./CourseCard";
import styles from "./CoursesSection.module.css";

const copy = {
  en: {
    eyebrow: "Core Courses",
    title: "Choose the right Quran and Islamic studies pathway",
    description:
      "Start with Qaida, Nazra, Hifz, Tajweed, Tafseer, or Dars-e-Nizami through guided online classes.",
    note:
      "Every course is built around live teaching, clear milestones, and family-friendly scheduling.",
    cta: "View All Courses",
  },
  ur: {
    eyebrow: "اہم کورسز",
    title: "قرآن اور اسلامی علوم کے لیے درست تعلیمی راستہ منتخب کریں",
    description:
      "قاعدہ، ناظرہ، حفظ، تجوید، تفسیر، یا درسِ نظامی کی تعلیم رہنمائی والی آن لائن کلاسز کے ذریعے حاصل کریں۔",
    note:
      "ہر کورس لائیو تدریس، واضح مراحل، اور خاندان کے لیے آسان شیڈول کے ساتھ بنایا گیا ہے۔",
    cta: "تمام کورسز دیکھیں",
  },
  ar: {
    eyebrow: "الدورات الأساسية",
    title: "اختر المسار المناسب للقرآن والدراسات الإسلامية",
    description:
      "ابدأ بالقاعدة أو القراءة أو الحفظ أو التجويد أو التفسير أو درس نظامي من خلال دروس مباشرة موجهة.",
    note:
      "كل دورة مبنية على تعليم مباشر ومراحل واضحة وجدول مناسب للعائلات.",
    cta: "عرض جميع الدورات",
  },
} as const;

export async function CoursesSection() {
  const locale = getLocaleFromCookies(await cookies());
  const content = copy[locale];
  const allCourses = await getPublicCourses();

  // Ensure core courses appear first: Qaida, Nazra, Hifz
  const orderedCategories = ["Qaida", "Nazra", "Hifz"];
  const orderedCourses: typeof allCourses = [];

  for (const cat of orderedCategories) {
    orderedCourses.push(...allCourses.filter((c) => c.category === cat));
  }

  // Append remaining courses after the ordered ones
  const remaining = allCourses.filter((c) => !orderedCourses.find((o) => o.id === c.id));
  const combined = [...orderedCourses, ...remaining];

  // Deduplicate by category so we don't show the same category multiple times on home
  const seen = new Set<string>();
  const uniqueByCategory = combined.filter((c) => {
    if (seen.has(c.category)) return false;
    seen.add(c.category);
    return true;
  });

  const featuredCourses = uniqueByCategory.slice(0, 6);

  return (
    <Section className={styles.section}>
      <Container>
        <div className={styles.header}>
          <SectionTitle
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
            align="left"
          />

          <div className={styles.actions}>
            <p className={styles.note}>{content.note}</p>
            <Button href="/courses" variant="secondary">
              {content.cta}
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>

        <div className={styles.grid}>
          {featuredCourses.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course} locale={locale} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
