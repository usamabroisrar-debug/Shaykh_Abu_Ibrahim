import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Container, Section, SectionTitle } from "@/components/shared";
import { resolveLocalizedInlineText, resolveLocalizedRichText } from "@/lib/content-localization";
import { getLocaleFromCookies } from "@/lib/locale";
import { getPublicBookBySlug, getPublicBooks } from "@/services/book/book.service";
import styles from "./BookDetailPage.module.css";

type BookDetailPageProps = {
  slug: string;
};

export async function BookDetailPage({ slug }: BookDetailPageProps) {
  const locale = getLocaleFromCookies(await cookies());
  const book = await getPublicBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const relatedBooks = (await getPublicBooks())
    .filter((item) => item.slug !== book.slug)
    .slice(0, 3);

  const copy = {
    en: {
      valueEyebrow: "Study Value",
      valueTitle: "How this resource supports the learning journey",
      valueDescription:
        "Library resources are selected to reinforce live classes, revision habits, and practical understanding.",
      practicalUse: "Practical use",
      practicalText:
        "This material supports structured learning and can be used alongside live classes or revision routines.",
      classroomAlignment: "Classroom alignment",
      classroomText:
        "The academy library connects directly with teaching pathways, student practice, and guided review.",
      download: "Open Book",
      relatedEyebrow: "More Resources",
      relatedTitle: "Explore related books",
      relatedDescription: "Continue browsing materials that complement the wider academy experience.",
      relatedCta: "View details",
      pages: "pages",
    },
    ur: {
      valueEyebrow: "مطالعہ کی اہمیت",
      valueTitle: "یہ وسیلہ تعلیمی سفر میں کیسے مدد دیتا ہے",
      valueDescription:
        "لائبریری وسائل live classes، دہرائی، اور عملی سمجھ کو مضبوط کرنے کے لیے منتخب کیے جاتے ہیں۔",
      practicalUse: "عملی استعمال",
      practicalText:
        "یہ مواد منظم تعلیم، live classes، اور revision routine کے ساتھ استعمال کے لیے ہے۔",
      classroomAlignment: "کلاس سے مطابقت",
      classroomText:
        "اکیڈمی لائبریری تدریسی راستوں، طلبہ کی مشق، اور رہنمائی کے ساتھ دہرائی سے جڑی ہوئی ہے۔",
      download: "کتاب کھولیں",
      relatedEyebrow: "مزید وسائل",
      relatedTitle: "متعلقہ کتب دیکھیں",
      relatedDescription: "ایسا مزید مواد دیکھیں جو اکیڈمی کے مجموعی تعلیمی تجربے کو مکمل کرتا ہے۔",
      relatedCta: "تفصیل دیکھیں",
      pages: "صفحات",
    },
    ar: {
      valueEyebrow: "قيمة دراسية",
      valueTitle: "كيف يدعم هذا المورد رحلة التعلم",
      valueDescription:
        "تختار الأكاديمية موارد المكتبة لتعزيز الدروس المباشرة والمراجعة والفهم العملي.",
      practicalUse: "استخدام عملي",
      practicalText:
        "هذه المادة تدعم التعلم المنظم ويمكن استخدامها مع الدروس المباشرة وروتين المراجعة.",
      classroomAlignment: "ارتباط بالفصل",
      classroomText:
        "ترتبط مكتبة الأكاديمية بمسارات التدريس وتدريب الطلاب والمراجعة الموجهة.",
      download: "فتح الكتاب",
      relatedEyebrow: "موارد إضافية",
      relatedTitle: "استكشف كتبًا ذات صلة",
      relatedDescription: "واصل تصفح المواد التي تكمل تجربة الأكاديمية.",
      relatedCta: "عرض التفاصيل",
      pages: "صفحة",
    },
  }[locale];

  return (
    <>
      <Section className={styles.hero}>
        <Container className={styles.heroGrid}>
          <div>
            <Badge variant="gold">
              {resolveLocalizedInlineText(book.category, locale) || book.category}
            </Badge>
            <h1>{resolveLocalizedInlineText(book.title, locale)}</h1>
            <p>{resolveLocalizedRichText(book.summary, locale)}</p>
            {book.fileUrl ? (
              <a
                href={book.fileUrl}
                className={styles.downloadButton}
                target="_blank"
                rel="noreferrer"
              >
                {copy.download}
              </a>
            ) : null}
          </div>

          <div className={styles.panel}>
            {book.coverUrl ? (
              <span
                className={styles.cover}
                style={{ backgroundImage: `url(${book.coverUrl})` }}
                aria-hidden="true"
              />
            ) : null}
            <strong>{resolveLocalizedInlineText(book.format, locale)}</strong>
            <span>
              {book.pages} {copy.pages}
            </span>
            <p>{resolveLocalizedRichText(book.featuredNote, locale)}</p>
          </div>
        </Container>
      </Section>

      <Section variant="white">
        <Container>
          <SectionTitle
            eyebrow={copy.valueEyebrow}
            title={copy.valueTitle}
            description={copy.valueDescription}
          />
          <div className={styles.featureBlock}>
            <div className={styles.featureCard}>
              <h3>{copy.practicalUse}</h3>
              <p>{copy.practicalText}</p>
            </div>
            <div className={styles.featureCard}>
              <h3>{copy.classroomAlignment}</h3>
              <p>{copy.classroomText}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle
            eyebrow={copy.relatedEyebrow}
            title={copy.relatedTitle}
            description={copy.relatedDescription}
          />
          <div className={styles.relatedGrid}>
            {relatedBooks.map((item) => (
              <div key={item.id} className={styles.relatedCard}>
                <h3>{resolveLocalizedInlineText(item.title, locale)}</h3>
                <p>{resolveLocalizedRichText(item.summary, locale)}</p>
                <Link href={`/books/${item.slug}`}>{copy.relatedCta}</Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
