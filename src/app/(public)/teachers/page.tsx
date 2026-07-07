import { TeachersPage } from "@/components/public/teachers/TeachersPage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Teachers",
  description:
    "Meet the academy faculty guiding Quran, Hifz, Tafseer, Hadith, Fiqh, and Arabic-focused learning with clarity and care.",
  path: "/teachers",
});

export default function TeachersRoute() {
  return <TeachersPage />;
}
