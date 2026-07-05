import Link from "next/link";
import { ArrowRight, Clock, GraduationCap, Users } from "lucide-react";
import styles from "./CourseCard.module.css";

type CourseCardProps = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  duration: string;
  level: string;
  students: string;
};

export function CourseCard({
  title,
  description,
  href,
  icon,
  duration,
  level,
  students,
}: CourseCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.iconBox}>{icon}</div>

      <h3 className={styles.title}>{title}</h3>

      <p className={styles.description}>{description}</p>

      <div className={styles.metaGrid}>
        <span>
          <Clock size={15} />
          {duration}
        </span>

        <span>
          <GraduationCap size={15} />
          {level}
        </span>

        <span>
          <Users size={15} />
          {students}
        </span>
      </div>

      <Link href={href} className={styles.link}>
        Start Learning <ArrowRight size={16} />
      </Link>
    </article>
  );
}