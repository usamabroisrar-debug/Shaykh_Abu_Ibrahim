import { cookies } from "next/headers";
import {
  BookOpen,
  BookText,
  GraduationCap,
  Languages,
  Medal,
  ScrollText,
} from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import styles from "./LearningJourney.module.css";

const icons = [
  <BookOpen size={28} key="qaida" />,
  <BookText size={28} key="nazra" />,
  <Languages size={28} key="tajweed" />,
  <GraduationCap size={28} key="hifz" />,
  <ScrollText size={28} key="tafseer" />,
  <Medal size={28} key="dars" />,
];

const copy = {
  en: {
    eyebrow: "Learning Journey",
    title: "A simple path from first letters to deeper Islamic study",
    description:
      "Students move step by step, so each next course feels clear and achievable.",
    items: [
      ["Qaida", "Build Arabic letter recognition and pronunciation."],
      ["Nazra Quran", "Read the Quran fluently with guided correction."],
      ["Tajweed", "Improve recitation with rules and practice."],
      ["Hifz", "Memorize with sabaq, revision, and accountability."],
      ["Tafseer", "Understand meanings, context, and guidance."],
      ["Dars-e-Nizami", "Study advanced Islamic sciences in a structured way."],
    ],
  },
  ur: {
    eyebrow: "تعلیمی سفر",
    title: "حروف سے گہرے اسلامی مطالعے تک آسان راستہ",
    description:
      "طلبہ مرحلہ وار آگے بڑھتے ہیں تاکہ ہر اگلا کورس واضح اور قابلِ عمل محسوس ہو۔",
    items: [
      ["قاعدہ", "عربی حروف اور درست تلفظ کی بنیاد بنائیں۔"],
      ["ناظرہ قرآن", "رہنمائی اور اصلاح کے ساتھ قرآن روانی سے پڑھیں۔"],
      ["تجوید", "قواعد اور مشق کے ذریعے تلاوت بہتر بنائیں۔"],
      ["حفظ", "سبق، دہرائی، اور نگرانی کے ساتھ حفظ کریں۔"],
      ["تفسیر", "معانی، پس منظر، اور قرآنی رہنمائی سمجھیں۔"],
      ["درسِ نظامی", "اسلامی علوم کو منظم انداز میں پڑھیں۔"],
    ],
  },
  ar: {
    eyebrow: "رحلة التعلم",
    title: "مسار واضح من الحروف الأولى إلى الدراسة الإسلامية المتقدمة",
    description:
      "يتقدم الطلاب خطوة بخطوة حتى تكون كل مرحلة تالية واضحة وممكنة.",
    items: [
      ["القاعدة", "بناء معرفة الحروف العربية والنطق الصحيح."],
      ["قراءة القرآن", "قراءة القرآن بطلاقة مع التصحيح الموجه."],
      ["التجويد", "تحسين التلاوة بالقواعد والممارسة."],
      ["الحفظ", "الحفظ مع الدرس والمراجعة والمتابعة."],
      ["التفسير", "فهم المعاني والسياق والهداية."],
      ["درس نظامي", "دراسة العلوم الإسلامية المتقدمة بطريقة منظمة."],
    ],
  },
} as const;

export async function LearningJourney() {
  const locale = getLocaleFromCookies(await cookies());
  const content = copy[locale];

  return (
    <Section variant="dark" className={styles.section}>
      <Container>
        <SectionTitle
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <div className={styles.grid}>
          {content.items.map(([title, description], index) => (
            <article key={title} className={styles.card}>
              <span className={styles.stepNumber}>0{index + 1}</span>
              <div className={styles.iconWrap}>{icons[index]}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
