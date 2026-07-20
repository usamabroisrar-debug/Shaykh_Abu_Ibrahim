import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { normalizeSlug } from "@/utils/slug";

export type StoredUpload = {
  url: string;
  filename: string;
  mimeType: string | null;
  size: number;
};

export function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}

export function getUploadTitle(value: FormDataEntryValue | null) {
  if (!isUploadedFile(value)) {
    return "";
  }

  return path.parse(value.name).name.replace(/[-_]+/g, " ").trim();
}

function cleanFilename(value: string, fallback = "upload") {
  const parsed = path.parse(value || fallback);
  const safeName = normalizeSlug(parsed.name || fallback) || fallback;
  const safeExt = parsed.ext.toLowerCase().replace(/[^a-z0-9.]/g, "");

  return `${safeName}${safeExt || ""}`;
}

export async function saveUploadedFile(
  value: FormDataEntryValue | null,
  folder: string
): Promise<StoredUpload | null> {
  if (!isUploadedFile(value)) {
    return null;
  }

  const filename = `${Date.now()}-${cleanFilename(value.name)}`;
  const key = `${folder.replace(/^\/+|\/+$/g, "")}/${filename}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(key, value, {
      access: "public",
      addRandomSuffix: true,
    });

    return {
      url: blob.url,
      filename,
      mimeType: value.type || null,
      size: value.size,
    };
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  const outputPath = path.join(uploadDir, filename);
  const bytes = Buffer.from(await value.arrayBuffer());

  await mkdir(uploadDir, { recursive: true });
  await writeFile(outputPath, bytes);

  return {
    url: `/uploads/${folder}/${filename}`.replace(/\\/g, "/"),
    filename,
    mimeType: value.type || null,
    size: value.size,
  };
}
