"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createLiveClassSession } from "@/services/live-class/live-class.service";
import { normalizeSlug } from "@/utils/slug";

function cleanValue(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

async function requireTeacherAccess() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "TEACHER") {
    redirect("/login?next=/teacher");
  }

  return session.user;
}

export async function reviewSubmissionAction(formData: FormData) {
  const user = await requireTeacherAccess();
  const submissionId = cleanValue(formData.get("submissionId"));
  const feedback = cleanValue(formData.get("feedback"));
  const grade = Number(formData.get("grade") || 0);

  if (!submissionId) {
    redirect("/teacher?error=submission-review-failed");
  }

  try {
    const submission = await prisma.assignmentSubmission.findFirst({
      where: {
        id: submissionId,
        assignment: {
          teacherId: user.id,
        },
      },
      select: {
        id: true,
        studentId: true,
        assignment: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!submission) {
      throw new Error("Submission not found.");
    }

    await prisma.assignmentSubmission.update({
      where: { id: submission.id },
      data: {
        status: "REVIEWED",
        feedback: feedback || null,
        grade: Number.isFinite(grade) && grade >= 0 ? grade : null,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    });

    await prisma.notification.create({
      data: {
        userId: submission.studentId,
        title: "Assignment reviewed",
        message: `${submission.assignment.title} has been reviewed by your teacher.`,
        type: "ASSIGNMENT",
      },
    });
  } catch {
    redirect("/teacher?error=submission-review-failed");
  }

  revalidatePath("/teacher");
  revalidatePath("/student");
  redirect("/teacher?success=submission-reviewed");
}

export async function saveAttendanceAction(formData: FormData) {
  const user = await requireTeacherAccess();
  const studentEmail = cleanValue(formData.get("studentEmail")).toLowerCase();
  const courseId = cleanValue(formData.get("courseId"));
  const lessonId = cleanValue(formData.get("lessonId"));
  const status = cleanValue(formData.get("status")) as "PRESENT" | "ABSENT" | "EXCUSED";
  const note = cleanValue(formData.get("note"));

  if (!studentEmail || !courseId || !status) {
    redirect("/teacher?error=attendance-save-failed");
  }

  try {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: user.id,
      },
      select: { id: true },
    });
    const student = await prisma.user.findUnique({
      where: { email: studentEmail },
      select: { id: true },
    });

    if (!course || !student) {
      throw new Error("Attendance target not found.");
    }

    await prisma.attendance.create({
      data: {
        studentId: student.id,
        courseId: course.id,
        lessonId: lessonId || null,
        status,
        note: note || null,
      },
    });
  } catch {
    redirect("/teacher?error=attendance-save-failed");
  }

  revalidatePath("/teacher");
  redirect("/teacher?success=attendance-saved");
}

export async function createTeacherLessonAction(formData: FormData) {
  const user = await requireTeacherAccess();
  const courseId = cleanValue(formData.get("courseId"));
  const title = cleanValue(formData.get("title"));
  const content = cleanValue(formData.get("content"));
  const duration = Number(formData.get("duration") || 0);

  if (!courseId || !title) {
    redirect("/teacher?error=lesson-create-failed");
  }

  try {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: user.id,
      },
      include: {
        lessons: {
          select: { order: true },
          orderBy: { order: "desc" },
          take: 1,
        },
      },
    });

    if (!course) {
      throw new Error("Course not assigned to teacher.");
    }

    await prisma.lesson.create({
      data: {
        courseId,
        title,
        slug: normalizeSlug(cleanValue(formData.get("slug")) || title),
        content: content || null,
        order: (course.lessons[0]?.order || 0) + 1,
        duration: Number.isFinite(duration) && duration > 0 ? duration : null,
      },
    });
  } catch {
    redirect("/teacher?error=lesson-create-failed");
  }

  revalidatePath("/teacher");
  revalidatePath("/student");
  redirect("/teacher?success=lesson-created");
}

export async function createTeacherAssignmentAction(formData: FormData) {
  const user = await requireTeacherAccess();
  const courseId = cleanValue(formData.get("courseId"));
  const title = cleanValue(formData.get("title"));
  const description = cleanValue(formData.get("description"));
  const dueDateValue = cleanValue(formData.get("dueDate"));

  if (!courseId || !title) {
    redirect("/teacher?error=assignment-create-failed");
  }

  try {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: user.id,
      },
      select: { id: true },
    });

    if (!course) {
      throw new Error("Course not assigned to teacher.");
    }

    await prisma.assignment.create({
      data: {
        courseId,
        teacherId: user.id,
        title,
        description: description || null,
        dueDate: dueDateValue ? new Date(dueDateValue) : null,
      },
    });
  } catch {
    redirect("/teacher?error=assignment-create-failed");
  }

  revalidatePath("/teacher");
  revalidatePath("/student");
  redirect("/teacher?success=assignment-created");
}

export async function createTeacherLiveClassAction(formData: FormData) {
  const user = await requireTeacherAccess();
  const courseId = cleanValue(formData.get("courseId"));
  const title = cleanValue(formData.get("title"));
  const startsAtValue = cleanValue(formData.get("startsAt"));
  const durationMinutes = Number(formData.get("durationMinutes") || 60);

  if (!courseId || !title || !startsAtValue) {
    redirect("/teacher?error=live-class-create-failed");
  }

  try {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: user.id,
      },
      select: { id: true },
    });

    if (!course) {
      throw new Error("Course not assigned to teacher.");
    }

    await createLiveClassSession({
      title,
      courseId,
      teacherId: user.id,
      startsAt: new Date(startsAtValue),
      durationMinutes: Number.isFinite(durationMinutes) ? durationMinutes : 60,
      joinNote: cleanValue(formData.get("joinNote")),
    });
  } catch {
    redirect("/teacher?error=live-class-create-failed");
  }

  revalidatePath("/teacher");
  revalidatePath("/student");
  redirect("/teacher?success=live-class-created");
}
