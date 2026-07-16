import { cookies } from "next/headers";
import { Check } from "lucide-react";
import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import { pricingPlans } from "@/data/pricing";
import styles from "./PricingPlans.module.css";

const copy = {
  en: {
    eyebrow: "Pricing Plans",
    title: "Flexible monthly plans for live one-to-one classes",
    description:
      "Choose the class rhythm that fits your family, then begin with a guided trial conversation.",
    note: "Pricing is simple, monthly, and designed for steady progress.",
    benefits: ["Live 1:1 classes", "Flexible timings", "Progress guidance"],
    recommended: "Recommended",
    mostPopular: "Most Popular",
    freeTrial: "Free trial",
    trialText: "Start before full admission",
    meta: ["Online 1:1", "Flexible timings"],
    startTrial: "Start Free Trial",
    helper: "No payment required for first consultation",
    cadence: "Monthly",
  },
  ur: {
    eyebrow: "قیمت کے پلانز",
    title: "لائیو ون ٹو ون کلاسز کے لیے لچکدار ماہانہ پلانز",
    description:
      "اپنے خاندان کے لیے مناسب کلاس روٹین منتخب کریں، پھر رہنمائی والی ٹرائل گفتگو سے آغاز کریں۔",
    note: "قیمتیں آسان، ماہانہ، اور مستقل پیش رفت کے لیے ترتیب دی گئی ہیں۔",
    benefits: ["لائیو 1:1 کلاسز", "لچکدار اوقات", "پیش رفت رہنمائی"],
    recommended: "تجویز کردہ",
    mostPopular: "سب سے مقبول",
    freeTrial: "فری ٹرائل",
    trialText: "مکمل داخلے سے پہلے آغاز",
    meta: ["آن لائن 1:1", "لچکدار اوقات"],
    startTrial: "فری ٹرائل شروع کریں",
    helper: "پہلی مشاورت کے لیے ادائیگی ضروری نہیں",
    cadence: "ماہانہ",
  },
  ar: {
    eyebrow: "خطط الأسعار",
    title: "خطط شهرية مرنة للدروس الفردية المباشرة",
    description:
      "اختر إيقاع الدروس المناسب لعائلتك، ثم ابدأ بمحادثة تجريبية موجهة.",
    note: "الأسعار بسيطة وشهرية ومصممة للتقدم المستمر.",
    benefits: ["دروس مباشرة 1:1", "مواعيد مرنة", "متابعة التقدم"],
    recommended: "موصى به",
    mostPopular: "الأكثر شيوعا",
    freeTrial: "حصة تجريبية",
    trialText: "ابدأ قبل التسجيل الكامل",
    meta: ["أونلاين 1:1", "مواعيد مرنة"],
    startTrial: "ابدأ الحصة المجانية",
    helper: "لا يلزم الدفع للاستشارة الأولى",
    cadence: "شهريا",
  },
} as const;

const planCopy = {
  ur: {
    basic: {
      name: "بیسک پلان",
      description: "ابتدائی طلبہ کے لیے ایک آسان اور مستقل قرآن روٹین۔",
      features: ["ہفتے میں 2 کلاسز", "ماہانہ 8 کلاسز", "ون ٹو ون آن لائن سیشنز", "لچکدار اوقات"],
    },
    standard: {
      name: "اسٹینڈرڈ پلان",
      description: "زیادہ تسلسل، فیڈبیک، اور واضح پیش رفت کے لیے متوازن پلان۔",
      features: ["ہفتے میں 4 کلاسز", "ماہانہ 16 کلاسز", "ذاتی تعلیمی منصوبہ", "پیش رفت مانیٹرنگ"],
    },
    premium: {
      name: "پریمیم پلان",
      description: "زیادہ توجہ اور گہری رہنمائی کے خواہش مند طلبہ کے لیے۔",
      features: ["ہفتے میں 6 کلاسز", "ماہانہ 24 کلاسز", "مخصوص استاد کا راستہ", "تفصیلی پیش رفت رپورٹ"],
    },
  },
  ar: {
    basic: {
      name: "الخطة الأساسية",
      description: "خطة سهلة للطلاب المبتدئين لبناء روتين قرآني ثابت.",
      features: ["حصتان أسبوعيا", "8 حصص شهريا", "جلسات فردية أونلاين", "مواعيد مرنة"],
    },
    standard: {
      name: "الخطة القياسية",
      description: "خطة متوازنة للاستمرارية والتغذية الراجعة والتقدم الواضح.",
      features: ["4 حصص أسبوعيا", "16 حصة شهريا", "خطة تعلم شخصية", "متابعة التقدم"],
    },
    premium: {
      name: "الخطة المميزة",
      description: "للطلاب الذين يريدون اهتماما أكبر وإرشادا أعمق.",
      features: ["6 حصص أسبوعيا", "24 حصة شهريا", "مسار مع معلم مخصص", "تقرير تقدم مفصل"],
    },
  },
} as const;

type PlanId = "basic" | "standard" | "premium";

export async function PricingPlans() {
  const locale = getLocaleFromCookies(await cookies());
  const content = copy[locale];

  return (
    <Section variant="white" className={styles.section}>
      <Container>
        <div className={styles.header}>
          <SectionTitle
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
            align="left"
          />
          <p className={styles.note}>{content.note}</p>
        </div>

        <div className={styles.quickBenefits}>
          {content.benefits.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className={styles.grid}>
          {pricingPlans.map((plan) => {
            const localized =
              locale === "en" ? null : planCopy[locale][plan.id as PlanId];
            const features = localized?.features || plan.features;

            return (
              <article
                key={plan.id}
                className={`${styles.card} ${plan.isPopular ? styles.popular : ""}`}
              >
                {plan.isPopular ? (
                  <span className={styles.cornerBadge}>{content.recommended}</span>
                ) : null}

                <div className={styles.planBar}>
                  <span className={styles.planName}>{localized?.name || plan.name}</span>
                  {plan.isPopular ? (
                    <span className={styles.badge}>{content.mostPopular}</span>
                  ) : null}
                </div>

                <div className={styles.topRow}>
                  <div>
                    <h3>
                      {plan.price} <small>{content.cadence}</small>
                    </h3>
                    <p className={styles.classesLabel}>{features[0]}</p>
                  </div>
                  <div className={styles.priceNote}>
                    <strong>{content.freeTrial}</strong>
                    <span>{content.trialText}</span>
                  </div>
                </div>

                <p className={styles.description}>
                  {localized?.description || plan.description}
                </p>

                <div className={styles.metaStrip}>
                  {content.meta.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <div className={styles.featureList}>
                  {features.slice(1).map((feature) => (
                    <div key={feature} className={styles.feature}>
                      <Check size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <Button href="/admission" variant={plan.isPopular ? "primary" : "outline"}>
                    {content.startTrial}
                  </Button>
                  <p className={styles.helper}>{content.helper}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
