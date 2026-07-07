import type { Metadata } from "next";
import { BlogDetailPage } from "@/components/public/blog/BlogDetailPage";
import { blogs, getBlogBySlug } from "@/data/blogs";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return blogs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getBlogBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Article Not Found",
      description: "This article could not be found.",
      path: `/blog/${slug}`,
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: [...post.tags, post.category, post.author],
  });
}

export default async function BlogDetailRoute(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  return <BlogDetailPage slug={slug} />;
}
