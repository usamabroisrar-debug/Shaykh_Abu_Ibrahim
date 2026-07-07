import { blogs } from "@/data/blogs";
import { books } from "@/data/books";
import { courses } from "@/data/courses";
import { teachers } from "@/data/teachers";

export type SearchResult = {
  id: string;
  title: string;
  href: string;
  type: "Course" | "Teacher" | "Book" | "Blog";
  description: string;
  meta: string;
};

export function searchSiteContent(rawQuery: string) {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const course of courses) {
    const haystack = [
      course.title,
      course.description,
      course.shortDescription,
      course.category,
      course.teacher.name,
      ...course.tags,
    ]
      .join(" ")
      .toLowerCase();

    if (haystack.includes(query)) {
      results.push({
        id: `course-${course.id}`,
        title: course.title,
        href: `/courses/${course.slug}`,
        type: "Course",
        description: course.shortDescription,
        meta: `${course.category} • ${course.level} • ${course.duration}`,
      });
    }
  }

  for (const teacher of teachers) {
    const haystack = [
      teacher.name,
      teacher.designation,
      teacher.specialty,
      teacher.summary,
      ...teacher.badges,
      ...teacher.languages,
    ]
      .join(" ")
      .toLowerCase();

    if (haystack.includes(query)) {
      results.push({
        id: `teacher-${teacher.id}`,
        title: teacher.name,
        href: `/teachers/${teacher.slug}`,
        type: "Teacher",
        description: teacher.summary,
        meta: `${teacher.specialty} • ${teacher.experience}`,
      });
    }
  }

  for (const book of books) {
    const haystack = [book.title, book.category, book.summary, book.featuredNote]
      .join(" ")
      .toLowerCase();

    if (haystack.includes(query)) {
      results.push({
        id: `book-${book.id}`,
        title: book.title,
        href: `/books/${book.slug}`,
        type: "Book",
        description: book.summary,
        meta: `${book.category} • ${book.format}`,
      });
    }
  }

  for (const post of blogs) {
    const haystack = [
      post.title,
      post.excerpt,
      post.category,
      post.author,
      ...post.tags,
    ]
      .join(" ")
      .toLowerCase();

    if (haystack.includes(query)) {
      results.push({
        id: `blog-${post.id}`,
        title: post.title,
        href: `/blog/${post.slug}`,
        type: "Blog",
        description: post.excerpt,
        meta: `${post.category} • ${post.readingTime}`,
      });
    }
  }

  return results;
}
