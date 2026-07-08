import { Container, Section, SectionTitle } from "@/components/shared";
import { faqItems } from "@/data/faq";
import styles from "./FAQ.module.css";

export function FAQ() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
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
              eyebrow="FAQ"
              title="Answers families usually need before starting online Quran classes"
              description="A clear enrollment experience starts with simple answers about schedules, teaching style, progress, and family support."
              align="left"
            />

            <div className={styles.supportCard}>
              <strong>Still not sure which course fits best?</strong>
              <p>
                Start with a conversation and we can help guide the most suitable
                teacher, pace, and class rhythm.
              </p>
            </div>
          </div>

          <div className={styles.list}>
            {faqItems.map((item) => (
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
