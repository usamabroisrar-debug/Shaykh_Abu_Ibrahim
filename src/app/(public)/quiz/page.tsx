import { QuizPage } from "@/components/public/quiz/QuizPage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Islamic Quiz And Assessment",
  description:
    "Discover the academy quiz experience for Tajweed, Quran study, progress tracking, timed assessments, and certificate-oriented evaluation.",
  path: "/quiz",
});

export default function QuizRoute() {
  return <QuizPage />;
}
