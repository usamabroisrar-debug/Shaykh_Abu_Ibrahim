"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
