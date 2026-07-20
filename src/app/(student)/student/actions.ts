"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload-storage";

function cleanValue(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

async function requireStudentAccess() {
  const session = await auth();

  if (!session?.user?.id || !["STUDENT", "PARENT"].includes(session.user.role)) {
    redirect("/login?next=/student");
  }

  return session.user;
}

export async function markLessonCompleteAction(formData: FormData) {
  const user = await requireStudentAccess();
  const courseId = cleanValue(formData.get("courseId"));
  const lessonId = cleanValue(formData.get("lessonId"));

  if (!courseId || !lessonId) {
    redirect("/student?error=lesson-progress-failed");
  }

  try {
    await prisma.lessonProgress.upsert({
      where: {
        studentId_lessonId: {
          studentId: user.id,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        studentId: user.id,
        courseId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });
  } catch {
    redirect("/student?error=lesson-progress-failed");
  }

  revalidatePath("/student");
  redirect("/student?success=lesson-completed");
}

export async function submitAssignmentAction(formData: FormData) {
  const user = await requireStudentAccess();
  const assignmentId = cleanValue(formData.get("assignmentId"));
  const content = cleanValue(formData.get("content"));
  const uploadedAttachment = await saveUploadedFile(
    formData.get("attachmentFile"),
    "assignments/submissions"
  );
  const attachmentUrl = uploadedAttachment?.url || cleanValue(formData.get("attachmentUrl"));

  if (!assignmentId || (!content && !attachmentUrl)) {
    redirect("/student?error=assignment-submit-failed");
  }

  try {
    await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: user.id,
        },
      },
      update: {
        content: content || null,
        attachmentUrl: attachmentUrl || null,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      create: {
        assignmentId,
        studentId: user.id,
        content: content || null,
        attachmentUrl: attachmentUrl || null,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });
  } catch {
    redirect("/student?error=assignment-submit-failed");
  }

  revalidatePath("/student");
  revalidatePath("/teacher");
  redirect("/student?success=assignment-submitted");
}
