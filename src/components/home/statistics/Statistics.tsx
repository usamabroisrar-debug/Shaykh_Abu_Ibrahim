import { cookies } from "next/headers";
import { Container, Section } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import styles from "./Statistics.module.css";

const trustStripCopy = {
  en: [
    {
      id: "trust-1",
      value: "Live 1:1",
      label: "Personal classes",
      detail: "Teacher-led Quran learning with individual attention.",
    },
    {
      id: "trust-2",
      value: "Flexible",
      label: "Global timings",
      detail: "Schedules for children, adults, and families.",
    },
    {
      id: "trust-3",
      value: "Guided",
      label: "Progress pathway",
      detail: "Clear milestones from Qaida to advanced study.",
    },
    {
      id: "trust-4",
      value: "Verified",
      label: "Certificates",
      detail: "Completion records for eligible students.",
    },
  ],
  ur: [
    {
      id: "trust-1",
      value: "لائیو 1:1",
      label: "ذاتی کلاسز",
      detail: "استاد کی براہ راست رہنمائی کے ساتھ قرآن کی تعلیم۔",
    },
    {
      id: "trust-2",
      value: "لچکدار",
      label: "عالمی اوقات",
      detail: "بچوں، بڑوں، اور خاندانوں کے لیے مناسب شیڈول۔",
    },
    {
      id: "trust-3",
      value: "منظم",
      label: "تعلیمی راستہ",
      detail: "قاعدہ سے اعلیٰ اسلامی تعلیم تک واضح مراحل۔",
    },
    {
      id: "trust-4",
      value: "تصدیق شدہ",
      label: "سرٹیفکیٹس",
      detail: "اہل طلبہ کے لیے تکمیل کے سرٹیفکیٹس۔",
    },
  ],
  ar: [
    {
      id: "trust-1",
      value: "مباشر 1:1",
      label: "دروس شخصية",
      detail: "تعلم القرآن مع توجيه مباشر من المعلم.",
    },
    {
      id: "trust-2",
      value: "مرن",
      label: "مواعيد عالمية",
      detail: "جداول مناسبة للأطفال والبالغين والعائلات.",
    },
    {
      id: "trust-3",
      value: "منظم",
      label: "مسار تعليمي",
      detail: "مراحل واضحة من القاعدة إلى الدراسات المتقدمة.",
    },
    {
      id: "trust-4",
      value: "موثق",
      label: "شهادات",
      detail: "سجلات إتمام للطلاب المؤهلين.",
    },
  ],
} as const;

export async function Statistics() {
  const locale = getLocaleFromCookies(await cookies());
  const items = trustStripCopy[locale];

  return (
    <Section variant="white" className={styles.section}>
      <Container>
        <div className={styles.grid}>
          {items.map((stat) => (
            <article key={stat.id} className={styles.card}>
              <strong>{stat.value}</strong>
              <h2>{stat.label}</h2>
              <p>{stat.detail}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
