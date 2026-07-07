export type TeacherSpecialty =
  | "Quran Recitation"
  | "Hifz"
  | "Tafseer"
  | "Hadith"
  | "Fiqh"
  | "Arabic";

export type Teacher = {
  id: string;
  name: string;
  slug: string;
  designation: string;
  specialty: TeacherSpecialty;
  experience: string;
  students: number;
  courses: number;
  languages: string[];
  summary: string;
  badges: string[];
};

export const teachers: Teacher[] = [
  {
    id: "teacher-abu-ibrahim",
    name: "Shaykh Abu Ibrahim",
    slug: "shaykh-abu-ibrahim",
    designation: "Founder and Senior Quran Instructor",
    specialty: "Quran Recitation",
    experience: "12 years",
    students: 1200,
    courses: 8,
    languages: ["English", "Urdu", "Arabic"],
    summary:
      "Leads the academy with a structured Quran-first curriculum focused on tajweed accuracy, spiritual growth, and consistency.",
    badges: ["Ijazah Guided", "Live Mentorship", "Parent Friendly"],
  },
  {
    id: "teacher-maryam",
    name: "Ustadha Maryam Fatima",
    slug: "ustadha-maryam-fatima",
    designation: "Women and Children Program Lead",
    specialty: "Hifz",
    experience: "9 years",
    students: 680,
    courses: 5,
    languages: ["English", "Urdu"],
    summary:
      "Designs nurturing memorization pathways for young learners with progress checkpoints, revision structure, and family alignment.",
    badges: ["Kids Specialist", "Revision Plans", "Female Mentorship"],
  },
  {
    id: "teacher-hasan",
    name: "Mufti Hasan Qasmi",
    slug: "mufti-hasan-qasmi",
    designation: "Tafseer and Fiqh Faculty",
    specialty: "Fiqh",
    experience: "14 years",
    students: 540,
    courses: 4,
    languages: ["English", "Urdu", "Arabic"],
    summary:
      "Brings classical scholarship into a modern online format through practical fiqh, thematic tafseer, and question-driven teaching.",
    badges: ["Scholarly Depth", "Applied Fiqh", "Advanced Cohorts"],
  },
  {
    id: "teacher-zayd",
    name: "Ustadh Zayd Rahman",
    slug: "ustadh-zayd-rahman",
    designation: "Hadith and Arabic Studies Instructor",
    specialty: "Hadith",
    experience: "8 years",
    students: 430,
    courses: 3,
    languages: ["English", "Arabic"],
    summary:
      "Helps students connect language, hadith, and daily practice through engaging lessons built around comprehension and reflection.",
    badges: ["Arabic Focus", "Hadith Study", "Discussion Led"],
  },
];

export function getTeacherBySlug(slug: string) {
  return teachers.find((teacher) => teacher.slug === slug);
}
