import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Container, Section, SectionTitle } from "@/components/shared";
import {
  getPublishedBlogBySlug,
  getPublishedBlogs,
} from "@/services/blog/blog.service";
import styles from "./BlogDetailPage.module.css";

type BlogDetailPageProps = {
  slug: string;
};

export async function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const post = await getPublishedBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = (await getPublishedBlogs())
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);
  const paragraphs = post.content.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <Section className={styles.hero}>
        <Container className={styles.heroInner}>
          <Badge variant="gold">{post.category}</Badge>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className={styles.meta}>
            <span>{post.author}</span>
            <span>{post.readingTime}</span>
            <span>{post.publishedAt}</span>
          </div>
        </Container>
      </Section>

      <Section variant="white">
        <Container className={styles.content}>
          <SectionTitle
            eyebrow="Article Overview"
            title="Why this topic matters"
            description="These academy blog entries are built to extend useful learning beyond the classroom."
            align="left"
          />
          <div className={styles.bodyCard}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle
            eyebrow="Related Posts"
            title="Continue reading"
            description="Explore more articles built around practical and reflective study."
          />
          <div className={styles.relatedGrid}>
            {relatedPosts.map((item) => (
              <div key={item.id} className={styles.relatedCard}>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <Link href={`/blog/${item.slug}`}>Read article</Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
