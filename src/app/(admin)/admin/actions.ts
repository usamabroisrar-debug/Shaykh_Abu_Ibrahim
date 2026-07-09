"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  createAdminBlog,
  deleteAdminBlog,
  seedAdminBlogs,
  updateAdminBlog,
} from "@/services/blog/blog.service";
import {
  createAdminBook,
  deleteAdminBook,
  seedAdminBooks,
  updateAdminBook,
} from "@/services/book/book.service";
import {
  createAdminCourse,
  deleteAdminCourse,
  seedAdminCourses,
  updateAdminCourse,
} from "@/services/course/course.service";

function cleanValue(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function joinInlineTranslations(primary: string, secondary: string) {
  const left = primary.trim();
  const right = secondary.trim();

  if (!left) {
    return right;
  }

  if (!right) {
    return left;
  }

  return `${left} / ${right}`;
}

function joinBlockTranslations(
  englishHeading: string,
  primary: string,
  urduHeading: string,
  secondary: string
) {
  const left = primary.trim();
  const right = secondary.trim();

  if (left && right) {
    return `${englishHeading}\n${left}\n\n${urduHeading}\n${right}`;
  }

  return left || right;
}

function buildAdminRedirect(search: string) {
  return `/admin?${search}`;
}

async function requireAdminAccess() {
  const session = await auth();

  if (!session?.user?.id || !["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
    redirect("/login?next=/admin");
  }

  return session.user;
}

export async function createBlogAction(formData: FormData) {
  const user = await requireAdminAccess();
  const title = cleanValue(formData.get("title"));
  const titleUrdu = cleanValue(formData.get("titleUrdu"));
  const excerpt = cleanValue(formData.get("excerpt"));
  const excerptUrdu = cleanValue(formData.get("excerptUrdu"));
  const content = cleanValue(formData.get("content"));
  const contentUrdu = cleanValue(formData.get("contentUrdu"));

  try {
    await createAdminBlog({
      title: joinInlineTranslations(title, titleUrdu),
      slug: cleanValue(formData.get("slug")),
      excerpt: joinBlockTranslations("English Summary", excerpt, "Urdu Summary", excerptUrdu),
      content: joinBlockTranslations("English Content", content, "Urdu Content", contentUrdu),
      categoryName: cleanValue(formData.get("categoryName")) || "Quran",
      status: cleanValue(formData.get("status")) as
        | "DRAFT"
        | "PUBLISHED"
        | "ARCHIVED",
      authorId: user.id,
    });
  } catch {
    redirect(buildAdminRedirect("error=blog-create-failed"));
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=blog-created"));
}

export async function deleteBlogAction(formData: FormData) {
  await requireAdminAccess();

  try {
    await deleteAdminBlog(String(formData.get("id") || ""));
  } catch {
    redirect(buildAdminRedirect("error=blog-delete-failed"));
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=blog-deleted"));
}

export async function updateBlogAction(formData: FormData) {
  await requireAdminAccess();

  try {
    await updateAdminBlog({
      id: cleanValue(formData.get("id")),
      title: cleanValue(formData.get("title")),
      slug: cleanValue(formData.get("slug")),
      excerpt: cleanValue(formData.get("excerpt")),
      content: cleanValue(formData.get("content")),
      categoryName: cleanValue(formData.get("categoryName")) || "Quran",
      status: cleanValue(formData.get("status")) as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    });
  } catch {
    redirect(buildAdminRedirect("error=blog-create-failed"));
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=blog-created"));
}

export async function createCourseAction(formData: FormData) {
  await requireAdminAccess();
  const title = cleanValue(formData.get("title"));
  const titleUrdu = cleanValue(formData.get("titleUrdu"));
  const description = cleanValue(formData.get("description"));
  const descriptionUrdu = cleanValue(formData.get("descriptionUrdu"));
  const content = cleanValue(formData.get("content"));
  const contentUrdu = cleanValue(formData.get("contentUrdu"));

  try {
    await createAdminCourse({
      title: joinInlineTranslations(title, titleUrdu),
      slug: cleanValue(formData.get("slug")),
      description: joinBlockTranslations(
        "English Description",
        description,
        "Urdu Description",
        descriptionUrdu
      ),
      content: joinBlockTranslations(
        "English Curriculum / Notes",
        content,
        "Urdu Curriculum / Notes",
        contentUrdu
      ),
      level: cleanValue(formData.get("level")),
      duration: cleanValue(formData.get("duration")),
      status: cleanValue(formData.get("status")) as
        | "DRAFT"
        | "PUBLISHED"
        | "ARCHIVED",
      featured: formData.get("featured") === "on",
      price: Number(formData.get("price") || 0),
    });
  } catch {
    redirect(buildAdminRedirect("error=course-create-failed"));
  }

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=course-created"));
}

export async function deleteCourseAction(formData: FormData) {
  await requireAdminAccess();

  try {
    await deleteAdminCourse(String(formData.get("id") || ""));
  } catch {
    redirect(buildAdminRedirect("error=course-delete-failed"));
  }

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=course-deleted"));
}

export async function updateCourseAction(formData: FormData) {
  await requireAdminAccess();

  try {
    await updateAdminCourse({
      id: cleanValue(formData.get("id")),
      title: cleanValue(formData.get("title")),
      slug: cleanValue(formData.get("slug")),
      description: cleanValue(formData.get("description")),
      content: cleanValue(formData.get("content")),
      level: cleanValue(formData.get("level")),
      duration: cleanValue(formData.get("duration")),
      status: cleanValue(formData.get("status")) as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      featured: formData.get("featured") === "on",
      price: Number(formData.get("price") || 0),
    });
  } catch {
    redirect(buildAdminRedirect("error=course-create-failed"));
  }

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=course-created"));
}

export async function createBookAction(formData: FormData) {
  await requireAdminAccess();
  const title = cleanValue(formData.get("title"));
  const titleUrdu = cleanValue(formData.get("titleUrdu"));
  const summary = cleanValue(formData.get("summary"));
  const summaryUrdu = cleanValue(formData.get("summaryUrdu"));
  const featuredNote = cleanValue(formData.get("featuredNote"));
  const featuredNoteUrdu = cleanValue(formData.get("featuredNoteUrdu"));

  try {
    await createAdminBook({
      title: joinInlineTranslations(title, titleUrdu),
      slug: cleanValue(formData.get("slug")),
      category: cleanValue(formData.get("category")) || "Quran",
      format: cleanValue(formData.get("format")) || "PDF Guide",
      pages: Number(formData.get("pages") || 1),
      summary: joinBlockTranslations("English Summary", summary, "Urdu Summary", summaryUrdu),
      featuredNote: joinBlockTranslations(
        "English Featured Note",
        featuredNote,
        "Urdu Featured Note",
        featuredNoteUrdu
      ),
      status: cleanValue(formData.get("status")) as
        | "DRAFT"
        | "PUBLISHED"
        | "ARCHIVED",
    });
  } catch {
    redirect(buildAdminRedirect("error=book-create-failed"));
  }

  revalidatePath("/");
  revalidatePath("/books");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=book-created"));
}

export async function deleteBookAction(formData: FormData) {
  await requireAdminAccess();

  try {
    await deleteAdminBook(String(formData.get("id") || ""));
  } catch {
    redirect(buildAdminRedirect("error=book-delete-failed"));
  }

  revalidatePath("/");
  revalidatePath("/books");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=book-deleted"));
}

export async function updateBookAction(formData: FormData) {
  await requireAdminAccess();

  try {
    await updateAdminBook({
      id: cleanValue(formData.get("id")),
      title: cleanValue(formData.get("title")),
      slug: cleanValue(formData.get("slug")),
      category: cleanValue(formData.get("category")) || "Quran",
      format: cleanValue(formData.get("format")) || "PDF Guide",
      pages: Number(formData.get("pages") || 1),
      summary: cleanValue(formData.get("summary")),
      featuredNote: cleanValue(formData.get("featuredNote")),
      status: cleanValue(formData.get("status")) as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    });
  } catch {
    redirect(buildAdminRedirect("error=book-create-failed"));
  }

  revalidatePath("/");
  revalidatePath("/books");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=book-created"));
}

export async function seedDemoContentAction() {
  const user = await requireAdminAccess();

  try {
    await seedAdminBlogs(user.id);
    await seedAdminCourses();
    await seedAdminBooks();
  } catch {
    redirect(buildAdminRedirect("error=seed-failed"));
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/courses");
  revalidatePath("/books");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=seed-complete"));
}
