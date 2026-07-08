import { prisma } from "@/lib/prisma";
import { getRecentAdmissions } from "@/services/admission/admission.service";
import { getRecentContactSubmissions } from "@/services/contact/contact.service";
import { getRecentCourses, getTeacherCourses } from "@/services/course/course.service";

export async function getStudentDashboardData(userId: string) {
  const [enrollments, admissions, certificates, notifications, attempts] =
    await Promise.all([
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
      prisma.admission.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.certificate.findMany({
        where: { studentId: userId },
        orderBy: { issuedAt: "desc" },
        take: 5,
      }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.quizAttempt.findMany({
        where: { userId },
        include: { quiz: true },
        orderBy: { startedAt: "desc" },
        take: 5,
      }),
    ]);

  return {
    enrollments,
    admissions,
    certificates,
    notifications,
    attempts,
  };
}

export async function getTeacherDashboardData(userId: string) {
  const [courses, assignments, submissions, certificates] = await Promise.all([
    getTeacherCourses(userId),
    prisma.assignment.findMany({
      where: { teacherId: userId },
      include: { course: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.assignmentSubmission.findMany({
      where: { reviewedById: userId },
      include: {
        assignment: true,
        student: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    prisma.certificate.findMany({
      where: { issuedById: userId },
      orderBy: { issuedAt: "desc" },
      take: 6,
    }),
  ]);

  return {
    courses,
    assignments,
    submissions,
    certificates,
  };
}

export async function getAdminDashboardData() {
  const [
    users,
    admissions,
    courses,
    submissions,
    payments,
    certificates,
    contacts,
  ] = await Promise.all([
    prisma.user.count(),
    getRecentAdmissions(8),
    getRecentCourses(8),
    prisma.assignmentSubmission.findMany({
      include: {
        assignment: true,
        student: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
    prisma.payment.findMany({
      include: {
        user: true,
        course: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.certificate.findMany({
      orderBy: { issuedAt: "desc" },
      take: 8,
    }),
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
