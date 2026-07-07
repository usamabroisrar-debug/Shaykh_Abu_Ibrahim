import { BookOpenText, Languages, Users } from "lucide-react";
import type { Teacher } from "@/data/teachers";
import styles from "./TeacherCard.module.css";

type TeacherCardProps = {
  teacher: Teacher;
};

export function TeacherCard({ teacher }: TeacherCardProps) {
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
          {teacher.students}+ students
        </span>
        <span>
          <BookOpenText size={15} />
          {teacher.courses} courses
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
