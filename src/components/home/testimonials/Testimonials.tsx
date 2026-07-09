import { cookies } from "next/headers";
import { Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import { testimonials } from "@/data/testimonials";
import styles from "./Testimonials.module.css";

export async function Testimonials() {
  const locale = getLocaleFromCookies(await cookies());
  const content = {
    en: {
      eyebrow: "Student Testimonials",
      title: "Families stay when the teaching feels sincere, clear, and dependable",
      description:
        "The strongest online academies are not only informative. They feel calm, organized, and genuinely supportive from the student side.",
      trustedTitle: "Trusted by families",
      trustedText: "Parents value consistent communication and steady student progress.",
      clarityTitle: "Built on clarity",
      clarityText: "Students stay engaged when lessons, feedback, and expectations feel simple.",
    },
    ur: {
      eyebrow: "طلبہ کے تاثرات",
      title: "خاندان تب جڑے رہتے ہیں جب تدریس مخلص، واضح، اور قابل اعتماد محسوس ہو",
      description:
        "بہترین آن لائن اکیڈمیز صرف معلوماتی نہیں ہوتیں بلکہ پُرسکون، منظم، اور طلبہ کے لیے حقیقتاً معاون بھی محسوس ہوتی ہیں۔",
      trustedTitle: "خاندانوں کا اعتماد",
      trustedText: "والدین مستقل رابطے اور طلبہ کی مسلسل پیش رفت کو اہم سمجھتے ہیں۔",
      clarityTitle: "وضاحت پر مبنی",
      clarityText: "جب اسباق، فیڈبیک، اور توقعات سادہ ہوں تو طلبہ زیادہ جڑے رہتے ہیں۔",
    },
    ar: {
      eyebrow: "آراء الطلاب",
      title: "تبقى العائلات عندما يكون التعليم صادقاً وواضحاً ويمكن الاعتماد عليه",
      description:
        "الأكاديميات الإلكترونية الأقوى ليست معلوماتية فقط، بل تبدو هادئة ومنظمة وداعمة حقاً من جهة الطالب.",
      trustedTitle: "موثوقة لدى العائلات",
      trustedText: "يقدّر أولياء الأمور التواصل المستمر وتقدم الطلاب الثابت.",
      clarityTitle: "مبنية على الوضوح",
      clarityText: "يبقى الطلاب مندمجين عندما تبدو الدروس والملاحظات والتوقعات بسيطة.",
    },
  }[locale];

  return (
    <Section className={styles.section}>
      <Container>
        <SectionTitle
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <strong>{content.trustedTitle}</strong>
            <p>{content.trustedText}</p>
          </div>
          <div className={styles.summaryCard}>
            <strong>{content.clarityTitle}</strong>
            <p>{content.clarityText}</p>
          </div>
        </div>

        <div className={styles.grid}>
          {testimonials.map((item) => (
            <article key={item.id} className={styles.card}>
              <p className={styles.quote}>&ldquo;{item.quote}&rdquo;</p>
              <strong>{item.name}</strong>
              <span className={styles.role}>{item.role}</span>
              <span className={styles.outcome}>{item.outcome}</span>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
