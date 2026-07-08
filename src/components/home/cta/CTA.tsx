import { Button, Container, Section } from "@/components/shared";
import styles from "./CTA.module.css";

export function CTA() {
  return (
    <Section className={styles.section}>
      <Container>
        <div className={styles.card}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Admissions Open</span>
            <h2>Start a more intentional Islamic learning journey today</h2>
            <p>
              Whether the goal is strong Quran foundations, memorization, or a
              deeper connection to Islamic knowledge, the next step should feel
              clear and welcoming.
            </p>

            <div className={styles.benefits}>
              <span>Free trial class</span>
              <span>Flexible schedule</span>
              <span>Personal guidance</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Button href="/admission" variant="primary" size="lg">
              Start Free Trial
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Speak With The Team
            </Button>
            <p className={styles.note}>No upfront payment. Consultation first.</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
