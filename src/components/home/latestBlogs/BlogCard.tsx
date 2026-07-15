import Link from "next/link";
import type { BlogPost } from "@/data/blogs";
import { resolveLocalizedInlineText, resolveLocalizedRichText } from "@/lib/content-localization";
import type { SiteLocale } from "@/lib/locale";
import styles from "./BlogCard.module.css";

type BlogCardProps = {
  post: BlogPost;
  locale: SiteLocale;
};

export function BlogCard({ post, locale }: BlogCardProps) {
  const category =
    locale === "ur"
      ? resolveLocalizedInlineText(post.category, locale) || "بلاگ"
      : locale === "ar"
        ? resolveLocalizedInlineText(post.category, locale) || "المدونة"
        : post.category;

  return (
    <article className={styles.card}>
      <div className={styles.metaRow}>
        <span className={styles.category}>{category}</span>
        <span className={styles.readingTime}>{post.readingTime}</span>
      </div>

      <h3>{resolveLocalizedInlineText(post.title, locale)}</h3>
      <p>{resolveLocalizedRichText(post.excerpt, locale)}</p>

      <div className={styles.footer}>
        <div>
          <strong>{post.author}</strong>
          <span>{post.publishedAt}</span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          {locale === "en" ? "Read More" : locale === "ur" ? "مزید پڑھیں" : "اقرأ المزيد"}
        </Link>
      </div>
    </article>
  );
}
