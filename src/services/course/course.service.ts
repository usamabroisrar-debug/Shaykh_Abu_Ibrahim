import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured, shouldUseDatabaseReads } from "@/lib/server";
import { type Course, type CourseCategory, type CourseLevel } from "@/data/courses";
import { normalizeSlug } from "@/utils/slug";

const categoryImageMap: Record<CourseCategory, string> = {
  Qaida: "/images/courses/qaida.png",
  Nazra: "/images/courses/nazra.png",
  Hifz: "/images/courses/hifz.png",
  Tajweed: "/images/courses/tajweed-master.png",
  Tarjuma: "/images/courses/quran-translation.png",
  Tafseer: "/images/courses/tafseer-course.png",
  Hadith: "/images/courses/hadith-studies.png",
  Fiqh: "/images/courses/fiqh.png",
  Arabic: "/images/courses/qaida.png",
  Kids: "/images/courses/qaida.png",
};

function normalizeInstructorName(name?: string | null) {
  const value = name?.trim();

  if (!value) {
    return "Academy Faculty";
  }

  if (/shayk?h?\s+abdul\s+hadi/i.test(value)) {
    return "Shaykh Abu Ibrahim";
  }

  return value;
}

function inferCourseCategory(title: string): CourseCategory {
  const value = title.toLowerCase();

  if (value.includes("dars") || value.includes("nizami")) return "Fiqh";
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
    .filter((item) => item && !/^(english|urdu|arabic)\b/i.test(item));

  return lines.length ? lines.slice(0, 8) : fallback;
}

function sortPublicCourses(courses: Course[]) {
  return [...courses].sort(
    (left, right) =>
      Number(right.featured) - Number(left.featured) ||
      (left.order || 999) - (right.order || 999) ||
      String(left.title || "").localeCompare(String(right.title || ""))
  );
}

type CourseLocaleContent = {
  title?: Partial<Record<"en" | "ur" | "ar", string>>;
  description?: Partial<Record<"en" | "ur" | "ar", string>>;
  content?: Partial<Record<"en" | "ur" | "ar", string>>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeLocaleContent(value: unknown): CourseLocaleContent {
  return isRecord(value) ? (value as CourseLocaleContent) : {};
}

function resolveLocaleBucket(
  value: Partial<Record<"en" | "ur" | "ar", string>> | undefined,
  fallback: string | null | undefined
) {
  const bucket = {
    en: value?.en?.trim() || fallback?.trim() || "",
    ur: value?.ur?.trim() || "",
    ar: value?.ar?.trim() || "",
  };

  return bucket.en || bucket.ur || bucket.ar ? bucket : fallback?.trim() || "";
}

function toPublicCourseFromDb(course: {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  localeContent: unknown;
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
  const localeContent = normalizeLocaleContent(course.localeContent);
  const localizedTitle = resolveLocaleBucket(localeContent.title, course.title);
  const localizedDescription = resolveLocaleBucket(localeContent.description, course.description);
  const localizedContent = resolveLocaleBucket(localeContent.content, course.content);
  const category = inferCourseCategory(course.title);
  const image = categoryImageMap[category];
  const description =
    (typeof localizedDescription === "string" ? localizedDescription : localizedDescription.en) ||
    `${course.title} built for students who want structured Islamic learning with clear progress.`;

  return {
    id: course.id,
    title: localizedTitle || course.title,
    slug: course.slug,
    shortDescription: description,
    description,
    rawDescription: localizedDescription || undefined,
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
    language: "English, Urdu, Arabic",
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
      name: normalizeInstructorName(course.teacher?.name),
      slug: "teachers",
      image: course.teacher?.image || "/images/logo-transparent.webp",
      designation: "Islamic Instructor",
    },
    curriculum: buildListFromContent(
      typeof localizedContent === "string"
        ? localizedContent
        : localizedContent.en || localizedContent.ur || localizedContent.ar,
      [
      "Guided weekly lessons",
      "Teacher-led explanation",
      "Practical assignments",
      "Structured revision",
      ]
    ),
    rawContent: localizedContent || undefined,
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

async function getDatabasePublishedCourses() {
  if (!shouldUseDatabaseReads()) {
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
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    return await prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: true,
        enrollments: true,
      },
    });
  } catch {
    return null;
  }
}

export async function ensureCourseRecordBySlug(slug: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  return getCourseBySlugFromDb(slug);
}

