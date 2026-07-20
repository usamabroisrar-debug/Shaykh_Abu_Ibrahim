import {
  resolveLocalizedInlineText,
  resolveLocalizedRichText,
  type LocalizedTextValue,
} from "@/lib/content-localization";
import { getPublishedBlogs } from "@/services/blog/blog.service";
import { getPublicBooks } from "@/services/book/book.service";
import { getPublicCourses } from "@/services/course/course.service";
import { getPublicTeachers } from "@/services/teacher/teacher.service";

export type SearchResult = {
  id: string;
  title: string;
  href: string;
  type: "Course" | "Teacher" | "Book" | "Blog";
  description: string;
  meta: string;
};

function toSearchText(value: LocalizedTextValue) {
  return (
    resolveLocalizedInlineText(value, "en") ||
    resolveLocalizedInlineText(value, "ur") ||
    resolveLocalizedInlineText(value, "ar")
  );
}

function toSearchRichText(value: LocalizedTextValue) {
  return (
    resolveLocalizedRichText(value, "en") ||
    resolveLocalizedRichText(value, "ur") ||
    resolveLocalizedRichText(value, "ar")
  );
}

function includesQuery(haystack: Array<string | undefined>, query: string) {
  return haystack.filter(Boolean).join(" ").toLowerCase().includes(query);
}

export async function searchSiteContent(rawQuery: string) {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return [];
  }

  const [courses, teachers, books, blogs] = await Promise.all([
    getPublicCourses(),
    getPublicTeachers(),
    getPublicBooks(),
    getPublishedBlogs(),
  ]);

  const results: SearchResult[] = [];

  for (const course of courses) {
    const title = toSearchText(course.title);
    const description = toSearchRichText(course.description);
    const shortDescription = toSearchRichText(course.shortDescription);

    if (
      includesQuery(
        [title, description, shortDescription, course.category, course.teacher.name, ...course.tags],
        query
      )
    ) {
      results.push({
        id: `course-${course.id}`,
        title,
        href: `/courses/${course.slug}`,
        type: "Course",
        description: shortDescription || description,
        meta: `${course.category} • ${course.level} • ${course.duration}`,
      });
    }
  }

  for (const teacher of teachers) {
    if (
      includesQuery(
        [
          teacher.name,
          teacher.designation,
          teacher.specialty,
          teacher.summary,
          ...teacher.badges,
          ...teacher.languages,
        ],
        query
      )
    ) {
      results.push({
        id: `teacher-${teacher.id}`,
        title: teacher.name,
        href: `/teachers/${teacher.slug}`,
        type: "Teacher",
        description: teacher.summary,
        meta: `${teacher.specialty} • ${teacher.courses} courses`,
      });
    }
  }

  for (const book of books) {
    const title = toSearchText(book.title);
    const summary = toSearchRichText(book.summary);
    const featuredNote = toSearchRichText(book.featuredNote);

    if (includesQuery([title, book.category, summary, featuredNote], query)) {
      results.push({
        id: `book-${book.id}`,
        title,
        href: `/books/${book.slug}`,
        type: "Book",
        description: summary,
        meta: `${book.category} • ${book.format}`,
      });
    }
  }

  for (const post of blogs) {
    const title = toSearchText(post.title);
    const excerpt = toSearchRichText(post.excerpt);

    if (includesQuery([title, excerpt, post.category, post.author, ...post.tags], query)) {
      results.push({
        id: `blog-${post.id}`,
        title,
        href: `/blog/${post.slug}`,
        type: "Blog",
        description: excerpt,
        meta: `${post.category} • ${post.readingTime}`,
      });
    }
  }

  return results;
}
