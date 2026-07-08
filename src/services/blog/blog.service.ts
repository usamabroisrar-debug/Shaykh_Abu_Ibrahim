import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/server";
import {
  blogs as staticBlogs,
  getBlogBySlug as getStaticBlogBySlug,
  type BlogCategory,
  type BlogPost,
} from "@/data/blogs";
import { normalizeSlug } from "@/utils/slug";

export type PublicBlogPost = BlogPost & {
  content: string;
  source: "database" | "static";
};

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

function buildStaticContent(post: BlogPost) {
  return [
    post.excerpt,
    "This article supports students, parents, and families who want a steadier Islamic learning rhythm with practical steps and reflective guidance.",
    "Use the ideas here as a starting point, then build consistency through teacher support, regular revision, and realistic weekly goals.",
  ].join("\n\n");
}

function mapStaticBlog(post: BlogPost): PublicBlogPost {
  return {
    ...post,
    content: buildStaticContent(post),
    source: "static",
  };
}

function mapDbBlog(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  createdAt: Date;
  author: { name: string | null } | null;
  category: { name: string } | null;
}): PublicBlogPost {
  const content = post.content?.trim() || post.excerpt?.trim() || post.title;

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt:
      post.excerpt?.trim() ||
      `${post.title} for students, parents, and learners building a stronger Islamic study routine.`,
    category: normalizeCategory(post.category?.name),
    author: post.author?.name?.trim() || "Shaykh Abu Ibrahim",
    publishedAt: post.createdAt.toISOString().slice(0, 10),
    readingTime: estimateReadingTime(content),
    tags: [normalizeCategory(post.category?.name), "Islamic Learning"],
    content,
    source: "database",
  };
}

async function getDatabasePublishedBlogs() {
  if (!isDatabaseConfigured()) {
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
  const mappedDatabaseBlogs = databaseBlogs.map(mapDbBlog);
  const databaseSlugs = new Set(mappedDatabaseBlogs.map((post) => post.slug));

  const merged = [
    ...mappedDatabaseBlogs,
    ...staticBlogs
      .filter((post) => !databaseSlugs.has(post.slug))
      .map(mapStaticBlog),
  ].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

  return typeof limit === "number" ? merged.slice(0, limit) : merged;
}

export async function getPublishedBlogBySlug(slug: string) {
  if (isDatabaseConfigured()) {
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
      // Fall back to bundled content when the database is unavailable.
    }
  }

  const staticBlog = getStaticBlogBySlug(slug);
  return staticBlog ? mapStaticBlog(staticBlog) : undefined;
}

export async function getAdminBlogs() {
  if (!isDatabaseConfigured()) {
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

export async function deleteAdminBlog(id: string) {
  return prisma.blog.delete({
    where: {
      id,
    },
  });
}
