"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getInlineLanguageLabelValues } from "@/lib/content-localization";
import { prisma } from "@/lib/prisma";
import { getUploadTitle, saveUploadedFile } from "@/lib/upload-storage";
import { importStaticContentToDatabase } from "@/services/content/import-static-content.service";
import {
  updateHomepageHeroSettings,
  updateSiteSettings,
} from "@/services/settings/site-settings.service";
import { createLiveClassSession } from "@/services/live-class/live-class.service";
import {
  createAdminBlog,
  deleteAdminBlog,
  updateAdminBlog,
} from "@/services/blog/blog.service";
import {
  createAdminBook,
  deleteAdminBook,
  updateAdminBook,
} from "@/services/book/book.service";
import {
  createAdminCourse,
  deleteAdminCourse,
  updateAdminCourse,
} from "@/services/course/course.service";
import { issueCertificate } from "@/services/certificate/certificate.service";
import { normalizeSlug } from "@/utils/slug";

function cleanValue(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function requireAtLeastOne(...values: string[]) {
  return values.some((value) => value.trim().length > 0);
}

function buildLocaleField(english: string, urdu: string, arabic = "") {
  return {
    en: english.trim(),
    ur: urdu.trim(),
    ar: arabic.trim(),
  };
}

function pickStorageText(english: string, urdu: string, arabic = "") {
  return english.trim() || urdu.trim() || arabic.trim();
}

function readLocaleInputs(formData: FormData, baseName: string) {
  const english = cleanValue(formData.get(`${baseName}En`)) || cleanValue(formData.get(baseName));
  const urdu = cleanValue(formData.get(`${baseName}Ur`)) || cleanValue(formData.get(`${baseName}Urdu`));
  const arabic = cleanValue(formData.get(`${baseName}Ar`)) || cleanValue(formData.get(`${baseName}Arabic`));

  if (english || urdu || arabic) {
    return {
      en: english,
      ur: urdu,
      ar: arabic,
    };
  }

  return splitExistingLocaleText(cleanValue(formData.get(baseName)));
}

function splitExistingLocaleText(value: string) {
  const parts = getInlineLanguageLabelValues(value);
  const hasParts = hasLocaleParts(parts);

  return {
    en: parts.en?.trim() || (!hasParts ? value.trim() : ""),
    ur: parts.ur?.trim() || "",
    ar: parts.ar?.trim() || "",
  };
}

function titleFromFile(value: FormDataEntryValue | null) {
  return getUploadTitle(value);
}

function hasLocaleParts(value: Partial<Record<"en" | "ur" | "ar" | "default", string>>) {
  return Boolean(value.en || value.ur || value.ar || value.default);
}

function resolveCategory(
  selectedCategory: FormDataEntryValue | null,
  customCategory: FormDataEntryValue | null,
  fallback: string
) {
  const custom = cleanValue(customCategory);

  if (custom) {
    return custom;
  }

  const selected = cleanValue(selectedCategory);
  return selected && selected !== "CUSTOM" ? selected : fallback;
}

function buildAdminRedirect(search: string, view?: string) {
  const params = new URLSearchParams(search);

  if (view) {
    params.set("view", view);
  }

  return `/admin?${params.toString()}`;
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
  const view = cleanValue(formData.get("view")) || "blogs";
  const title = cleanValue(formData.get("title"));
  const titleUrdu = cleanValue(formData.get("titleUrdu"));
  const titleArabic = cleanValue(formData.get("titleArabic"));
  const excerpt = cleanValue(formData.get("excerpt"));
  const excerptUrdu = cleanValue(formData.get("excerptUrdu"));
  const excerptArabic = cleanValue(formData.get("excerptArabic"));
  const content = cleanValue(formData.get("content"));
  const contentUrdu = cleanValue(formData.get("contentUrdu"));
  const contentArabic = cleanValue(formData.get("contentArabic"));

  if (
    !requireAtLeastOne(title, titleUrdu, titleArabic) ||
    !requireAtLeastOne(excerpt, excerptUrdu, excerptArabic) ||
    !requireAtLeastOne(content, contentUrdu, contentArabic)
  ) {
    redirect(buildAdminRedirect("error=blog-create-failed", view));
  }

  try {
    await createAdminBlog({
      title: pickStorageText(title, titleUrdu, titleArabic),
      slug: cleanValue(formData.get("slug")),
      excerpt: pickStorageText(excerpt, excerptUrdu, excerptArabic),
      content: pickStorageText(content, contentUrdu, contentArabic),
      localeContent: {
        title: buildLocaleField(title, titleUrdu, titleArabic),
        excerpt: buildLocaleField(excerpt, excerptUrdu, excerptArabic),
        content: buildLocaleField(content, contentUrdu, contentArabic),
      },
      categoryName: resolveCategory(
        formData.get("categoryName"),
        formData.get("customCategoryName"),
        "Quran"
      ),
      status: cleanValue(formData.get("status")) as
        | "DRAFT"
        | "PUBLISHED"
        | "ARCHIVED",
      authorId: user.id,
    });
  } catch {
    redirect(buildAdminRedirect("error=blog-create-failed", view));
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=blog-created", view));
}

export async function deleteBlogAction(formData: FormData) {
  await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "blogs";

  try {
    await deleteAdminBlog(String(formData.get("id") || ""));
  } catch {
    redirect(buildAdminRedirect("error=blog-delete-failed", view));
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=blog-deleted", view));
}

export async function updateBlogAction(formData: FormData) {
  await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "blogs";

  try {
    const titleParts = readLocaleInputs(formData, "title");
    const excerptParts = readLocaleInputs(formData, "excerpt");
    const contentParts = readLocaleInputs(formData, "content");

    await updateAdminBlog({
      id: cleanValue(formData.get("id")),
      title: pickStorageText(titleParts.en, titleParts.ur, titleParts.ar),
      slug: cleanValue(formData.get("slug")),
      excerpt: pickStorageText(excerptParts.en, excerptParts.ur, excerptParts.ar),
      content: pickStorageText(contentParts.en, contentParts.ur, contentParts.ar),
      localeContent: {
        title: buildLocaleField(titleParts.en, titleParts.ur, titleParts.ar),
        excerpt: buildLocaleField(excerptParts.en, excerptParts.ur, excerptParts.ar),
        content: buildLocaleField(contentParts.en, contentParts.ur, contentParts.ar),
      },
      categoryName: resolveCategory(
        formData.get("categoryName"),
        formData.get("customCategoryName"),
        "Quran"
      ),
      status: cleanValue(formData.get("status")) as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    });
  } catch {
    redirect(buildAdminRedirect("error=blog-create-failed", view));
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=blog-created", view));
}

export async function createCourseAction(formData: FormData) {
  await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "courses";
  const title = cleanValue(formData.get("title"));
  const titleUrdu = cleanValue(formData.get("titleUrdu"));
  const titleArabic = cleanValue(formData.get("titleArabic"));
  const description = cleanValue(formData.get("description"));
  const descriptionUrdu = cleanValue(formData.get("descriptionUrdu"));
  const descriptionArabic = cleanValue(formData.get("descriptionArabic"));
  const content = cleanValue(formData.get("content"));
  const contentUrdu = cleanValue(formData.get("contentUrdu"));
  const contentArabic = cleanValue(formData.get("contentArabic"));

  if (
    !requireAtLeastOne(title, titleUrdu, titleArabic) ||
    !requireAtLeastOne(description, descriptionUrdu, descriptionArabic) ||
    !requireAtLeastOne(content, contentUrdu, contentArabic)
  ) {
    redirect(buildAdminRedirect("error=course-create-failed", view));
  }

  try {
    await createAdminCourse({
      title: pickStorageText(title, titleUrdu, titleArabic),
      slug: cleanValue(formData.get("slug")),
      description: pickStorageText(description, descriptionUrdu, descriptionArabic),
      content: pickStorageText(content, contentUrdu, contentArabic),
      localeContent: {
        title: buildLocaleField(title, titleUrdu, titleArabic),
        description: buildLocaleField(description, descriptionUrdu, descriptionArabic),
        content: buildLocaleField(content, contentUrdu, contentArabic),
      },
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
    redirect(buildAdminRedirect("error=course-create-failed", view));
  }

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=course-created", view));
}

export async function deleteCourseAction(formData: FormData) {
  await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "courses";

  try {
    await deleteAdminCourse(String(formData.get("id") || ""));
  } catch {
    redirect(buildAdminRedirect("error=course-delete-failed", view));
  }

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=course-deleted", view));
}

export async function updateCourseAction(formData: FormData) {
  await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "courses";

  try {
    const titleParts = readLocaleInputs(formData, "title");
    const descriptionParts = readLocaleInputs(formData, "description");
    const contentParts = readLocaleInputs(formData, "content");

    await updateAdminCourse({
      id: cleanValue(formData.get("id")),
      title: pickStorageText(titleParts.en, titleParts.ur, titleParts.ar),
      slug: cleanValue(formData.get("slug")),
      description: pickStorageText(descriptionParts.en, descriptionParts.ur, descriptionParts.ar),
      content: pickStorageText(contentParts.en, contentParts.ur, contentParts.ar),
      localeContent: {
        title: buildLocaleField(titleParts.en, titleParts.ur, titleParts.ar),
        description: buildLocaleField(descriptionParts.en, descriptionParts.ur, descriptionParts.ar),
        content: buildLocaleField(contentParts.en, contentParts.ur, contentParts.ar),
      },
      level: cleanValue(formData.get("level")),
      duration: cleanValue(formData.get("duration")),
      status: cleanValue(formData.get("status")) as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      featured: formData.get("featured") === "on",
      price: Number(formData.get("price") || 0),
    });
  } catch {
    redirect(buildAdminRedirect("error=course-create-failed", view));
  }

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=course-created", view));
}

export async function createBookAction(formData: FormData) {
  await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "books";
  const bookFile = formData.get("bookFile");
  const coverFile = formData.get("coverFile");
  const detectedTitle = titleFromFile(bookFile);
  const titleParts = readLocaleInputs(formData, "title");
  const storageTitle = pickStorageText(titleParts.en, titleParts.ur, titleParts.ar) || detectedTitle;
  const summary =
    cleanValue(formData.get("summary")) ||
    (storageTitle ? `Study resource for ${storageTitle}.` : "");
  const summaryUrdu = cleanValue(formData.get("summaryUrdu"));
  const summaryArabic = cleanValue(formData.get("summaryArabic"));
  const featuredNote = cleanValue(formData.get("featuredNote"));
  const featuredNoteUrdu = cleanValue(formData.get("featuredNoteUrdu"));
  const featuredNoteArabic = cleanValue(formData.get("featuredNoteArabic"));

  if (!requireAtLeastOne(titleParts.en, titleParts.ur, titleParts.ar, storageTitle)) {
    redirect(buildAdminRedirect("error=book-create-failed", view));
  }

  try {
    const uploadedFile = await saveUploadedFile(bookFile, "books/files");
    const uploadedCover = await saveUploadedFile(coverFile, "books/covers");

    await createAdminBook({
      title: storageTitle,
      slug: cleanValue(formData.get("slug")),
      category: cleanValue(formData.get("category")) || "Quran",
      format: cleanValue(formData.get("format")) || "PDF Guide",
      pages: Number(formData.get("pages") || 1),
      summary: pickStorageText(summary, summaryUrdu, summaryArabic),
      featuredNote: pickStorageText(featuredNote, featuredNoteUrdu, featuredNoteArabic),
      fileUrl: uploadedFile?.url || cleanValue(formData.get("fileUrl")),
      coverUrl: uploadedCover?.url || cleanValue(formData.get("coverUrl")),
      localeContent: {
        title: buildLocaleField(titleParts.en || storageTitle, titleParts.ur, titleParts.ar),
        summary: buildLocaleField(summary, summaryUrdu, summaryArabic),
        featuredNote: buildLocaleField(featuredNote, featuredNoteUrdu, featuredNoteArabic),
      },
      status: cleanValue(formData.get("status")) as
        | "DRAFT"
        | "PUBLISHED"
        | "ARCHIVED",
    });
  } catch (error) {
    console.error("Book create failed", error);
    redirect(buildAdminRedirect("error=book-create-failed", view));
  }

  revalidatePath("/");
  revalidatePath("/books");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=book-created", view));
}

export async function deleteBookAction(formData: FormData) {
  await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "books";

  try {
    await deleteAdminBook(String(formData.get("id") || ""));
  } catch {
    redirect(buildAdminRedirect("error=book-delete-failed", view));
  }

  revalidatePath("/");
  revalidatePath("/books");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=book-deleted", view));
}

export async function updateBookAction(formData: FormData) {
  await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "books";

  try {
    const bookFile = formData.get("bookFile");
    const coverFile = formData.get("coverFile");
    const uploadedFile = await saveUploadedFile(bookFile, "books/files");
    const uploadedCover = await saveUploadedFile(coverFile, "books/covers");
    const titleParts = readLocaleInputs(formData, "title");
    const storageTitle =
      pickStorageText(titleParts.en, titleParts.ur, titleParts.ar) || titleFromFile(bookFile);
    const summaryParts = readLocaleInputs(formData, "summary");
    const featuredNoteParts = readLocaleInputs(formData, "featuredNote");
    const summary =
      pickStorageText(summaryParts.en, summaryParts.ur, summaryParts.ar) ||
      (storageTitle ? `Study resource for ${storageTitle}.` : "Study resource for academy students.");

    await updateAdminBook({
      id: cleanValue(formData.get("id")),
      title: storageTitle,
      slug: cleanValue(formData.get("slug")),
      category: cleanValue(formData.get("category")) || "Quran",
      format: cleanValue(formData.get("format")) || "PDF Guide",
      pages: Number(formData.get("pages") || 1),
      summary,
      featuredNote: cleanValue(formData.get("featuredNote")),
      fileUrl: uploadedFile?.url || cleanValue(formData.get("fileUrl")),
      coverUrl: uploadedCover?.url || cleanValue(formData.get("coverUrl")),
      localeContent: {
        title: buildLocaleField(titleParts.en, titleParts.ur, titleParts.ar),
        summary: buildLocaleField(summaryParts.en || summary, summaryParts.ur, summaryParts.ar),
        featuredNote: buildLocaleField(
          featuredNoteParts.en,
          featuredNoteParts.ur,
          featuredNoteParts.ar
        ),
      },
      status: cleanValue(formData.get("status")) as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    });
  } catch (error) {
    console.error("Book update failed", error);
    redirect(buildAdminRedirect("error=book-create-failed", view));
  }

  revalidatePath("/");
  revalidatePath("/books");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=book-created", view));
}

export async function importAcademyContentAction() {
  const user = await requireAdminAccess();
  const view = "overview";

  try {
    await importStaticContentToDatabase(user.id);
  } catch (error) {
    console.error("Academy content import failed", error);
    redirect(buildAdminRedirect("error=seed-failed", view));
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/courses");
  revalidatePath("/books");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=seed-complete", view));
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdminAccess();
  const view = "settings";

  try {
    await updateSiteSettings({
      brandName: buildLocaleField(
        cleanValue(formData.get("brandName")),
        cleanValue(formData.get("brandNameUrdu")),
        cleanValue(formData.get("brandNameArabic"))
      ),
      subtitle: buildLocaleField(
        cleanValue(formData.get("subtitle")),
        cleanValue(formData.get("subtitleUrdu")),
        cleanValue(formData.get("subtitleArabic"))
      ),
      description: buildLocaleField(
        cleanValue(formData.get("description")),
        cleanValue(formData.get("descriptionUrdu")),
        cleanValue(formData.get("descriptionArabic"))
      ),
      footerText: buildLocaleField(
        cleanValue(formData.get("footerText")),
        cleanValue(formData.get("footerTextUrdu")),
        cleanValue(formData.get("footerTextArabic"))
      ),
      logoSrc: cleanValue(formData.get("logoSrc")) || "/images/logo-transparent.webp",
      socials: {
        youtube: cleanValue(formData.get("youtube")),
        facebook: cleanValue(formData.get("facebook")),
        instagram: cleanValue(formData.get("instagram")),
        tiktok: cleanValue(formData.get("tiktok")),
        whatsapp: cleanValue(formData.get("whatsapp")),
        whatsappChat: cleanValue(formData.get("whatsappChat")),
      },
    });
  } catch {
    redirect(buildAdminRedirect("error=settings-save-failed", view));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=settings-saved", view));
}

export async function saveHomepageHeroSettingsAction(formData: FormData) {
  await requireAdminAccess();
  const view = "settings";

  try {
    await updateHomepageHeroSettings({
      badge: buildLocaleField(
        cleanValue(formData.get("badge")),
        cleanValue(formData.get("badgeUrdu")),
        cleanValue(formData.get("badgeArabic"))
      ),
      title: buildLocaleField(
        cleanValue(formData.get("title")),
        cleanValue(formData.get("titleUrdu")),
        cleanValue(formData.get("titleArabic"))
      ),
      description: buildLocaleField(
        cleanValue(formData.get("description")),
        cleanValue(formData.get("descriptionUrdu")),
        cleanValue(formData.get("descriptionArabic"))
      ),
      miniHighlights: buildLocaleField(
        cleanValue(formData.get("miniHighlights")),
        cleanValue(formData.get("miniHighlightsUrdu")),
        cleanValue(formData.get("miniHighlightsArabic"))
      ),
      highlights: buildLocaleField(
        cleanValue(formData.get("highlights")),
        cleanValue(formData.get("highlightsUrdu")),
        cleanValue(formData.get("highlightsArabic"))
      ),
      primaryAction: buildLocaleField(
        cleanValue(formData.get("primaryAction")),
        cleanValue(formData.get("primaryActionUrdu")),
        cleanValue(formData.get("primaryActionArabic"))
      ),
      secondaryAction: buildLocaleField(
        cleanValue(formData.get("secondaryAction")),
        cleanValue(formData.get("secondaryActionUrdu")),
        cleanValue(formData.get("secondaryActionArabic"))
      ),
      trusted: buildLocaleField(
        cleanValue(formData.get("trusted")),
        cleanValue(formData.get("trustedUrdu")),
        cleanValue(formData.get("trustedArabic"))
      ),
      curriculum: buildLocaleField(
        cleanValue(formData.get("curriculum")),
        cleanValue(formData.get("curriculumUrdu")),
        cleanValue(formData.get("curriculumArabic"))
      ),
      teachers: buildLocaleField(
        cleanValue(formData.get("teachers")),
        cleanValue(formData.get("teachersUrdu")),
        cleanValue(formData.get("teachersArabic"))
      ),
      stats: [
        {
          label: buildLocaleField(
            cleanValue(formData.get("statLabel1")),
            cleanValue(formData.get("statLabel1Urdu")),
            cleanValue(formData.get("statLabel1Arabic"))
          ),
          value: cleanValue(formData.get("statValue1")) || "12+",
        },
        {
          label: buildLocaleField(
            cleanValue(formData.get("statLabel2")),
            cleanValue(formData.get("statLabel2Urdu")),
            cleanValue(formData.get("statLabel2Arabic"))
          ),
          value: cleanValue(formData.get("statValue2")) || "500+",
        },
        {
          label: buildLocaleField(
            cleanValue(formData.get("statLabel3")),
            cleanValue(formData.get("statLabel3Urdu")),
            cleanValue(formData.get("statLabel3Arabic"))
          ),
          value: cleanValue(formData.get("statValue3")) || "100%",
        },
      ],
      certificate: buildLocaleField(
        cleanValue(formData.get("certificate")),
        cleanValue(formData.get("certificateUrdu")),
        cleanValue(formData.get("certificateArabic"))
      ),
      certificateDetail: buildLocaleField(
        cleanValue(formData.get("certificateDetail")),
        cleanValue(formData.get("certificateDetailUrdu")),
        cleanValue(formData.get("certificateDetailArabic"))
      ),
      liveClasses: buildLocaleField(
        cleanValue(formData.get("liveClasses")),
        cleanValue(formData.get("liveClassesUrdu")),
        cleanValue(formData.get("liveClassesArabic"))
      ),
      liveDetail: buildLocaleField(
        cleanValue(formData.get("liveDetail")),
        cleanValue(formData.get("liveDetailUrdu")),
        cleanValue(formData.get("liveDetailArabic"))
      ),
      verified: buildLocaleField(
        cleanValue(formData.get("verified")),
        cleanValue(formData.get("verifiedUrdu")),
        cleanValue(formData.get("verifiedArabic"))
      ),
      imageAlt: buildLocaleField(
        cleanValue(formData.get("imageAlt")),
        cleanValue(formData.get("imageAltUrdu")),
        cleanValue(formData.get("imageAltArabic"))
      ),
      imageSrc: cleanValue(formData.get("imageSrc")) || "/images/hero.webp",
    });
  } catch {
    redirect(buildAdminRedirect("error=hero-save-failed", view));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=hero-saved", view));
}

export async function issueCertificateAction(formData: FormData) {
  const user = await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "operations";
  const studentEmail = cleanValue(formData.get("studentEmail"));
  const courseId = cleanValue(formData.get("courseId"));
  const issuedAtValue = cleanValue(formData.get("issuedAt"));

  if (!studentEmail || !courseId) {
    redirect(buildAdminRedirect("error=certificate-issue-failed", view));
  }

  try {
    await issueCertificate({
      studentEmail,
      courseId,
      issuedById: user.id,
      issuedAt: issuedAtValue ? new Date(issuedAtValue) : undefined,
    });
  } catch {
    redirect(buildAdminRedirect("error=certificate-issue-failed", view));
  }

  revalidatePath("/admin");
  revalidatePath("/student");
  redirect(buildAdminRedirect("success=certificate-issued", view));
}

export async function updateAdmissionStatusAction(formData: FormData) {
  await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "operations";
  const id = cleanValue(formData.get("id"));
  const status = cleanValue(formData.get("status")) as
    | "NEW"
    | "REVIEWING"
    | "APPROVED"
    | "WAITLISTED"
    | "REJECTED";

  if (!id || !status) {
    redirect(buildAdminRedirect("error=admission-status-failed", view));
  }

  try {
    await prisma.admission.update({
      where: { id },
      data: { status },
    });
  } catch {
    redirect(buildAdminRedirect("error=admission-status-failed", view));
  }

  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=admission-status-updated", view));
}

export async function createLessonAction(formData: FormData) {
  await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "operations";
  const courseId = cleanValue(formData.get("courseId"));
  const title = cleanValue(formData.get("title"));
  const content = cleanValue(formData.get("content"));
  const order = Number(formData.get("order") || 0);
  const duration = Number(formData.get("duration") || 0);

  if (!courseId || !title) {
    redirect(buildAdminRedirect("error=lesson-create-failed", view));
  }

  try {
    await prisma.lesson.create({
      data: {
        courseId,
        title,
        slug: normalizeSlug(cleanValue(formData.get("slug")) || title),
        content: content || null,
        order: Number.isFinite(order) ? order : 0,
        duration: Number.isFinite(duration) && duration > 0 ? duration : null,
        isPreview: formData.get("isPreview") === "on",
      },
    });
  } catch {
    redirect(buildAdminRedirect("error=lesson-create-failed", view));
  }

  revalidatePath("/admin");
  revalidatePath("/courses");
  redirect(buildAdminRedirect("success=lesson-created", view));
}

export async function createAssignmentAction(formData: FormData) {
  const user = await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "operations";
  const courseId = cleanValue(formData.get("courseId"));
  const title = cleanValue(formData.get("title"));
  const description = cleanValue(formData.get("description"));
  const dueDateValue = cleanValue(formData.get("dueDate"));

  if (!courseId || !title) {
    redirect(buildAdminRedirect("error=assignment-create-failed", view));
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { teacherId: true },
    });

    await prisma.assignment.create({
      data: {
        courseId,
        title,
        description: description || null,
        teacherId: course?.teacherId || user.id,
        dueDate: dueDateValue ? new Date(dueDateValue) : null,
      },
    });
  } catch {
    redirect(buildAdminRedirect("error=assignment-create-failed", view));
  }

  revalidatePath("/admin");
  revalidatePath("/teacher");
  revalidatePath("/student");
  redirect(buildAdminRedirect("success=assignment-created", view));
}

export async function createEnrollmentAction(formData: FormData) {
  await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "operations";
  const studentEmail = cleanValue(formData.get("studentEmail")).toLowerCase();
  const courseId = cleanValue(formData.get("courseId"));
  const status = cleanValue(formData.get("status")) as
    | "PENDING"
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELLED";

  if (!studentEmail || !courseId || !status) {
    redirect(buildAdminRedirect("error=enrollment-create-failed", view));
  }

  try {
    const student = await prisma.user.findUnique({
      where: { email: studentEmail },
      select: { id: true },
    });

    if (!student) {
      throw new Error("Student not found.");
    }

    await prisma.enrollment.upsert({
      where: {
        studentId_courseId: {
          studentId: student.id,
          courseId,
        },
      },
      update: { status },
      create: {
        studentId: student.id,
        courseId,
        status,
      },
    });
  } catch {
    redirect(buildAdminRedirect("error=enrollment-create-failed", view));
  }

  revalidatePath("/admin");
  revalidatePath("/student");
  redirect(buildAdminRedirect("success=enrollment-created", view));
}

export async function createPaymentAction(formData: FormData) {
  await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "operations";
  const userEmail = cleanValue(formData.get("userEmail")).toLowerCase();
  const courseId = cleanValue(formData.get("courseId"));
  const amount = Number(formData.get("amount") || 0);
  const referenceId = cleanValue(formData.get("referenceId"));
  const status = cleanValue(formData.get("status")) as "PENDING" | "PAID" | "FAILED" | "REFUNDED";

  if (!userEmail || !referenceId || !Number.isFinite(amount) || amount <= 0) {
    redirect(buildAdminRedirect("error=payment-create-failed", view));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    await prisma.payment.upsert({
      where: { referenceId },
      update: {
        userId: user.id,
        courseId: courseId || null,
        amount,
        currency: cleanValue(formData.get("currency")) || "USD",
        provider: cleanValue(formData.get("provider")) || null,
        status,
        paidAt: status === "PAID" ? new Date() : null,
      },
      create: {
        userId: user.id,
        courseId: courseId || null,
        amount,
        currency: cleanValue(formData.get("currency")) || "USD",
        provider: cleanValue(formData.get("provider")) || null,
        referenceId,
        status,
        paidAt: status === "PAID" ? new Date() : null,
      },
    });
  } catch {
    redirect(buildAdminRedirect("error=payment-create-failed", view));
  }

  revalidatePath("/admin");
  revalidatePath("/student");
  redirect(buildAdminRedirect("success=payment-created", view));
}

export async function createLiveClassAction(formData: FormData) {
  await requireAdminAccess();
  const view = "operations";
  const title = cleanValue(formData.get("title"));
  const courseId = cleanValue(formData.get("courseId"));
  const lessonId = cleanValue(formData.get("lessonId"));
  const teacherId = cleanValue(formData.get("teacherId"));
  const startsAtValue = cleanValue(formData.get("startsAt"));
  const durationMinutes = Number(formData.get("durationMinutes") || 60);

  if (!title || !courseId || !teacherId || !startsAtValue) {
    redirect(buildAdminRedirect("error=live-class-create-failed", view));
  }

  try {
    await createLiveClassSession({
      title,
      courseId,
      lessonId,
      teacherId,
      startsAt: new Date(startsAtValue),
      durationMinutes: Number.isFinite(durationMinutes) ? durationMinutes : 60,
      joinNote: cleanValue(formData.get("joinNote")),
      status: cleanValue(formData.get("status")) as
        | "SCHEDULED"
        | "LIVE"
        | "COMPLETED"
        | "CANCELLED",
    });
  } catch {
    redirect(buildAdminRedirect("error=live-class-create-failed", view));
  }

  revalidatePath("/admin");
  revalidatePath("/student");
  revalidatePath("/teacher");
  redirect(buildAdminRedirect("success=live-class-created", view));
}

export async function createMediaRecordAction(formData: FormData) {
  const user = await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "operations";
  const uploadedFile = await saveUploadedFile(formData.get("mediaFile"), "media");
  const url = uploadedFile?.url || cleanValue(formData.get("url"));
  const filename = uploadedFile?.filename || cleanValue(formData.get("filename"));

  if (!url || !filename) {
    redirect(buildAdminRedirect("error=media-create-failed", view));
  }

  try {
    await prisma.mediaFile.create({
      data: {
        url,
        filename,
        mimeType: uploadedFile?.mimeType || cleanValue(formData.get("mimeType")) || null,
        size: uploadedFile?.size || Number(formData.get("size") || 0) || null,
        userId: user.id,
      },
    });
  } catch {
    redirect(buildAdminRedirect("error=media-create-failed", view));
  }

  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=media-created", view));
}
