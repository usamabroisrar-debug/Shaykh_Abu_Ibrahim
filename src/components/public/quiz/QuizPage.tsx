import { Badge, Card, Container, Section } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { featuredQuiz, quizBenefits } from "@/data/quiz";
import styles from "./QuizPage.module.css";

export function QuizPage() {
  return (
    <>
      <PageHero
        eyebrow="Quiz"
        title="Assessment tools designed to strengthen confidence and measure progress"
        description="Explore the academy's assessment format for timed tests, module checkpoints, and motivating performance feedback."
      />

      <Section variant="white">
        <Container className={styles.grid}>
          <Card className={styles.primaryCard}>
            <Badge variant="gold">{featuredQuiz.level}</Badge>
            <h2>{featuredQuiz.title}</h2>
            <p>{featuredQuiz.description}</p>
            <div className={styles.meta}>
              <span>{featuredQuiz.questions} questions</span>
              <span>{featuredQuiz.duration}</span>
            </div>
          </Card>

          <Card className={styles.secondaryCard}>
            <h2>What students can expect</h2>
            <div className={styles.benefits}>
              {quizBenefits.map((item) => (
                <div key={item} className={styles.benefit}>
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
}
