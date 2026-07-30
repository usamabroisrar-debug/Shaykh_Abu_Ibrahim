import type { LocalizedTextValue } from "@/lib/content-localization";

export type BlogCategory =
  | "Quran"
  | "Tajweed"
  | "Parenting"
  | "Spirituality"
  | "Study Habits";

export type BlogPost = {
  id: string;
  title: LocalizedTextValue;
  slug: string;
  excerpt: LocalizedTextValue;
  category: BlogCategory;
  author: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
};
