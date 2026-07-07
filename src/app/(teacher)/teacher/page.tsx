import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Container, Section } from "@/components/shared";
import { auth, getDashboardPath } from "@/lib/auth";
import { getTeacherDashboardData } from "@/lib/dashboard";
import styles from "@/components/lms/LmsExperience.module.css";

export default async function TeacherDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?next=/teacher");
  }

  if (session.user.role !== "TEACHER") {
    redirect(getDashboardPath(session.user.role));
  }

  let dashboard: Awaited<ReturnType<typeof getTeacherDashboardData>> = {
    courses: [],
    assignments: [],
    submissions: [],
    certificates: [],
  };

  try {
    dashboard = await getTeacherDashboardData(session.user.id);
  } catch {
    // Keep zero-state UI available even before Prisma data is seeded.
  }

  return (
    <Section>
      <Container className={styles.dashboard}>
        <div className={styles.dashboardTop}>
          <div>
            <h1>Teacher Dashboard</h1>
            <p>
              Faculty area for course oversight, submissions, and recent
              teaching activity.
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className={styles.dashboardStats}>
          <div className={styles.statCard}>
            <span>Managed courses</span>
            <strong>{dashboard.courses.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Assignments</span>
            <strong>{dashboard.assignments.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Reviewed submissions</span>
            <strong>{dashboard.submissions.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Issued certificates</span>
            <strong>{dashboard.certificates.length}</strong>
          </div>
        </div>

        <div className={styles.dashboardPanels}>
          <div className={styles.panel}>
            <h2>Course overview</h2>
            <div className={styles.list}>
              {dashboard.courses.length ? (
                dashboard.courses.map((course) => (
                  <div key={course.id} className={styles.listItem}>
                    <strong>{course.title}</strong>
                    <div className={styles.listItemMeta}>
                      {course.lessons.length} lessons •{" "}
                      {course.enrollments.length} enrollments
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  No teacher-linked courses yet. Assign teacher IDs in Prisma
                  data to activate this area fully.
                </div>
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Assignment activity</h2>
            <div className={styles.list}>
              {dashboard.assignments.length ? (
                dashboard.assignments.map((item) => (
                  <div key={item.id} className={styles.listItem}>
                    <strong>{item.title}</strong>
                    <div className={styles.listItemMeta}>
                      {item.course.title}
                      {item.dueDate ? ` • Due ${item.dueDate.toDateString()}` : ""}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  Assignment workflow ka schema ready hai. CRUD screens next pass
                  mein add kiye ja sakte hain.
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
