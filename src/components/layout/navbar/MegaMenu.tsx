import Link from "next/link";
import {
  BookOpen,
  BookMarked,
  Mic2,
  Languages,
  ScrollText,
  Landmark,
} from "lucide-react";
import styles from "./MegaMenu.module.css";

const courses = [
  {
    title: "Qaida",
    text: "Learn Quran reading basics",
    href: "/courses/qaida",
    icon: <BookOpen size={20} />,
  },
  {
    title: "Nazra",
    text: "Improve Quran fluency",
    href: "/courses/nazra",
    icon: <BookMarked size={20} />,
  },
  {
    title: "Tajweed",
    text: "Rules of recitation",
    href: "/courses/tajweed",
    icon: <Mic2 size={20} />,
  },
  {
    title: "Translation",
    text: "Understand Quran meanings",
    href: "/courses/tarjuma",
    icon: <Languages size={20} />,
  },
  {
    title: "Tafseer",
    text: "Explanation of Quran",
    href: "/courses/tafseer",
    icon: <ScrollText size={20} />,
  },
  {
    title: "Hadith",
    text: "Authentic Hadith studies",
    href: "/courses/hadith",
    icon: <Landmark size={20} />,
  },
];

export function MegaMenu() {
  return (
    <div className={styles.menu}>
      <div className={styles.header}>
        <span>Islamic Courses</span>
        <strong>Choose your learning path</strong>
      </div>

      <div className={styles.grid}>
        {courses.map((course) => (
          <Link key={course.href} href={course.href} className={styles.item}>
            <div className={styles.icon}>{course.icon}</div>
            <div>
              <h4>{course.title}</h4>
              <p>{course.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}