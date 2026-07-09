import { cookies } from "next/headers";
import {
  BookOpen,
  BookText,
  Medal,
  GraduationCap,
  Languages,
  ScrollText,
} from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import styles from "./LearningJourney.module.css";

const journey = [
  {
    title: "Qaida",
    description: "Learn Arabic letters, pronunciation and Noorani Qaida.",
    icon: <BookOpen size={28} />,
  },
  {
    title: "Nazra Quran",
    description: "Read the Holy Quran fluently with proper guidance.",
    icon: <BookText size={28} />,
  },
  {
    title: "Tajweed",
    description: "Master the rules of Quranic recitation.",
    icon: <Languages size={28} />,
  },
  {
    title: "Hifz & Tarjuma",
    description: "Memorize and understand the meanings of the Quran.",
    icon: <GraduationCap size={28} />,
  },
  {
    title: "Tafseer",
    description: "Study the explanation and wisdom of the Quran.",
    icon: <ScrollText size={28} />,
  },
  {
    title: "Hadith & Fiqh",
    description: "Complete your Islamic education with authentic Hadith and Fiqh.",
    icon: <Medal size={28} />,
  },
];

const learningCopy = {
  en: {
    eyebrow: "Learning Journey",
    title: "A complete pathway from first recitation to deep Islamic study",
    description:
      "Students progress through a calm, measurable sequence so the next step always feels purposeful, not confusing.",
    items: journey,
  },
  ur: {
    eyebrow: "تعلیمی سفر",
    title: "پہلی قراءت سے گہرے اسلامی مطالعے تک ایک مکمل راستہ",
    description:
      "طلبہ ایک پُرسکون اور قابلِ پیمائش ترتیب میں آگے بڑھتے ہیں تاکہ اگلا قدم ہمیشہ با مقصد محسوس ہو، الجھا ہوا نہیں۔",
    items: [
      { title: "قاعدہ", description: "عربی حروف، تلفظ، اور نورانی قاعدہ سیکھیں.", icon: <BookOpen size={28} /> },
      { title: "ناظرہ قرآن", description: "صحیح رہنمائی کے ساتھ قرآن مجید روانی سے پڑھیں.", icon: <BookText size={28} /> },
      { title: "تجوید", description: "قرآنی قراءت کے قواعد میں مہارت حاصل کریں.", icon: <Languages size={28} /> },
      { title: "حفظ و ترجمہ", description: "قرآن کو یاد کریں اور اس کے معانی سمجھیں.", icon: <GraduationCap size={28} /> },
      { title: "تفسیر", description: "قرآن کی تشریح اور حکمت کا مطالعہ کریں.", icon: <ScrollText size={28} /> },
      { title: "حدیث و فقہ", description: "مستند حدیث اور فقہ کے ساتھ اپنی اسلامی تعلیم مکمل کریں.", icon: <Medal size={28} /> },
    ],
  },
  ar: {
    eyebrow: "رحلة التعلم",
    title: "مسار كامل من التلاوة الأولى إلى الدراسة الإسلامية العميقة",
    description:
      "يتقدم الطلاب عبر تسلسل هادئ وقابل للقياس حتى تبدو الخطوة التالية دائماً مقصودة لا مربكة.",
    items: [
      { title: "القاعدة", description: "تعلّم الحروف العربية والنطق والقاعدة النورانية.", icon: <BookOpen size={28} /> },
      { title: "نظرة القرآن", description: "اقرأ القرآن الكريم بطلاقة مع التوجيه الصحيح.", icon: <BookText size={28} /> },
      { title: "التجويد", description: "أتقن قواعد تلاوة القرآن الكريم.", icon: <Languages size={28} /> },
      { title: "الحفظ والترجمة", description: "احفظ القرآن وافهم معانيه.", icon: <GraduationCap size={28} /> },
      { title: "التفسير", description: "ادرس شرح القرآن وحكمته.", icon: <ScrollText size={28} /> },
      { title: "الحديث والفقه", description: "أكمل تعليمك الإسلامي بالحديث والفقه الموثوقين.", icon: <Medal size={28} /> },
    ],
  },
} as const;

export async function LearningJourney() {
  const locale = getLocaleFromCookies(await cookies());
  const content = learningCopy[locale];

  return (
    <Section variant="dark" className={styles.section}>
      <Container>
        <SectionTitle
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <div className={styles.grid}>
          {content.items.map((item, index) => (
            <article key={item.title} className={styles.card}>
              <span className={styles.stepNumber}>0{index + 1}</span>
              <div className={styles.iconWrap}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
