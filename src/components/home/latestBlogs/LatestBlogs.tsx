import { cookies } from "next/headers";
import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import { getPublishedBlogs } from "@/services/blog/blog.service";
import { BlogCard } from "./BlogCard";
import styles from "./LatestBlogs.module.css";

export async function LatestBlogs() {
  const locale = getLocaleFromCookies(await cookies());
  const content = {
    en: {
      eyebrow: "Latest Insights",
      title: "Writing that supports the learning journey beyond class time",
      description:
        "Short, useful, and carefully framed resources for students, parents, and anyone building a serious study routine.",
      cta: "Browse Articles",
    },
    ur: {
      eyebrow: "تازہ رہنمائی",
      title: "ایسی تحریریں جو کلاس کے بعد بھی تعلیمی سفر کو سہارا دیتی ہیں",
      description:
        "طلبہ، والدین، اور سنجیدہ مطالعہ معمول بنانے والوں کے لیے مختصر، مفید، اور احتیاط سے تیار کردہ وسائل۔",
      cta: "مضامین دیکھیں",
    },
    ar: {
      eyebrow: "أحدث الفوائد",
      title: "كتابات تدعم رحلة التعلم خارج وقت الحصة",
      description:
        "موارد قصيرة ومفيدة ومصاغة بعناية للطلاب وأولياء الأمور وكل من يبني روتين دراسة جاداً.",
      cta: "تصفح المقالات",
    },
  }[locale];
  const blogs = await getPublishedBlogs(3);

  return (
    <Section className={styles.section}>
      <Container>
        <div className={styles.header}>
          <SectionTitle
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
            align="left"
          />
          <Button href="/blog" variant="ghost">
            {content.cta}
          </Button>
        </div>

        <div className={styles.grid}>
          {blogs.map((post) => (
            <BlogCard key={post.id} post={post} locale={locale} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
