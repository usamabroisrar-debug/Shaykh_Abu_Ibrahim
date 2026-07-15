import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import { getPublicTeacherBySlug, getPublicTeachers } from "@/services/teacher/teacher.service";
import styles from "./TeacherDetailPage.module.css";

type TeacherDetailPageProps = {
  slug: string;
};

export async function TeacherDetailPage({ slug }: TeacherDetailPageProps) {
  const locale = getLocaleFromCookies(await cookies());
  const [teacher, teachers] = await Promise.all([
    getPublicTeacherBySlug(slug),
    getPublicTeachers(),
  ]);

  if (!teacher) {
    notFound();
  }

  const relatedTeachers = teachers.filter((item) => item.slug !== teacher.slug);
  const copy = {
    en: {
      experience: "Teaching experience",
      students: "Students served",
      programs: "Programs led",
      focusEyebrow: "Teaching Focus",
      focusTitle: "What this teacher brings to the academy",
      focusDescription: "Each instructor contributes a different strength to the student journey.",
      languagesEyebrow: "Languages",
      languagesTitle: "Teaching access",
      languagesDescription:
        "Language support helps students and families feel more comfortable and connected.",
      facultyEyebrow: "Faculty",
      facultyTitle: "Meet more teachers",
      facultyDescription: "Explore other instructors supporting the broader academy experience.",
      profileCta: "View profile",
    },
    ur: {
      experience: "تدریسی تجربہ",
      students: "جن طلبہ کی رہنمائی کی",
      programs: "پروگرامز",
      focusEyebrow: "تدریسی توجہ",
      focusTitle: "یہ استاد اکیڈمی میں کیا خاص لاتا ہے",
      focusDescription: "ہر استاد طلبہ کے سفر میں الگ قوت شامل کرتا ہے۔",
      languagesEyebrow: "زبانیں",
      languagesTitle: "تعلیمی رسائی",
      languagesDescription: "زبان کی سہولت طلبہ اور خاندانوں کو زیادہ آرام دہ اور مربوط محسوس کراتی ہے۔",
      facultyEyebrow: "فیکلٹی",
      facultyTitle: "مزید اساتذہ سے ملیں",
      facultyDescription: "ایسے دیگر اساتذہ دیکھیں جو اکیڈمی کے وسیع تعلیمی تجربے کو مضبوط کرتے ہیں۔",
      profileCta: "پروفائل دیکھیں",
    },
    ar: {
      experience: "الخبرة التعليمية",
      students: "الطلاب الذين خدمهم",
      programs: "البرامج التي يقودها",
      focusEyebrow: "التركيز التعليمي",
      focusTitle: "ما الذي يقدمه هذا المعلم للأكاديمية",
      focusDescription: "يسهم كل معلم بقوة مختلفة في رحلة الطالب.",
      languagesEyebrow: "اللغات",
      languagesTitle: "إتاحة التدريس",
      languagesDescription: "يساعد دعم اللغة الطلاب والأسر على الشعور براحة وارتباط أكبر.",
      facultyEyebrow: "الهيئة التعليمية",
      facultyTitle: "تعرّف على مزيد من المعلمين",
      facultyDescription: "استكشف معلمين آخرين يدعمون التجربة الأكاديمية الأوسع.",
      profileCta: "عرض الملف",
    },
  }[locale];

  return (
    <>
      <Section className={styles.hero}>
        <Container className={styles.heroGrid}>
          <div>
            <Badge variant="gold">{teacher.specialty}</Badge>
            <h1>{teacher.name}</h1>
            <p className={styles.designation}>{teacher.designation}</p>
            <p className={styles.summary}>{teacher.summary}</p>
          </div>

          <div className={styles.panel}>
            <div>
              <strong>{teacher.students}+</strong>
              <span>{copy.students}</span>
            </div>
            <div>
              <strong>{teacher.courses}</strong>
              <span>{copy.programs}</span>
            </div>
            <div>
              <strong>{teacher.headline}</strong>
              <span>{copy.experience}</span>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="white">
        <Container className={styles.content}>
          <div>
            <SectionTitle
              eyebrow={copy.focusEyebrow}
              title={copy.focusTitle}
              description={copy.focusDescription}
              align="left"
            />
            <div className={styles.tagGrid}>
              {teacher.badges.map((badge) => (
                <span key={badge} className={styles.tag}>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle
              eyebrow={copy.languagesEyebrow}
              title={copy.languagesTitle}
              description={copy.languagesDescription}
              align="left"
            />
            <div className={styles.tagGrid}>
              {teacher.languages.map((language) => (
                <span key={language} className={styles.tag}>
                  {language}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle
            eyebrow={copy.facultyEyebrow}
            title={copy.facultyTitle}
            description={copy.facultyDescription}
          />
          <div className={styles.relatedGrid}>
            {relatedTeachers.map((item) => (
              <div key={item.id} className={styles.relatedCard}>
                <h3>{item.name}</h3>
                <p>{item.designation}</p>
                <Link href={`/teachers/${item.slug}`}>{copy.profileCta}</Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
