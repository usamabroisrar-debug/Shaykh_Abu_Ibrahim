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

async function buildUniqueBookSlug(baseValue: string, existingId?: string) {
  const baseSlug = normalizeSlug(baseValue) || "book";
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await prisma.libraryBook.findUnique({
      where: {
        slug: candidate,
      },
      select: {
        id: true,
      },
    });

    if (!existing || existing.id === existingId) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
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
  fileUrl?: string | null;
  coverUrl?: string | null;
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
    fileUrl: book.fileUrl || null,
    coverUrl: book.coverUrl || null,
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
  fileUrl?: string;
  coverUrl?: string;
  localeContent?: BookLocaleContent;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  const title = input.title.trim();
  const slug = await buildUniqueBookSlug(input.slug?.trim() || title);

  return prisma.libraryBook.create({
    data: {
      title,
      slug,
      category: normalizeCategory(input.category),
      format: input.format.trim(),
      pages: Math.max(1, input.pages || 1),
      summary: input.summary.trim(),
      featuredNote: input.featuredNote?.trim() || null,
      fileUrl: input.fileUrl?.trim() || null,
      coverUrl: input.coverUrl?.trim() || null,
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
  fileUrl?: string;
  coverUrl?: string;
  localeContent?: BookLocaleContent;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  const title = input.title.trim();
  const slug = await buildUniqueBookSlug(input.slug?.trim() || title, input.id);

  return prisma.libraryBook.update({
    where: {
      id: input.id,
    },
    data: {
      title,
      slug,
      category: normalizeCategory(input.category),
      format: input.format.trim(),
      pages: Math.max(1, input.pages || 1),
      summary: input.summary.trim(),
      featuredNote: input.featuredNote?.trim() || null,
      fileUrl: input.fileUrl?.trim() || null,
      coverUrl: input.coverUrl?.trim() || null,
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

  const academyBooks = [
    {
      title: "Foundations of Daily Adhkar",
      slug: "foundations-of-daily-adhkar",
      category: "Character",
      format: "PDF Guide",
      pages: 42,
      summary:
        "A concise student companion for morning and evening adhkar with transliteration cues and short reflections.",
      featuredNote: "Ideal for new students and families.",
      localeContent: {
        title: {
          en: "Foundations of Daily Adhkar",
          ur: "روزانہ اذکار کی بنیادیں",
          ar: "أسس أذكار اليوم والليلة",
        },
        summary: {
          en: "A concise student companion for morning and evening adhkar with transliteration cues and short reflections.",
          ur: "صبح و شام کے اذکار کے لیے مختصر رہنما جس میں تلفظی اشارے اور مختصر نصیحتیں شامل ہیں۔",
          ar: "رفيق مختصر للطلاب في أذكار الصباح والمساء مع إرشادات نطق وتأملات قصيرة.",
        },
        featuredNote: {
          en: "Ideal for new students and families.",
          ur: "نئے طلبہ اور خاندانوں کے لیے بہترین۔",
          ar: "مناسب للطلاب الجدد والعائلات.",
        },
      },
      status: "PUBLISHED" as const,
    },
    {
      title: "Tajweed Essentials Workbook",
      slug: "tajweed-essentials-workbook",
      category: "Quran",
      format: "Practice Workbook",
      pages: 64,
      summary:
        "Practice sheets covering makharij, madd, qalqalah, and common live-recitation errors.",
      featuredNote: "Pairs well with weekly Tajweed review.",
      localeContent: {
        title: {
          en: "Tajweed Essentials Workbook",
          ur: "تجوید ضروریات ورک بک",
          ar: "كراسة أساسيات التجويد",
        },
        summary: {
          en: "Practice sheets covering makharij, madd, qalqalah, and common live-recitation errors.",
          ur: "مخارج، مد، قلقلہ، اور عام قرأت غلطیوں پر مبنی مشقی صفحات۔",
          ar: "أوراق تدريبية تغطي المخارج والمدود والقلقلة وأخطاء التلاوة الشائعة.",
        },
        featuredNote: {
          en: "Pairs well with weekly Tajweed review.",
          ur: "ہفتہ وار تجوید ریویو کے ساتھ بہترین رہتا ہے۔",
          ar: "مناسب مع مراجعة التجويد الأسبوعية.",
        },
      },
      status: "PUBLISHED" as const,
    },
  ];

  for (const book of academyBooks) {
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

