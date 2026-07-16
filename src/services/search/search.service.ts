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
    if (
      includesQuery(
        [
          course.title,
          course.description,
          course.shortDescription,
          course.category,
          course.teacher.name,
          ...course.tags,
        ],
        query
      )
    ) {
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
    if (includesQuery([book.title, book.category, book.summary, book.featuredNote], query)) {
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
    if (
      includesQuery([post.title, post.excerpt, post.category, post.author, ...post.tags], query)
    ) {
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
