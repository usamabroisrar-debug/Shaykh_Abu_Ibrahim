import { BooksPage } from "@/components/public/books/BooksPage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Books And Study Resources",
  description:
    "Browse academy books, workbooks, and Islamic study companions supporting Quran, Fiqh, Aqidah, character, and revision pathways.",
  path: "/books",
});

export default function BooksRoute() {
  return <BooksPage />;
}
