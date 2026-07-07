import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { blogs } from "@/data/blogs";
import { BlogCard } from "./BlogCard";
import styles from "./LatestBlogs.module.css";

export function LatestBlogs() {
  return (
    <Section className={styles.section}>
      <Container>
        <div className={styles.header}>
          <SectionTitle
            eyebrow="Latest Insights"
            title="Writing that supports the learning journey beyond class time"
            description="Short, useful, and carefully framed resources for students, parents, and anyone building a serious study routine."
            align="left"
          />
          <Button href="/blog" variant="ghost">
            Browse Articles
          </Button>
        </div>

        <div className={styles.grid}>
          {blogs.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
