import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Badge,
  Button,
  Container,
  Section,
  SectionTitle,
} from "@/components/shared";
import { EnrollmentButton } from "@/components/lms/EnrollmentButton";
import { getCourseBySlug, popularCourses } from "@/data/courses";
import { auth } from "@/lib/auth";
import { getCourseImagePath } from "@/utils/course-image";
import styles from "./CourseDetailPage.module.css";

type CourseDetailPageProps = {
  slug: string;
};

export async function CourseDetailPage({ slug }: CourseDetailPageProps) {
  const course = getCourseBySlug(slug);
  const session = await auth();

  if (!course) {
    notFound();
  }

  const relatedCourses = popularCourses
    .filter((item) => item.slug !== course.slug)
    .slice(0, 3);

  return (
    <>
      <Section className={styles.hero}>
        <Container className={styles.heroGrid}>
          <div className={styles.copy}>
            <Badge variant="gold">{course.category}</Badge>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className={styles.meta}>
              <span>{course.duration}</span>
              <span>{course.lessons} lessons</span>
              <span>{course.language.split(/[^A-Za-z]+/).filter(Boolean).join(" / ")}</span>
              <span>{course.rating} rating</span>
            </div>
            <div className={styles.actions}>
              <EnrollmentButton
                courseSlug={course.slug}
                isAuthenticated={Boolean(session?.user?.id)}
              />
              <Button href="/courses" variant="outline">
                Back To Courses
              </Button>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={`${styles.sidebarCard} ${styles.coverCard}`}>
              <Image
                src={getCourseImagePath(course.banner)}
                alt={course.title}
                width={900}
                height={620}
                className={styles.coverImage}
              />
            </div>

            <div className={styles.sidebarCard}>
              <span className={styles.sidebarLabel}>Instructor</span>
              <strong>{course.teacher.name}</strong>
              <p>{course.teacher.designation}</p>
            </div>
            <div className={styles.sidebarCard}>
              <span className={styles.sidebarLabel}>Outcomes</span>
              <ul>
                {course.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="white">
        <Container className={styles.contentGrid}>
          <div>
            <SectionTitle
              eyebrow="Curriculum"
              title="What students will cover"
              description="A step-by-step overview of the course structure and practical learning goals."
              align="left"
            />
            <div className={styles.listGrid}>
              {course.curriculum.map((item) => (
                <div key={item} className={styles.listItem}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle
              eyebrow="Requirements"
              title="Before enrollment"
              description="Helpful expectations to make sure students begin with clarity and confidence."
              align="left"
            />
            <div className={styles.requirements}>
              {course.requirements.map((item) => (
                <div key={item} className={styles.listItem}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle
            eyebrow="Related Courses"
            title="Continue your learning journey"
            description="Explore other academy programs often chosen by students pursuing similar pathways."
          />
          <div className={styles.relatedGrid}>
            {relatedCourses.map((item) => (
              <div key={item.id} className={styles.relatedCard}>
                <Image
                  src={getCourseImagePath(item.thumbnail)}
                  alt={item.title}
                  width={640}
                  height={380}
                  className={styles.relatedImage}
                />
                <h3>{item.title}</h3>
                <p>{item.shortDescription}</p>
                <Link href={`/courses/${item.slug}`}>Explore course</Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
