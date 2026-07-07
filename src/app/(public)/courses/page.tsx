import { CoursesPage } from "@/components/public/courses/CoursesPage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Islamic Courses",
  description:
    "Explore online Quran, Tajweed, Hifz, Tafseer, Hadith, Fiqh, and translation courses designed for children, adults, and families.",
  path: "/courses",
});

export default function CoursesRoute() {
  return <CoursesPage />;
}
