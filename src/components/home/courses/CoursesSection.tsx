import { cookies } from "next/headers";
import { ArrowRight } from "lucide-react";
import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import { getFeaturedPublicCourses } from "@/services/course/course.service";
import { CourseCard } from "./CourseCard";
import styles from "./CoursesSection.module.css";

export async function CoursesSection() {
  const locale = getLocaleFromCookies(await cookies());
  const content = {
    en: {
      eyebrow: "Featured Courses",
      title: "Structured Islamic learning for every stage of the journey",
      description:
        "Explore flagship programs built for recitation, memorization, understanding, and long-term spiritual growth.",
      note:
        "Each course is designed with live teaching, progress milestones, and certificate-ready completion pathways.",
      cta: "View All Courses",
    },
    ur: {
      eyebrow: "نمایاں کورسز",
      title: "سفر کے ہر مرحلے کے لیے منظم اسلامی تعلیم",
      description:
        "ایسے اہم پروگرامز دیکھیں جو قراءت، حفظ، سمجھ، اور طویل مدتی روحانی ترقی کے لیے ترتیب دیے گئے ہیں۔",
      note:
        "ہر کورس لائیو تدریس، پیش رفت milestones، اور certificate-ready completion pathways کے ساتھ ڈیزائن کیا گیا ہے۔",
      cta: "تمام کورسز دیکھیں",
    },
    ar: {
      eyebrow: "الدورات المميزة",
      title: "تعلم إسلامي منظم لكل مرحلة من الرحلة",
      description:
        "استكشف برامج أساسية بُنيت للتلاوة والحفظ والفهم والنمو الروحي طويل المدى.",
      note:
        "كل دورة مصممة بتعليم مباشر ومحطات تقدم ومسارات إكمال جاهزة للشهادة.",
      cta: "عرض جميع الدورات",
    },
  }[locale];
  const featuredCourses = await getFeaturedPublicCourses(6);

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
