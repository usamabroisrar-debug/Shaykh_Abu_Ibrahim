import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Container, Section } from "@/components/shared";
import { auth, getDashboardPath } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/dashboard";
import styles from "@/components/lms/LmsExperience.module.css";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?next=/admin");
  }

  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
    redirect(getDashboardPath(session.user.role));
  }

  let dashboard: Awaited<ReturnType<typeof getAdminDashboardData>> = {
    users: 0,
    admissions: [],
    courses: [],
    submissions: [],
    payments: [],
    certificates: [],
    contacts: [],
  };

  try {
    dashboard = await getAdminDashboardData();
  } catch {
    // Keep zero-state UI available even before Prisma data is seeded.
  }

  return (
    <Section>
      <Container className={styles.dashboard}>
        <div className={styles.dashboardTop}>
          <div>
            <h1>Admin Panel</h1>
            <p>
              Operational view for admissions, courses, contact submissions,
              payments, and academic workflows.
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className={styles.dashboardStats}>
          <div className={styles.statCard}>
            <span>Total users</span>
            <strong>{dashboard.users}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Admissions</span>
            <strong>{dashboard.admissions.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Payments</span>
            <strong>{dashboard.payments.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Contacts</span>
            <strong>{dashboard.contacts.length}</strong>
          </div>
        </div>

        <div className={styles.dashboardPanels}>
          <div className={styles.panel}>
            <h2>Recent admissions</h2>
            <div className={styles.list}>
              {dashboard.admissions.length ? (
                dashboard.admissions.map((item) => (
                  <div key={item.id} className={styles.listItem}>
                    <strong>{item.name}</strong>
                    <div className={styles.listItemMeta}>
                      {item.course || "Course pending"} • {item.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  Admission requests yahan show hongi jab families form submit
                  karengi.
                </div>
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Recent contact messages</h2>
            <div className={styles.list}>
              {dashboard.contacts.length ? (
                dashboard.contacts.map((item) => (
                  <div key={item.id} className={styles.listItem}>
                    <strong>{item.name}</strong>
                    <div className={styles.listItemMeta}>
                      {item.email} • {item.subject || "General inquiry"}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  Structured contact inquiries ab yahan capture hongi.
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
