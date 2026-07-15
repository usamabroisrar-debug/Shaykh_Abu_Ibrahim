import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/server";
import { getRecentAdmissions } from "@/services/admission/admission.service";
import { getRecentContactSubmissions } from "@/services/contact/contact.service";
import { getRecentCourses, getTeacherCourses } from "@/services/course/course.service";

const emptyAdminDashboardData = {
  users: 0,
  admissions: [],
  courses: [],
  submissions: [],
  payments: [],
  certificates: [],
  contacts: [],
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
  ] = await Promise.all([
    safeQuery(
      () =>
        prisma.enrollment.findMany({
          where: { studentId: userId },
          include: {
            course: {
              include: {
                lessons: true,
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
  ]);

  return {
    enrollments,
    admissions,
    certificates,
    notifications,
    attempts,
    assignments,
    payments,
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
    };
  }

  const [courses, assignments, submissions, certificates, attendance] = await Promise.all([
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
  ]);

  return {
    courses,
    assignments,
    submissions,
    certificates,
    attendance,
  };
}

export async function getAdminDashboardData() {
  if (!isDatabaseConfigured()) {
    return emptyAdminDashboardData;
  }

  const [users, admissions, courses, submissions, payments, certificates, contacts] =
    await Promise.all([
      safeQuery(() => prisma.user.count(), 0),
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
    ]);

  return {
    users,
    admissions,
    courses,
    submissions,
    payments,
    certificates,
    contacts,
  };
}
