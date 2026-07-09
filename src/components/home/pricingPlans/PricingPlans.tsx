import { cookies } from "next/headers";
import { Check } from "lucide-react";
import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import { pricingPlans } from "@/data/pricing";
import styles from "./PricingPlans.module.css";

const pricingCopy = {
  en: {
    eyebrow: "Pricing Plans",
    title: "Flexible online class plans for different study rhythms",
    description:
      "A clean pricing structure helps families understand commitment, frequency, and support level before starting.",
    note: "Choose a clear monthly rhythm, then start with a guided conversation before final enrollment.",
    benefits: ["One-on-one live classes", "Flexible global timings", "Structured progress guidance"],
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
    title: "مختلف تعلیمی رفتار کے لیے لچکدار آن لائن کلاس پلانز",
    description:
      "واضح قیمتوں کا ڈھانچہ خاندانوں کو آغاز سے پہلے کمٹمنٹ، فریکوئنسی، اور سپورٹ لیول سمجھنے میں مدد دیتا ہے۔",
    note: "اپنے لیے موزوں ماہانہ رفتار منتخب کریں، پھر آخری داخلے سے پہلے رہنمائی کے ساتھ گفتگو شروع کریں۔",
    benefits: ["ون ٹو ون لائیو کلاسز", "عالمی سطح پر لچکدار اوقات", "منظم پیش رفت رہنمائی"],
    recommended: "تجویز کردہ",
    mostPopular: "سب سے مقبول",
    freeTrial: "فری ٹرائل",
    trialText: "مکمل داخلے سے پہلے آغاز کریں",
    meta: ["آن لائن 1:1", "لچکدار اوقات"],
    startTrial: "فری ٹرائل شروع کریں",
    helper: "پہلی مشاورت کے لیے کوئی ادائیگی درکار نہیں",
    cadence: "ماہانہ",
  },
  ar: {
    eyebrow: "خطط الأسعار",
    title: "خطط دروس مرنة عبر الإنترنت لمختلف أنماط الدراسة",
    description:
      "يساعد هيكل الأسعار الواضح العائلات على فهم الالتزام وعدد الدروس ومستوى الدعم قبل البدء.",
    note: "اختر إيقاعاً شهرياً مناسباً، ثم ابدأ بمحادثة موجهة قبل التسجيل النهائي.",
    benefits: ["دروس مباشرة فردية", "مواعيد عالمية مرنة", "متابعة تقدم منظمة"],
    recommended: "موصى به",
    mostPopular: "الأكثر شيوعاً",
    freeTrial: "حصة تجريبية",
    trialText: "ابدأ قبل القبول الكامل",
    meta: ["أونلاين 1:1", "مواعيد مرنة"],
    startTrial: "ابدأ الحصة المجانية",
    helper: "لا حاجة إلى دفع قبل الاستشارة الأولى",
    cadence: "شهرياً",
  },
} as const;

const planTranslations = {
  ur: {
    basic: {
      name: "بیسک پلان",
      description: "ان طلبہ کے لیے موزوں جو استاد کی معاونت اور لچکدار اوقات کے ساتھ قرآن کا مستقل معمول شروع کر رہے ہوں۔",
      features: ["ہفتے میں 2 کلاسز", "ماہانہ 8 کلاسز", "ون ٹو ون آن لائن سیشنز", "لچکدار اوقات", "زوم یا گوگل میٹ سپورٹ"],
    },
    standard: {
      name: "اسٹینڈرڈ پلان",
      description: "ان طلبہ کے لیے متوازن پلان جو زیادہ تسلسل، فیڈبیک، اور قابلِ پیمائش پیش رفت چاہتے ہوں۔",
      features: ["ہفتے میں 4 کلاسز", "ماہانہ 16 کلاسز", "ذاتی تعلیمی منصوبہ", "پیش رفت مانیٹرنگ", "ترجیحی ری شیڈولنگ سپورٹ"],
    },
    premium: {
      name: "پریمیم پلان",
      description: "ان سنجیدہ طلبہ کے لیے بہترین جو زیادہ توجہ اور گہری مستقل رہنمائی چاہتے ہوں۔",
      features: ["ہفتے میں 6 کلاسز", "ماہانہ 24 کلاسز", "مخصوص استاد کا راستہ", "ترجیحی شیڈولنگ", "تفصیلی پیش رفت رپورٹس"],
    },
  },
  ar: {
    basic: {
      name: "الخطة الأساسية",
      description: "مثالية للطلاب الذين يبدؤون روتيناً ثابتاً في القرآن مع دعم المعلم ومواعيد مرنة.",
      features: ["حصتان أسبوعياً", "8 حصص شهرياً", "جلسات فردية عبر الإنترنت", "مواعيد مرنة", "دعم عبر زوم أو جوجل ميت"],
    },
    standard: {
      name: "الخطة القياسية",
      description: "خطة متوازنة للمتعلمين الذين يريدون استمرارية أقوى وتغذية راجعة وتقدماً قابلاً للقياس.",
      features: ["4 حصص أسبوعياً", "16 حصة شهرياً", "خطة تعلم شخصية", "متابعة التقدم", "دعم أولوية لإعادة الجدولة"],
    },
    premium: {
      name: "الخطة المميزة",
      description: "الأفضل للطلاب الجادين الذين يريدون إيقاعاً تعليمياً أعمق وإرشاداً مستمراً أكبر.",
      features: ["6 حصص أسبوعياً", "24 حصة شهرياً", "مسار مع معلم مخصص", "جدولة ذات أولوية", "تقارير تقدم مفصلة"],
    },
  },
} as const;

export async function PricingPlans() {
  const locale = getLocaleFromCookies(await cookies());
  const content = pricingCopy[locale];

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
          {pricingPlans.map((plan) => (
            <article
              key={plan.id}
              className={`${styles.card} ${plan.isPopular ? styles.popular : ""}`}
            >
              {plan.isPopular ? (
                <span className={styles.cornerBadge}>{content.recommended}</span>
              ) : null}

              <div className={styles.planBar}>
                <span className={styles.planName}>
                  {locale === "en"
                    ? plan.name
                    : planTranslations[locale][plan.id as "basic" | "standard" | "premium"].name}
                </span>
                {plan.isPopular ? (
                  <span className={styles.badge}>{content.mostPopular}</span>
                ) : null}
              </div>

              <div className={styles.topRow}>
                <div>
                  <h3>
                    {plan.price} <small>{locale === "en" ? plan.cadence : content.cadence}</small>
                  </h3>
                  <p className={styles.classesLabel}>
                    {locale === "en"
                      ? plan.features[0]
                      : planTranslations[locale][plan.id as "basic" | "standard" | "premium"].features[0]}
                  </p>
                </div>
                <div className={styles.priceNote}>
                  <strong>{content.freeTrial}</strong>
                  <span>{content.trialText}</span>
                </div>
              </div>

              <p className={styles.description}>
                {locale === "en"
                  ? plan.description
                  : planTranslations[locale][plan.id as "basic" | "standard" | "premium"].description}
              </p>

              <div className={styles.metaStrip}>
                {content.meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <div className={styles.featureList}>
                {(locale === "en"
                  ? plan.features.slice(1)
                  : planTranslations[locale][plan.id as "basic" | "standard" | "premium"].features.slice(1)
                ).map((feature) => (
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
          ))}
        </div>
      </Container>
    </Section>
  );
}
