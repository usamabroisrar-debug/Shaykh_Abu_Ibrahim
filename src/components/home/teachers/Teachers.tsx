import { cookies } from "next/headers";
import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import { getPublicTeachers } from "@/services/teacher/teacher.service";
import { TeacherCard } from "./TeacherCard";
import styles from "./Teachers.module.css";

const copy = {
  en: {
    eyebrow: "Our Teachers",
    title: "Learn with Shaykh Abu Ibrahim and a guided teaching team",
    description:
      "The academy focuses on patient instruction, correct recitation, and a learning rhythm families can trust.",
    points: ["Quran-first guidance", "Student-friendly teaching", "Flexible one-to-one classes"],
    cta: "Meet The Faculty",
  },
  ur: {
    eyebrow: "ہمارے اساتذہ",
    title: "Shaykh Abu Ibrahim اور رہنمائی کرنے والی تدریسی ٹیم سے سیکھیں",
    description:
      "اکیڈمی صبر، درست قراءت، اور ایسے تعلیمی معمول پر توجہ دیتی ہے جس پر خاندان اعتماد کر سکیں۔",
    points: ["قرآن پر مبنی رہنمائی", "طالب علم دوست تدریس", "لچکدار ون ٹو ون کلاسز"],
    cta: "اساتذہ سے ملیں",
  },
  ar: {
    eyebrow: "معلمونا",
    title: "تعلم مع Shaykh Abu Ibrahim وفريق تعليمي موجه",
    description:
      "تركز الأكاديمية على التعليم الهادئ والتلاوة الصحيحة وإيقاع تعلم تثق به العائلات.",
    points: ["توجيه قرآني أولا", "تعليم مناسب للطلاب", "دروس فردية مرنة"],
    cta: "تعرف على المعلمين",
  },
} as const;

export async function Teachers() {
  const locale = getLocaleFromCookies(await cookies());
  const content = copy[locale];
  const teachers = await getPublicTeachers();

  return (
    <Section variant="white" className={styles.section}>
      <Container>
        <div className={styles.header}>
          <div className={styles.copy}>
            <SectionTitle
              eyebrow={content.eyebrow}
              title={content.title}
              description={content.description}
              align="left"
            />
            <div className={styles.points}>
              {content.points.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <Button href="/teachers" variant="outline">
            {content.cta}
          </Button>
        </div>

        <div className={styles.grid}>
          {teachers.slice(0, 3).map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} locale={locale} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
