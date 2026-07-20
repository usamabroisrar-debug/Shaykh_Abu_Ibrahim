import { blogs } from "@/data/blogs";
import { books } from "@/data/books";
import { courses } from "@/data/courses";
import { teachers } from "@/data/teachers";
import { resolveLocalizedInlineText, resolveLocalizedRichText, type LocalizedTextValue } from "@/lib/content-localization";
import { prisma } from "@/lib/prisma";
import { normalizeSlug } from "@/utils/slug";

type LocaleMap = Partial<Record<"en" | "ur" | "ar", string>>;

function localizedBucket(value: LocalizedTextValue): LocaleMap {
  return {
    en: resolveLocalizedInlineText(value, "en") || resolveLocalizedRichText(value, "en"),
    ur: resolveLocalizedInlineText(value, "ur") || resolveLocalizedRichText(value, "ur"),
    ar: resolveLocalizedInlineText(value, "ar") || resolveLocalizedRichText(value, "ar"),
  };
}

function buildLocaleContent<T extends Record<string, LocalizedTextValue>>(fields: T) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, localizedBucket(value)])
  );
}

function asPlainText(value: LocalizedTextValue) {
  return (
    resolveLocalizedInlineText(value, "en") ||
    resolveLocalizedRichText(value, "en") ||
    resolveLocalizedInlineText(value, "ur") ||
    resolveLocalizedRichText(value, "ur") ||
    resolveLocalizedInlineText(value, "ar") ||
    resolveLocalizedRichText(value, "ar")
  );
}

function buildTeacherEmail(slug: string) {
  return `${slug}@shaykhabuibrahim.com`;
}

function buildTeacherExpertise(teacher: (typeof teachers)[number]) {
  return [teacher.specialty, ...teacher.badges, ...teacher.languages].join(", ");
}

function buildBlogContent(post: (typeof blogs)[number]) {
  return `${asPlainText(post.excerpt)}\n\nTags: ${post.tags.join(", ")}`;
}

async function importTeachers() {
  const teacherUsers = new Map<string, string>();

  for (const teacher of teachers) {
    try {
      const email = buildTeacherEmail(teacher.slug);
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          name: teacher.name,
          role: "TEACHER",
        },
        create: {
          email,
          name: teacher.name,
          role: "TEACHER",
        },
      });

      await prisma.teacherProfile.upsert({
        where: { userId: user.id },
        update: {
          bio: teacher.summary,
          headline: teacher.designation,
          expertise: buildTeacherExpertise(teacher),
        },
        create: {
          userId: user.id,
          bio: teacher.summary,
          headline: teacher.designation,
          expertise: buildTeacherExpertise(teacher),
        },
      });

      teacherUsers.set(normalizeSlug(teacher.name), user.id);
    } catch (error) {
      console.warn(`Teacher import skipped for ${teacher.slug}`, error);
    }
  }

  return teacherUsers;
}

async function importBlogs(authorId: string | undefined, teacherUsers: Map<string, string>) {
  for (const post of blogs) {
    const categorySlug = normalizeSlug(post.category);
    const category = await prisma.blogCategory.upsert({
      where: { slug: categorySlug },
      update: { name: post.category },
      create: {
        name: post.category,
        slug: categorySlug,
      },
    });
    const matchedAuthorId = teacherUsers.get(normalizeSlug(post.author)) || authorId || null;
    const content = buildBlogContent(post);

    await prisma.blog.upsert({
      where: { slug: post.slug },
      update: {
        title: asPlainText(post.title),
        excerpt: asPlainText(post.excerpt),
        content,
        localeContent: buildLocaleContent({
          title: asPlainText(post.title),
          excerpt: asPlainText(post.excerpt),
          content,
        }),
        status: "PUBLISHED",
        categoryId: category.id,
        authorId: matchedAuthorId,
      },
      create: {
        title: asPlainText(post.title),
        slug: post.slug,
        excerpt: asPlainText(post.excerpt),
        content,
        localeContent: buildLocaleContent({
          title: asPlainText(post.title),
          excerpt: asPlainText(post.excerpt),
          content,
        }),
        status: "PUBLISHED",
        categoryId: category.id,
        authorId: matchedAuthorId,
      },
    });
  }
}

async function importBooks() {
  for (const book of books) {
    const localeContent = buildLocaleContent({
      title: asPlainText(book.title),
      summary: asPlainText(book.summary),
      featuredNote: asPlainText(book.featuredNote),
    }) as {
      title: LocaleMap;
      summary: LocaleMap;
      featuredNote: LocaleMap;
    };

    await prisma.libraryBook.upsert({
      where: { slug: book.slug },
      update: {
        title: asPlainText(book.title),
        category: book.category,
        format: book.format,
        pages: book.pages,
        summary: asPlainText(book.summary),
        featuredNote: asPlainText(book.featuredNote),
        fileUrl: book.fileUrl || null,
        coverUrl: book.coverUrl || null,
        localeContent,
        status: "PUBLISHED",
      },
      create: {
        title: asPlainText(book.title),
        slug: book.slug,
        category: book.category,
        format: book.format,
        pages: book.pages,
        summary: asPlainText(book.summary),
        featuredNote: asPlainText(book.featuredNote),
        fileUrl: book.fileUrl || null,
        coverUrl: book.coverUrl || null,
        localeContent,
        status: "PUBLISHED",
      },
    });
  }
}

async function importCourses(teacherUsers: Map<string, string>) {
  for (const course of courses) {
    const teacherId = teacherUsers.get(normalizeSlug(course.teacher.name)) || null;
    const content = course.curriculum.join("\n");
    const createdCourse = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        title: asPlainText(course.title),
        description: asPlainText(course.description),
        content,
        localeContent: buildLocaleContent({
          title: asPlainText(course.title),
          description: asPlainText(course.description),
          content,
        }),
        status: "PUBLISHED",
        teacherId,
        level: course.level,
        duration: course.duration,
        price: course.price,
        featured: course.featured,
      },
      create: {
        title: asPlainText(course.title),
        slug: course.slug,
        description: asPlainText(course.description),
        content,
        localeContent: buildLocaleContent({
          title: asPlainText(course.title),
          description: asPlainText(course.description),
          content,
        }),
        status: "PUBLISHED",
        teacherId,
        level: course.level,
        duration: course.duration,
        price: course.price,
        featured: course.featured,
      },
    });

    for (const [index, line] of course.curriculum.entries()) {
      const lessonSlug = normalizeSlug(`${createdCourse.slug}-${index + 1}`);
      await prisma.lesson.upsert({
        where: {
          courseId_slug: {
            courseId: createdCourse.id,
            slug: lessonSlug,
          },
        },
        update: {
          title: line,
          content: line,
          order: index + 1,
        },
        create: {
          courseId: createdCourse.id,
          slug: lessonSlug,
          title: line,
          content: line,
          order: index + 1,
          duration: 45,
        },
      });
    }
  }
}

export async function importStaticContentToDatabase(authorId?: string) {
  const teacherUsers = await importTeachers();

  await importBlogs(authorId, teacherUsers);
  await importBooks();
  await importCourses(teacherUsers);
}
