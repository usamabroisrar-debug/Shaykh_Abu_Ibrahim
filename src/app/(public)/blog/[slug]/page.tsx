import type { Metadata } from "next";
import { BlogDetailPage } from "@/components/public/blog/BlogDetailPage";
import { resolveLocalizedInlineText, resolveLocalizedRichText } from "@/lib/content-localization";
import { buildMetadata } from "@/lib/metadata";
import { getPublishedBlogBySlug } from "@/services/blog/blog.service";

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPublishedBlogBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Article Not Found",
      description: "This article could not be found.",
      path: `/blog/${slug}`,
    });
  }

  return buildMetadata({
    title: resolveLocalizedInlineText(post.title, "en"),
    description: resolveLocalizedRichText(post.excerpt, "en"),
    path: `/blog/${post.slug}`,
    keywords: [...post.tags, post.category, post.author],
  });
}

export default async function BlogDetailRoute(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  return <BlogDetailPage slug={slug} />;
}
