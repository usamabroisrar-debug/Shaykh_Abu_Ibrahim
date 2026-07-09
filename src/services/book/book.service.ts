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

export async function updateAdminBook(input: {
  id: string;
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

  return prisma.libraryBook.update({
    where: {
      id: input.id,
    },
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

export async function seedAdminBooks() {
  const count = await prisma.libraryBook.count();

  if (count > 0) {
    return;
  }

  const demoBooks = [
    {
      title: "Foundations of Daily Adhkar / روزانہ اذکار کی بنیادیں",
      slug: "foundations-of-daily-adhkar",
      category: "Character",
      format: "PDF Guide",
      pages: 42,
      summary:
        "English Summary\nA concise student companion for morning and evening adhkar with transliteration cues and short reflections.\n\nUrdu Summary\nصبح و شام کے اذکار کے لیے مختصر رہنما جس میں تلفظی اشارے اور مختصر نصیحتیں شامل ہیں۔",
      featuredNote:
        "English Featured Note\nIdeal for new students and families.\n\nUrdu Featured Note\nنئے طلبہ اور خاندانوں کے لیے بہترین۔",
      status: "PUBLISHED" as const,
    },
    {
      title: "Tajweed Essentials Workbook / تجوید ضروریات ورک بک",
      slug: "tajweed-essentials-workbook",
      category: "Quran",
      format: "Practice Workbook",
      pages: 64,
      summary:
        "English Summary\nPractice sheets covering makharij, madd, qalqalah, and common live-recitation errors.\n\nUrdu Summary\nمخارج، مد، قلقلہ، اور عام قرأت کی غلطیوں پر مبنی مشقی صفحات۔",
      featuredNote:
        "English Featured Note\nPairs well with weekly Tajweed review.\n\nUrdu Featured Note\nہفتہ وار تجوید ریویو کے ساتھ بہترین رہتا ہے۔",
      status: "PUBLISHED" as const,
    },
  ];

  for (const book of demoBooks) {
    await createAdminBook(book);
  }
}

export async function deleteAdminBook(id: string) {
  return prisma.libraryBook.delete({
    where: {
      id,
    },
  });
}
