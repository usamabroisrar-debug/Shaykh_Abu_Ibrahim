import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/server";
import {
  books as staticBooks,
  getBookBySlug as getStaticBookBySlug,
  type Book,
  type BookCategory,
} from "@/data/books";
import { normalizeSlug } from "@/utils/slug";

const categories: BookCategory[] = ["Aqidah", "Fiqh", "Quran", "Character"];

function normalizeCategory(value?: string | null): BookCategory {
  const match = categories.find(
    (category) => category.toLowerCase() === (value || "").toLowerCase().trim()
  );

  return match ?? "Quran";
}

function mapDatabaseBook(book: {
  id: string;
  title: string;
  slug: string;
  category: string;
  format: string;
  pages: number;
  summary: string;
  featuredNote: string | null;
}): Book {
  return {
    id: book.id,
    title: book.title,
    slug: book.slug,
    category: normalizeCategory(book.category),
    format: book.format,
    pages: book.pages,
    summary: book.summary,
    featuredNote:
      book.featuredNote?.trim() || "Useful companion for guided academy study.",
  };
}

async function getDatabasePublishedBooks() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await prisma.libraryBook.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch {
    return [];
  }
}

export async function getPublicBooks(limit?: number) {
  const databaseBooks = await getDatabasePublishedBooks();
  const mappedDatabaseBooks = databaseBooks.map(mapDatabaseBook);
  const databaseSlugs = new Set(mappedDatabaseBooks.map((book) => book.slug));

  const merged = [
    ...mappedDatabaseBooks,
    ...staticBooks.filter((book) => !databaseSlugs.has(book.slug)),
  ];

  return typeof limit === "number" ? merged.slice(0, limit) : merged;
}

export async function getPublicBookBySlug(slug: string) {
  if (isDatabaseConfigured()) {
    try {
      const databaseBook = await prisma.libraryBook.findFirst({
        where: {
          slug,
          status: "PUBLISHED",
        },
      });

      if (databaseBook) {
        return mapDatabaseBook(databaseBook);
      }
    } catch {
      // Fall back to bundled data when the database is unavailable.
    }
  }

  return getStaticBookBySlug(slug);
}

export async function getAdminBooks() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await prisma.libraryBook.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch {
    return [];
  }
}

export async function createAdminBook(input: {
  title: string;
  slug?: string;
  category: string;
  format: string;
  pages: number;
  summary: string;
  featuredNote?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  const title = input.title.trim();

  return prisma.libraryBook.create({
    data: {
      title,
      slug: normalizeSlug(input.slug?.trim() || title),
      category: normalizeCategory(input.category),
      format: input.format.trim(),
      pages: Math.max(1, input.pages || 1),
      summary: input.summary.trim(),
      featuredNote: input.featuredNote?.trim() || null,
      status: input.status,
    },
  });
}

export async function deleteAdminBook(id: string) {
  return prisma.libraryBook.delete({
    where: {
      id,
    },
  });
}
