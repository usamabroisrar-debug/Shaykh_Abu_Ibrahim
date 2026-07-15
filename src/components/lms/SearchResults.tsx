import Link from "next/link";
import { Button, Container, Section } from "@/components/shared";
import { searchSiteContent } from "@/lib/search";
import styles from "./LmsExperience.module.css";

type SearchResultsProps = {
  query: string;
};

export async function SearchResults({ query }: SearchResultsProps) {
  const results = await searchSiteContent(query);

  return (
    <Section variant="white">
      <Container>
        <div className={styles.resultsHeader}>
          <div>
            <h1>Search the academy</h1>
            <p>
              Courses, teachers, books, and articles can now be searched from a
              single page.
            </p>
          </div>

          <form action="/search" className={styles.searchForm}>
            <input
              name="q"
              defaultValue={query}
              placeholder="Search courses, teachers, books, blog..."
            />
            <Button type="submit">Search</Button>
          </form>
        </div>

        {!query ? (
          <div className={styles.emptyState}>
            <h2>Start with a keyword</h2>
            <p>
              Try terms like <strong>Tajweed</strong>, <strong>Hifz</strong>,
              <strong> Shaykh Abu Ibrahim</strong>, or <strong>daily adhkar</strong>.
            </p>
          </div>
        ) : results.length ? (
          <div className={styles.resultsGrid}>
            {results.map((result) => (
              <article key={result.id} className={styles.resultCard}>
                <div className={styles.resultTop}>
                  <span className={styles.resultType}>{result.type}</span>
                  <span className={styles.resultMeta}>{result.meta}</span>
                </div>
                <h2>{result.title}</h2>
                <p>{result.description}</p>
                <Link href={result.href} className={styles.inlineLink}>
                  Open result
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2>No results for &quot;{query}&quot;</h2>
            <p>
              Try a broader search term, or browse courses and teachers directly.
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}
