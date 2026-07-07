import { prisma } from "@/lib/prisma";

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
    prisma.course.findMany({
      where: { teacherId: userId },
      include: {
        lessons: true,
        enrollments: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
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
    prisma.admission.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.course.findMany({
      include: {
        enrollments: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
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
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
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
