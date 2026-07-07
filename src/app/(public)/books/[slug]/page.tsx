import type { Metadata } from "next";
import { BookDetailPage } from "@/components/public/books/BookDetailPage";
import { books, getBookBySlug } from "@/data/books";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata(
  props: PageProps<"/books/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const book = getBookBySlug(slug);

  if (!book) {
    return buildMetadata({
      title: "Book Not Found",
      description: "This study resource could not be found.",
      path: `/books/${slug}`,
    });
  }

  return buildMetadata({
    title: book.title,
    description: book.summary,
    path: `/books/${book.slug}`,
    keywords: [book.title, book.category, "Islamic study resources"],
  });
}

export default async function BookDetailRoute(
  props: PageProps<"/books/[slug]">
) {
  const { slug } = await props.params;
  return <BookDetailPage slug={slug} />;
}
