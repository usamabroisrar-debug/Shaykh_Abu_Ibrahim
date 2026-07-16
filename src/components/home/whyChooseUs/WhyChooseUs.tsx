import { cookies } from "next/headers";
import {
  BookOpenCheck,
  Clock3,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import styles from "./WhyChooseUs.module.css";

const icons = [ShieldCheck, BookOpenCheck, Globe2, Clock3];

const copy = {
  en: {
    eyebrow: "Why Choose Us",
    title: "Clear, authentic, and family-friendly Quran learning",
    description:
      "Shaykh Abu Ibrahim Academy is built around trust, teacher quality, and a calm online journey from trial class to steady progress.",
    assuranceTitle: "Designed for long-term learning",
    assuranceText:
      "Every touchpoint supports clarity, accountability, and consistency for students and families.",
    personalTitle: "One-to-one attention",
    personalText: "Live personal classes help each student learn at the right pace.",
    globalTitle: "Flexible timings",
    globalText: "Schedules can adapt across time zones for children, adults, and families.",
    features: [
      {
        id: "feature-1",
        title: "Authentic guidance",
        description: "Courses follow respectful, practical Islamic learning principles.",
      },
      {
        id: "feature-2",
        title: "Structured pathway",
        description: "Students move from Qaida and Nazra to deeper Quran and Islamic studies.",
      },
      {
        id: "feature-3",
        title: "Online live classes",
        description: "Classes are guided directly by teachers with regular correction.",
      },
      {
        id: "feature-4",
        title: "Progress tracking",
        description: "Milestones, attendance, and feedback keep learning measurable.",
      },
    ],
  },
  ur: {
    eyebrow: "ہمیں کیوں منتخب کریں",
    title: "واضح، مستند، اور خاندان کے لیے آسان قرآنی تعلیم",
    description:
      "Shaykh Abu Ibrahim Academy اعتماد، معیاری تدریس، اور ٹرائل کلاس سے مستقل پیش رفت تک ایک آسان آن لائن سفر کے لیے بنائی گئی ہے۔",
    assuranceTitle: "طویل مدتی تعلیم کے لیے منظم",
    assuranceText:
      "ہر مرحلہ طلبہ اور خاندانوں کے لیے وضاحت، جوابدہی، اور تسلسل کو مضبوط بناتا ہے۔",
    personalTitle: "ون ٹو ون توجہ",
    personalText: "لائیو ذاتی کلاسز ہر طالب علم کو اس کی رفتار کے مطابق مدد دیتی ہیں۔",
    globalTitle: "لچکدار اوقات",
    globalText: "بچوں، بڑوں، اور خاندانوں کے لیے مختلف ٹائم زونز کے مطابق شیڈول۔",
    features: [
      {
        id: "feature-1",
        title: "مستند رہنمائی",
        description: "کورسز باادب اور عملی اسلامی تعلیم کے اصولوں پر مبنی ہیں۔",
      },
      {
        id: "feature-2",
        title: "منظم تعلیمی راستہ",
        description: "طلبہ قاعدہ اور ناظرہ سے گہرے قرآنی اور اسلامی علوم تک بڑھتے ہیں۔",
      },
      {
        id: "feature-3",
        title: "لائیو آن لائن کلاسز",
        description: "اساتذہ براہ راست رہنمائی اور باقاعدہ اصلاح فراہم کرتے ہیں۔",
      },
      {
        id: "feature-4",
        title: "پیش رفت کی نگرانی",
        description: "مراحل، حاضری، اور فیڈبیک سے تعلیم قابلِ پیمائش رہتی ہے۔",
      },
    ],
  },
  ar: {
    eyebrow: "لماذا تختارنا",
    title: "تعلم قرآني واضح وموثوق ومناسب للعائلات",
    description:
      "أكاديمية Shaykh Abu Ibrahim مبنية على الثقة وجودة التعليم ورحلة إلكترونية هادئة من الحصة التجريبية إلى التقدم المستمر.",
    assuranceTitle: "مصممة للتعلم المستمر",
    assuranceText:
      "كل مرحلة تدعم الوضوح والمسؤولية والثبات للطلاب والعائلات.",
    personalTitle: "اهتمام فردي",
    personalText: "الدروس المباشرة الفردية تساعد كل طالب حسب سرعته.",
    globalTitle: "مواعيد مرنة",
    globalText: "جداول مناسبة للأطفال والبالغين والعائلات عبر المناطق الزمنية.",
    features: [
      {
        id: "feature-1",
        title: "توجيه موثوق",
        description: "الدورات مبنية على مبادئ تعليم إسلامي عملية ومحترمة.",
      },
      {
        id: "feature-2",
        title: "مسار منظم",
        description: "ينتقل الطلاب من القاعدة والقراءة إلى الدراسات الإسلامية الأعمق.",
      },
      {
        id: "feature-3",
        title: "دروس مباشرة",
        description: "المعلمون يقدمون التوجيه والتصحيح المنتظم مباشرة.",
      },
      {
        id: "feature-4",
        title: "متابعة التقدم",
        description: "المراحل والحضور والملاحظات تجعل التعلم قابلا للقياس.",
      },
    ],
  },
} as const;

export async function WhyChooseUs() {
  const locale = getLocaleFromCookies(await cookies());
  const content = copy[locale];

  return (
    <Section variant="white" className={styles.section}>
      <Container className={styles.layout}>
        <div className={styles.intro}>
          <SectionTitle
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
            align="left"
          />

          <div className={styles.assuranceCard}>
            <div className={styles.assuranceIcon}>
              <Sparkles size={22} />
            </div>
            <div>
              <strong>{content.assuranceTitle}</strong>
              <p>{content.assuranceText}</p>
            </div>
          </div>

          <div className={styles.sidePoints}>
            <div>
              <strong>{content.personalTitle}</strong>
              <p>{content.personalText}</p>
            </div>
            <div>
              <strong>{content.globalTitle}</strong>
              <p>{content.globalText}</p>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {content.features.map((feature, index) => {
            const Icon = icons[index];

            return (
              <article key={feature.id} className={styles.card}>
                <div className={styles.iconWrap}>
                  <Icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
