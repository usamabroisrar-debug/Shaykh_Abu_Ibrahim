import {
  BookOpen,
  BookMarked,
  Languages,
  Landmark,
  Mic2,
  MoonStar,
} from "lucide-react";
import { CourseCard } from "./CourseCard";

const courses = [
  {
    title: "Qaida Course",
    description:
      "Learn the fundamentals of Quran reading with correct pronunciation, letters, joining rules, and step-by-step guidance.",
    href: "/courses/qaida",
    icon: <BookOpen size={26} />,
    duration: "4 Weeks",
    level: "Beginner",
    students: "120+",
  },
  {
    title: "Nazra Quran",
    description:
      "Develop fluency in Quran recitation with proper reading practice, correction, and daily guided lessons.",
    href: "/courses/nazra",
    icon: <BookMarked size={26} />,
    duration: "8 Weeks",
    level: "Beginner",
    students: "180+",
  },
  {
    title: "Hifz ul Quran",
    description:
      "Structured memorization plan with revision schedule, teacher supervision, and progress tracking for students.",
    href: "/courses/hifz",
    icon: <MoonStar size={26} />,
    duration: "Custom",
    level: "All Levels",
    students: "90+",
  },
  {
    title: "Tajweed Course",
    description:
      "Master Makharij, Sifaat, Ghunnah, Madd, and practical Tajweed rules for beautiful and correct recitation.",
    href: "/courses/tajweed",
    icon: <Mic2 size={26} />,
    duration: "6 Weeks",
    level: "Intermediate",
    students: "150+",
  },
  {
    title: "Quran Translation",
    description:
      "Understand the meanings of the Quran with clear explanations, vocabulary, and practical lessons.",
    href: "/courses/tarjuma",
    icon: <Languages size={26} />,
    duration: "12 Weeks",
    level: "Intermediate",
    students: "100+",
  },
  {
    title: "Hadith Studies",
    description:
      "Study selected authentic Hadith with explanation, context, lessons, and practical implementation.",
    href: "/courses/hadith",
    icon: <Landmark size={26} />,
    duration: "8 Weeks",
    level: "All Levels",
    students: "130+",
  },
];

export function CoursesSection() {
  return (
    <section className="bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
            Our Courses
          </p>

          <h2 className="mt-4 text-3xl font-extrabold text-slate-950 md:text-5xl">
            Structured Islamic Learning for Every Student
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600">
            Choose from carefully designed Quran and Islamic studies courses
            built for beginners, children, adults, and advanced learners.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.href} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}