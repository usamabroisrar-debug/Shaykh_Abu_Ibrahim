import type { LocalizedTextValue } from "@/lib/content-localization";

export type CourseCategory =
  | "Qaida"
  | "Nazra"
  | "Hifz"
  | "Tajweed"
  | "Tarjuma"
  | "Tafseer"
  | "Hadith"
  | "Fiqh"
  | "Arabic"
  | "Kids";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | "All Levels";

export type CourseStatus = "Draft" | "Published" | "Archived";

export type CourseTeacher = {
  name: string;
  slug: string;
  image: string;
  designation: string;
};

export type CourseSeo = {
  title: string;
  description: string;
  keywords: string[];
};

export type Course = {
  id: string;
  title: LocalizedTextValue;
  slug: string;

  shortDescription: LocalizedTextValue;
  description: LocalizedTextValue;
  rawDescription?: LocalizedTextValue;
  rawContent?: LocalizedTextValue;

  image: string;
  banner: string;
  thumbnail: string;

  category: CourseCategory;
  level: CourseLevel;
  status: CourseStatus;

  duration: string;
  language: string;

  students: number;
  lessons: number;
  rating: number;
  reviews: number;

  price: number;
  discountPrice?: number;

  certificate: boolean;
  featured: boolean;
  isPopular: boolean;
  isTrending: boolean;

  order: number;

  tags: string[];

  teacher: CourseTeacher;

  curriculum: string[];
  requirements: string[];
  outcomes: string[];

  seo: CourseSeo;

  createdAt: string;
  updatedAt: string;
};
