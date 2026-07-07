import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { teachers } from "@/data/teachers";
import { TeacherCard } from "./TeacherCard";
import styles from "./Teachers.module.css";

export function Teachers() {
  return (
    <Section variant="white" className={styles.section}>
      <Container>
        <div className={styles.header}>
          <SectionTitle
            eyebrow="Our Teachers"
            title="Faculty shaped by scholarship, mentorship, and care"
            description="Meet the instructors guiding students through Quran recitation, memorization, understanding, and lived practice."
            align="left"
          />

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
