import { ArrowRight } from "lucide-react";
import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { getFeaturedPublicCourses } from "@/services/course/course.service";
import { CourseCard } from "./CourseCard";
import styles from "./CoursesSection.module.css";

export async function CoursesSection() {
  const featuredCourses = await getFeaturedPublicCourses(6);

  return (
    <Section className={styles.section}>
      <Container>
        <div className={styles.header}>
          <SectionTitle
            eyebrow="Featured Courses"
            title="Structured Islamic learning for every stage of the journey"
            description="Explore flagship programs built for recitation, memorization, understanding, and long-term spiritual growth."
            align="left"
          />

          <div className={styles.actions}>
            <p className={styles.note}>
              Each course is designed with live teaching, progress milestones,
              and certificate-ready completion pathways.
            </p>
            <Button href="/courses" variant="secondary">
              View All Courses
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>

        <div className={styles.grid}>
          {featuredCourses.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
