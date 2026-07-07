import { Container, Section, SectionTitle } from "@/components/shared";
import { testimonials } from "@/data/testimonials";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  return (
    <Section className={styles.section}>
      <Container>
        <SectionTitle
          eyebrow="Student Testimonials"
          title="Families and learners stay because the experience feels trustworthy"
          description="Real progress is powered by good teaching, but also by calm systems, clear communication, and consistency that students can feel."
        />

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
