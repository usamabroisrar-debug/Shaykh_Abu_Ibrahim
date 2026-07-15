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
        "This material is intended to support structured learning, not sit passively in a library archive.",
      classroomAlignment: "Classroom alignment",
      classroomText:
        "The academy library is being shaped to connect directly with teaching pathways and revision goals.",
      relatedEyebrow: "More Resources",
      relatedTitle: "Explore related books",
      relatedDescription: "Continue browsing materials that complement the wider academy experience.",
      relatedCta: "View details",
    },
    ur: {
      valueEyebrow: "مطالعہ کی اہمیت",
      valueTitle: "یہ وسیلہ تعلیمی سفر میں کیسے مدد دیتا ہے",
      valueDescription: "لائبریری کے وسائل لائیو کلاسز، ریویژن عادات، اور عملی فہم کو مضبوط کرنے کے لیے منتخب کیے جاتے ہیں۔",
      practicalUse: "عملی استعمال",
      practicalText: "یہ مواد منظم تعلیم کی مدد کے لیے ہے، صرف لائبریری میں رکھے رہنے کے لیے نہیں۔",
      classroomAlignment: "کلاس روم مطابقت",
      classroomText: "اکیڈمی لائبریری کو تدریسی راستوں اور ریویژن مقاصد سے براہ راست جوڑا جا رہا ہے۔",
      relatedEyebrow: "مزید وسائل",
      relatedTitle: "متعلقہ کتب دیکھیں",
      relatedDescription: "ایسے مزید مواد دیکھیں جو اکیڈمی کے مجموعی تعلیمی تجربے کو مکمل کرتے ہیں۔",
      relatedCta: "تفصیل دیکھیں",
    },
    ar: {
      valueEyebrow: "قيمة دراسية",
      valueTitle: "كيف يدعم هذا المورد رحلة التعلم",
      valueDescription: "تُختار موارد المكتبة لتعزيز الدروس المباشرة وعادات المراجعة والفهم العملي.",
      practicalUse: "استخدام عملي",
      practicalText: "تهدف هذه المادة إلى دعم التعلم المنظم، لا أن تبقى ساكنة في أرشيف المكتبة.",
      classroomAlignment: "الارتباط بالفصل",
      classroomText: "تُبنى مكتبة الأكاديمية لتتصل مباشرة بمسارات التدريس وأهداف المراجعة.",
      relatedEyebrow: "موارد إضافية",
      relatedTitle: "استكشف كتبًا ذات صلة",
      relatedDescription: "واصل تصفح المواد التي تكمل التجربة الأكاديمية الأوسع.",
      relatedCta: "عرض التفاصيل",
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
          </div>

          <div className={styles.panel}>
            <strong>{resolveLocalizedInlineText(book.format, locale)}</strong>
            <span>
              {book.pages} {locale === "ur" ? "صفحات" : locale === "ar" ? "صفحة" : "pages"}
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
