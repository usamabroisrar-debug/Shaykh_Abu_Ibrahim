import { Badge, Button, Container, Section, SectionTitle } from "@/components/shared";
import { featuredQuiz, quizBenefits } from "@/data/quiz";
import styles from "./QuizSection.module.css";

export function QuizSection() {
  return (
    <Section variant="dark" className={styles.section}>
      <Container className={styles.layout}>
        <div>
          <SectionTitle
            eyebrow="Assessments"
            title="Quiz flows designed to reinforce learning, not just test memory"
            description="Timed assessments, progress checkpoints, and certificate readiness are part of the student experience from the beginning."
            align="left"
          />

          <div className={styles.benefits}>
            {quizBenefits.map((benefit) => (
              <Badge key={benefit} variant="gold" className={styles.badge}>
                {benefit}
              </Badge>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <span className={styles.label}>Featured Quiz</span>
          <h3>{featuredQuiz.title}</h3>
          <p>{featuredQuiz.description}</p>

          <div className={styles.meta}>
            <div>
              <strong>{featuredQuiz.questions}</strong>
              <span>Questions</span>
            </div>
            <div>
              <strong>{featuredQuiz.duration}</strong>
              <span>Duration</span>
            </div>
            <div>
              <strong>{featuredQuiz.level}</strong>
              <span>Level</span>
            </div>
          </div>

          <Button href="/quiz" variant="primary">
            Explore Quiz System
          </Button>
        </div>
      </Container>
    </Section>
  );
}
