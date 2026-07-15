import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Badge, Card, Container, Section } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { resolveLocalizedInlineText, resolveLocalizedRichText } from "@/lib/content-localization";
import { getLocaleFromCookies } from "@/lib/locale";
import { getPublicCourses } from "@/services/course/course.service";
import { getCourseImagePath } from "@/utils/course-image";
import styles from "./CoursesPage.module.css";

export async function CoursesPage() {
  const locale = getLocaleFromCookies(await cookies());
  const courses = await getPublicCourses();
  const copy = {
    en: {
      eyebrow: "Courses",
      title: "Structured programs for Quran recitation, memorization, understanding, and Islamic growth",
      description:
        "Browse the academy's signature learning tracks designed for beginners, families, and committed students seeking depth with consistent guidance.",
      primaryCta: "Apply For Admission",
      detailsCta: "View Course Details",
    },
    ur: {
      eyebrow: "کورسز",
      title: "قرآن قرأت، حفظ، فہم، اور اسلامی ترقی کے لیے منظم پروگرام",
      description:
        "ابتدائی طلبہ، خاندانوں، اور سنجیدہ طلبہ کے لیے تیار کردہ اکیڈمی کے نمایاں تعلیمی راستے دیکھیں۔",
      primaryCta: "داخلے کے لیے اپلائی کریں",
      detailsCta: "کورس کی تفصیل دیکھیں",
    },
    ar: {
      eyebrow: "الدورات",
      title: "برامج منظمة لتلاوة القرآن والحفظ والفهم والنمو الإسلامي",
      description:
        "تصفح المسارات التعليمية المميزة في الأكاديمية والمصممة للمبتدئين والعائلات والطلاب الجادين الباحثين عن العمق مع التوجيه المستمر.",
      primaryCta: "قدّم للقبول",
      detailsCta: "عرض تفاصيل الدورة",
    },
  }[locale];

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        primaryCta={{ label: copy.primaryCta, href: "/admission" }}
      />

      <Section variant="white">
        <Container>
          <div className={styles.grid}>
            {courses.map((course) => (
              <Card key={course.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image
                    src={getCourseImagePath(course.image)}
                    alt={resolveLocalizedInlineText(course.title, locale)}
                    width={860}
                    height={520}
                    className={styles.image}
                  />
                </div>
                <div className={styles.topRow}>
                  <Badge variant="green">
                    {resolveLocalizedInlineText(course.category, locale) || course.category}
                  </Badge>
                  <span className={styles.level}>
                    {resolveLocalizedInlineText(course.level, locale) || course.level}
                  </span>
                </div>
                <h2>{resolveLocalizedInlineText(course.title, locale)}</h2>
                <p className={styles.description}>
                  {resolveLocalizedRichText(course.rawDescription || course.description, locale)}
                </p>
                <div className={styles.meta}>
                  <span>{course.duration}</span>
                  <span>
                    {course.lessons} {locale === "ur" ? "اسباق" : locale === "ar" ? "دروس" : "lessons"}
                  </span>
                  <span>
                    {course.students}+ {locale === "ur" ? "طلبہ" : locale === "ar" ? "طلاب" : "students"}
                  </span>
                </div>
                <Link href={`/courses/${course.slug}`} className={styles.link}>
                  {copy.detailsCta}
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
