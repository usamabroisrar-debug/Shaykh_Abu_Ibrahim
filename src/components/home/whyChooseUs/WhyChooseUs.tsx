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
import { academyFeatures } from "@/data/features";
import styles from "./WhyChooseUs.module.css";

const icons = [ShieldCheck, BookOpenCheck, Globe2, Clock3];

const copy = {
  en: {
    eyebrow: "Why Choose Us",
    title: "Why families choose a clearer, more structured Quran learning experience",
    description:
      "The academy is designed around trust, teacher quality, and a smoother online journey from trial class to consistent progress.",
    assuranceTitle: "Designed for long-term learning",
    assuranceText:
      "From the first class to sustained study, every touchpoint is organized to support clarity, accountability, and steady growth.",
    personalTitle: "Personal attention",
    personalText: "Live one-to-one guidance keeps every student supported at their own pace.",
    globalTitle: "Global flexibility",
    globalText: "Schedules can adapt across time zones for children, adults, and families.",
    features: academyFeatures,
  },
  ur: {
    eyebrow: "ہمیں کیوں منتخب کریں",
    title: "خاندان ایک زیادہ واضح اور منظم قرآنی تعلیمی تجربہ کیوں منتخب کرتے ہیں",
    description:
      "اکیڈمی کو اعتماد، معیاری اساتذہ، اور ٹرائل کلاس سے مستقل پیش رفت تک ایک ہموار آن لائن سفر کے گرد ترتیب دیا گیا ہے۔",
    assuranceTitle: "طویل مدتی تعلیم کے لیے ترتیب دی گئی",
    assuranceText:
      "پہلی کلاس سے مستقل مطالعے تک ہر مرحلہ وضاحت، جوابدہی، اور مسلسل ترقی کو سہارا دینے کے لیے منظم ہے۔",
    personalTitle: "ذاتی توجہ",
    personalText: "ون ٹو ون لائیو رہنمائی ہر طالب علم کو اس کی رفتار کے مطابق سہارا دیتی ہے۔",
    globalTitle: "عالمی لچک",
    globalText: "بچوں، بڑوں، اور خاندانوں کے لیے مختلف ٹائم زونز کے مطابق شیڈول بنایا جا سکتا ہے۔",
    features: [
      {
        id: "feature-1",
        title: "مستند نصاب",
        description: "کورسز واضح، باادب، اور عملی اسلامی تعلیم کے مستند اصولوں پر بنائے گئے ہیں۔",
      },
      {
        id: "feature-2",
        title: "منظم راستے",
        description: "ہر طالب علم ابتدائی بنیاد سے گہری سمجھ تک ایک واضح راستے پر چلتا ہے۔",
      },
      {
        id: "feature-3",
        title: "لچکدار لائیو تدریس",
        description: "لائیو آن لائن سیشنز مصروف خاندانوں، بڑوں، اور مختلف سطحوں کے طلبہ کے لیے موزوں ہیں۔",
      },
      {
        id: "feature-4",
        title: "پیش رفت کی نگرانی",
        description: "اسیسمنٹس، حاضری، اور استاد کی فیڈبیک سیکھنے کو قابلِ پیمائش اور پائیدار بناتی ہے۔",
      },
    ],
  },
  ar: {
    eyebrow: "لماذا نحن",
    title: "لماذا تختار العائلات تجربة أوضح وأكثر تنظيماً لتعلم القرآن",
    description:
      "صُممت الأكاديمية حول الثقة وجودة المعلمين ورحلة تعليمية أكثر سلاسة من الحصة التجريبية إلى التقدم المستمر.",
    assuranceTitle: "مصممة للتعلم الطويل المدى",
    assuranceText:
      "من الحصة الأولى إلى الدراسة المستمرة، تم تنظيم كل نقطة تواصل لدعم الوضوح والمسؤولية والنمو الثابت.",
    personalTitle: "اهتمام شخصي",
    personalText: "التوجيه المباشر الفردي يبقي كل طالب مدعوماً وفق سرعته الخاصة.",
    globalTitle: "مرونة عالمية",
    globalText: "يمكن تكييف الجداول عبر المناطق الزمنية للأطفال والبالغين والعائلات.",
    features: [
      {
        id: "feature-1",
        title: "منهج موثوق",
        description: "الدورات مبنية على تعلم إسلامي موثوق بوضوح وأدب وتطبيق عملي.",
      },
      {
        id: "feature-2",
        title: "مسارات منظمة",
        description: "يتبع كل طالب طريقاً متدرجاً من الأساسيات إلى الفهم الأعمق.",
      },
      {
        id: "feature-3",
        title: "تعليم مباشر مرن",
        description: "الجلسات المباشرة عبر الإنترنت مناسبة للعائلات المشغولة والبالغين والمستويات المختلفة.",
      },
      {
        id: "feature-4",
        title: "متابعة التقدم",
        description: "التقييمات والحضور وملاحظات المعلم تجعل التعلم قابلاً للقياس والاستمرار.",
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
