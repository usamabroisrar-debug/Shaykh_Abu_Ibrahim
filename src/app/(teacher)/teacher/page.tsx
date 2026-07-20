import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Award,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  MessageSquare,
  Users,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { auth, getDashboardPath } from "@/lib/auth";
import { getTeacherDashboardData } from "@/lib/dashboard";
import {
  createTeacherAssignmentAction,
  createTeacherLessonAction,
  createTeacherLiveClassAction,
  reviewSubmissionAction,
  saveAttendanceAction,
} from "./actions";
import styles from "./TeacherDashboard.module.css";

type CourseItem = {
  id: string;
  title: string;
  lessons: Array<{ id: string; title: string }>;
  enrollments: unknown[];
};

type AssignmentItem = {
  id: string;
  title: string;
  dueDate?: Date | string | null;
  course: { title: string };
};

type SubmissionItem = {
  id: string;
  status?: string | null;
  updatedAt?: Date | string | null;
  assignment?: { title?: string | null } | null;
  student?: { name?: string | null } | null;
};

type CertificateItem = {
  id: string;
  studentName?: string | null;
  courseName?: string | null;
  certificateNo?: string | null;
  verificationId?: string | null;
  issuedAt?: Date | string | null;
};

type TeacherDashboardData = {
  courses: CourseItem[];
  assignments: AssignmentItem[];
  submissions: SubmissionItem[];
  certificates: CertificateItem[];
  liveSessions: Array<{
    id: string;
    title: string;
    startsAt?: Date | string | null;
    durationMinutes?: number | null;
    status?: string | null;
    course?: { title?: string | null } | null;
    lesson?: { title?: string | null } | null;
  }>;
  attendance: Array<{
    id: string;
    status: string;
    createdAt?: Date | string | null;
    student?: { name?: string | null; email?: string | null } | null;
    course?: { title?: string | null } | null;
    lesson?: { title?: string | null } | null;
  }>;
};

const emptyDashboard: TeacherDashboardData = {
  courses: [],
  assignments: [],
  submissions: [],
  certificates: [],
  liveSessions: [],
  attendance: [],
};

