import { prisma } from "@/lib/prisma";

export async function enrollStudentInCourse(input: {
  studentId: string;
  courseId: string;
  courseTitle: string;
}) {
  const enrollment = await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: input.studentId,
        courseId: input.courseId,
      },
    },
    update: {
      status: "ACTIVE",
    },
    create: {
      studentId: input.studentId,
      courseId: input.courseId,
      status: "ACTIVE",
    },
  });

  await prisma.notification.create({
    data: {
      userId: input.studentId,
      title: "Enrollment confirmed",
      message: `You are now enrolled in ${input.courseTitle}.`,
      type: "GENERAL",
    },
  });

  return enrollment;
}
