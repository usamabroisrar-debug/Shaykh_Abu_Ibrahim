import { AdmissionForm } from "@/components/lms/AdmissionForm";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { Badge, Card, Container, Section } from "@/components/shared";
import { courses } from "@/data/courses";
import { buildMetadata } from "@/lib/metadata";
import styles from "@/components/lms/LmsExperience.module.css";

export const metadata = buildMetadata({
  title: "Admission",
  description:
    "Review the academy admission flow for course matching, family details, scheduling, and the next steps for online Islamic enrollment.",
  path: "/admission",
});

export default function AdmissionRoute() {
  return (
    <>
      <PageHero
        eyebrow="Admission"
        title="A clearer admission journey for students, parents, and families"
        description="The academy now has a real admission request flow for course matching, guardian details, timezone planning, and guided follow-up."
      />

      <Section>
        <Container className={styles.heroCard}>
          <div className={styles.summary}>
            <Badge variant="gold">Enrollment guidance</Badge>
            <h2>Apply with clarity before you commit to the full learning path</h2>
            <p>
              Admissions are designed to gather the information we need for
              better course recommendations, smoother family communication, and
              stronger student placement from day one.
            </p>

            <div className={styles.featureGrid}>
              <Card className={styles.featureCard}>
                <strong>Course matching</strong>
                <p>Choose the most relevant path before direct enrollment.</p>
              </Card>
              <Card className={styles.featureCard}>
                <strong>Guardian details</strong>
                <p>Support younger learners and family-led study journeys.</p>
              </Card>
              <Card className={styles.featureCard}>
                <strong>Timezone planning</strong>
                <p>Help the academy guide suitable scheduling from the start.</p>
              </Card>
            </div>
          </div>

          <div className={styles.formCard}>
            <h2>Start your admission request</h2>
            <p>
              Submit your details and we will review the best pathway for your
              level, age group, and study goals.
            </p>
            <AdmissionForm />
          </div>
        </Container>
      </Section>

      <Section variant="white">
        <Container>
          <div className={styles.featureGrid}>
            {courses.slice(0, 3).map((course) => (
              <Card key={course.id} className={styles.featureCard}>
                <strong>{course.title}</strong>
                <p>{course.shortDescription}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
