import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Container, Section } from "@/components/shared";
import { auth, getDashboardPath } from "@/lib/auth";
import { getTeacherDashboardData } from "@/lib/dashboard";
import { reviewSubmissionAction, saveAttendanceAction } from "./actions";
import styles from "@/components/lms/LmsExperience.module.css";

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
  course: {
    title: string;
  };
};

type SubmissionItem = {
  id: string;
  status?: string | null;
  updatedAt?: Date | string | null;
  assignment?: {
    title?: string | null;
  } | null;
  student?: {
    name?: string | null;
  } | null;
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
  attendance: Array<{
    id: string;
    status: string;
    createdAt?: Date | string | null;
    student?: { name?: string | null; email?: string | null } | null;
    course?: { title?: string | null } | null;
    lesson?: { title?: string | null } | null;
  }>;
};

export default async function TeacherDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?next=/teacher");
  }

  if (session.user.role !== "TEACHER") {
    redirect(getDashboardPath(session.user.role));
  }

  let dashboard: TeacherDashboardData = {
    courses: [],
    assignments: [],
    submissions: [],
    certificates: [],
    attendance: [],
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
              Faculty area for course oversight, submissions, and recent teaching
              activity.
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
            <p className={styles.panelIntro}>
              Assigned courses, lesson load, and current learner activity at a
              glance.
            </p>
            <div className={styles.list}>
              {dashboard.courses.length ? (
                dashboard.courses.map((course: CourseItem) => (
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
                  No teacher-linked courses yet. Assign teacher IDs in Prisma data
                  to activate this area fully.
                </div>
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Assignment activity</h2>
            <p className={styles.panelIntro}>
              Live assignment desk for active courses and upcoming deadlines.
            </p>
            <div className={styles.list}>
              {dashboard.assignments.length ? (
                dashboard.assignments.map((item: AssignmentItem) => (
                  <div key={item.id} className={styles.listItem}>
                    <strong>{item.title}</strong>
                    <div className={styles.listItemMeta}>
                      {item.course.title}
                      {item.dueDate
                        ? ` • Due ${
                            item.dueDate instanceof Date
                              ? item.dueDate.toDateString()
                              : new Date(item.dueDate).toDateString()
                          }`
                        : ""}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  Abhi koi assignments create nahi hue. Jaise hi teacher-linked
                  course assignments add honge, unki activity yahan nazar aayegi.
                </div>
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Reviewed submissions</h2>
            <p className={styles.panelIntro}>
              Recent student work that has already been reviewed by this teacher.
            </p>
            <div className={styles.list}>
              {dashboard.submissions.length ? (
                dashboard.submissions.map((item: SubmissionItem) => (
                  <div key={item.id} className={styles.listItem}>
                    <strong>{item.assignment?.title || "Assignment"}</strong>
                    {item.status !== "REVIEWED" ? (
                      <form action={reviewSubmissionAction} className={styles.stackForm}>
                        <input type="hidden" name="submissionId" value={item.id} />
                        <textarea name="feedback" rows={3} placeholder="Feedback for student" />
                        <input name="grade" type="number" min="0" max="100" placeholder="Grade" />
                        <button type="submit">Review submission</button>
                      </form>
                    ) : null}
                    <div className={styles.listItemMeta}>
                      {item.student?.name || "Student"} • {item.status || "REVIEWED"}
                    </div>
                    <div className={styles.listItemMeta}>
                      {item.updatedAt
                        ? `Updated ${
                            item.updatedAt instanceof Date
                              ? item.updatedAt.toDateString()
                              : new Date(item.updatedAt).toDateString()
                          }`
                        : "Recently reviewed"}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  Reviewed submissions abhi available nahi hain. Jaise hi teacher
                  assignment reviews save karega, unki history yahan nazar aayegi.
                </div>
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Issued certificates</h2>
            <p className={styles.panelIntro}>
              Certificates already issued from this teacher account.
            </p>
            <div className={styles.list}>
              {dashboard.certificates.length ? (
                dashboard.certificates.map((item: CertificateItem) => (
                  <div key={item.id} className={styles.listItem}>
                    <strong>{item.studentName || "Student"}</strong>
                    <div className={styles.listItemMeta}>
                      {item.courseName || "Course"}
                    </div>
                    <div className={styles.listItemMeta}>
                      {item.certificateNo || "Certificate"} •{" "}
                      {item.issuedAt
                        ? item.issuedAt instanceof Date
                          ? item.issuedAt.toDateString()
                          : new Date(item.issuedAt).toDateString()
                        : "Issued recently"}
                    </div>
                    {item.verificationId ? (
                      <div className={styles.listItemMeta}>
                        <a
                          href={`/certificates/${item.verificationId}`}
                          className={styles.inlineLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open certificate verification
                        </a>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  Issued certificates yahan show honge jab admin ya teacher-side
                  issuance workflow se records create honge.
                </div>
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Attendance</h2>
            <p className={styles.panelIntro}>
              Mark attendance for students enrolled in your assigned courses.
            </p>
            <form action={saveAttendanceAction} className={styles.stackForm}>
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
                <option value="PRESENT">PRESENT</option>
                <option value="ABSENT">ABSENT</option>
                <option value="EXCUSED">EXCUSED</option>
              </select>
              <textarea name="note" rows={3} placeholder="Optional note" />
              <button type="submit">Save attendance</button>
            </form>
            <div className={styles.list}>
              {dashboard.attendance.length ? (
                dashboard.attendance.map((item) => (
                  <div key={item.id} className={styles.listItem}>
                    <strong>{item.student?.name || item.student?.email || "Student"}</strong>
                    <div className={styles.listItemMeta}>
                      {item.course?.title || "Course"} | {item.lesson?.title || "General class"}
                    </div>
                    <div className={styles.listItemMeta}>{item.status}</div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  Attendance records yahan save hone ke baad show honge.
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
