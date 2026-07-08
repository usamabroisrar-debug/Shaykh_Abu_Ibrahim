import { Container, Section, SectionTitle } from "@/components/shared";
import { testimonials } from "@/data/testimonials";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  return (
    <Section className={styles.section}>
      <Container>
        <SectionTitle
          eyebrow="Student Testimonials"
          title="Families stay when the teaching feels sincere, clear, and dependable"
          description="The strongest online academies are not only informative. They feel calm, organized, and genuinely supportive from the student side."
        />

        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <strong>Trusted by families</strong>
            <p>Parents value consistent communication and steady student progress.</p>
          </div>
          <div className={styles.summaryCard}>
            <strong>Built on clarity</strong>
            <p>Students stay engaged when lessons, feedback, and expectations feel simple.</p>
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