export async function getTeacherCourses(teacherId: string) {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await prisma.course.findMany({
      where: { teacherId },
      include: {
        lessons: true,
        enrollments: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getRecentCourses(limit = 8) {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await prisma.course.findMany({
      include: {
        enrollments: true,
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getPublicCourses(limit?: number) {
  const databaseCourses = await getDatabasePublishedCourses();
  const mappedDatabaseCourses = databaseCourses.map(toPublicCourseFromDb);
  const merged = sortPublicCourses(mappedDatabaseCourses);

  return typeof limit === "number" ? merged.slice(0, limit) : merged;
}

export async function getFeaturedPublicCourses(limit = 6) {
  const courses = await getPublicCourses();
  const featuredCourses = courses.filter((course) => course.featured);

  return (featuredCourses.length ? featuredCourses : courses).slice(0, limit);
}

export async function getPublicCourseBySlug(slug: string) {
  if (shouldUseDatabaseReads()) {
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
        return toPublicCourseFromDb(databaseCourse);
      }
    } catch {
      // Fall through to the initial academy content when the database is unavailable.
    }
  }

  return undefined;
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
  localeContent?: CourseLocaleContent;
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
      localeContent: input.localeContent,
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

export async function updateAdminCourse(input: {
  id: string;
  title: string;
  slug?: string;
  description: string;
  content?: string;
  localeContent?: CourseLocaleContent;
  level?: string;
  duration?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  price?: number;
}) {
  const title = input.title.trim();

  return prisma.course.update({
    where: {
      id: input.id,
    },
    data: {
      title,
      slug: normalizeSlug(input.slug?.trim() || title),
      description: input.description.trim(),
      content: input.content?.trim() || null,
      localeContent: input.localeContent,
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

export async function seedAdminCourses() {
  const count = await prisma.course.count();

  if (count > 0) {
    return;
  }

  const academyCourses = [
    {
      title: "Qaida Foundation Program",
      slug: "qaida-foundation-program",
      description:
        "A beginner course for Arabic letters, pronunciation, and smooth transition into Quran reading.",
      content: "Arabic letters\nHarakat and joining rules\nBasic reading fluency",
      localeContent: {
        title: {
          en: "Qaida Foundation Program",
          ur: "قاعدہ فاؤنڈیشن پروگرام",
          ar: "برنامج قاعدة التأسيسي",
        },
        description: {
          en: "A beginner course for Arabic letters, pronunciation, and smooth transition into Quran reading.",
          ur: "عربی حروف، درست تلفظ، اور قرآن پڑھنے کی مضبوط بنیاد کے لیے ابتدائی کورس۔",
          ar: "دورة تأسيسية للحروف العربية والنطق والانتقال السلس إلى قراءة القرآن.",
        },
        content: {
          en: "Arabic letters\nHarakat and joining rules\nBasic reading fluency",
          ur: "عربی حروف\nحرکات اور جوڑنے کے قواعد\nابتدائی روانی",
          ar: "الحروف العربية\nالحركات وقواعد الوصل\nالطلاقة الأساسية",
        },
      },
      level: "Beginner",
      duration: "6 Weeks",
      status: "PUBLISHED" as const,
      featured: true,
      price: 26,
    },
    {
      title: "Tajweed Improvement Track",
      slug: "tajweed-improvement-track",
      description:
        "A structured correction path for learners who want clearer recitation and stronger Tajweed application.",
      content: "Makharij drills\nMadd practice\nSurah recitation feedback",
      localeContent: {
        title: {
          en: "Tajweed Improvement Track",
          ur: "تجوید بہتری کورس",
          ar: "مسار تحسين التجويد",
        },
        description: {
          en: "A structured correction path for learners who want clearer recitation and stronger Tajweed application.",
          ur: "ان طلبہ کے لیے منظم اصلاحی راستہ جو بہتر قرأت اور مضبوط تجویدی اطلاق چاہتے ہیں۔",
          ar: "مسار تصحيحي منظم للمتعلمين الراغبين في تلاوة أوضح وتطبيق أقوى للتجويد.",
        },
        content: {
          en: "Makharij drills\nMadd practice\nSurah recitation feedback",
          ur: "مخارج کی مشق\nمد کی مشق\nسورہ قرأت فیڈ بیک",
          ar: "تدريبات المخارج\nتدريب المدود\nملاحظات على تلاوة السور",
        },
      },
      level: "Intermediate",
      duration: "8 Weeks",
      status: "PUBLISHED" as const,
      featured: true,
      price: 52,
    },
    {
      title: "Hifz Support & Revision Circle",
      slug: "hifz-support-revision-circle",
      description:
        "Support for memorization students with sabaq planning, revision discipline, and teacher accountability.",
      content: "Sabaq planning\nRevision checkpoints\nParent progress guidance",
      localeContent: {
        title: {
          en: "Hifz Support & Revision Circle",
          ur: "حفظ سپورٹ اور دہرائی حلقہ",
          ar: "حلقة دعم الحفظ والمراجعة",
        },
        description: {
          en: "Support for memorization students with sabaq planning, revision discipline, and teacher accountability.",
          ur: "حفظ کے طلبہ کے لیے سبق پلاننگ، دہرائی نظم، اور استاد کی نگرانی کے ساتھ معاونت۔",
          ar: "دعم لطلاب الحفظ من خلال تخطيط الدرس والانضباط في المراجعة ومتابعة المعلم.",
        },
        content: {
          en: "Sabaq planning\nRevision checkpoints\nParent progress guidance",
          ur: "سبق پلاننگ\nدہرائی چیک پوائنٹس\nوالدین کے لیے پیش رفت رہنمائی",
          ar: "تخطيط الدرس\nنقاط متابعة المراجعة\nإرشاد أولياء الأمور حول التقدم",
        },
      },
      level: "All Levels",
      duration: "Ongoing",
      status: "PUBLISHED" as const,
      featured: false,
      price: 78,
    },
  ];

  for (const course of academyCourses) {
    await createAdminCourse(course);
  }
}
export async function deleteAdminCourse(id: string) {
  return prisma.course.delete({
    where: {
      id,
    },
  });
}

