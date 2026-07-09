import { cookies } from "next/headers";
import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import { getPublicBooks } from "@/services/book/book.service";
import styles from "./BooksSection.module.css";

export async function BooksSection() {
  const locale = getLocaleFromCookies(await cookies());
  const content = {
    en: {
      eyebrow: "Digital Library",
      title: "Curated books and study companions for students who want more depth",
      description:
        "The academy library is being designed around guided reading, revision support, and practical references that connect directly with live courses.",
      cta: "Explore Library",
      pages: "pages",
    },
    ur: {
      eyebrow: "ڈیجیٹل لائبریری",
      title: "زیادہ گہرائی چاہنے والے طلبہ کے لیے منتخب کتب اور مطالعہ معاون وسائل",
      description:
        "اکیڈمی لائبریری کو رہنمائی والے مطالعے، ریویژن سپورٹ، اور ایسے عملی حوالہ جات کے گرد ترتیب دیا جا رہا ہے جو براہِ راست لائیو کورسز سے جڑتے ہیں۔",
      cta: "لائبریری دیکھیں",
      pages: "صفحات",
    },
    ar: {
      eyebrow: "المكتبة الرقمية",
      title: "كتب مختارة ورفقاء دراسة للطلاب الذين يريدون عمقاً أكبر",
      description:
        "تُصمم مكتبة الأكاديمية حول القراءة الموجّهة ودعم المراجعة والمراجع العملية المرتبطة مباشرة بالدورات المباشرة.",
      cta: "استكشف المكتبة",
      pages: "صفحة",
    },
  }[locale];
  const books = await getPublicBooks(4);

  return (
    <Section variant="white" className={styles.section}>
      <Container>
        <div className={styles.header}>
          <SectionTitle
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
            align="left"
          />
          <Button href="/books" variant="outline">
            {content.cta}
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
                <span>{book.pages} {content.pages}</span>
              </div>
              <small>{book.featuredNote}</small>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
