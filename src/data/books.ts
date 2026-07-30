import type { LocalizedTextValue } from "@/lib/content-localization";

export type BookCategory = "Aqidah" | "Fiqh" | "Quran" | "Character";

export type Book = {
  id: string;
  title: LocalizedTextValue;
  slug: string;
  category: BookCategory;
  format: string;
  pages: number;
  summary: LocalizedTextValue;
  featuredNote: LocalizedTextValue;
  fileUrl?: string | null;
  coverUrl?: string | null;
};
