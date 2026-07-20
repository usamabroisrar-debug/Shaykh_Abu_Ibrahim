import type { Metadata } from "next";
import { BookDetailPage } from "@/components/public/books/BookDetailPage";
import { resolveLocalizedInlineText, resolveLocalizedRichText } from "@/lib/content-localization";
import { buildMetadata } from "@/lib/metadata";
import { getPublicBookBySlug } from "@/services/book/book.service";

export async function generateMetadata(
  props: PageProps<"/books/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const book = await getPublicBookBySlug(slug);

  if (!book) {
    return buildMetadata({
      title: "Book Not Found",
      description: "This study resource could not be found.",
      path: `/books/${slug}`,
    });
  }

  return buildMetadata({
    title: resolveLocalizedInlineText(book.title, "en"),
    description: resolveLocalizedRichText(book.summary, "en"),
    path: `/books/${book.slug}`,
    keywords: [resolveLocalizedInlineText(book.title, "en"), book.category, "Islamic study resources"],
  });
}

export default async function BookDetailRoute(
  props: PageProps<"/books/[slug]">
) {
  const { slug } = await props.params;
  return <BookDetailPage slug={slug} />;
}
