import { prisma } from "@/lib/prisma";
import { shouldUseDatabaseReads } from "@/lib/server";
import {
  type BlogCategory,
  type BlogPost,
} from "@/data/blogs";
import { normalizeSlug } from "@/utils/slug";

export type PublicBlogPost = BlogPost & { content: string };

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

function stringifyLocaleField(
  value: Partial<Record<"en" | "ur" | "ar", string>> | undefined,
  fallback: string | null | undefined,
  headings: Record<"en" | "ur" | "ar", string>
) {
  const parts: string[] = [];

  for (const locale of ["en", "ur", "ar"] as const) {
    const content = value?.[locale]?.trim();

    if (content) {
      parts.push(`${headings[locale]}\n${content}`);
    }
  }

  return parts.length ? parts.join("\n\n") : fallback?.trim() || "";
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
  const title = stringifyLocaleField(localeContent.title, post.title, {
    en: "English",
    ur: "Urdu",
    ar: "Arabic",
  });
  const excerpt = stringifyLocaleField(localeContent.excerpt, post.excerpt, {
    en: "English Summary",
    ur: "Urdu Summary",
    ar: "Arabic Summary",
  });
  const content =
    stringifyLocaleField(localeContent.content, post.content, {
      en: "English Content",
      ur: "Urdu Content",
      ar: "Arabic Content",
    }) ||
    excerpt ||
    title;

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
    readingTime: estimateReadingTime(content),
    tags: [normalizeCategory(post.category?.name), "Islamic Learning"],
    content,
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

  const demoBlogs = [
    {
      title: "How to Build a Consistent Quran Routine at Home / گھر میں مستقل قرآن روٹین کیسے بنائیں",
      slug: "consistent-quran-routine-at-home",
      excerpt:
        "English Summary\nA practical framework for families and solo learners to create a calm, repeatable Quran study rhythm that actually lasts.\n\nUrdu Summary\nخاندانوں اور انفرادی طلبہ کے لیے ایک عملی طریقہ کار جو پُرسکون اور مستقل قرآن مطالعہ روٹین بنانے میں مدد دے۔",
      content:
        "English Content\nStart with a realistic weekly schedule, choose a fixed revision slot, and keep communication open with the teacher.\n\nUrdu Content\nحقیقی ہفتہ وار شیڈول بنائیں، ریویژن کے لیے مقرر وقت رکھیں، اور استاد کے ساتھ رابطہ واضح رکھیں۔",
      categoryName: "Quran",
      status: "PUBLISHED" as const,
      authorId,
    },
    {
      title: "Three Tajweed Mistakes New Learners Can Fix Quickly / نئی تجوید کی تین غلطیاں",
      slug: "tajweed-mistakes-new-learners-can-fix",
      excerpt:
        "English Summary\nCommon pronunciation issues can be corrected quickly when listening, repetition, and teacher feedback work together.\n\nUrdu Summary\nدرست سماعت، بار بار مشق، اور استاد کی رہنمائی سے تجوید کی عام غلطیاں جلد درست ہو سکتی ہیں۔",
      content:
        "English Content\nFocus on makharij, madd length, and heavy-light letter distinction during the first stage of Tajweed correction.\n\nUrdu Content\nتجوید کی ابتدائی اصلاح میں مخارج، مد کی مقدار، اور حروف کی تفخیم و ترقیق پر توجہ دیں۔",
      categoryName: "Tajweed",
      status: "PUBLISHED" as const,
      authorId,
    },
    {
      title: "What Parents Should Expect From an Online Hifz Program / آن لائن حفظ پروگرام سے والدین کیا توقع رکھیں",
      slug: "what-parents-should-expect-from-online-hifz",
      excerpt:
        "English Summary\nParents should look for a structured sabaq plan, revision system, and transparent progress reporting.\n\nUrdu Summary\nوالدین کو منظم سبق پلان، مضبوط ریویژن نظام، اور واضح پروگریس رپورٹنگ دیکھنی چاہیے۔",
      content:
        "English Content\nA serious Hifz journey depends on revision accountability, teacher consistency, and realistic memorization pacing.\n\nUrdu Content\nکامیاب حفظ سفر کے لیے ریویژن کی پابندی، استاد کی مستقل مزاجی، اور حفظ کی مناسب رفتار ضروری ہے۔",
      categoryName: "Parenting",
      status: "PUBLISHED" as const,
      authorId,
    },
  ];

  for (const blog of demoBlogs) {
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
