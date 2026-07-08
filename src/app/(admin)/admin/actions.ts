"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { createAdminBlog, deleteAdminBlog } from "@/services/blog/blog.service";
import { createAdminBook, deleteAdminBook } from "@/services/book/book.service";
import {
  createAdminCourse,
  deleteAdminCourse,
} from "@/services/course/course.service";

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

  try {
    await createAdminBlog({
      title: String(formData.get("title") || ""),
      slug: String(formData.get("slug") || ""),
      excerpt: String(formData.get("excerpt") || ""),
      content: String(formData.get("content") || ""),
      categoryName: String(formData.get("categoryName") || "Quran"),
      status: String(formData.get("status") || "PUBLISHED") as
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

export async function createCourseAction(formData: FormData) {
  await requireAdminAccess();

  try {
    await createAdminCourse({
      title: String(formData.get("title") || ""),
      slug: String(formData.get("slug") || ""),
      description: String(formData.get("description") || ""),
      content: String(formData.get("content") || ""),
      level: String(formData.get("level") || ""),
      duration: String(formData.get("duration") || ""),
      status: String(formData.get("status") || "PUBLISHED") as
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

export async function createBookAction(formData: FormData) {
  await requireAdminAccess();

  try {
    await createAdminBook({
      title: String(formData.get("title") || ""),
      slug: String(formData.get("slug") || ""),
      category: String(formData.get("category") || "Quran"),
      format: String(formData.get("format") || "PDF Guide"),
      pages: Number(formData.get("pages") || 1),
      summary: String(formData.get("summary") || ""),
      featuredNote: String(formData.get("featuredNote") || ""),
      status: String(formData.get("status") || "PUBLISHED") as
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