const sidebarItems = [
  { href: "#overview", label: "Dashboard", icon: LayoutDashboard },
  { href: "#courses", label: "Courses", icon: BookOpen },
  { href: "#live-classes", label: "Live Classes", icon: CalendarCheck },
  { href: "#assignments", label: "Assignments", icon: FileText },
  { href: "#submissions", label: "Submissions", icon: ClipboardList },
  { href: "#attendance", label: "Attendance", icon: CalendarCheck },
  { href: "#certificates", label: "Certificates", icon: Award },
];

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "Not set";

  return new Date(value).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Sidebar({ userName, userEmail }: { userName: string; userEmail: string }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Image src="/images/logo2.webp" alt="Shaykh Abu Ibrahim" width={74} height={74} priority />
        <div>
          <strong>Shaykh Abu Ibrahim</strong>
          <span>Teacher Portal</span>
        </div>
      </div>

      <nav className={styles.sideNav} aria-label="Teacher dashboard sections">
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
      <summary>Teacher menu</summary>
      <nav aria-label="Teacher mobile dashboard sections">
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

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className={styles.emptyState}>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export default async function TeacherDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?next=/teacher");
  }

  if (session.user.role !== "TEACHER") {
    redirect(getDashboardPath(session.user.role));
  }

  let dashboard = emptyDashboard;

  try {
    dashboard = await getTeacherDashboardData(session.user.id);
  } catch {
    dashboard = emptyDashboard;
  }

  const userName = session.user.name || "Teacher";
  const userEmail = session.user.email || "teacher";
  const enrollmentCount = dashboard.courses.reduce(
    (total, course) => total + course.enrollments.length,
    0
  );
  const pendingSubmissions = dashboard.submissions.filter(
    (submission) => submission.status !== "REVIEWED"
  );

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
            <span>Teacher Dashboard</span>
          </div>
          <Link href="/contact" className={styles.feedbackLink}>
            <MessageSquare size={18} aria-hidden="true" />
            Feedback
          </Link>
        </header>

        <section id="overview" className={styles.heroPanel}>
          <div>
            <span className={styles.eyebrow}>Faculty workspace</span>
            <h1>Assalamualaikum, {userName}</h1>
            <p>
              Manage assigned courses, review submissions, track attendance, and
              keep certificate-ready learning records organized.
            </p>
          </div>
          <div className={styles.heroCard}>
            <span>Assigned learners</span>
            <strong>{enrollmentCount}</strong>
          </div>
        </section>

        <section className={styles.statsGrid} aria-label="Teacher overview">
          <article className={styles.statCard}>
            <BookOpen aria-hidden="true" />
            <span>Courses</span>
            <strong>{dashboard.courses.length}</strong>
          </article>
          <article className={styles.statCard}>
            <Users aria-hidden="true" />
            <span>Learners</span>
            <strong>{enrollmentCount}</strong>
          </article>
          <article className={styles.statCard}>
            <FileText aria-hidden="true" />
            <span>Assignments</span>
            <strong>{dashboard.assignments.length}</strong>
          </article>
          <article className={styles.statCard}>
            <ClipboardList aria-hidden="true" />
            <span>Pending reviews</span>
            <strong>{pendingSubmissions.length}</strong>
          </article>
          <article className={styles.statCard}>
            <CalendarCheck aria-hidden="true" />
            <span>Live classes</span>
            <strong>{dashboard.liveSessions.length}</strong>
          </article>
          <article className={styles.statCard}>
            <Award aria-hidden="true" />
            <span>Certificates</span>
            <strong>{dashboard.certificates.length}</strong>
          </article>
        </section>

        <section id="courses" className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelKicker}>Courses</span>
              <h2>Assigned courses</h2>
            </div>
            <span className={styles.counter}>{dashboard.courses.length}</span>
          </div>
          {dashboard.courses.length ? (
            <div className={styles.courseGrid}>
              {dashboard.courses.map((course) => (
                <article key={course.id} className={styles.courseCard}>
                  <strong>{course.title}</strong>
                  <span>{course.lessons.length} lessons</span>
                  <span>{course.enrollments.length} enrollments</span>
                  <details className={styles.courseTools}>
                    <summary>Add lesson</summary>
                    <form action={createTeacherLessonAction} className={styles.stackForm}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input name="title" placeholder="Lesson title" required />
                      <input name="duration" type="number" min="1" placeholder="Minutes" />
                      <textarea name="content" rows={3} placeholder="Lesson notes optional" />
                      <button type="submit">Create lesson</button>
                    </form>
                  </details>
                  <details className={styles.courseTools}>
                    <summary>Schedule live class</summary>
                    <form action={createTeacherLiveClassAction} className={styles.stackForm}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input name="title" placeholder="Live class title" required />
                      <input name="startsAt" type="datetime-local" required />
                      <input name="durationMinutes" type="number" min="15" defaultValue="60" />
                      <textarea name="joinNote" rows={3} placeholder="Class note optional" />
                      <button type="submit">Schedule live class</button>
                    </form>
                  </details>
                  <details className={styles.courseTools}>
                    <summary>Add assignment</summary>
                    <form action={createTeacherAssignmentAction} className={styles.stackForm}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input name="title" placeholder="Assignment title" required />
                      <input name="dueDate" type="date" />
                      <textarea name="description" rows={3} placeholder="Assignment details" />
                      <button type="submit">Create assignment</button>
                    </form>
                  </details>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No courses assigned yet"
              description="Admin can assign courses to your teacher account from the admin panel."
            />
          )}
        </section>

        <div className={styles.contentGrid}>
          <section id="live-classes" className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelKicker}>Live classroom</span>
                <h2>Upcoming sessions</h2>
              </div>
              <span className={styles.counter}>{dashboard.liveSessions.length}</span>
            </div>
            {dashboard.liveSessions.length ? (
              <div className={styles.compactList}>
                {dashboard.liveSessions.map((item) => (
                  <article key={item.id} className={styles.compactItem}>
                    <strong>{item.title}</strong>
                    <span>{item.course?.title || "Course"}</span>
                    <span>{formatDate(item.startsAt)}</span>
                    <span className={styles.status}>{item.status || "SCHEDULED"}</span>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No live classes scheduled"
                description="Schedule LiveKit classes from an assigned course card."
              />
            )}
          </section>

          <section id="assignments" className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelKicker}>Assignments</span>
                <h2>Upcoming work</h2>
              </div>
              <span className={styles.counter}>{dashboard.assignments.length}</span>
            </div>
            {dashboard.assignments.length ? (
              <div className={styles.compactList}>
                {dashboard.assignments.map((item) => (
                  <article key={item.id} className={styles.compactItem}>
                    <strong>{item.title}</strong>
                    <span>{item.course.title}</span>
                    <span>Due {formatDate(item.dueDate)}</span>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No assignments yet"
                description="Assignments created for your courses will appear here."
              />
            )}
          </section>

          <section id="certificates" className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelKicker}>Certificates</span>
                <h2>Issued records</h2>
              </div>
              <span className={styles.counter}>{dashboard.certificates.length}</span>
            </div>
            {dashboard.certificates.length ? (
              <div className={styles.compactList}>
                {dashboard.certificates.map((item) => (
                  <article key={item.id} className={styles.compactItem}>
                    <strong>{item.studentName || "Student"}</strong>
                    <span>{item.courseName || "Course"}</span>
                    <span>{item.certificateNo || "Certificate"}</span>
                    {item.verificationId ? (
                      <Link href={`/certificates/${item.verificationId}`}>
                        Open certificate
                      </Link>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No certificates issued"
                description="Certificates issued through admin or teacher workflows will appear here."
              />
            )}
          </section>
        </div>

        <section id="submissions" className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelKicker}>Submissions</span>
              <h2>Student work review</h2>
            </div>
            <span className={styles.counter}>{dashboard.submissions.length}</span>
          </div>
          {dashboard.submissions.length ? (
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>Assignment</span>
                <span>Student</span>
                <span>Status</span>
                <span>Review</span>
              </div>
              {dashboard.submissions.map((item) => (
                <article key={item.id} className={styles.tableRow}>
                  <strong>{item.assignment?.title || "Assignment"}</strong>
                  <span>{item.student?.name || "Student"}</span>
                  <span className={styles.status}>{item.status || "SUBMITTED"}</span>
                  {item.status !== "REVIEWED" ? (
                    <form action={reviewSubmissionAction} className={styles.stackForm}>
                      <input type="hidden" name="submissionId" value={item.id} />
                      <textarea name="feedback" rows={3} placeholder="Feedback for student" />
                      <input name="grade" type="number" min="0" max="100" placeholder="Grade" />
                      <button type="submit">Review</button>
                    </form>
                  ) : (
                    <span className={styles.reviewed}>
                      <CheckCircle2 size={18} aria-hidden="true" />
                      Reviewed
                    </span>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No submissions yet"
              description="Student submissions from your assigned courses will appear here."
            />
          )}
        </section>

        <section id="attendance" className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelKicker}>Attendance</span>
              <h2>Mark class attendance</h2>
            </div>
            <span className={styles.counter}>{dashboard.attendance.length}</span>
          </div>
          <form action={saveAttendanceAction} className={styles.attendanceForm}>
            <input name="studentEmail" type="email" placeholder="student@example.com" required />
            <select name="courseId" defaultValue="" required>
              <option value="" disabled>
                Select course
              </option>
              {dashboard.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <select name="lessonId" defaultValue="">
              <option value="">No lesson selected</option>
              {dashboard.courses.flatMap((course) =>
                course.lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {course.title} | {lesson.title}
                  </option>
                ))
              )}
            </select>
            <select name="status" defaultValue="PRESENT">
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="EXCUSED">Excused</option>
            </select>
            <textarea name="note" rows={3} placeholder="Optional note" />
            <button type="submit">Save attendance</button>
          </form>

          {dashboard.attendance.length ? (
            <div className={styles.compactList}>
              {dashboard.attendance.map((item) => (
                <article key={item.id} className={styles.compactItem}>
                  <strong>{item.student?.name || item.student?.email || "Student"}</strong>
                  <span>{item.course?.title || "Course"}</span>
                  <span>{item.lesson?.title || "General class"}</span>
                  <span className={styles.status}>{item.status}</span>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No attendance records"
              description="Saved attendance records for your courses will appear here."
            />
          )}
        </section>
      </div>
    </main>
  );
}
