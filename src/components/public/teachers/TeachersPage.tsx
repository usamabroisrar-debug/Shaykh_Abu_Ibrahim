import Link from "next/link";
import { Card, Container, Section } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { teachers } from "@/data/teachers";
import styles from "./TeachersPage.module.css";

export function TeachersPage() {
  return (
    <>
      <PageHero
        eyebrow="Teachers"
        title="Meet the faculty guiding students with scholarship, care, and consistency"
        description="Our teachers support learners across Quran reading, memorization, tafseer, hadith, fiqh, and Arabic-focused study paths."
      />

      <Section variant="white">
        <Container className={styles.grid}>
          {teachers.map((teacher) => (
            <Card key={teacher.id} className={styles.card}>
              <span className={styles.specialty}>{teacher.specialty}</span>
              <h2>{teacher.name}</h2>
              <p className={styles.designation}>{teacher.designation}</p>
              <p className={styles.summary}>{teacher.summary}</p>
              <div className={styles.meta}>
                <span>{teacher.experience}</span>
                <span>{teacher.students}+ students</span>
                <span>{teacher.languages.join(" / ")}</span>
              </div>
              <Link href={`/teachers/${teacher.slug}`} className={styles.link}>
                View teacher profile
              </Link>
            </Card>
          ))}
        </Container>
      </Section>
    </>
  );
}
