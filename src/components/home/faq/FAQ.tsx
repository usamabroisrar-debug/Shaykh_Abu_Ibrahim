import { cookies } from "next/headers";
import { Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import { faqItems } from "@/data/faq";
import styles from "./FAQ.module.css";

const faqTranslations = {
  en: {
    eyebrow: "FAQ",
    title: "Answers families usually need before starting online Quran classes",
    description:
      "A clear enrollment experience starts with simple answers about schedules, teaching style, progress, and family support.",
    supportTitle: "Still not sure which course fits best?",
    supportText:
      "Start with a conversation and we can help guide the most suitable teacher, pace, and class rhythm.",
    items: faqItems,
  },
  ur: {
    eyebrow: "عمومی سوالات",
    title: "آن لائن قرآن کلاسز شروع کرنے سے پہلے خاندانوں کے عام سوالات کے جوابات",
    description:
      "واضح داخلہ تجربہ شیڈول، تدریسی انداز، پیش رفت، اور خاندانی معاونت کے سادہ جوابات سے شروع ہوتا ہے۔",
    supportTitle: "ابھی بھی یقین نہیں کہ کون سا کورس بہتر ہے؟",
    supportText:
      "گفتگو سے آغاز کریں، ہم مناسب استاد، رفتار، اور کلاس کے معمول کے انتخاب میں مدد کریں گے۔",
    items: [
      {
        id: "faq-1",
        question: "یہ کورسز کن لوگوں کے لیے ہیں؟",
        answer:
          "اکیڈمی بچوں، بڑوں، بہنوں، اور سنجیدہ طلبہ کے لیے قرآن، تجوید، حفظ، ترجمہ، اور اسلامی علوم کے الگ راستے فراہم کرتی ہے۔",
      },
      {
        id: "faq-2",
        question: "کلاسز لائیو ہوتی ہیں یا ریکارڈڈ؟",
        answer:
          "بنیادی پروگرامز لائیو استاد کے ساتھ پڑھائے جاتے ہیں، جبکہ معاون مواد، نوٹس، اور ریویژن ریسورسز لچکدار مطالعے کے لیے منظم کیے گئے ہیں۔",
      },
      {
        id: "faq-3",
        question: "کیا طلبہ کی پیش رفت کی نگرانی ہوتی ہے؟",
        answer:
          "جی ہاں، پروگرامز milestones، فیڈبیک، حاضری، اور assessment points کے ساتھ ترتیب دیے گئے ہیں تاکہ طلبہ اور خاندان واضح پیش رفت دیکھ سکیں۔",
      },
      {
        id: "faq-4",
        question: "کیا ایک خاندان کے ایک سے زیادہ بچے داخلہ لے سکتے ہیں؟",
        answer:
          "جی ہاں، پلیٹ فارم کو family-friendly admissions کے لیے ترتیب دیا جا رہا ہے، جس میں course matching، guardian details، اور مختلف عمر کے بچوں کی support شامل ہے۔",
      },
      {
        id: "faq-5",
        question: "کیا سرٹیفکیٹس دستیاب ہوں گے؟",
        answer:
          "جی ہاں، completion certificates تعلیمی نظام کا حصہ ہیں، اور بڑا LMS roadmap verification-ready downloadable certificates بھی شامل کرتا ہے۔",
      },
    ],
  },
  ar: {
    eyebrow: "الأسئلة الشائعة",
    title: "إجابات تحتاجها العائلات عادة قبل بدء دروس القرآن عبر الإنترنت",
    description:
      "تبدأ تجربة القبول الواضحة بإجابات بسيطة حول الجداول وأسلوب التدريس والتقدم ودعم الأسرة.",
    supportTitle: "ما زلت غير متأكد من الدورة الأنسب؟",
    supportText:
      "ابدأ بمحادثة وسنساعدك في اختيار المعلم والسرعة وإيقاع الصف الأنسب.",
    items: [
      {
        id: "faq-1",
        question: "لمن صممت هذه الدورات؟",
        answer:
          "تخدم الأكاديمية الأطفال والبالغين والأخوات والدارسين المتقدمين عبر مسارات منفصلة للقراءة والتجويد والحفظ والترجمة والدراسات الإسلامية.",
      },
      {
        id: "faq-2",
        question: "هل الدروس مباشرة أم مسجلة؟",
        answer:
          "تُدرَّس البرامج الأساسية مباشرة مع تفاعل المعلم، بينما يتم تنظيم الموارد المساندة والملاحظات ومواد الطلاب للمراجعة المرنة.",
      },
      {
        id: "faq-3",
        question: "هل يوجد تتبع لتقدم الطلاب؟",
        answer:
          "نعم. صُممت البرامج حول مراحل واضحة وتغذية راجعة وحضور منتظم ونقاط تقييم حتى ترى العائلات تقدماً ملموساً.",
      },
      {
        id: "faq-4",
        question: "هل يمكن للعائلة تسجيل أكثر من طفل؟",
        answer:
          "نعم. يتم تشكيل المنصة لتكون مناسبة للعائلات، بما في ذلك مواءمة الدورات وبيانات أولياء الأمور ودعم الفئات العمرية المختلفة.",
      },
      {
        id: "faq-5",
        question: "هل ستكون الشهادات متاحة؟",
        answer:
          "نعم. شهادات الإتمام جزء من مسار التعلم، وتشمل الخطة الأكبر شهادات قابلة للتنزيل وجاهزة للتحقق.",
      },
    ],
  },
} as const;

export async function FAQ() {
  const locale = getLocaleFromCookies(await cookies());
  const content = faqTranslations[locale];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
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
            {content.items.map((item) => (
              <details key={item.id} className={styles.item}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
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
