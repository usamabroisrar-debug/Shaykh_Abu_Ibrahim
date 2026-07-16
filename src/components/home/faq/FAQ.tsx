import { cookies } from "next/headers";
import { Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import styles from "./FAQ.module.css";

const copy = {
  en: {
    eyebrow: "FAQ",
    title: "Clear answers before you start online Quran classes",
    description:
      "Here are the questions families usually ask before admission, trial class, and monthly scheduling.",
    supportTitle: "Still not sure which course fits best?",
    supportText:
      "Start with a short conversation and we will guide the right course, teacher, and schedule.",
    items: [
      ["Can I start with a free trial?", "Yes. Families can begin with a guided conversation or trial class before final enrollment."],
      ["Are classes live?", "Yes. Core courses are taught live with teacher interaction and correction."],
      ["Which courses are available?", "Qaida, Nazra, Hifz, Tajweed, Tafseer, Hadith, Fiqh, and Dars-e-Nizami pathways are available."],
      ["Can children and adults both join?", "Yes. Courses are arranged for children, adults, sisters, and advanced learners."],
      ["Will students receive certificates?", "Eligible students can receive completion certificates after finishing the required course work."],
    ],
  },
  ur: {
    eyebrow: "عام سوالات",
    title: "آن لائن قرآن کلاسز شروع کرنے سے پہلے واضح جوابات",
    description:
      "یہ وہ سوالات ہیں جو خاندان داخلہ، ٹرائل کلاس، اور ماہانہ شیڈول سے پہلے عموما پوچھتے ہیں۔",
    supportTitle: "ابھی یقین نہیں کہ کون سا کورس بہتر ہے؟",
    supportText:
      "مختصر گفتگو سے آغاز کریں، ہم مناسب کورس، استاد، اور شیڈول منتخب کرنے میں مدد کریں گے۔",
    items: [
      ["کیا فری ٹرائل سے آغاز ہو سکتا ہے؟", "جی ہاں۔ حتمی داخلے سے پہلے رہنمائی یا ٹرائل کلاس سے آغاز کیا جا سکتا ہے۔"],
      ["کیا کلاسز لائیو ہوتی ہیں؟", "جی ہاں۔ بنیادی کورسز استاد کی براہ راست رہنمائی اور اصلاح کے ساتھ لائیو ہوتے ہیں۔"],
      ["کون سے کورسز دستیاب ہیں؟", "قاعدہ، ناظرہ، حفظ، تجوید، تفسیر، حدیث، فقہ، اور درسِ نظامی کے راستے دستیاب ہیں۔"],
      ["کیا بچے اور بڑے دونوں شامل ہو سکتے ہیں؟", "جی ہاں۔ کورسز بچوں، بڑوں، بہنوں، اور سنجیدہ طلبہ کے لیے ترتیب دیے جاتے ہیں۔"],
      ["کیا سرٹیفکیٹ ملے گا؟", "اہل طلبہ مطلوبہ کورس مکمل کرنے کے بعد تکمیل کا سرٹیفکیٹ حاصل کر سکتے ہیں۔"],
    ],
  },
  ar: {
    eyebrow: "الأسئلة الشائعة",
    title: "إجابات واضحة قبل بدء دروس القرآن عبر الإنترنت",
    description:
      "هذه أهم الأسئلة التي تسألها العائلات قبل التسجيل والحصة التجريبية والجدولة الشهرية.",
    supportTitle: "ما زلت غير متأكد من الدورة المناسبة؟",
    supportText:
      "ابدأ بمحادثة قصيرة وسنساعدك في اختيار الدورة والمعلم والجدول المناسب.",
    items: [
      ["هل يمكن البدء بحصة تجريبية؟", "نعم. يمكن للعائلات البدء بمحادثة موجهة أو حصة تجريبية قبل التسجيل النهائي."],
      ["هل الدروس مباشرة؟", "نعم. الدورات الأساسية تقدم مباشرة مع تفاعل المعلم وتصحيح التلاوة."],
      ["ما الدورات المتاحة؟", "تتوفر مسارات القاعدة والقراءة والحفظ والتجويد والتفسير والحديث والفقه ودرس نظامي."],
      ["هل يمكن للأطفال والبالغين الالتحاق؟", "نعم. تنظم الدورات للأطفال والبالغين والأخوات والطلاب المتقدمين."],
      ["هل توجد شهادات؟", "يمكن للطلاب المؤهلين الحصول على شهادات إتمام بعد إنهاء متطلبات الدورة."],
    ],
  },
} as const;

export async function FAQ() {
  const locale = getLocaleFromCookies(await cookies());
  const content = copy[locale];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.items.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  return (
    <Section variant="white" className={styles.section}>
      <Container>
        <div className={styles.layout}>
          <div className={styles.intro}>
            <SectionTitle
              eyebrow={content.eyebrow}
              title={content.title}
              description={content.description}
              align="left"
            />

            <div className={styles.supportCard}>
              <strong>{content.supportTitle}</strong>
              <p>{content.supportText}</p>
            </div>
          </div>

          <div className={styles.list}>
            {content.items.map(([question, answer]) => (
              <details key={question} className={styles.item}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </Container>
    </Section>
  );
}
