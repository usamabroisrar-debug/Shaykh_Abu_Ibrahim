import { prisma } from "@/lib/prisma";
import { shouldUseDatabaseReads } from "@/lib/server";
import { type Book, type BookCategory } from "@/data/books";
import { normalizeSlug } from "@/utils/slug";

const categories: BookCategory[] = ["Aqidah", "Fiqh", "Quran", "Character"];

function normalizeCategory(value?: string | null): BookCategory {
  const match = categories.find(
    (category) => category.toLowerCase() === (value || "").toLowerCase().trim()
  );

  return match ?? "Quran";
}

type BookLocaleContent = {
  title?: Partial<Record<"en" | "ur" | "ar", string>>;
  summary?: Partial<Record<"en" | "ur" | "ar", string>>;
  featuredNote?: Partial<Record<"en" | "ur" | "ar", string>>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeLocaleContent(value: unknown): BookLocaleContent {
  return isRecord(value) ? (value as BookLocaleContent) : {};
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

function mapDatabaseBook(book: {
  id: string;
  title: string;
  slug: string;
  category: string;
  format: string;
  pages: number;
  summary: string;
  featuredNote: string | null;
  localeContent: unknown;
}): Book {
  const localeContent = normalizeLocaleContent(book.localeContent);
  const title = stringifyLocaleField(localeContent.title, book.title, {
    en: "English",
    ur: "Urdu",
    ar: "Arabic",
  });
  const summary = stringifyLocaleField(localeContent.summary, book.summary, {
    en: "English Summary",
    ur: "Urdu Summary",
    ar: "Arabic Summary",
  });
  const featuredNote = stringifyLocaleField(localeContent.featuredNote, book.featuredNote, {
    en: "English Featured Note",
    ur: "Urdu Featured Note",
    ar: "Arabic Featured Note",
  });

  return {
    id: book.id,
    title: title || book.title,
    slug: book.slug,
    category: normalizeCategory(book.category),
    format: book.format,
    pages: book.pages,
    summary: summary || book.summary,
    featuredNote:
      featuredNote || "Useful companion for guided academy study.",
  };
}

async function getDatabasePublishedBooks() {
  if (!shouldUseDatabaseReads()) {
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
  const merged = databaseBooks.map(mapDatabaseBook);

  return typeof limit === "number" ? merged.slice(0, limit) : merged;
}

export async function getPublicBookBySlug(slug: string) {
  if (shouldUseDatabaseReads()) {
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
      return undefined;
    }
  }

  return undefined;
}

export async function getAdminBooks() {
  if (!shouldUseDatabaseReads()) {
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
  localeContent?: BookLocaleContent;
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
      localeContent: input.localeContent,
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
  localeContent?: BookLocaleContent;
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
      localeContent: input.localeContent,
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
