import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/server";
import {
  courses as staticCourses,
  getCourseBySlug as getStaticCourseBySlug,
  type Course,
  type CourseCategory,
  type CourseLevel,
} from "@/data/courses";
import { normalizeSlug } from "@/utils/slug";

const categoryImageMap: Record<CourseCategory, string> = {
  Qaida: "/images/courses/qaida.svg",
  Nazra: "/images/courses/nazra.svg",
  Hifz: "/images/courses/hifz.svg",
  Tajweed: "/images/courses/tajweed.svg",
  Tarjuma: "/images/courses/tarjuma.svg",
  Tafseer: "/images/courses/tafseer.svg",
  Hadith: "/images/courses/hadith.svg",
  Fiqh: "/images/courses/fiqh.svg",
  Arabic: "/images/courses/qaida.svg",
  Kids: "/images/courses/qaida.svg",
};

function inferCourseCategory(title: string): CourseCategory {
  const value = title.toLowerCase();

  if (value.includes("nazra")) return "Nazra";
  if (value.includes("hifz")) return "Hifz";
  if (value.includes("tajweed")) return "Tajweed";
  if (value.includes("tarjuma") || value.includes("translation")) return "Tarjuma";
  if (value.includes("tafseer")) return "Tafseer";
  if (value.includes("hadith")) return "Hadith";
  if (value.includes("fiqh")) return "Fiqh";
  if (value.includes("arabic")) return "Arabic";
  if (value.includes("kids")) return "Kids";

  return "Qaida";
}

function normalizeCourseLevel(level?: string | null): CourseLevel {
  if (level === "Beginner" || level === "Intermediate" || level === "Advanced") {
    return level;
  }

  return "All Levels";
}

function buildListFromContent(content: string | null | undefined, fallback: string[]) {
  const lines = (content || "")
    .split(/\r?\n/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  return lines.length ? lines.slice(0, 8) : fallback;
}

function toPublicCourseFromDb(course: {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  level: string | null;
  duration: string | null;
  price: { toNumber(): number } | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  teacher: { name: string | null; image: string | null } | null;
  lessons: { id: string }[];
  enrollments: { id: string }[];
}): Course {
  const category = inferCourseCategory(course.title);
  const image = categoryImageMap[category];
  const description =
    course.description?.trim() ||
    `${course.title} built for students who want structured Islamic learning with clear progress.`;

  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    shortDescription: description,
    description,
    image,
    banner: image,
    thumbnail: image,
    category,
    level: normalizeCourseLevel(course.level),
    status:
      course.status === "PUBLISHED"
        ? "Published"
        : course.status === "ARCHIVED"
          ? "Archived"
          : "Draft",
    duration: course.duration?.trim() || "Flexible schedule",
    language: "English / Urdu",
    students: course.enrollments.length,
    lessons: Math.max(course.lessons.length, 1),
    rating: 5,
    reviews: 0,
    price: course.price?.toNumber() || 0,
    discountPrice: undefined,
    certificate: true,
    featured: course.featured,
    isPopular: course.featured,
    isTrending: false,
    order: 999,
    tags: [category, "Islamic Learning", "Online Course"],
    teacher: {
      name: course.teacher?.name?.trim() || "Academy Faculty",
      slug: "teachers",
      image: course.teacher?.image || "/images/logo-transparent.webp",
      designation: "Islamic Instructor",
    },
    curriculum: buildListFromContent(course.content, [
      "Guided weekly lessons",
      "Teacher-led explanation",
      "Practical assignments",
      "Structured revision",
    ]),
    requirements: [
      "Stable internet connection",
      "Regular attendance",
      "Notebook for study",
    ],
    outcomes: [
      `Build stronger understanding in ${course.title}`,
      "Study with clearer structure and consistency",
      "Follow guided progress with teacher support",
    ],
    seo: {
      title: `${course.title} | Shaykh Abu Ibrahim`,
      description,
      keywords: [course.title, category, "Online Islamic Course"],
    },
    createdAt: course.createdAt.toISOString().slice(0, 10),
    updatedAt: course.updatedAt.toISOString().slice(0, 10),
  };
}

