import { BookOpenText, Languages, Users } from "lucide-react";
import type { SiteLocale } from "@/lib/locale";
import type { PublicTeacher } from "@/services/teacher/teacher.service";
import styles from "./TeacherCard.module.css";

type TeacherCardProps = {
  teacher: PublicTeacher;
  locale: SiteLocale;
};

export function TeacherCard({ teacher, locale }: TeacherCardProps) {
  const labels = {
    en: { students: "students", courses: "courses" },
    ur: { students: "طلبہ", courses: "کورسز" },
    ar: { students: "طلاب", courses: "دورات" },
  }[locale];
  const initials = teacher.name
    .split(" ")
    .map((segment) => segment[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className={styles.card}>
      <div className={styles.avatar}>{initials}</div>

      <span className={styles.specialty}>{teacher.specialty}</span>
      <h3>{teacher.name}</h3>
      <p className={styles.designation}>{teacher.designation}</p>
      <p className={styles.summary}>{teacher.summary}</p>

      <div className={styles.meta}>
        <span>
          <Users size={15} />
          {teacher.students}+ {labels.students}
        </span>
        <span>
          <BookOpenText size={15} />
          {teacher.courses} {labels.courses}
        </span>
        <span>
          <Languages size={15} />
          {teacher.languages.join(", ")}
        </span>
      </div>

      <div className={styles.badges}>
        {teacher.badges.map((badge) => (
          <span key={badge}>{badge}</span>
        ))}
      </div>
    </article>
  );
}
