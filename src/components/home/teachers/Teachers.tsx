import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { teachers } from "@/data/teachers";
import { TeacherCard } from "./TeacherCard";
import styles from "./Teachers.module.css";

export function Teachers() {
  return (
    <Section variant="white" className={styles.section}>
      <Container>
        <div className={styles.header}>
          <div className={styles.copy}>
            <SectionTitle
              eyebrow="Our Teachers"
              title="Meet teachers who combine scholarship, patience, and online teaching clarity"
              description="Students learn better when the teacher is not only qualified, but calm, encouraging, and consistent in delivery."
              align="left"
            />
            <div className={styles.points}>
              <span>Qualified Quran guidance</span>
              <span>Student-friendly teaching</span>
              <span>Flexible one-to-one classes</span>
            </div>
          </div>

          <Button href="/teachers" variant="outline">
            Meet The Faculty
          </Button>
        </div>

        <div className={styles.grid}>
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
