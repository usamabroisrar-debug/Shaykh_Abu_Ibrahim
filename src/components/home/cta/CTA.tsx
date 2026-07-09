import { cookies } from "next/headers";
import { Button, Container, Section } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import styles from "./CTA.module.css";

const copy = {
  en: {
    eyebrow: "Admissions Open",
    title: "Start a more intentional Islamic learning journey today",
    description:
      "Whether the goal is strong Quran foundations, memorization, or a deeper connection to Islamic knowledge, the next step should feel clear and welcoming.",
    benefits: ["Free trial class", "Flexible schedule", "Personal guidance"],
    primary: "Start Free Trial",
    secondary: "Speak With The Team",
    note: "No upfront payment. Consultation first.",
  },
  ur: {
    eyebrow: "داخلے کھلے ہیں",
    title: "آج ہی ایک زیادہ بامقصد اسلامی تعلیمی سفر شروع کریں",
    description:
      "چاہے مقصد قرآن کی مضبوط بنیاد ہو، حفظ ہو، یا اسلامی علم سے گہرا تعلق، اگلا قدم واضح اور خوش آمدیدی ہونا چاہیے۔",
    benefits: ["فری ٹرائل کلاس", "لچکدار شیڈول", "ذاتی رہنمائی"],
    primary: "فری ٹرائل شروع کریں",
    secondary: "ٹیم سے بات کریں",
    note: "پیشگی ادائیگی نہیں۔ پہلے مشاورت۔",
  },
  ar: {
    eyebrow: "القبول مفتوح",
    title: "ابدأ اليوم رحلة تعليمية إسلامية أكثر قصداً",
    description:
      "سواء كان الهدف تأسيساً قوياً في القرآن أو الحفظ أو ارتباطاً أعمق بالعلم الإسلامي، ينبغي أن تبدو الخطوة التالية واضحة ومرحبة.",
    benefits: ["حصة تجريبية مجانية", "جدول مرن", "إرشاد شخصي"],
    primary: "ابدأ الحصة المجانية",
    secondary: "تحدث مع الفريق",
    note: "لا دفعة مقدمة. الاستشارة أولاً.",
  },
} as const;

export async function CTA() {
  const locale = getLocaleFromCookies(await cookies());
  const content = copy[locale];

  return (
    <Section className={styles.section}>
      <Container>
        <div className={styles.card}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>{content.eyebrow}</span>
            <h2>{content.title}</h2>
            <p>{content.description}</p>

            <div className={styles.benefits}>
              {content.benefits.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <Button href="/admission" variant="primary" size="lg">
              {content.primary}
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              {content.secondary}
            </Button>
            <p className={styles.note}>{content.note}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
