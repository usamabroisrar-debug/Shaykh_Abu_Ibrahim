import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Container, Section, SectionTitle } from "@/components/shared";
import { getTeacherBySlug, teachers } from "@/data/teachers";
import styles from "./TeacherDetailPage.module.css";

type TeacherDetailPageProps = {
  slug: string;
};

export function TeacherDetailPage({ slug }: TeacherDetailPageProps) {
  const teacher = getTeacherBySlug(slug);

  if (!teacher) {
    notFound();
  }

  const relatedTeachers = teachers.filter((item) => item.slug !== teacher.slug);

  return (
    <>
      <Section className={styles.hero}>
        <Container className={styles.heroGrid}>
          <div>
            <Badge variant="gold">{teacher.specialty}</Badge>
            <h1>{teacher.name}</h1>
            <p className={styles.designation}>{teacher.designation}</p>
            <p className={styles.summary}>{teacher.summary}</p>
          </div>

          <div className={styles.panel}>
            <div>
              <strong>{teacher.experience}</strong>
              <span>Teaching experience</span>
            </div>
            <div>
              <strong>{teacher.students}+</strong>
              <span>Students served</span>
            </div>
            <div>
              <strong>{teacher.courses}</strong>
              <span>Programs led</span>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="white">
        <Container className={styles.content}>
          <div>
            <SectionTitle
              eyebrow="Teaching Focus"
              title="What this teacher brings to the academy"
              description="Each instructor contributes a different strength to the student journey."
              align="left"
            />
            <div className={styles.tagGrid}>
              {teacher.badges.map((badge) => (
                <span key={badge} className={styles.tag}>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle
              eyebrow="Languages"
              title="Teaching access"
              description="Language support helps students and families feel more comfortable and connected."
              align="left"
            />
            <div className={styles.tagGrid}>
              {teacher.languages.map((language) => (
                <span key={language} className={styles.tag}>
                  {language}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle
            eyebrow="Faculty"
            title="Meet more teachers"
            description="Explore other instructors supporting the broader academy experience."
          />
          <div className={styles.relatedGrid}>
            {relatedTeachers.map((item) => (
              <div key={item.id} className={styles.relatedCard}>
                <h3>{item.name}</h3>
                <p>{item.designation}</p>
                <Link href={`/teachers/${item.slug}`}>View profile</Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
