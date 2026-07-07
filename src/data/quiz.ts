export type QuizHighlight = {
  id: string;
  title: string;
  level: string;
  questions: number;
  duration: string;
  description: string;
};

export const featuredQuiz: QuizHighlight = {
  id: "quiz-tajweed-core",
  title: "Tajweed Core Assessment",
  level: "Intermediate",
  questions: 25,
  duration: "15 minutes",
  description:
    "A timed assessment covering makharij, sifaat, madd, qalqalah, and recitation decision-making for active students.",
};

export const quizBenefits = [
  "Track mastery after each module",
  "Timed tests to build confidence under pressure",
  "Certificates for qualifying scores",
  "Leaderboard support for motivated learners",
];
