import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Container, Section } from "@/components/shared";
import { auth, getDashboardPath } from "@/lib/auth";
import { getStudentDashboardData } from "@/lib/dashboard";
import styles from "@/components/lms/LmsExperience.module.css";

type EnrollmentItem = {
  id: string;
  status?: string | null;
  progress?: number | null;
  course: {
    title: string;
    lessons: unknown[];
  };
};

type NotificationItem = {
  id: string;
  title: string;
  message: string;
};

type StudentDashboardData = {
  enrollments: EnrollmentItem[];
  admissions: unknown[];
  certificates: unknown[];
  notifications: NotificationItem[];
  attempts: unknown[];
};

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?next=/student");
  }

  if (!["STUDENT", "PARENT"].includes(session.user.role)) {
    redirect(getDashboardPath(session.user.role));
  }

  let dashboard: StudentDashboardData = {
    enrollments: [],
    admissions: [],
    certificates: [],
    notifications: [],
    attempts: [],
  };

  try {
    dashboard = await getStudentDashboardData(session.user.id);
  } catch {
    // Keep zero-state UI available even before Prisma data is seeded.
  }

  return (
    <Section>
      <Container className={styles.dashboard}>
        <div className={styles.dashboardTop}>
          <div>
            <h1>Student Dashboard</h1>
            <p>
              Assalamualaikum {session.user.name || "Student"}, yahan se aap
              admissions, enrollments, certificates, aur recent activity track
              kar sakte hain.
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className={styles.dashboardStats}>
          <div className={styles.statCard}>
            <span>Active enrollments</span>
            <strong>{dashboard.enrollments.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Admission requests</span>
            <strong>{dashboard.admissions.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Certificates</span>
            <strong>{dashboard.certificates.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Quiz attempts</span>
            <strong>{dashboard.attempts.length}</strong>
          </div>
        </div>

        <div className={styles.dashboardPanels}>
          <div className={styles.panel}>
            <h2>My learning journey</h2>
            <div className={styles.list}>
              {dashboard.enrollments.length ? (
                dashboard.enrollments.map((item: EnrollmentItem) => (
                  <div key={item.id} className={styles.listItem}>
                    <strong>{item.course.title}</strong>
                    <div className={styles.listItemMeta}>
                      {item.status || "Active"} • {item.progress ?? 0}% complete
                      • {item.course.lessons.length} lessons
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  No enrollments yet. <Link href="/courses">Browse courses</Link>
                  .
                </div>
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Recent updates</h2>
            <div className={styles.list}>
              {dashboard.notifications.length ? (
                dashboard.notifications.map((item: NotificationItem) => (
                  <div key={item.id} className={styles.listItem}>
                    <strong>{item.title}</strong>
                    <div className={styles.listItemMeta}>{item.message}</div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  Notifications yahan appear hongi jab admission, enrollment, ya
                  certificate activity hogi.
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}