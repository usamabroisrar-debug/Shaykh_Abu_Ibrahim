export type BookCategory = "Aqidah" | "Fiqh" | "Quran" | "Character";

export type Book = {
  id: string;
  title: string;
  slug: string;
  category: BookCategory;
  format: string;
  pages: number;
  summary: string;
  featuredNote: string;
  fileUrl?: string | null;
  coverUrl?: string | null;
};

export const books: Book[] = [
  {
    id: "book-1",
    title: "Foundations of Daily Adhkar",
    slug: "foundations-of-daily-adhkar",
    category: "Character",
    format: "PDF Guide",
    pages: 42,
    summary:
      "A concise student companion for morning and evening adhkar with transliteration cues and short reflections.",
    featuredNote: "Ideal for new students and families",
  },
  {
    id: "book-2",
    title: "Tajweed Essentials Workbook",
    slug: "tajweed-essentials-workbook",
    category: "Quran",
    format: "Practice Workbook",
    pages: 64,
    summary:
      "Drill sheets and examples covering makharij, madd, qalqalah, and common mistakes in live recitation classes.",
    featuredNote: "Pairs with weekly assessment lessons",
  },
  {
    id: "book-3",
    title: "Fiqh of Purification and Prayer",
    slug: "fiqh-of-purification-and-prayer",
    category: "Fiqh",
    format: "Study Notes",
    pages: 58,
    summary:
      "An accessible handbook on taharah, salah, and daily worship essentials taught in beginner and all-level cohorts.",
    featuredNote: "Structured for guided classroom use",
  },
  {
    id: "book-4",
    title: "Aqidah for Young Hearts",
    slug: "aqidah-for-young-hearts",
    category: "Aqidah",
    format: "Illustrated Reader",
    pages: 36,
    summary:
      "A gentle introduction to core beliefs using clear language, memorable themes, and age-appropriate explanations.",
    featuredNote: "Popular in weekend student circles",
  },
];

export function getBookBySlug(slug: string) {
  return books.find((book) => book.slug === slug);
}
