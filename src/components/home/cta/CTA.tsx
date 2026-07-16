import { cookies } from "next/headers";
import { Button, Container, Section } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import styles from "./CTA.module.css";

const copy = {
  en: {
    eyebrow: "Admissions Open",
    title: "Start your Quran learning journey with a clear next step",
    description:
      "Choose the course, share the student details, and begin with a guided conversation before final enrollment.",
    benefits: ["Free trial class", "Flexible schedule", "Personal guidance"],
    primary: "Apply Now",
    secondary: "Contact Us",
    note: "No upfront payment. Consultation first.",
  },
  ur: {
    eyebrow: "داخلے جاری ہیں",
    title: "واضح اگلے قدم کے ساتھ قرآن سیکھنے کا سفر شروع کریں",
    description:
      "کورس منتخب کریں، طالب علم کی معلومات دیں، اور حتمی داخلے سے پہلے رہنمائی والی گفتگو سے آغاز کریں۔",
    benefits: ["فری ٹرائل کلاس", "لچکدار شیڈول", "ذاتی رہنمائی"],
    primary: "ابھی اپلائی کریں",
    secondary: "رابطہ کریں",
    note: "پیشگی ادائیگی نہیں۔ پہلے مشاورت۔",
  },
  ar: {
    eyebrow: "التسجيل مفتوح",
    title: "ابدأ رحلة تعلم القرآن بخطوة واضحة",
    description:
      "اختر الدورة، وشارك بيانات الطالب، وابدأ بمحادثة موجهة قبل التسجيل النهائي.",
    benefits: ["حصة تجريبية مجانية", "جدول مرن", "إرشاد شخصي"],
    primary: "قدم الآن",
    secondary: "تواصل معنا",
    note: "لا توجد دفعة مقدمة. الاستشارة أولا.",
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
