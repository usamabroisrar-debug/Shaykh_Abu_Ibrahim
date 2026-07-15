import { cookies } from "next/headers";
import { Badge, Card, Container, Section } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { featuredQuiz, quizBenefits } from "@/data/quiz";
import { getLocaleFromCookies } from "@/lib/locale";
import styles from "./QuizPage.module.css";

export async function QuizPage() {
  const locale = getLocaleFromCookies(await cookies());
  const copy = {
    en: {
      eyebrow: "Quiz",
      title: "Assessment tools designed to strengthen confidence and measure progress",
      description:
        "Explore the academy's assessment format for timed tests, module checkpoints, and motivating performance feedback.",
      questions: "questions",
      expectTitle: "What students can expect",
    },
    ur: {
      eyebrow: "کوئز",
      title: "ایسے جائزہ ٹولز جو اعتماد بڑھائیں اور پیش رفت ناپیں",
      description:
        "ٹائمڈ ٹیسٹس، ماڈیول چیک پوائنٹس، اور حوصلہ افزا کارکردگی فیڈبیک کے لیے اکیڈمی کا جائزہ فارمیٹ دیکھیں۔",
      questions: "سوالات",
      expectTitle: "طلبہ کیا توقع رکھ سکتے ہیں",
    },
    ar: {
      eyebrow: "الاختبار",
      title: "أدوات تقييم مصممة لتعزيز الثقة وقياس التقدم",
      description:
        "استكشف نمط التقييم في الأكاديمية للاختبارات الموقوتة ونقاط التحقق المرحلية والتغذية الراجعة المحفزة.",
      questions: "أسئلة",
      expectTitle: "ما الذي يمكن للطلاب توقعه",
    },
  }[locale];

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <Section variant="white">
        <Container className={styles.grid}>
          <Card className={styles.primaryCard}>
            <Badge variant="gold">{featuredQuiz.level}</Badge>
            <h2>{featuredQuiz.title}</h2>
            <p>{featuredQuiz.description}</p>
            <div className={styles.meta}>
              <span>{featuredQuiz.questions} {copy.questions}</span>
              <span>{featuredQuiz.duration}</span>
            </div>
          </Card>

          <Card className={styles.secondaryCard}>
            <h2>{copy.expectTitle}</h2>
            <div className={styles.benefits}>
              {quizBenefits.map((item) => (
                <div key={item} className={styles.benefit}>
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
}
