import { cookies } from "next/headers";
import Link from "next/link";
import { Card, Container, Section } from "@/components/shared";
import { PageHero } from "@/components/public/PageHero/PageHero";
import { getLocaleFromCookies } from "@/lib/locale";
import { getPublicTeachers } from "@/services/teacher/teacher.service";
import styles from "./TeachersPage.module.css";

export async function TeachersPage() {
  const locale = getLocaleFromCookies(await cookies());
  const teachers = await getPublicTeachers();
  const copy = {
    en: {
      eyebrow: "Teachers",
      title: "Meet the faculty guiding students with scholarship, care, and consistency",
      description:
        "Our teachers support learners across Quran reading, memorization, tafseer, hadith, fiqh, and Arabic-focused study paths.",
      students: "students",
      cta: "View teacher profile",
    },
    ur: {
      eyebrow: "اساتذہ",
      title: "ان اساتذہ سے ملیں جو طلبہ کی علمی رہنمائی، توجہ، اور مستقل مزاجی کے ساتھ مدد کرتے ہیں",
      description:
        "ہمارے اساتذہ قرآن خوانی، حفظ، تفسیر، حدیث، فقہ، اور عربی مرکوز تعلیمی راستوں میں طلبہ کی رہنمائی کرتے ہیں۔",
      students: "طلبہ",
      cta: "استاد کا پروفائل دیکھیں",
    },
    ar: {
      eyebrow: "المعلمون",
      title: "تعرّف على الهيئة التعليمية التي ترشد الطلاب بعلم ورعاية وثبات",
      description:
        "يدعم معلمونا المتعلمين في تلاوة القرآن والحفظ والتفسير والحديث والفقه والمسارات الدراسية المرتكزة على العربية.",
      students: "طلاب",
      cta: "عرض ملف المعلم",
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
          {teachers.map((teacher) => (
            <Card key={teacher.id} className={styles.card}>
              <span className={styles.specialty}>{teacher.specialty}</span>
              <h2>{teacher.name}</h2>
              <p className={styles.designation}>{teacher.designation}</p>
              <p className={styles.summary}>{teacher.summary}</p>
              <div className={styles.meta}>
                <span>{teacher.specialty}</span>
                <span>{teacher.students}+ {copy.students}</span>
                <span>{teacher.languages.join(" / ")}</span>
              </div>
              <Link href={`/teachers/${teacher.slug}`} className={styles.link}>
                {copy.cta}
              </Link>
            </Card>
          ))}
        </Container>
      </Section>
    </>
  );
}
