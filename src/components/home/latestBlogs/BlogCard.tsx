import Link from "next/link";
import type { BlogPost } from "@/data/blogs";
import type { SiteLocale } from "@/lib/locale";
import styles from "./BlogCard.module.css";

type BlogCardProps = {
  post: BlogPost;
  locale: SiteLocale;
};

export function BlogCard({ post, locale }: BlogCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.metaRow}>
        <span className={styles.category}>{post.category}</span>
        <span className={styles.readingTime}>{post.readingTime}</span>
      </div>

      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>

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
