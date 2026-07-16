"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getInlineLanguageLabelValues } from "@/lib/content-localization";
import { prisma } from "@/lib/prisma";
import { importStaticContentToDatabase } from "@/services/content/import-static-content.service";
import {
  updateHomepageHeroSettings,
  updateSiteSettings,
} from "@/services/settings/site-settings.service";
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

function buildLocaleField(english: string, urdu: string, arabic = "") {
  return {
    en: english.trim(),
    ur: urdu.trim(),
    ar: arabic.trim(),
  };
}

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}

function cleanFilename(value: string) {
  const parsed = path.parse(value || "upload");
  const safeName = normalizeSlug(parsed.name || "book-file");
  const safeExt = parsed.ext.toLowerCase().replace(/[^a-z0-9.]/g, "");

  return `${safeName || "book-file"}${safeExt || ""}`;
}

function titleFromFile(value: FormDataEntryValue | null) {
  if (!isUploadedFile(value)) {
    return "";
  }

  return path.parse(value.name).name.replace(/[-_]+/g, " ").trim();
}

function hasLocaleParts(value: Partial<Record<"en" | "ur" | "ar" | "default", string>>) {
  return Boolean(value.en || value.ur || value.ar || value.default);
}

function splitBookTitle(rawTitle: string, rawUrduTitle: string, fallbackTitle: string) {
  const source = rawTitle || fallbackTitle;
  const parts = getInlineLanguageLabelValues(source);
  const hasParts = hasLocaleParts(parts);
  const englishTitle = parts.en?.trim() || (!hasParts ? source.trim() : "");
  const urduTitle = rawUrduTitle.trim() || parts.ur?.trim() || "";
  const arabicTitle = parts.ar?.trim() || "";

  return {
    englishTitle,
    urduTitle,
    arabicTitle,
    storageTitle: englishTitle || urduTitle || arabicTitle || source.trim(),
  };
}

