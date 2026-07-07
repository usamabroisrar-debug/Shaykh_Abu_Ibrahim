import { notFound } from "next/navigation";
import { Badge, Container, Section, SectionTitle } from "@/components/shared";
import { books, getBookBySlug } from "@/data/books";
import styles from "./BookDetailPage.module.css";

type BookDetailPageProps = {
  slug: string;
};

export function BookDetailPage({ slug }: BookDetailPageProps) {
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const relatedBooks = books.filter((item) => item.slug !== book.slug).slice(0, 3);

  return (
    <>
      <Section className={styles.hero}>
        <Container className={styles.heroGrid}>
          <div>
            <Badge variant="gold">{book.category}</Badge>
            <h1>{book.title}</h1>
            <p>{book.summary}</p>
          </div>

          <div className={styles.panel}>
            <strong>{book.format}</strong>
            <span>{book.pages} pages</span>
            <p>{book.featuredNote}</p>
          </div>
        </Container>
      </Section>

      <Section variant="white">
        <Container>
          <SectionTitle
            eyebrow="Study Value"
            title="How this resource supports the learning journey"
            description="Library resources are selected to reinforce live classes, revision habits, and practical understanding."
          />
          <div className={styles.featureBlock}>
            <div className={styles.featureCard}>
              <h3>Practical use</h3>
              <p>
                This material is intended to support structured learning, not
                sit passively in a library archive.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3>Classroom alignment</h3>
              <p>
                The academy library is being shaped to connect directly with
                teaching pathways and revision goals.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle
            eyebrow="More Resources"
            title="Explore related books"
            description="Continue browsing materials that complement the wider academy experience."
          />
          <div className={styles.relatedGrid}>
            {relatedBooks.map((item) => (
              <div key={item.id} className={styles.relatedCard}>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <a href={`/books/${item.slug}`}>View details</a>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
