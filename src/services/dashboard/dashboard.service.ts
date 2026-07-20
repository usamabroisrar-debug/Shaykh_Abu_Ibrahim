import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/server";
import { getRecentAdmissions } from "@/services/admission/admission.service";
import { getRecentContactSubmissions } from "@/services/contact/contact.service";
import { getRecentCourses, getTeacherCourses } from "@/services/course/course.service";
import {
  getAdminLiveClassSessions,
  getStudentLiveClassSessions,
  getTeacherLiveClassSessions,
} from "@/services/live-class/live-class.service";

const emptyAdminDashboardData = {
  users: 0,
  userAccounts: [],
  admissions: [],
  courses: [],
  submissions: [],
  payments: [],
  certificates: [],
  contacts: [],
  liveSessions: [],
};

async function safeQuery<T>(resolver: () => Promise<T>, fallback: T) {
  try {
    return await resolver();
  } catch {
    return fallback;
  }
}

export async function getStudentDashboardData(userId: string) {
  if (!isDatabaseConfigured()) {
    return {
      enrollments: [],
      admissions: [],
      certificates: [],
      notifications: [],
      attempts: [],
      assignments: [],
      payments: [],
      attendance: [],
      liveSessions: [],
    };
  }

  const [
    enrollments,
    admissions,
    certificates,
    notifications,
    attempts,
    assignments,
    payments,
    attendance,
    liveSessions,
  ] = await Promise.all([
    safeQuery(
      () =>
        prisma.enrollment.findMany({
          where: { studentId: userId },
          include: {
            course: {
              include: {
                lessons: {
                  orderBy: { order: "asc" },
                  include: {
                    progress: {
                      where: { studentId: userId },
                    },
                  },
                },
              },
            },
          },
          orderBy: { updatedAt: "desc" },
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.admission.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.certificate.findMany({
          where: { studentId: userId },
          orderBy: { issuedAt: "desc" },
          take: 5,
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.quizAttempt.findMany({
          where: { userId },
          include: { quiz: true },
          orderBy: { startedAt: "desc" },
          take: 5,
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.assignment.findMany({
          where: {
            course: {
              enrollments: {
                some: {
                  studentId: userId,
                  status: {
                    in: ["ACTIVE", "PENDING"],
                  },
                },
              },
            },
          },
          include: {
            course: true,
            submissions: {
              where: { studentId: userId },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.payment.findMany({
          where: { userId },
          include: { course: true },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.attendance.findMany({
          where: { studentId: userId },
          include: {
            course: true,
            lesson: true,
          },
          orderBy: { attendanceDate: "desc" },
          take: 8,
        }),
      []
    ),
    safeQuery(() => getStudentLiveClassSessions(userId), []),
  ]);

  return {
    enrollments,
    admissions,
    certificates,
    notifications,
    attempts,
    assignments,
    payments,
    attendance,
    liveSessions,
  };
}

export async function getTeacherDashboardData(userId: string) {
  if (!isDatabaseConfigured()) {
    return {
      courses: [],
      assignments: [],
      submissions: [],
      certificates: [],
      attendance: [],
      liveSessions: [],
    };
  }

  const [courses, assignments, submissions, certificates, attendance, liveSessions] = await Promise.all([
    getTeacherCourses(userId),
    safeQuery(
      () =>
        prisma.assignment.findMany({
          where: { teacherId: userId },
          include: { course: true },
          orderBy: { createdAt: "desc" },
          take: 6,
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.assignmentSubmission.findMany({
          where: {
            assignment: {
              teacherId: userId,
            },
          },
          include: {
            assignment: true,
            student: true,
          },
          orderBy: { updatedAt: "desc" },
          take: 6,
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.certificate.findMany({
          where: { issuedById: userId },
          orderBy: { issuedAt: "desc" },
          take: 6,
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.attendance.findMany({
          where: {
            course: {
              teacherId: userId,
            },
          },
          include: {
            student: true,
            course: true,
            lesson: true,
          },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
      []
    ),
    safeQuery(() => getTeacherLiveClassSessions(userId), []),
  ]);

  return {
    courses,
    assignments,
    submissions,
    certificates,
    attendance,
    liveSessions,
  };
}

export async function getAdminDashboardData() {
  if (!isDatabaseConfigured()) {
    return emptyAdminDashboardData;
  }

  const [users, userAccounts, admissions, courses, submissions, payments, certificates, contacts, liveSessions] =
    await Promise.all([
      safeQuery(() => prisma.user.count(), 0),
      safeQuery(
        () =>
          prisma.user.findMany({
            where: {
              role: {
                in: ["STUDENT", "PARENT", "TEACHER"],
              },
            },
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              phone: true,
              createdAt: true,
              _count: {
                select: {
                  enrollments: true,
                  teacherCourses: true,
                  payments: true,
                  certificates: true,
                },
              },
            },
            orderBy: [{ role: "asc" }, { createdAt: "desc" }],
          }),
        []
      ),
      getRecentAdmissions(8),
      getRecentCourses(8),
      safeQuery(
        () =>
          prisma.assignmentSubmission.findMany({
            include: {
              assignment: true,
              student: true,
            },
            orderBy: { updatedAt: "desc" },
            take: 8,
          }),
        []
      ),
      safeQuery(
        () =>
          prisma.payment.findMany({
            include: {
              user: true,
              course: true,
            },
            orderBy: { createdAt: "desc" },
            take: 8,
          }),
        []
      ),
      safeQuery(
        () =>
          prisma.certificate.findMany({
            orderBy: { issuedAt: "desc" },
            take: 8,
          }),
        []
      ),
      getRecentContactSubmissions(8),
      safeQuery(() => getAdminLiveClassSessions(), []),
    ]);

  return {
    users,
    userAccounts,
    admissions,
    courses,
    submissions,
    payments,
    certificates,
    contacts,
    liveSessions,
  };
}
