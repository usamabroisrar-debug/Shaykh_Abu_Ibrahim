import Image from "next/image";
import Link from "next/link";
import { Badge, Card, Container, Section } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { getPublicCourses } from "@/services/course/course.service";
import { getCourseImagePath } from "@/utils/course-image";
import styles from "./CoursesPage.module.css";

export async function CoursesPage() {
  const courses = await getPublicCourses();

  return (
    <>
      <PageHero
        eyebrow="Courses"
        title="Structured programs for Quran recitation, memorization, understanding, and Islamic growth"
        description="Browse the academy's signature learning tracks designed for beginners, families, and committed students seeking depth with consistent guidance."
        primaryCta={{ label: "Apply For Admission", href: "/admission" }}
      />

      <Section variant="white">
        <Container>
          <div className={styles.grid}>
            {courses.map((course) => (
              <Card key={course.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image
                    src={getCourseImagePath(course.image)}
                    alt={course.title}
                    width={860}
                    height={520}
                    className={styles.image}
                  />
                </div>
                <div className={styles.topRow}>
                  <Badge variant="green">{course.category}</Badge>
                  <span className={styles.level}>{course.level}</span>
                </div>
                <h2>{course.title}</h2>
                <p className={styles.description}>{course.description}</p>
                <div className={styles.meta}>
                  <span>{course.duration}</span>
                  <span>{course.lessons} lessons</span>
                  <span>{course.students}+ students</span>
                </div>
                <Link href={`/courses/${course.slug}`} className={styles.link}>
                  View Course Details
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
