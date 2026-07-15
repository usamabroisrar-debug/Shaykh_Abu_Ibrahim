import { cookies } from "next/headers";
import Link from "next/link";
import { Card, Container, Section } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { resolveLocalizedInlineText, resolveLocalizedRichText } from "@/lib/content-localization";
import { getLocaleFromCookies } from "@/lib/locale";
import { getPublishedBlogs } from "@/services/blog/blog.service";
import styles from "./BlogPage.module.css";

export async function BlogPage() {
  const locale = getLocaleFromCookies(await cookies());
  const blogs = await getPublishedBlogs();
  const copy = {
    en: {
      eyebrow: "Blog",
      title: "Short, thoughtful articles supporting students, parents, and everyday Islamic growth",
      description:
        "Read practical reflections and academy insights on Quran study, Tajweed, Hifz routines, and building steadier learning habits.",
      cta: "Read Article",
    },
    ur: {
      eyebrow: "بلاگ",
      title: "مختصر اور بافکر مضامین جو طلبہ، والدین، اور روزمرہ اسلامی ترقی میں مدد دیں",
      description:
        "قرآن، تجوید، حفظ روٹین، اور زیادہ مستقل تعلیمی عادات کے بارے میں عملی رہنمائی اور اکیڈمی کی بصیرتیں پڑھیں۔",
      cta: "مضمون پڑھیں",
    },
    ar: {
      eyebrow: "المدونة",
      title: "مقالات قصيرة وعميقة تدعم الطلاب وأولياء الأمور والنمو الإسلامي اليومي",
      description:
        "اقرأ تأملات عملية ورؤى أكاديمية حول دراسة القرآن والتجويد وروتين الحفظ وبناء عادات تعلم أكثر ثباتًا.",
      cta: "اقرأ المقال",
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
          {blogs.map((post) => (
            <Card key={post.id} className={styles.card}>
              <span className={styles.category}>
                {resolveLocalizedInlineText(post.category, locale) || post.category}
              </span>
              <h2>{resolveLocalizedInlineText(post.title, locale)}</h2>
              <p>{resolveLocalizedRichText(post.excerpt, locale)}</p>
              <div className={styles.meta}>
                <span>{post.author}</span>
                <span>{post.readingTime}</span>
                <span>{post.publishedAt}</span>
              </div>
              <Link href={`/blog/${post.slug}`} className={styles.link}>
                {copy.cta}
              </Link>
            </Card>
          ))}
        </Container>
      </Section>
    </>
  );
}
