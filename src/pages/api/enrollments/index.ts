import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getCourseBySlugFromDb } from "@/services/course/course.service";
import { enrollStudentInCourse } from "@/services/enrollment/enrollment.service";

const enrollmentSchema = z.object({
  courseSlug: z.string().min(2),
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed." });
  }

  try {
    const session = await getServerSession(request, response, authOptions);

    if (!session?.user?.id) {
      return response.status(401).json({
        message: "Please log in before enrolling in a course.",
      });
    }

    const parsed = enrollmentSchema.safeParse(request.body);

    if (!parsed.success) {
      return response.status(400).json({
        message: "A valid course is required for enrollment.",
      });
    }

    const course = await getCourseBySlugFromDb(parsed.data.courseSlug);

    if (!course) {
      return response.status(404).json({
        message: "Course not found.",
      });
    }

    const enrollment = await enrollStudentInCourse({
      studentId: session.user.id,
      courseId: course.id,
      courseTitle: course.title,
    });

    return response.status(200).json({
      message: "Enrollment completed successfully.",
      enrollmentId: enrollment.id,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Enrollment could not be completed.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
