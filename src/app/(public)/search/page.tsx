import { SearchResults } from "@/components/lms/SearchResults";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Search",
  description:
    "Use academy search to quickly find courses, teachers, books, blog articles, and important student resources across the platform.",
  path: "/search",
});

export default async function SearchRoute({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  return <SearchResults query={params.q ?? ""} />;
}
