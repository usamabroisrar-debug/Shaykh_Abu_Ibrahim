import { cookies } from "next/headers";
import Link from "next/link";
import { Card, Container, Section } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { resolveLocalizedInlineText, resolveLocalizedRichText } from "@/lib/content-localization";
import { getLocaleFromCookies } from "@/lib/locale";
import { getPublicBooks } from "@/services/book/book.service";
import styles from "./BooksPage.module.css";

export async function BooksPage() {
  const locale = getLocaleFromCookies(await cookies());
  const books = await getPublicBooks();
  const copy = {
    en: {
      eyebrow: "Books",
      title: "Guided reading resources and study companions for academy students",
      description:
        "Browse the academy's developing digital library of practical references, workbooks, and supporting materials.",
      cta: "Preview",
      download: "Download",
      pages: "pages",
    },
    ur: {
      eyebrow: "کتب",
      title: "اکیڈمی طلبہ کے لیے رہنمائی پر مبنی مطالعہ وسائل",
      description:
        "عملی حوالہ جات، ورک بکس، اور معاون تعلیمی مواد پر مشتمل اکیڈمی کی ڈیجیٹل لائبریری دیکھیں۔",
      cta: "پری ویو",
      download: "ڈاؤن لوڈ",
      pages: "صفحات",
    },
    ar: {
      eyebrow: "الكتب",
      title: "موارد قراءة موجهة لطلاب الأكاديمية",
      description:
        "تصفح مكتبة الأكاديمية الرقمية من المراجع العملية ودفاتر العمل والمواد المساندة.",
      cta: "معاينة",
      download: "تنزيل",
      pages: "صفحة",
    },
  }[locale];

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <Section variant="white">
        <Container className={styles.grid}>
          {books.map((book) => (
            <Card key={book.id} className={styles.card}>
              <div className={styles.content}>
                <span className={styles.category}>
                  {resolveLocalizedInlineText(book.category, locale) || book.category}
                </span>
                <h2>{resolveLocalizedInlineText(book.title, locale)}</h2>
                <p>{resolveLocalizedRichText(book.summary, locale)}</p>
                <div className={styles.meta}>
                  <span>{resolveLocalizedInlineText(book.format, locale)}</span>
                  <span>
                    {book.pages} {copy.pages}
                  </span>
                </div>
                <div className={styles.actions}>
                  {book.fileUrl ? (
                    <a
                      href={book.fileUrl}
                      className={styles.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {copy.cta}
                    </a>
                  ) : (
                    <Link href={`/books/${book.slug}`} className={styles.link}>
                      {copy.cta}
                    </Link>
                  )}
                  {book.fileUrl ? (
                    <a href={book.fileUrl} className={styles.downloadLink} download>
                      {copy.download}
                    </a>
                  ) : null}
                </div>
              </div>

              {book.coverUrl ? (
                <span
                  className={styles.cover}
                  style={{ backgroundImage: `url(${book.coverUrl})` }}
                  aria-hidden="true"
                />
              ) : null}
            </Card>
          ))}
        </Container>
      </Section>
    </>
  );
}
