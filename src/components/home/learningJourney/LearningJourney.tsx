import {
  BookOpen,
  BookText,
  Medal,
  GraduationCap,
  Languages,
  ScrollText,
} from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/shared";
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

export function LearningJourney() {
  return (
    <Section variant="dark" className={styles.section}>
      <Container>
        <SectionTitle
          eyebrow="Learning Journey"
          title="A complete pathway from first recitation to deep Islamic study"
          description="Students progress through a calm, measurable sequence so the next step always feels purposeful, not confusing."
        />

        <div className={styles.grid}>
          {journey.map((item, index) => (
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
