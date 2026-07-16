import { prisma } from "@/lib/prisma";
import { shouldUseDatabaseReads } from "@/lib/server";
import { teachers as staticTeachers } from "@/data/teachers";
import { normalizeSlug } from "@/utils/slug";

export type PublicTeacher = {
  id: string;
  name: string;
  slug: string;
  image: string;
  designation: string;
  specialty: string;
  summary: string;
  headline: string;
  students: number;
  courses: number;
  languages: string[];
  badges: string[];
};

function splitCommaValues(value?: string | null) {
  return (value || "")
    .split(/[,\n/]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeLanguages(value?: string | null) {
  const values = splitCommaValues(value).filter((item) =>
    ["english", "urdu", "arabic"].includes(item.toLowerCase())
  );

  if (values.length) {
    return Array.from(new Set(values)).slice(0, 3);
  }

  return ["English", "Urdu", "Arabic"];
}

function buildBadges(value: {
  headline?: string | null;
  expertise?: string | null;
  courseCount: number;
}) {
  const badges = [
    value.headline?.trim(),
    ...splitCommaValues(value.expertise).filter(
      (item) => !["english", "urdu", "arabic"].includes(item.toLowerCase())
    ),
    value.courseCount > 0 ? `${value.courseCount} live courses` : "",
  ].filter(Boolean) as string[];

  return Array.from(new Set(badges)).slice(0, 4);
}

function resolveSpecialty(expertise?: string | null) {
  const first = splitCommaValues(expertise)[0];
  return first || "Islamic Studies";
}

function buildSummary(input: {
  bio?: string | null;
  headline?: string | null;
  name: string;
  courseCount: number;
}) {
  const bio = input.bio?.trim();

  if (bio) {
    return bio;
  }

  if (input.headline?.trim()) {
    return input.headline.trim();
  }

  if (input.courseCount > 0) {
    return `${input.name} supports structured Islamic learning across active academy courses.`;
  }

  return `${input.name} serves as part of the academy faculty for guided Islamic learning.`;
}

function mapTeacher(teacher: {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  teacherProfile: {
    bio: string | null;
    expertise: string | null;
    headline: string | null;
  } | null;
  teacherCourses: {
    id: string;
    enrollments: { id: string }[];
  }[];
}) {
  const name = teacher.name?.trim() || teacher.email.split("@")[0] || "Academy Instructor";
  const courseCount = teacher.teacherCourses.length;
  const studentCount = teacher.teacherCourses.reduce(
    (total, course) => total + course.enrollments.length,
    0
  );
  const designation =
    teacher.teacherProfile?.headline?.trim() || "Islamic Instructor";
  const specialty = resolveSpecialty(teacher.teacherProfile?.expertise);

  return {
    id: teacher.id,
    name,
    slug: normalizeSlug(name),
    image: teacher.image || "/images/logo-transparent.webp",
    designation,
    specialty,
    summary: buildSummary({
      bio: teacher.teacherProfile?.bio,
      headline: teacher.teacherProfile?.headline,
      name,
      courseCount,
    }),
    headline: designation,
    students: studentCount,
    courses: courseCount,
    languages: normalizeLanguages(teacher.teacherProfile?.expertise),
    badges: buildBadges({
      headline: teacher.teacherProfile?.headline,
      expertise: teacher.teacherProfile?.expertise,
      courseCount,
    }),
  } satisfies PublicTeacher;
}

async function getDatabaseTeachers() {
  if (!shouldUseDatabaseReads()) {
    return [];
  }

  try {
    return await prisma.user.findMany({
      where: {
        role: "TEACHER",
      },
      include: {
        teacherProfile: true,
        teacherCourses: {
          include: {
            enrollments: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  } catch {
    return [];
  }
}

export async function getPublicTeachers() {
  const teachers = await getDatabaseTeachers();
  const mappedTeachers = teachers.map(mapTeacher);

  if (mappedTeachers.length) {
    return mappedTeachers;
  }

  return staticTeachers.map((teacher) => ({
    id: teacher.id,
    name: teacher.name,
    slug: teacher.slug,
    image: "/images/logo-transparent.webp",
    designation: teacher.designation,
    specialty: teacher.specialty,
    summary: teacher.summary,
    headline: teacher.designation,
    students: teacher.students,
    courses: teacher.courses,
    languages: teacher.languages,
    badges: teacher.badges,
  }));
}

export async function getPublicTeacherBySlug(slug: string) {
  const teachers = await getPublicTeachers();
  return teachers.find((teacher) => teacher.slug === slug);
}
