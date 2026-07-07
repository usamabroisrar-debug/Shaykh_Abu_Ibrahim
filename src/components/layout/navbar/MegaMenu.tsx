import Link from "next/link";
import {
  BookOpen,
  BookMarked,
  GraduationCap,
  Languages,
  Landmark,
  Mic2,
  ScrollText,
} from "lucide-react";
import { courseNavigation } from "@/data/navigation";
import styles from "./MegaMenu.module.css";

const icons = [BookOpen, BookMarked, GraduationCap, Mic2, Languages, Landmark];

export function MegaMenu() {
  return (
    <div className={styles.menu}>
      <div className={styles.header}>
        <span>Islamic Courses</span>
        <strong>Choose your learning path</strong>
      </div>

      <div className={styles.grid}>
        {courseNavigation.map((course, index) => {
          const Icon = icons[index] ?? ScrollText;

          return (
            <Link key={course.href} href={course.href} className={styles.item}>
              <div className={styles.icon}>
                <Icon size={20} />
              </div>
              <div>
                <h4>{course.title}</h4>
                <p>{course.text}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
