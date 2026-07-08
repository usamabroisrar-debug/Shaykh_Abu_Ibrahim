import Link from "next/link";
import { Card, Container, Section } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { blogs } from "@/data/blogs";
import styles from "./BlogPage.module.css";

export function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Short, thoughtful articles supporting students, parents, and everyday Islamic growth"
        description="Read practical reflections and academy insights on Quran study, Tajweed, Hifz routines, and building steadier learning habits."
      />

      <Section variant="white">
        <Container className={styles.grid}>
          {blogs.map((post) => (
            <Card key={post.id} className={styles.card}>
              <span className={styles.category}>{post.category}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className={styles.meta}>
                <span>{post.author}</span>
                <span>{post.readingTime}</span>
                <span>{post.publishedAt}</span>
              </div>
              <Link href={`/blog/${post.slug}`} className={styles.link}>
                Read Article
              </Link>
            </Card>
          ))}
        </Container>
      </Section>
    </>
  );
}
