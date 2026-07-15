import { prisma } from "@/lib/prisma";
import { blogs } from "@/data/blogs";
import { books } from "@/data/books";
import { courses } from "@/data/courses";
import { teachers } from "@/data/teachers";
import { normalizeSlug } from "@/utils/slug";

function buildSection(heading: string, value: string) {
  return `${heading}\n${value}`;
}

function buildCourseDescription(description: string) {
  return buildSection("English Description", description);
}

function buildCourseContent(lines: string[]) {
  return ["English Curriculum / Notes", ...lines].join("\n");
}

function buildBlogField(heading: string, value: string, urduHeading: string) {
  void urduHeading;
  return buildSection(heading, value);
}

function buildTeacherEmail(slug: string) {
  return `${slug}@shaykhabuibrahim.com`;
}

function buildTeacherExpertise(teacher: (typeof teachers)[number]) {
  return [teacher.specialty, ...teacher.badges, ...teacher.languages].join(", ");
}

export async function importStaticContentToDatabase(authorId?: string) {
  const teacherUsers = new Map<string, string>();

  for (const teacher of teachers) {
    const email = buildTeacherEmail(teacher.slug);
    const user = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name: teacher.name,
        role: "TEACHER",
        teacherProfile: {
          upsert: {
            update: {
              bio: teacher.summary,
              headline: teacher.designation,
              expertise: buildTeacherExpertise(teacher),
            },
            create: {
              bio: teacher.summary,
              headline: teacher.designation,
              expertise: buildTeacherExpertise(teacher),
            },
          },
        },
      },
      create: {
        email,
        name: teacher.name,
        role: "TEACHER",
        teacherProfile: {
          create: {
            bio: teacher.summary,
            headline: teacher.designation,
            expertise: buildTeacherExpertise(teacher),
          },
        },
      },
    });

    teacherUsers.set(normalizeSlug(teacher.name), user.id);
  }

  for (const post of blogs) {
    const categorySlug = normalizeSlug(post.category);
    const category = await prisma.blogCategory.upsert({
      where: {
        slug: categorySlug,
      },
      update: {
        name: post.category,
      },
      create: {
        name: post.category,
        slug: categorySlug,
      },
    });

    const authorSlug = normalizeSlug(post.author);
    const matchedAuthorId = teacherUsers.get(authorSlug) || authorId || null;

    await prisma.blog.upsert({
      where: {
        slug: post.slug,
      },
      update: {
        title: post.title,
        excerpt: buildBlogField("English Summary", post.excerpt, "Urdu Summary"),
        content: buildBlogField(
          "English Content",
          `${post.excerpt}\n\n${post.tags.join(", ")}`,
          "Urdu Content"
        ),
        status: "PUBLISHED",
        categoryId: category.id,
        authorId: matchedAuthorId,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: buildBlogField("English Summary", post.excerpt, "Urdu Summary"),
        content: buildBlogField(
          "English Content",
          `${post.excerpt}\n\n${post.tags.join(", ")}`,
          "Urdu Content"
        ),
        status: "PUBLISHED",
        categoryId: category.id,
        authorId: matchedAuthorId,
      },
    });
  }

  for (const book of books) {
    await prisma.libraryBook.upsert({
      where: {
        slug: book.slug,
      },
      update: {
        title: book.title,
        category: book.category,
        format: book.format,
        pages: book.pages,
        summary: buildBlogField("English Summary", book.summary, "Urdu Summary"),
        featuredNote: buildBlogField(
          "English Featured Note",
          book.featuredNote,
          "Urdu Featured Note"
        ),
        status: "PUBLISHED",
      },
      create: {
        title: book.title,
        slug: book.slug,
        category: book.category,
        format: book.format,
        pages: book.pages,
        summary: buildBlogField("English Summary", book.summary, "Urdu Summary"),
        featuredNote: buildBlogField(
          "English Featured Note",
          book.featuredNote,
          "Urdu Featured Note"
        ),
        status: "PUBLISHED",
      },
    });
  }

  for (const course of courses) {
    const teacherId = teacherUsers.get(normalizeSlug(course.teacher.name)) || null;
    const createdCourse = await prisma.course.upsert({
      where: {
        slug: course.slug,
      },
      update: {
        title: course.title,
        description: buildCourseDescription(course.description),
        content: buildCourseContent(course.curriculum),
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
        description: buildCourseDescription(course.description),
        content: buildCourseContent(course.curriculum),
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
