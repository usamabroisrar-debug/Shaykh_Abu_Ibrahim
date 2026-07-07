export type BlogCategory =
  | "Quran"
  | "Tajweed"
  | "Parenting"
  | "Spirituality"
  | "Study Habits";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: BlogCategory;
  author: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
};

export const blogs: BlogPost[] = [
  {
    id: "blog-1",
    title: "How to Build a Consistent Quran Routine at Home",
    slug: "consistent-quran-routine-at-home",
    excerpt:
      "A practical framework for families and solo learners to create a calm, repeatable Quran study rhythm that actually lasts.",
    category: "Quran",
    author: "Shaykh Abu Ibrahim",
    publishedAt: "2026-06-28",
    readingTime: "6 min read",
    tags: ["Quran", "Routine", "Consistency"],
  },
  {
    id: "blog-2",
    title: "Three Tajweed Mistakes New Learners Can Fix Quickly",
    slug: "tajweed-mistakes-new-learners-can-fix",
    excerpt:
      "A teacher-guided look at common pronunciation issues and how structured correction can improve confidence within weeks.",
    category: "Tajweed",
    author: "Ustadha Maryam Fatima",
    publishedAt: "2026-06-17",
    readingTime: "4 min read",
    tags: ["Tajweed", "Beginners", "Recitation"],
  },
  {
    id: "blog-3",
    title: "What Parents Should Expect From an Online Hifz Program",
    slug: "what-parents-should-expect-from-online-hifz",
    excerpt:
      "From sabaq planning to revision accountability, here is what separates a serious memorization program from casual classes.",
    category: "Parenting",
    author: "Mufti Hasan Qasmi",
    publishedAt: "2026-05-29",
    readingTime: "7 min read",
    tags: ["Hifz", "Parents", "Progress"],
  },
];

export function getBlogBySlug(slug: string) {
  return blogs.find((post) => post.slug === slug);
}
