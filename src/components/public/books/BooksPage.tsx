import { Card, Container, Section } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { books } from "@/data/books";
import styles from "./BooksPage.module.css";

export function BooksPage() {
  return (
    <>
      <PageHero
        eyebrow="Books"
        title="Guided reading resources and study companions for academy students"
        description="Browse the academy's developing digital library of practical references, workbooks, and supporting materials."
      />

      <Section variant="white">
        <Container className={styles.grid}>
          {books.map((book) => (
            <Card key={book.id} className={styles.card}>
              <span className={styles.category}>{book.category}</span>
              <h2>{book.title}</h2>
              <p>{book.summary}</p>
              <div className={styles.meta}>
                <span>{book.format}</span>
                <span>{book.pages} pages</span>
              </div>
              <a href={`/books/${book.slug}`} className={styles.link}>
                View Book Details
              </a>
            </Card>
          ))}
        </Container>
      </Section>
    </>
  );
}
