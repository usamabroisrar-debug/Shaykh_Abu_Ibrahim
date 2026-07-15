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
      cta: "View Book Details",
    },
    ur: {
      eyebrow: "کتب",
      title: "اکیڈمی طلبہ کے لیے رہنمائی پر مبنی مطالعہ وسائل اور معاون کتابیں",
      description:
        "عملی حوالہ جات، ورک بکس، اور معاون تعلیمی مواد پر مشتمل اکیڈمی کی ڈیجیٹل لائبریری دیکھیں۔",
      cta: "کتاب کی تفصیل دیکھیں",
    },
    ar: {
      eyebrow: "الكتب",
      title: "موارد قراءة موجهة ورفقاء دراسة لطلاب الأكاديمية",
      description:
        "تصفح مكتبة الأكاديمية الرقمية المتنامية من المراجع العملية ودفاتر العمل والمواد المساندة.",
      cta: "عرض تفاصيل الكتاب",
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
              <span className={styles.category}>
                {resolveLocalizedInlineText(book.category, locale) || book.category}
              </span>
              <h2>{resolveLocalizedInlineText(book.title, locale)}</h2>
              <p>{resolveLocalizedRichText(book.summary, locale)}</p>
              <div className={styles.meta}>
                <span>{resolveLocalizedInlineText(book.format, locale)}</span>
                <span>
                  {book.pages} {locale === "ur" ? "صفحات" : locale === "ar" ? "صفحة" : "pages"}
                </span>
              </div>
              <Link href={`/books/${book.slug}`} className={styles.link}>
                {copy.cta}
              </Link>
            </Card>
          ))}
        </Container>
      </Section>
    </>
  );
}
