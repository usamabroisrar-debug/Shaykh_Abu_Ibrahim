import { cookies } from "next/headers";
import { Button, Container, Section, SectionTitle } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import { getPublicTeachers } from "@/services/teacher/teacher.service";
import { TeacherCard } from "./TeacherCard";
import styles from "./Teachers.module.css";

const copy = {
  en: {
    eyebrow: "Our Teachers",
    title: "Meet teachers who combine scholarship, patience, and online teaching clarity",
    description:
      "Students learn better when the teacher is not only qualified, but calm, encouraging, and consistent in delivery.",
    points: ["Qualified Quran guidance", "Student-friendly teaching", "Flexible one-to-one classes"],
    cta: "Meet The Faculty",
  },
  ur: {
    eyebrow: "ہمارے اساتذہ",
    title: "ایسے اساتذہ سے ملیں جو علم، صبر، اور واضح آن لائن تدریس کو یکجا کرتے ہیں",
    description:
      "طلبہ بہتر اس وقت سیکھتے ہیں جب استاد صرف ماہر ہی نہیں بلکہ پُرسکون، حوصلہ افزا، اور مستقل مزاج بھی ہو۔",
    points: ["ماہر قرآنی رہنمائی", "طالب علم دوست تدریس", "لچکدار ون ٹو ون کلاسز"],
    cta: "اساتذہ سے ملیں",
  },
  ar: {
    eyebrow: "معلمونا",
    title: "تعرّف على معلمين يجمعون بين العلم والصبر ووضوح التعليم عبر الإنترنت",
    description:
      "يتعلم الطلاب بصورة أفضل عندما يكون المعلم مؤهلاً وهادئاً ومشجعاً وثابتاً في أسلوبه.",
    points: ["إرشاد قرآني مؤهل", "تدريس مناسب للطلاب", "دروس فردية مرنة"],
    cta: "تعرّف على الهيئة التعليمية",
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
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} locale={locale} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