async function saveLocalBookAsset(value: FormDataEntryValue | null, folder: "files" | "covers") {
  if (!isUploadedFile(value)) {
    return "";
  }

  const filename = `${Date.now()}-${cleanFilename(value.name)}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "books", folder);
  const outputPath = path.join(uploadDir, filename);
  const bytes = Buffer.from(await value.arrayBuffer());

  await mkdir(uploadDir, { recursive: true });
  await writeFile(outputPath, bytes);

  return `/uploads/books/${folder}/${filename}`;
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
  const excerpt = cleanValue(formData.get("excerpt"));
  const excerptUrdu = cleanValue(formData.get("excerptUrdu"));
  const content = cleanValue(formData.get("content"));
  const contentUrdu = cleanValue(formData.get("contentUrdu"));

  if (
    !requireAtLeastOne(title, titleUrdu) ||
    !requireAtLeastOne(excerpt, excerptUrdu) ||
    !requireAtLeastOne(content, contentUrdu)
  ) {
    redirect(buildAdminRedirect("error=blog-create-failed", view));
  }

  try {
    await createAdminBlog({
      title: joinInlineTranslations(title, titleUrdu),
      slug: cleanValue(formData.get("slug")),
      excerpt: joinBlockTranslations("English Summary", excerpt, "Urdu Summary", excerptUrdu),
      content: joinBlockTranslations("English Content", content, "Urdu Content", contentUrdu),
      localeContent: {
        title: buildLocaleField(title, titleUrdu),
        excerpt: buildLocaleField(excerpt, excerptUrdu),
        content: buildLocaleField(content, contentUrdu),
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
    await updateAdminBlog({
      id: cleanValue(formData.get("id")),
      title: cleanValue(formData.get("title")),
      slug: cleanValue(formData.get("slug")),
      excerpt: cleanValue(formData.get("excerpt")),
      content: cleanValue(formData.get("content")),
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
  const description = cleanValue(formData.get("description"));
  const descriptionUrdu = cleanValue(formData.get("descriptionUrdu"));
  const content = cleanValue(formData.get("content"));
  const contentUrdu = cleanValue(formData.get("contentUrdu"));

  if (
    !requireAtLeastOne(title, titleUrdu) ||
    !requireAtLeastOne(description, descriptionUrdu) ||
    !requireAtLeastOne(content, contentUrdu)
  ) {
    redirect(buildAdminRedirect("error=course-create-failed", view));
  }

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
      localeContent: {
        title: buildLocaleField(title, titleUrdu),
        description: buildLocaleField(description, descriptionUrdu),
        content: buildLocaleField(content, contentUrdu),
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
  const rawTitle = cleanValue(formData.get("title"));
  const detectedTitle = titleFromFile(bookFile);
  const { englishTitle, urduTitle, arabicTitle, storageTitle } = splitBookTitle(
    rawTitle,
    cleanValue(formData.get("titleUrdu")),
    detectedTitle
  );
  const summary =
    cleanValue(formData.get("summary")) ||
    (storageTitle ? `Study resource for ${storageTitle}.` : "");
  const summaryUrdu = cleanValue(formData.get("summaryUrdu"));
  const featuredNote = cleanValue(formData.get("featuredNote"));
  const featuredNoteUrdu = cleanValue(formData.get("featuredNoteUrdu"));

  if (!requireAtLeastOne(englishTitle, urduTitle, arabicTitle)) {
    redirect(buildAdminRedirect("error=book-create-failed", view));
  }

  try {
    const uploadedFileUrl = await saveLocalBookAsset(bookFile, "files");
    const uploadedCoverUrl = await saveLocalBookAsset(coverFile, "covers");

    await createAdminBook({
      title: storageTitle,
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
      fileUrl: uploadedFileUrl || cleanValue(formData.get("fileUrl")),
      coverUrl: uploadedCoverUrl || cleanValue(formData.get("coverUrl")),
      localeContent: {
        title: buildLocaleField(englishTitle, urduTitle, arabicTitle),
        summary: buildLocaleField(summary, summaryUrdu),
        featuredNote: buildLocaleField(featuredNote, featuredNoteUrdu),
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
    const uploadedFileUrl = await saveLocalBookAsset(bookFile, "files");
    const uploadedCoverUrl = await saveLocalBookAsset(coverFile, "covers");
    const rawTitle = cleanValue(formData.get("title"));
    const { englishTitle, urduTitle, arabicTitle, storageTitle } = splitBookTitle(
      rawTitle,
      cleanValue(formData.get("titleUrdu")),
      titleFromFile(bookFile)
    );
    const summary =
      cleanValue(formData.get("summary")) ||
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
      fileUrl: uploadedFileUrl || cleanValue(formData.get("fileUrl")),
      coverUrl: uploadedCoverUrl || cleanValue(formData.get("coverUrl")),
      localeContent: {
        title: buildLocaleField(englishTitle, urduTitle, arabicTitle),
        summary: buildLocaleField(summary, cleanValue(formData.get("summaryUrdu"))),
        featuredNote: buildLocaleField(
          cleanValue(formData.get("featuredNote")),
          cleanValue(formData.get("featuredNoteUrdu"))
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
      brandName: joinInlineTranslations(
        cleanValue(formData.get("brandName")),
        cleanValue(formData.get("brandNameUrdu"))
      ),
      subtitle: joinBlockTranslations(
        "English",
        cleanValue(formData.get("subtitle")),
        "Urdu",
        cleanValue(formData.get("subtitleUrdu"))
      ),
      description: joinBlockTranslations(
        "English",
        cleanValue(formData.get("description")),
        "Urdu",
        cleanValue(formData.get("descriptionUrdu"))
      ),
      footerText: joinBlockTranslations(
        "English",
        cleanValue(formData.get("footerText")),
        "Urdu",
        cleanValue(formData.get("footerTextUrdu"))
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
      badge: joinBlockTranslations(
        "English",
        cleanValue(formData.get("badge")),
        "Urdu",
        cleanValue(formData.get("badgeUrdu"))
      ),
      title: joinBlockTranslations(
        "English",
        cleanValue(formData.get("title")),
        "Urdu",
        cleanValue(formData.get("titleUrdu"))
      ),
      description: joinBlockTranslations(
        "English",
        cleanValue(formData.get("description")),
        "Urdu",
        cleanValue(formData.get("descriptionUrdu"))
      ),
      miniHighlights: joinBlockTranslations(
        "English",
        cleanValue(formData.get("miniHighlights")),
        "Urdu",
        cleanValue(formData.get("miniHighlightsUrdu"))
      ),
      highlights: joinBlockTranslations(
        "English",
        cleanValue(formData.get("highlights")),
        "Urdu",
        cleanValue(formData.get("highlightsUrdu"))
      ),
      primaryAction: joinBlockTranslations(
        "English",
        cleanValue(formData.get("primaryAction")),
        "Urdu",
        cleanValue(formData.get("primaryActionUrdu"))
      ),
      secondaryAction: joinBlockTranslations(
        "English",
        cleanValue(formData.get("secondaryAction")),
        "Urdu",
        cleanValue(formData.get("secondaryActionUrdu"))
      ),
      trusted: joinBlockTranslations(
        "English",
        cleanValue(formData.get("trusted")),
        "Urdu",
        cleanValue(formData.get("trustedUrdu"))
      ),
      curriculum: joinBlockTranslations(
        "English",
        cleanValue(formData.get("curriculum")),
        "Urdu",
        cleanValue(formData.get("curriculumUrdu"))
      ),
      teachers: joinBlockTranslations(
        "English",
        cleanValue(formData.get("teachers")),
        "Urdu",
        cleanValue(formData.get("teachersUrdu"))
      ),
      stats: [
        {
          label: joinBlockTranslations(
            "English",
            cleanValue(formData.get("statLabel1")),
            "Urdu",
            cleanValue(formData.get("statLabel1Urdu"))
          ),
          value: cleanValue(formData.get("statValue1")) || "12+",
        },
        {
          label: joinBlockTranslations(
            "English",
            cleanValue(formData.get("statLabel2")),
            "Urdu",
            cleanValue(formData.get("statLabel2Urdu"))
          ),
          value: cleanValue(formData.get("statValue2")) || "500+",
        },
        {
          label: joinBlockTranslations(
            "English",
            cleanValue(formData.get("statLabel3")),
            "Urdu",
            cleanValue(formData.get("statLabel3Urdu"))
          ),
          value: cleanValue(formData.get("statValue3")) || "100%",
        },
      ],
      certificate: joinBlockTranslations(
        "English",
        cleanValue(formData.get("certificate")),
        "Urdu",
        cleanValue(formData.get("certificateUrdu"))
      ),
      certificateDetail: joinBlockTranslations(
        "English",
        cleanValue(formData.get("certificateDetail")),
        "Urdu",
        cleanValue(formData.get("certificateDetailUrdu"))
      ),
      liveClasses: joinBlockTranslations(
        "English",
        cleanValue(formData.get("liveClasses")),
        "Urdu",
        cleanValue(formData.get("liveClassesUrdu"))
      ),
      liveDetail: joinBlockTranslations(
        "English",
        cleanValue(formData.get("liveDetail")),
        "Urdu",
        cleanValue(formData.get("liveDetailUrdu"))
      ),
      verified: joinBlockTranslations(
        "English",
        cleanValue(formData.get("verified")),
        "Urdu",
        cleanValue(formData.get("verifiedUrdu"))
      ),
      imageAlt: joinBlockTranslations(
        "English",
        cleanValue(formData.get("imageAlt")),
        "Urdu",
        cleanValue(formData.get("imageAltUrdu"))
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

export async function createMediaRecordAction(formData: FormData) {
  const user = await requireAdminAccess();
  const view = cleanValue(formData.get("view")) || "operations";
  const url = cleanValue(formData.get("url"));
  const filename = cleanValue(formData.get("filename"));

  if (!url || !filename) {
    redirect(buildAdminRedirect("error=media-create-failed", view));
  }

  try {
    await prisma.mediaFile.create({
      data: {
        url,
        filename,
        mimeType: cleanValue(formData.get("mimeType")) || null,
        size: Number(formData.get("size") || 0) || null,
        userId: user.id,
      },
    });
  } catch {
    redirect(buildAdminRedirect("error=media-create-failed", view));
  }

  revalidatePath("/admin");
  redirect(buildAdminRedirect("success=media-created", view));
}
