import { prisma } from "@/lib/prisma";

export async function getCourseBySlugFromDb(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: true,
      enrollments: true,
    },
  });
}

export async function getTeacherCourses(teacherId: string) {
  return prisma.course.findMany({
    where: { teacherId },
    include: {
      lessons: true,
      enrollments: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getRecentCourses(limit = 8) {
  return prisma.course.findMany({
    include: {
      enrollments: true,
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}
