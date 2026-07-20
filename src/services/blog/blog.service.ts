import { prisma } from "@/lib/prisma";
import { shouldUseDatabaseReads } from "@/lib/server";
import { type BlogCategory, type BlogPost } from "@/data/blogs";
import type { LocalizedTextValue } from "@/lib/content-localization";
import { normalizeSlug } from "@/utils/slug";

export type PublicBlogPost = BlogPost & { content: LocalizedTextValue };

const blogCategories: BlogCategory[] = [
  "Quran",
  "Tajweed",
  "Parenting",
  "Spirituality",
  "Study Habits",
];

function estimateReadingTime(text: string) {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return `${minutes} min read`;
}

function normalizeCategory(category?: string | null): BlogCategory {
  const match = blogCategories.find(
    (item) => item.toLowerCase() === (category || "").toLowerCase().trim()
  );

  return match ?? "Quran";
}

type BlogLocaleContent = {
  title?: Partial<Record<"en" | "ur" | "ar", string>>;
  excerpt?: Partial<Record<"en" | "ur" | "ar", string>>;
  content?: Partial<Record<"en" | "ur" | "ar", string>>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeLocaleContent(value: unknown): BlogLocaleContent {
  return isRecord(value) ? (value as BlogLocaleContent) : {};
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

function mapDbBlog(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  localeContent: unknown;
  createdAt: Date;
  author: { name: string | null } | null;
  category: { name: string } | null;
}): PublicBlogPost {
  const localeContent = normalizeLocaleContent(post.localeContent);
  const title = resolveLocaleBucket(localeContent.title, post.title);
  const excerpt = resolveLocaleBucket(localeContent.excerpt, post.excerpt);
  const content = resolveLocaleBucket(localeContent.content, post.content);
  const readingText =
    (typeof content === "string" ? content : content.en || content.ur || content.ar) ||
    (typeof excerpt === "string" ? excerpt : excerpt.en || excerpt.ur || excerpt.ar) ||
    (typeof title === "string" ? title : title.en || title.ur || title.ar);

  return {
    id: post.id,
    title: title || post.title,
    slug: post.slug,
    excerpt:
      excerpt ||
      `${post.title} for students, parents, and learners building a stronger Islamic study routine.`,
    category: normalizeCategory(post.category?.name),
    author: post.author?.name?.trim() || "Shaykh Abu Ibrahim",
    publishedAt: post.createdAt.toISOString().slice(0, 10),
    readingTime: estimateReadingTime(readingText),
    tags: [normalizeCategory(post.category?.name), "Islamic Learning"],
    content: content || excerpt || title || post.title,
  };
}

async function getDatabasePublishedBlogs() {
  if (!shouldUseDatabaseReads()) {
    return [];
  }

  try {
    return await prisma.blog.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch {
    return [];
  }
}

export async function getPublishedBlogs(limit?: number) {
  const databaseBlogs = await getDatabasePublishedBlogs();
  const merged = databaseBlogs
    .map(mapDbBlog)
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

  return typeof limit === "number" ? merged.slice(0, limit) : merged;
}

export async function getPublishedBlogBySlug(slug: string) {
  if (shouldUseDatabaseReads()) {
    try {
      const databaseBlog = await prisma.blog.findFirst({
        where: {
          slug,
          status: "PUBLISHED",
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      });

      if (databaseBlog) {
        return mapDbBlog(databaseBlog);
      }
    } catch {
      return undefined;
    }
  }

  return undefined;
}

export async function getAdminBlogs() {
  if (!shouldUseDatabaseReads()) {
    return [];
  }

  try {
    return await prisma.blog.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch {
    return [];
  }
}

export async function createAdminBlog(input: {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  localeContent?: BlogLocaleContent;
  categoryName: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  authorId: string;
}) {
  const title = input.title.trim();
  const slug = normalizeSlug(input.slug?.trim() || title);
  const categoryName = input.categoryName.trim() || "Quran";

  return prisma.blog.create({
    data: {
      title,
      slug,
      excerpt: input.excerpt.trim(),
      content: input.content.trim(),
      localeContent: input.localeContent,
      status: input.status,
      author: {
        connect: {
          id: input.authorId,
        },
      },
      category: {
        connectOrCreate: {
          where: {
            slug: normalizeSlug(categoryName),
          },
          create: {
            name: categoryName,
            slug: normalizeSlug(categoryName),
          },
        },
      },
    },
  });
}

export async function updateAdminBlog(input: {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  localeContent?: BlogLocaleContent;
  categoryName: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  const title = input.title.trim();
  const slug = normalizeSlug(input.slug?.trim() || title);
  const categoryName = input.categoryName.trim() || "Quran";

  return prisma.blog.update({
    where: {
      id: input.id,
    },
    data: {
      title,
      slug,
      excerpt: input.excerpt.trim(),
      content: input.content.trim(),
      localeContent: input.localeContent,
      status: input.status,
      category: {
        connectOrCreate: {
          where: {
            slug: normalizeSlug(categoryName),
          },
          create: {
            name: categoryName,
            slug: normalizeSlug(categoryName),
          },
        },
      },
    },
  });
}

export async function seedAdminBlogs(authorId: string) {
  const count = await prisma.blog.count();

  if (count > 0) {
    return;
  }

  const academyBlogs = [
    {
      title: "How to Build a Consistent Quran Routine at Home",
      slug: "consistent-quran-routine-at-home",
      excerpt:
        "A practical framework for families and solo learners to create a calm, repeatable Quran study rhythm.",
      content:
        "Start with a realistic weekly schedule, choose a fixed revision slot, and keep communication open with the teacher.",
      localeContent: {
        title: {
          en: "How to Build a Consistent Quran Routine at Home",
          ur: "گھر میں مستقل قرآن روٹین کیسے بنائیں",
          ar: "كيف تبني روتينًا ثابتًا لتعلم القرآن في المنزل",
        },
        excerpt: {
          en: "A practical framework for families and solo learners to create a calm, repeatable Quran study rhythm.",
          ur: "خاندانوں اور انفرادی طلبہ کے لیے ایک عملی طریقہ جو پرسکون اور مستقل قرآن مطالعہ روٹین بناتا ہے۔",
          ar: "إطار عملي للعائلات والمتعلمين الأفراد لبناء روتين هادئ ومتكرر لدراسة القرآن.",
        },
        content: {
          en: "Start with a realistic weekly schedule, choose a fixed revision slot, and keep communication open with the teacher.",
          ur: "حقیقی ہفتہ وار شیڈول بنائیں، دہرائی کے لیے مقرر وقت رکھیں، اور استاد کے ساتھ رابطہ واضح رکھیں۔",
          ar: "ابدأ بجدول أسبوعي واقعي، وحدد وقتًا ثابتًا للمراجعة، واجعل التواصل مع المعلم واضحًا.",
        },
      },
      categoryName: "Quran",
      status: "PUBLISHED" as const,
      authorId,
    },
    {
      title: "Three Tajweed Mistakes New Learners Can Fix Quickly",
      slug: "tajweed-mistakes-new-learners-can-fix",
      excerpt:
        "Common pronunciation issues can be corrected quickly when listening, repetition, and teacher feedback work together.",
      content:
        "Focus on makharij, madd length, and heavy-light letter distinction during the first stage of Tajweed correction.",
      localeContent: {
        title: {
          en: "Three Tajweed Mistakes New Learners Can Fix Quickly",
          ur: "نئے طلبہ تجوید کی تین غلطیاں جلد کیسے درست کر سکتے ہیں",
          ar: "ثلاثة أخطاء في التجويد يمكن للمبتدئين تصحيحها بسرعة",
        },
        excerpt: {
          en: "Common pronunciation issues can be corrected quickly when listening, repetition, and teacher feedback work together.",
          ur: "درست سماعت، بار بار مشق، اور استاد کی رہنمائی سے عام تجویدی غلطیاں جلد درست ہو سکتی ہیں۔",
          ar: "يمكن تصحيح مشكلات النطق الشائعة بسرعة عند الجمع بين الاستماع والتكرار وتوجيه المعلم.",
        },
        content: {
          en: "Focus on makharij, madd length, and heavy-light letter distinction during the first stage of Tajweed correction.",
          ur: "تجوید کی ابتدائی اصلاح میں مخارج، مد کی مقدار، اور حروف کی تفخیم و ترقیق پر توجہ دیں۔",
          ar: "ركز على المخارج ومقادير المد والتمييز بين الحروف المفخمة والمرققة في البداية.",
        },
      },
      categoryName: "Tajweed",
      status: "PUBLISHED" as const,
      authorId,
    },
    {
      title: "What Parents Should Expect From an Online Hifz Program",
      slug: "what-parents-should-expect-from-online-hifz",
      excerpt:
        "Parents should look for a structured sabaq plan, revision system, and transparent progress reporting.",
      content:
        "A serious Hifz journey depends on revision accountability, teacher consistency, and realistic memorization pacing.",
      localeContent: {
        title: {
          en: "What Parents Should Expect From an Online Hifz Program",
          ur: "آن لائن حفظ پروگرام سے والدین کیا توقع رکھیں",
          ar: "ما الذي ينبغي أن يتوقعه الوالدان من برنامج حفظ عبر الإنترنت",
        },
        excerpt: {
          en: "Parents should look for a structured sabaq plan, revision system, and transparent progress reporting.",
          ur: "والدین کو منظم سبق پلان، مضبوط دہرائی نظام، اور واضح پیش رفت رپورٹنگ دیکھنی چاہیے۔",
          ar: "ينبغي للوالدين البحث عن خطة درس منظمة ونظام مراجعة وتقارير تقدم واضحة.",
        },
        content: {
          en: "A serious Hifz journey depends on revision accountability, teacher consistency, and realistic memorization pacing.",
          ur: "کامیاب حفظ سفر کے لیے دہرائی کی پابندی، استاد کی مستقل مزاجی، اور حفظ کی مناسب رفتار ضروری ہے۔",
          ar: "تعتمد رحلة الحفظ الجادة على متابعة المراجعة وثبات المعلم وسرعة حفظ واقعية.",
        },
      },
      categoryName: "Parenting",
      status: "PUBLISHED" as const,
      authorId,
    },
  ];

  for (const blog of academyBlogs) {
    await createAdminBlog(blog);
  }
}
export async function deleteAdminBlog(id: string) {
  return prisma.blog.delete({
    where: {
      id,
    },
  });
}

