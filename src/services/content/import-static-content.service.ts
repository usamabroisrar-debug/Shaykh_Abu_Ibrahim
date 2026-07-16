import { blogs } from "@/data/blogs";
import { books } from "@/data/books";
import { courses } from "@/data/courses";
import { teachers } from "@/data/teachers";
import { prisma } from "@/lib/prisma";
import { normalizeSlug } from "@/utils/slug";

type LocaleMap = Partial<Record<"en" | "ur" | "ar", string>>;

function buildLocaleContent<T extends Record<string, string>>(fields: T) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, { en: value }])
  );
}

function buildTeacherEmail(slug: string) {
  return `${slug}@shaykhabuibrahim.com`;
}

function buildTeacherExpertise(teacher: (typeof teachers)[number]) {
  return [teacher.specialty, ...teacher.badges, ...teacher.languages].join(", ");
}

function buildBlogContent(post: (typeof blogs)[number]) {
  return `${post.excerpt}\n\nTags: ${post.tags.join(", ")}`;
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
        title: post.title,
        excerpt: post.excerpt,
        content,
        localeContent: buildLocaleContent({
          title: post.title,
          excerpt: post.excerpt,
          content,
        }),
        status: "PUBLISHED",
        categoryId: category.id,
        authorId: matchedAuthorId,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content,
        localeContent: buildLocaleContent({
          title: post.title,
          excerpt: post.excerpt,
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
      title: book.title,
      summary: book.summary,
      featuredNote: book.featuredNote,
    }) as {
      title: LocaleMap;
      summary: LocaleMap;
      featuredNote: LocaleMap;
    };

    await prisma.libraryBook.upsert({
      where: { slug: book.slug },
      update: {
        title: book.title,
        category: book.category,
        format: book.format,
        pages: book.pages,
        summary: book.summary,
        featuredNote: book.featuredNote,
        fileUrl: book.fileUrl || null,
        coverUrl: book.coverUrl || null,
        localeContent,
        status: "PUBLISHED",
      },
      create: {
        title: book.title,
        slug: book.slug,
        category: book.category,
        format: book.format,
        pages: book.pages,
        summary: book.summary,
        featuredNote: book.featuredNote,
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
        title: course.title,
        description: course.description,
        content,
        localeContent: buildLocaleContent({
          title: course.title,
          description: course.description,
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
        title: course.title,
        slug: course.slug,
        description: course.description,
        content,
        localeContent: buildLocaleContent({
          title: course.title,
          description: course.description,
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
