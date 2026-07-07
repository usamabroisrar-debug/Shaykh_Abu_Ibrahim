import { Container, Section, SectionTitle } from "@/components/shared";
import { faqItems } from "@/data/faq";
import styles from "./FAQ.module.css";

export function FAQ() {
  return (
    <Section variant="white" className={styles.section}>
      <Container>
        <SectionTitle
          eyebrow="FAQ"
          title="Answers for students and families considering enrollment"
          description="The academy experience is designed to feel clear before admission, during class delivery, and after program completion."
        />

        <div className={styles.list}>
          {faqItems.map((item) => (
            <details key={item.id} className={styles.item}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
