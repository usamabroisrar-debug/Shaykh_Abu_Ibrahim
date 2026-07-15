import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Container, Section, SectionTitle } from "@/components/shared";
import {
  resolveLocalizedInlineText,
  resolveLocalizedParagraphs,
  resolveLocalizedRichText,
} from "@/lib/content-localization";
import { getLocaleFromCookies } from "@/lib/locale";
import {
  getPublishedBlogBySlug,
  getPublishedBlogs,
} from "@/services/blog/blog.service";
import styles from "./BlogDetailPage.module.css";

type BlogDetailPageProps = {
  slug: string;
};

export async function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const locale = getLocaleFromCookies(await cookies());
  const post = await getPublishedBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = (await getPublishedBlogs())
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);
  const paragraphs = resolveLocalizedParagraphs(post.content, locale);
  const copy = {
    en: {
      overviewEyebrow: "Article Overview",
      overviewTitle: "Why this topic matters",
      overviewDescription:
        "These academy blog entries are built to extend useful learning beyond the classroom.",
      relatedEyebrow: "Related Posts",
      relatedTitle: "Continue reading",
      relatedDescription: "Explore more articles built around practical and reflective study.",
      readMore: "Read article",
    },
    ur: {
      overviewEyebrow: "مضمون کا خلاصہ",
      overviewTitle: "یہ موضوع کیوں اہم ہے",
      overviewDescription: "اکیڈمی کے یہ مضامین کلاس روم سے باہر بھی مفید سیکھنے کو آگے بڑھانے کے لیے تیار کیے گئے ہیں۔",
      relatedEyebrow: "متعلقہ مضامین",
      relatedTitle: "مطالعہ جاری رکھیں",
      relatedDescription: "عملی اور فکری مطالعے پر مبنی مزید مضامین دیکھیں۔",
      readMore: "مضمون پڑھیں",
    },
    ar: {
      overviewEyebrow: "نظرة على المقال",
      overviewTitle: "لماذا يهم هذا الموضوع",
      overviewDescription: "صُممت مقالات الأكاديمية هذه لتمديد التعلم النافع إلى ما بعد وقت الحصة.",
      relatedEyebrow: "مقالات ذات صلة",
      relatedTitle: "واصل القراءة",
      relatedDescription: "استكشف المزيد من المقالات المبنية على الدراسة العملية والتأملية.",
      readMore: "اقرأ المقال",
    },
  }[locale];

  return (
    <>
      <Section className={styles.hero}>
        <Container className={styles.heroInner}>
          <Badge variant="gold">
            {resolveLocalizedInlineText(post.category, locale) || post.category}
          </Badge>
          <h1>{resolveLocalizedInlineText(post.title, locale)}</h1>
          <p>{resolveLocalizedRichText(post.excerpt, locale)}</p>
          <div className={styles.meta}>
            <span>{post.author}</span>
            <span>{post.readingTime}</span>
            <span>{post.publishedAt}</span>
          </div>
        </Container>
      </Section>

      <Section variant="white">
        <Container className={styles.content}>
          <SectionTitle
            eyebrow={copy.overviewEyebrow}
            title={copy.overviewTitle}
            description={copy.overviewDescription}
            align="left"
          />
          <div className={styles.bodyCard}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
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
            {relatedPosts.map((item) => (
              <div key={item.id} className={styles.relatedCard}>
                <h3>{resolveLocalizedInlineText(item.title, locale)}</h3>
                <p>{resolveLocalizedRichText(item.excerpt, locale)}</p>
                <Link href={`/blog/${item.slug}`}>{copy.readMore}</Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
