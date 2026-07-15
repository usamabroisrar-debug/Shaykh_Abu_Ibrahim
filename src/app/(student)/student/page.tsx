import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Container, Section } from "@/components/shared";
import { auth, getDashboardPath } from "@/lib/auth";
import { getStudentDashboardData } from "@/lib/dashboard";
import { markLessonCompleteAction, submitAssignmentAction } from "./actions";
import styles from "@/components/lms/LmsExperience.module.css";

type EnrollmentItem = {
  id: string;
  status?: string | null;
  progress?: number | null;
  course: {
    id: string;
    title: string;
    lessons: Array<{ id: string; title: string }>;
  };
};

type NotificationItem = {
  id: string;
  title: string;
  message: string;
};

type CertificateItem = {
  id: string;
  certificateNo: string;
  verificationId: string;
  studentName: string;
  courseName: string;
  teacherName?: string | null;
  issuedAt: Date | string;
};

type StudentDashboardData = {
  enrollments: EnrollmentItem[];
  admissions: unknown[];
  certificates: CertificateItem[];
  notifications: NotificationItem[];
  attempts: unknown[];
  assignments: Array<{
    id: string;
    title: string;
    description?: string | null;
    dueDate?: Date | string | null;
    course: { title: string };
    submissions: Array<{
      id: string;
      status: string;
      feedback?: string | null;
      grade?: number | null;
    }>;
  }>;
  payments: Array<{
    id: string;
    amount: { toNumber(): number } | number;
    currency: string;
    status: string;
    referenceId: string;
    course?: { title: string } | null;
  }>;
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
    assignments: [],
    payments: [],
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
          <div className={styles.statCard}>
            <span>Assignments</span>
            <strong>{dashboard.assignments.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Payments</span>
            <strong>{dashboard.payments.length}</strong>
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
                    {item.course.lessons[0] ? (
                      <form action={markLessonCompleteAction} className={styles.inlineForm}>
                        <input type="hidden" name="courseId" value={item.course.id} />
                        <input type="hidden" name="lessonId" value={item.course.lessons[0].id} />
                        <button type="submit">Mark first lesson complete</button>
                      </form>
                    ) : null}
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
            <h2>My certificates</h2>
            <div className={styles.list}>
              {dashboard.certificates.length ? (
                dashboard.certificates.map((item: CertificateItem) => (
                  <div key={item.id} className={styles.listItem}>
                    <strong>{item.courseName}</strong>
                    <div className={styles.listItemMeta}>
                      {item.certificateNo} • Issued{" "}
                      {new Date(item.issuedAt).toLocaleDateString("en-PK", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className={styles.listItemMeta}>
                      Teacher: {item.teacherName || "Shaykh Abu Ibrahim"}
                    </div>
                    <div className={styles.listItemMeta}>
                      <Link href={`/certificates/${item.verificationId}`}>
                        Verify or print certificate
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  Certificates yahan show hongay jab admin aap ke course completion
                  ke baad issue karega.
                </div>
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Assignments</h2>
            <div className={styles.list}>
              {dashboard.assignments.length ? (
                dashboard.assignments.map((item) => {
                  const submission = item.submissions[0];

                  return (
                    <div key={item.id} className={styles.listItem}>
                      <strong>{item.title}</strong>
                      <div className={styles.listItemMeta}>
                        {item.course.title}
                        {item.dueDate
                          ? ` | Due ${new Date(item.dueDate).toLocaleDateString("en-PK")}`
                          : ""}
                      </div>
                      {submission ? (
                        <div className={styles.listItemMeta}>
                          Status: {submission.status}
                          {submission.grade ? ` | Grade ${submission.grade}` : ""}
                          {submission.feedback ? ` | ${submission.feedback}` : ""}
                        </div>
                      ) : (
                        <form action={submitAssignmentAction} className={styles.stackForm}>
                          <input type="hidden" name="assignmentId" value={item.id} />
                          <textarea
                            name="content"
                            placeholder="Write your assignment response"
                            rows={4}
                          />
                          <input
                            name="attachmentUrl"
                            type="url"
                            placeholder="Attachment URL optional"
                          />
                          <button type="submit">Submit assignment</button>
                        </form>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className={styles.empty}>
                  Active course assignments yahan show hongi.
                </div>
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Payments</h2>
            <div className={styles.list}>
              {dashboard.payments.length ? (
                dashboard.payments.map((item) => {
                  const amount =
                    typeof item.amount === "number" ? item.amount : item.amount.toNumber();

                  return (
                    <div key={item.id} className={styles.listItem}>
                      <strong>{item.course?.title || "Academy payment"}</strong>
                      <div className={styles.listItemMeta}>
                        {item.currency} {amount.toFixed(2)} | {item.status}
                      </div>
                      <div className={styles.listItemMeta}>{item.referenceId}</div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.empty}>
                  Payment records admin ke save karne ke baad yahan appear honge.
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
