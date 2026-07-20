import { prisma } from "@/lib/prisma";
import { normalizeSlug } from "@/utils/slug";

type LiveClassStatus = "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";

function buildRoomName(courseId: string, title: string) {
  return `${courseId}-${normalizeSlug(title) || "live-class"}-${Date.now()}`;
}

export async function createLiveClassSession(input: {
  title: string;
  courseId: string;
  lessonId?: string | null;
  teacherId: string;
  startsAt: Date;
  durationMinutes?: number;
  status?: LiveClassStatus;
  joinNote?: string;
}) {
  const title = input.title.trim();

  if (!title || !input.courseId || !input.teacherId || Number.isNaN(input.startsAt.getTime())) {
    throw new Error("Live class title, course, teacher, and start time are required.");
  }

  return prisma.liveClassSession.create({
    data: {
      title,
      courseId: input.courseId,
      lessonId: input.lessonId || null,
      teacherId: input.teacherId,
      startsAt: input.startsAt,
      durationMinutes: Math.max(15, input.durationMinutes || 60),
      status: input.status || "SCHEDULED",
      joinNote: input.joinNote?.trim() || null,
      roomName: buildRoomName(input.courseId, title),
    },
  });
}

export async function getAdminLiveClassSessions(limit = 12) {
  return prisma.liveClassSession.findMany({
    include: {
      course: true,
      lesson: true,
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      startsAt: "asc",
    },
    take: limit,
  });
}

export async function getStudentLiveClassSessions(userId: string, limit = 8) {
  return prisma.liveClassSession.findMany({
    where: {
      status: {
        in: ["SCHEDULED", "LIVE"],
      },
      course: {
        enrollments: {
          some: {
            studentId: userId,
            status: {
              in: ["PENDING", "ACTIVE"],
            },
          },
        },
      },
    },
    include: {
      course: true,
      lesson: true,
      teacher: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      startsAt: "asc",
    },
    take: limit,
  });
}

export async function getTeacherLiveClassSessions(userId: string, limit = 12) {
  return prisma.liveClassSession.findMany({
    where: {
      teacherId: userId,
    },
    include: {
      course: true,
      lesson: true,
    },
    orderBy: {
      startsAt: "asc",
    },
    take: limit,
  });
}

export async function authorizeLiveClassJoin(input: {
  sessionId: string;
  userId: string;
  role: string;
}) {
  const session = await prisma.liveClassSession.findUnique({
    where: {
      id: input.sessionId,
    },
    include: {
      course: {
        include: {
          enrollments: {
            where: {
              studentId: input.userId,
              status: {
                in: ["PENDING", "ACTIVE"],
              },
            },
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!session || session.status === "CANCELLED" || session.status === "COMPLETED") {
    return null;
  }

  const isAdmin = ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(input.role);
  const isAssignedTeacher = input.role === "TEACHER" && session.teacherId === input.userId;
  const isEnrolledStudent =
    ["STUDENT", "PARENT"].includes(input.role) && session.course.enrollments.length > 0;

  if (!isAdmin && !isAssignedTeacher && !isEnrolledStudent) {
    return null;
  }

  return session;
}
