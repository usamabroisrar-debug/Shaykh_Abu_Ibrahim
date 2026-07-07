import { BlogPage } from "@/components/public/blog/BlogPage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Islamic Blog",
  description:
    "Read practical Islamic articles on Quran routines, Tajweed growth, Hifz habits, parenting, and building consistent study rhythms.",
  path: "/blog",
});

export default function BlogRoute() {
  return <BlogPage />;
}
