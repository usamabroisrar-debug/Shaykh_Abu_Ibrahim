import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { books } from "@/data/books";
import styles from "./BooksSection.module.css";

export function BooksSection() {
  return (
    <Section variant="white" className={styles.section}>
      <Container>
        <div className={styles.header}>
          <SectionTitle
            eyebrow="Digital Library"
            title="Curated books and study companions for students who want more depth"
            description="The academy library is being designed around guided reading, revision support, and practical references that connect directly with live courses."
            align="left"
          />
          <Button href="/books" variant="outline">
            Explore Library
          </Button>
        </div>

        <div className={styles.grid}>
          {books.map((book) => (
            <article key={book.id} className={styles.card}>
              <span className={styles.category}>{book.category}</span>
              <h3>{book.title}</h3>
              <p>{book.summary}</p>
              <div className={styles.meta}>
                <strong>{book.format}</strong>
                <span>{book.pages} pages</span>
              </div>
              <small>{book.featuredNote}</small>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