function mergeStaticCourseWithDb(
  staticCourse: Course,
  course: {
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    level: string | null;
    duration: string | null;
    price: { toNumber(): number } | null;
    featured: boolean;
    lessons: { id: string }[];
    enrollments: { id: string }[];
    teacher: { name: string | null; image: string | null } | null;
  }
) {
  return {
    ...staticCourse,
    title: course.title || staticCourse.title,
    slug: course.slug || staticCourse.slug,
    shortDescription: course.description?.trim() || staticCourse.shortDescription,
    description: course.description?.trim() || staticCourse.description,
    level: normalizeCourseLevel(course.level),
    duration: course.duration?.trim() || staticCourse.duration,
    price: course.price?.toNumber() || staticCourse.price,
    featured: course.featured,
    isPopular: course.featured || staticCourse.isPopular,
    lessons: course.lessons.length || staticCourse.lessons,
    students: course.enrollments.length || staticCourse.students,
    teacher: {
      ...staticCourse.teacher,
      name: course.teacher?.name?.trim() || staticCourse.teacher.name,
      image: course.teacher?.image || staticCourse.teacher.image,
    },
    curriculum: buildListFromContent(course.content, staticCourse.curriculum),
  } satisfies Course;
}

async function getDatabasePublishedCourses() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        lessons: {
          select: {
            id: true,
          },
        },
        enrollments: {
          select: {
            id: true,
          },
        },
        teacher: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch {
    return [];
  }
}

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

export async function getPublicCourses(limit?: number) {
  const databaseCourses = await getDatabasePublishedCourses();
  const databaseCourseMap = new Map(databaseCourses.map((course) => [course.slug, course]));

  const mergedStaticCourses = staticCourses.map((course) => {
    const databaseCourse = databaseCourseMap.get(course.slug);
    return databaseCourse ? mergeStaticCourseWithDb(course, databaseCourse) : course;
  });

  const extraDatabaseCourses = databaseCourses
    .filter((course) => !staticCourses.some((item) => item.slug === course.slug))
    .map(toPublicCourseFromDb);

  const merged = [...mergedStaticCourses, ...extraDatabaseCourses].sort(
    (left, right) => left.order - right.order || left.title.localeCompare(right.title)
  );

  return typeof limit === "number" ? merged.slice(0, limit) : merged;
}

export async function getFeaturedPublicCourses(limit = 6) {
  const courses = await getPublicCourses();
  return courses.filter((course) => course.featured).slice(0, limit);
}

export async function getPublicCourseBySlug(slug: string) {
  if (isDatabaseConfigured()) {
    try {
      const databaseCourse = await prisma.course.findFirst({
        where: {
          slug,
          status: "PUBLISHED",
        },
        include: {
          lessons: {
            select: {
              id: true,
            },
          },
          enrollments: {
            select: {
              id: true,
            },
          },
          teacher: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      if (databaseCourse) {
        const staticCourse = getStaticCourseBySlug(slug);
        return staticCourse
          ? mergeStaticCourseWithDb(staticCourse, databaseCourse)
          : toPublicCourseFromDb(databaseCourse);
      }
    } catch {
      // Fall back to bundled course data when the database is unavailable.
    }
  }

  return getStaticCourseBySlug(slug);
}

export async function getAdminCourses() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await prisma.course.findMany({
      include: {
        lessons: {
          select: {
            id: true,
          },
        },
        enrollments: {
          select: {
            id: true,
          },
        },
        teacher: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch {
    return [];
  }
}

export async function createAdminCourse(input: {
  title: string;
  slug?: string;
  description: string;
  content?: string;
  level?: string;
  duration?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  price?: number;
}) {
  const title = input.title.trim();

  return prisma.course.create({
    data: {
      title,
      slug: normalizeSlug(input.slug?.trim() || title),
      description: input.description.trim(),
      content: input.content?.trim() || null,
      level: input.level?.trim() || null,
      duration: input.duration?.trim() || null,
      status: input.status,
      featured: input.featured,
      price:
        typeof input.price === "number" && Number.isFinite(input.price)
          ? input.price
          : undefined,
    },
  });
}

export async function deleteAdminCourse(id: string) {
  return prisma.course.delete({
    where: {
      id,
    },
  });
}
