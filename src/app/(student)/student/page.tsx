import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  Award,
  Bell,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { auth, getDashboardPath } from "@/lib/auth";
import { getStudentDashboardData } from "@/lib/dashboard";
import { markLessonCompleteAction, submitAssignmentAction } from "./actions";
import styles from "./StudentDashboard.module.css";

type LessonItem = {
  id: string;
  title: string;
  progress?: Array<{ completed: boolean }>;
};

type EnrollmentItem = {
  id: string;
  status?: string | null;
  progress?: number | null;
  course: {
    id: string;
    title: string;
    lessons: LessonItem[];
  };
};

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  readAt?: Date | string | null;
  createdAt?: Date | string;
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

type QuizAttemptItem = {
  id: string;
  score: number;
  totalQuestions: number;
  startedAt: Date | string;
  completedAt?: Date | string | null;
  resultVisible: boolean;
  quiz: {
    title: string;
    passingScore: number;
  };
};

type AttendanceItem = {
  id: string;
  attendanceDate: Date | string;
  status: string;
  note?: string | null;
  course: { title: string };
  lesson?: { title: string } | null;
};

type AssignmentItem = {
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
};

type PaymentItem = {
  id: string;
  amount: { toNumber(): number } | number;
  currency: string;
  status: string;
  referenceId: string;
  paidAt?: Date | string | null;
  course?: { title: string } | null;
};

type StudentDashboardData = {
  enrollments: EnrollmentItem[];
  admissions: unknown[];
  certificates: CertificateItem[];
  notifications: NotificationItem[];
  attempts: QuizAttemptItem[];
  assignments: AssignmentItem[];
  payments: PaymentItem[];
  attendance: AttendanceItem[];
};

const emptyDashboard: StudentDashboardData = {
  enrollments: [],
  admissions: [],
  certificates: [],
  notifications: [],
  attempts: [],
  assignments: [],
  payments: [],
  attendance: [],
};

const sidebarItems = [
  { href: "#overview", label: "Dashboard", icon: LayoutDashboard },
  { href: "#progress", label: "Progress", icon: BookOpen },
  { href: "#attendance", label: "Attendance", icon: CalendarCheck },
  { href: "#payments", label: "Payments", icon: CreditCard },
  { href: "#assignments", label: "Assignments", icon: FileText },
  { href: "#quiz", label: "Quiz", icon: ClipboardCheck },
  { href: "#certificates", label: "Certificates", icon: Award },
  { href: "#notifications", label: "Notifications", icon: Bell },
];

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(value: { toNumber(): number } | number, currency: string) {
  const amount = typeof value === "number" ? value : value.toNumber();
  return `${currency} ${amount.toFixed(2)}`;
}

function getCompletedLessons(lessons: LessonItem[]) {
  return lessons.filter((lesson) =>
    lesson.progress?.some((progress) => progress.completed)
  ).length;
}

function getEnrollmentProgress(item: EnrollmentItem) {
  const lessonCount = item.course.lessons.length;

  if (lessonCount > 0) {
    return Math.round((getCompletedLessons(item.course.lessons) / lessonCount) * 100);
  }

  return Math.max(0, Math.min(100, item.progress ?? 0));
}

function getAverageProgress(enrollments: EnrollmentItem[]) {
  if (!enrollments.length) {
    return 0;
  }

  const total = enrollments.reduce((sum, item) => sum + getEnrollmentProgress(item), 0);
  return Math.round(total / enrollments.length);
}

function getNextLesson(lessons: LessonItem[]) {
  return (
    lessons.find((lesson) => !lesson.progress?.some((progress) => progress.completed)) ??
    lessons[0]
  );
}

function getQuizPercentage(item: QuizAttemptItem) {
  if (!item.totalQuestions) {
    return 0;
  }

  return Math.round((item.score / item.totalQuestions) * 100);
}

