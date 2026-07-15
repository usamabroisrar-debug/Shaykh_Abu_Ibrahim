import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Badge,
  Button,
  Container,
  Section,
  SectionTitle,
} from "@/components/shared";
import { EnrollmentButton } from "@/components/lms/EnrollmentButton";
import {
  resolveLocalizedInlineText,
  resolveLocalizedLines,
  resolveLocalizedRichText,
} from "@/lib/content-localization";
import { auth } from "@/lib/auth";
import { getLocaleFromCookies } from "@/lib/locale";
import {
  getPublicCourseBySlug,
  getPublicCourses,
} from "@/services/course/course.service";
import { getCourseImagePath } from "@/utils/course-image";
import styles from "./CourseDetailPage.module.css";

type CourseDetailPageProps = {
  slug: string;
};

export async function CourseDetailPage({ slug }: CourseDetailPageProps) {
  const locale = getLocaleFromCookies(await cookies());
  const course = await getPublicCourseBySlug(slug);
  const session = await auth();

  if (!course) {
    notFound();
  }

  const relatedCourses = (await getPublicCourses())
    .filter((item) => item.featured)
    .filter((item) => item.slug !== course.slug)
    .slice(0, 3);
  const curriculum = resolveLocalizedLines(course.rawContent || course.curriculum.join("\n"), locale);
  const copy = {
    en: {
      back: "Back To Courses",
      instructor: "Instructor",
      outcomes: "Outcomes",
      curriculumEyebrow: "Curriculum",
      curriculumTitle: "What students will cover",
      curriculumDescription: "A step-by-step overview of the course structure and practical learning goals.",
      requirementsEyebrow: "Requirements",
      requirementsTitle: "Before enrollment",
      requirementsDescription: "Helpful expectations to make sure students begin with clarity and confidence.",
      relatedEyebrow: "Related Courses",
      relatedTitle: "Continue your learning journey",
      relatedDescription:
        "Explore other academy programs often chosen by students pursuing similar pathways.",
      relatedCta: "Explore course",
    },
    ur: {
      back: "کورسز پر واپس جائیں",
      instructor: "استاد",
      outcomes: "نتائج",
      curriculumEyebrow: "نصاب",
      curriculumTitle: "طلبہ کیا کچھ سیکھیں گے",
      curriculumDescription: "کورس کے ڈھانچے اور عملی تعلیمی اہداف کا مرحلہ وار جائزہ۔",
      requirementsEyebrow: "ضروریات",
      requirementsTitle: "داخلے سے پہلے",
      requirementsDescription: "ایسی بنیادی توقعات جو طلبہ کو وضاحت اور اعتماد کے ساتھ آغاز میں مدد دیں۔",
      relatedEyebrow: "متعلقہ کورسز",
      relatedTitle: "اپنا تعلیمی سفر جاری رکھیں",
      relatedDescription: "ایسے مزید اکیڈمی پروگرام دیکھیں جو ملتے جلتے تعلیمی راستوں کے طلبہ منتخب کرتے ہیں۔",
      relatedCta: "کورس دیکھیں",
    },
    ar: {
      back: "العودة إلى الدورات",
      instructor: "المعلم",
      outcomes: "النتائج",
      curriculumEyebrow: "المنهج",
      curriculumTitle: "ما الذي سيغطيه الطلاب",
      curriculumDescription: "نظرة خطوة بخطوة على هيكل الدورة وأهداف التعلم العملية.",
      requirementsEyebrow: "المتطلبات",
      requirementsTitle: "قبل التسجيل",
      requirementsDescription: "توقعات مفيدة لضمان أن يبدأ الطلاب بوضوح وثقة.",
      relatedEyebrow: "دورات ذات صلة",
      relatedTitle: "واصل رحلتك التعليمية",
      relatedDescription: "استكشف برامج أكاديمية أخرى يختارها غالبًا الطلاب ذوو المسارات المتشابهة.",
      relatedCta: "استكشف الدورة",
    },
  }[locale];

  return (
    <>
      <Section className={styles.hero}>
        <Container className={styles.heroGrid}>
          <div className={styles.copy}>
            <Badge variant="gold">
              {resolveLocalizedInlineText(course.category, locale) || course.category}
            </Badge>
            <h1>{resolveLocalizedInlineText(course.title, locale)}</h1>
            <p>{resolveLocalizedRichText(course.rawDescription || course.description, locale)}</p>
            <div className={styles.meta}>
              <span>{course.duration}</span>
              <span>
                {course.lessons} {locale === "ur" ? "اسباق" : locale === "ar" ? "دروس" : "lessons"}
              </span>
              <span>{course.language.split(/[^A-Za-z]+/).filter(Boolean).join(" / ")}</span>
              <span>
                {course.rating} {locale === "ur" ? "ریٹنگ" : locale === "ar" ? "تقييم" : "rating"}
              </span>
            </div>
            <div className={styles.actions}>
              <EnrollmentButton
                courseSlug={course.slug}
                isAuthenticated={Boolean(session?.user?.id)}
              />
              <Button href="/courses" variant="outline">
                {copy.back}
              </Button>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={`${styles.sidebarCard} ${styles.coverCard}`}>
              <Image
                src={getCourseImagePath(course.banner)}
                alt={resolveLocalizedInlineText(course.title, locale)}
                width={900}
                height={620}
                className={styles.coverImage}
              />
            </div>

            <div className={styles.sidebarCard}>
              <span className={styles.sidebarLabel}>{copy.instructor}</span>
              <strong>{course.teacher.name}</strong>
              <p>{course.teacher.designation}</p>
            </div>
            <div className={styles.sidebarCard}>
              <span className={styles.sidebarLabel}>{copy.outcomes}</span>
              <ul>
                {course.outcomes.map((item) => (
                  <li key={item}>{resolveLocalizedRichText(item, locale) || item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="white">
        <Container className={styles.contentGrid}>
          <div>
            <SectionTitle
              eyebrow={copy.curriculumEyebrow}
              title={copy.curriculumTitle}
              description={copy.curriculumDescription}
              align="left"
            />
            <div className={styles.listGrid}>
              {curriculum.map((item) => (
                <div key={item} className={styles.listItem}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle
              eyebrow={copy.requirementsEyebrow}
              title={copy.requirementsTitle}
              description={copy.requirementsDescription}
              align="left"
            />
            <div className={styles.requirements}>
              {course.requirements.map((item) => (
                <div key={item} className={styles.listItem}>
                  {resolveLocalizedRichText(item, locale) || item}
                </div>
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
            {relatedCourses.map((item) => (
              <div key={item.id} className={styles.relatedCard}>
                <Image
                  src={getCourseImagePath(item.thumbnail)}
                  alt={resolveLocalizedInlineText(item.title, locale)}
                  width={640}
                  height={380}
                  className={styles.relatedImage}
                />
                <h3>{resolveLocalizedInlineText(item.title, locale)}</h3>
                <p>{resolveLocalizedRichText(item.rawDescription || item.shortDescription, locale)}</p>
                <Link href={`/courses/${item.slug}`}>{copy.relatedCta}</Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
