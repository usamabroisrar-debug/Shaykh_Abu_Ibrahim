import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Container, Section, SectionTitle } from "@/components/shared";
import { blogs, getBlogBySlug } from "@/data/blogs";
import styles from "./BlogDetailPage.module.css";

type BlogDetailPageProps = {
  slug: string;
};

export function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogs.filter((item) => item.slug !== post.slug);

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
            <p>
              {post.excerpt} Each article is designed to be concise, relevant,
              and beneficial for students and families trying to build more
              consistent Islamic study habits.
            </p>
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