function Sidebar({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Image
          src="/images/logo2.webp"
          alt="Shaykh Abu Ibrahim"
          width={74}
          height={74}
          priority
        />
        <div>
          <strong>Shaykh Abu Ibrahim</strong>
          <span>Student Portal</span>
        </div>
      </div>

      <nav className={styles.sideNav} aria-label="Student dashboard sections">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          return (
            <a key={item.href} href={item.href}>
              <Icon size={20} aria-hidden="true" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.userAvatar}>{userName.slice(0, 1).toUpperCase()}</div>
        <div className={styles.userMeta}>
          <strong>{userName}</strong>
          <span>{userEmail}</span>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}

function MobileMenu() {
  return (
    <details className={styles.mobileMenu}>
      <summary>Student menu</summary>
      <nav aria-label="Student mobile dashboard sections">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          return (
            <a key={item.href} href={item.href}>
              <Icon size={18} aria-hidden="true" />
              {item.label}
            </a>
          );
        })}
      </nav>
    </details>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className={styles.emptyState}>
      <strong>{title}</strong>
      <p>{description}</p>
      {action ? <Link href={action.href}>{action.label}</Link> : null}
    </div>
  );
}

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?next=/student");
  }

  if (!["STUDENT", "PARENT"].includes(session.user.role)) {
    redirect(getDashboardPath(session.user.role));
  }

  let dashboard = emptyDashboard;

  try {
    dashboard = await getStudentDashboardData(session.user.id);
  } catch {
    dashboard = emptyDashboard;
  }

  const userName = session.user.name || "Student";
  const userEmail = session.user.email || "student";
  const activeEnrollments = dashboard.enrollments.filter(
    (item) => item.status === "ACTIVE" || item.status === "PENDING"
  );
  const pendingAssignments = dashboard.assignments.filter((item) => !item.submissions[0]);
  const averageProgress = getAverageProgress(dashboard.enrollments);
  const paidPayments = dashboard.payments.filter((item) => item.status === "PAID");
  const latestEnrollment = activeEnrollments[0] ?? dashboard.enrollments[0];

  return (
    <main className={styles.appShell}>
      <Sidebar userName={userName} userEmail={userEmail} />

      <div className={styles.workspace}>
        <MobileMenu />

        <header className={styles.topBar}>
          <div className={styles.breadcrumb}>
            <Link href="/">
              <Home size={18} aria-hidden="true" />
              Home
            </Link>
            <ChevronRight size={16} aria-hidden="true" />
            <span>Student Dashboard</span>
          </div>
          <Link href="/contact" className={styles.feedbackLink}>
            <MessageSquare size={18} aria-hidden="true" />
            Feedback
          </Link>
        </header>

        <section id="overview" className={styles.heroPanel}>
          <div>
            <span className={styles.eyebrow}>Student workspace</span>
            <h1>Assalamualaikum, {userName}</h1>
            <p>
              Track your academy journey from one clean place: enrollments,
              progress, assignments, quiz attempts, payments, certificates, and
              important updates.
            </p>
            <div className={styles.heroActions}>
              <Link href="/courses" className={styles.primaryLink}>
                Explore courses
              </Link>
              <Link href="/admission" className={styles.secondaryLink}>
                Continue admission
              </Link>
            </div>
          </div>
          <div className={styles.progressDial}>
            <span>{averageProgress}%</span>
            <small>Overall progress</small>
          </div>
        </section>

        <section className={styles.statsGrid} aria-label="Student overview">
          <article className={styles.statCard}>
            <BookOpen aria-hidden="true" />
            <span>Active courses</span>
            <strong>{activeEnrollments.length}</strong>
          </article>
          <article className={styles.statCard}>
            <CheckCircle2 aria-hidden="true" />
            <span>Progress</span>
            <strong>{averageProgress}%</strong>
          </article>
          <article className={styles.statCard}>
            <FileText aria-hidden="true" />
            <span>Pending assignments</span>
            <strong>{pendingAssignments.length}</strong>
          </article>
          <article className={styles.statCard}>
            <Award aria-hidden="true" />
            <span>Certificates</span>
            <strong>{dashboard.certificates.length}</strong>
          </article>
          <article className={styles.statCard}>
            <CreditCard aria-hidden="true" />
            <span>Paid records</span>
            <strong>{paidPayments.length}</strong>
          </article>
          <article className={styles.statCard}>
            <ClipboardCheck aria-hidden="true" />
            <span>Quiz attempts</span>
            <strong>{dashboard.attempts.length}</strong>
          </article>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelKicker}>Active course</span>
                <h2>{latestEnrollment?.course.title || "No active course yet"}</h2>
              </div>
              {latestEnrollment ? (
                <span className={styles.status}>{latestEnrollment.status || "Active"}</span>
              ) : null}
            </div>

            {latestEnrollment ? (
              <article className={styles.activeCourseCard}>
                {(() => {
                  const progress = getEnrollmentProgress(latestEnrollment);
                  const completed = getCompletedLessons(latestEnrollment.course.lessons);
                  const nextLesson = getNextLesson(latestEnrollment.course.lessons);

                  return (
                    <>
                      <div className={styles.progressTrack}>
                        <span
                          className={styles.progressFill}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className={styles.courseMeta}>
                        <span>{progress}% completed</span>
                        <span>
                          {completed}/{latestEnrollment.course.lessons.length} lessons
                        </span>
                      </div>
                      {nextLesson ? (
                        <form action={markLessonCompleteAction} className={styles.inlineForm}>
                          <input
                            type="hidden"
                            name="courseId"
                            value={latestEnrollment.course.id}
                          />
                          <input type="hidden" name="lessonId" value={nextLesson.id} />
                          <button type="submit">Mark next lesson complete</button>
                        </form>
                      ) : (
                        <p className={styles.mutedText}>
                          Lessons are not available for this course yet.
                        </p>
                      )}
                    </>
                  );
                })()}
              </article>
            ) : (
              <EmptyState
                title="No enrollment found"
                description="Once your admission or course enrollment is approved, your active course will appear here."
                action={{ href: "/courses", label: "Browse courses" }}
              />
            )}
          </section>

          <section id="attendance" className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelKicker}>Schedule and attendance</span>
                <h2>Recent class activity</h2>
              </div>
              <span className={styles.counter}>{dashboard.attendance.length}</span>
            </div>
            {dashboard.attendance.length ? (
              <div className={styles.compactList}>
                {dashboard.attendance.map((item) => (
                  <article key={item.id} className={styles.compactItem}>
                    <strong>{item.lesson?.title || item.course.title}</strong>
                    <span>{formatDate(item.attendanceDate)}</span>
                    <span className={styles.status}>{item.status}</span>
                    {item.note ? <p>{item.note}</p> : null}
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No attendance yet"
                description="Attendance and class schedule details will appear after your teacher starts recording live classes."
              />
            )}
          </section>
        </div>

        <section id="progress" className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelKicker}>Progress</span>
              <h2>Course progress</h2>
            </div>
            <span className={styles.counter}>{dashboard.enrollments.length}</span>
          </div>

          {dashboard.enrollments.length ? (
            <div className={styles.courseList}>
              {dashboard.enrollments.map((item) => {
                const progress = getEnrollmentProgress(item);
                const completed = getCompletedLessons(item.course.lessons);

                return (
                  <article key={item.id} className={styles.courseRow}>
                    <div>
                      <strong>{item.course.title}</strong>
                      <span>
                        {completed}/{item.course.lessons.length} lessons completed
                      </span>
                    </div>
                    <div className={styles.rowProgress}>
                      <div className={styles.progressTrack}>
                        <span
                          className={styles.progressFill}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <strong>{progress}%</strong>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No progress to show"
              description="Progress will start once you are enrolled and lessons are added to your course."
            />
          )}
        </section>

        <section id="assignments" className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelKicker}>Assignments</span>
              <h2>Course work</h2>
            </div>
            <span className={styles.counter}>{dashboard.assignments.length}</span>
          </div>

          {dashboard.assignments.length ? (
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>Assignment</span>
                <span>Course</span>
                <span>Due date</span>
                <span>Status</span>
                <span>Action</span>
              </div>
              {dashboard.assignments.map((item) => {
                const submission = item.submissions[0];

                return (
                  <article key={item.id} className={styles.tableRow}>
                    <div>
                      <strong>{item.title}</strong>
                      {item.description ? <p>{item.description}</p> : null}
                    </div>
                    <span>{item.course.title}</span>
                    <span>{formatDate(item.dueDate)}</span>
                    <span className={styles.status}>{submission?.status || "Pending"}</span>
                    <div>
                      {submission ? (
                        <span className={styles.mutedText}>
                          {submission.grade ? `Grade ${submission.grade}. ` : ""}
                          {submission.feedback || "Submitted"}
                        </span>
                      ) : (
                        <form action={submitAssignmentAction} className={styles.stackForm}>
                          <input type="hidden" name="assignmentId" value={item.id} />
                          <textarea
                            name="content"
                            placeholder="Write your answer"
                            rows={3}
                          />
                          <input
                            name="attachmentUrl"
                            type="url"
                            placeholder="Attachment URL optional"
                          />
                          <input
                            name="attachmentFile"
                            type="file"
                            aria-label="Upload assignment file"
                          />
                          <button type="submit">Submit</button>
                        </form>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No assignments yet"
              description="Assignments will appear when your teacher publishes course work."
            />
          )}
        </section>

        <div className={styles.contentGrid}>
          <section id="payments" className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelKicker}>Payments</span>
                <h2>Fee records</h2>
              </div>
              <span className={styles.counter}>{dashboard.payments.length}</span>
            </div>

            {dashboard.payments.length ? (
              <div className={styles.compactList}>
                {dashboard.payments.map((item) => (
                  <article key={item.id} className={styles.compactItem}>
                    <strong>{item.course?.title || "Academy payment"}</strong>
                    <span>{formatAmount(item.amount, item.currency)}</span>
                    <span>Ref: {item.referenceId}</span>
                    <span>{item.paidAt ? `Paid ${formatDate(item.paidAt)}` : "Not paid yet"}</span>
                    <span className={styles.status}>{item.status}</span>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No payment records"
                description="Manual fee records will appear here once admin adds them."
              />
            )}
          </section>

          <section id="quiz" className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelKicker}>Quiz</span>
                <h2>Quiz attempts</h2>
              </div>
              <span className={styles.counter}>{dashboard.attempts.length}</span>
            </div>

            {dashboard.attempts.length ? (
              <div className={styles.compactList}>
                {dashboard.attempts.map((item) => {
                  const percentage = getQuizPercentage(item);

                  return (
                    <article key={item.id} className={styles.compactItem}>
                      <strong>{item.quiz.title}</strong>
                      <span>
                        Score {item.score}/{item.totalQuestions} | {percentage}%
                      </span>
                      <span className={styles.status}>
                        {percentage >= item.quiz.passingScore ? "Passed" : "Review"}
                      </span>
                      <span>{formatDate(item.completedAt || item.startedAt)}</span>
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No quiz attempts"
                description="Your quiz attempts and results will appear here after you take a quiz."
                action={{ href: "/quiz", label: "Open quiz page" }}
              />
            )}
          </section>
        </div>

        <div className={styles.contentGrid}>
          <section id="certificates" className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelKicker}>Certificates</span>
                <h2>Issued certificates</h2>
              </div>
              <span className={styles.counter}>{dashboard.certificates.length}</span>
            </div>

            {dashboard.certificates.length ? (
              <div className={styles.compactList}>
                {dashboard.certificates.map((item) => (
                  <article key={item.id} className={styles.compactItem}>
                    <strong>{item.courseName}</strong>
                    <span>{item.certificateNo}</span>
                    <span>Issued {formatDate(item.issuedAt)}</span>
                    <Link href={`/certificates/${item.verificationId}`}>
                      Verify / print certificate
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No certificates yet"
                description="Certificates will appear after course completion and academy approval."
              />
            )}
          </section>

          <section id="notifications" className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelKicker}>Notifications</span>
                <h2>Academy updates</h2>
              </div>
              <span className={styles.counter}>{dashboard.notifications.length}</span>
            </div>

            {dashboard.notifications.length ? (
              <div className={styles.compactList}>
                {dashboard.notifications.map((item) => (
                  <article key={item.id} className={styles.compactItem}>
                    <strong>{item.title}</strong>
                    <p>{item.message}</p>
                    {item.createdAt ? <span>{formatDate(item.createdAt)}</span> : null}
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No notifications"
                description="Important admission, class, and certificate updates will appear here."
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
