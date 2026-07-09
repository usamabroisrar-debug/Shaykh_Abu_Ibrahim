import { cookies } from "next/headers";
import { Badge, Button, Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import { featuredQuiz, quizBenefits } from "@/data/quiz";
import styles from "./QuizSection.module.css";

export async function QuizSection() {
  const locale = getLocaleFromCookies(await cookies());
  const content = {
    en: {
      eyebrow: "Assessments",
      title: "Quiz flows designed to reinforce learning, not just test memory",
      description:
        "Timed assessments, progress checkpoints, and certificate readiness are part of the student experience from the beginning.",
      label: "Featured Quiz",
      questions: "Questions",
      duration: "Duration",
      level: "Level",
      cta: "Explore Quiz System",
      benefits: quizBenefits,
    },
    ur: {
      eyebrow: "اسیسمنٹس",
      title: "ایسے کوئز سسٹم جو صرف یادداشت نہیں بلکہ سیکھنے کو مضبوط کرتے ہیں",
      description:
        "ٹائمڈ assessments، progress checkpoints، اور certificate readiness شروع سے ہی طالب علم کے تجربے کا حصہ ہیں۔",
      label: "نمایاں کوئز",
      questions: "سوالات",
      duration: "دورانیہ",
      level: "لیول",
      cta: "کوئز سسٹم دیکھیں",
      benefits: ["Timed quizzes", "Progress checks", "Certificate ready"],
    },
    ar: {
      eyebrow: "التقييمات",
      title: "أنظمة اختبار مصممة لتعزيز التعلم لا لمجرد اختبار الذاكرة",
      description:
        "التقييمات الزمنية ونقاط متابعة التقدم والاستعداد للشهادة جزء من تجربة الطالب منذ البداية.",
      label: "الاختبار المميز",
      questions: "الأسئلة",
      duration: "المدة",
      level: "المستوى",
      cta: "استكشف نظام الاختبارات",
      benefits: ["اختبارات مؤقتة", "متابعة التقدم", "جاهزية الشهادة"],
    },
  }[locale];

  return (
    <Section variant="dark" className={styles.section}>
      <Container className={styles.layout}>
        <div>
          <SectionTitle
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
            align="left"
          />

          <div className={styles.benefits}>
            {content.benefits.map((benefit) => (
              <Badge key={benefit} variant="gold" className={styles.badge}>
                {benefit}
              </Badge>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <span className={styles.label}>{content.label}</span>
          <h3>{featuredQuiz.title}</h3>
          <p>{featuredQuiz.description}</p>

          <div className={styles.meta}>
            <div>
              <strong>{featuredQuiz.questions}</strong>
              <span>{content.questions}</span>
            </div>
            <div>
              <strong>{featuredQuiz.duration}</strong>
              <span>{content.duration}</span>
            </div>
            <div>
              <strong>{featuredQuiz.level}</strong>
              <span>{content.level}</span>
            </div>
          </div>

          <Button href="/quiz" variant="primary">
            {content.cta}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
