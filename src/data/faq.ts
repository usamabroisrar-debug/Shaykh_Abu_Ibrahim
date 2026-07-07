export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "faq-1",
    question: "Who are these courses designed for?",
    answer:
      "The academy serves children, adults, sisters, and advanced learners through separate pathways for Quran reading, tajweed, hifz, translation, and Islamic studies.",
  },
  {
    id: "faq-2",
    question: "Are classes live or recorded?",
    answer:
      "Core programs are taught live with teacher interaction, while supporting resources, revision notes, and student materials are organized for flexible review.",
  },
  {
    id: "faq-3",
    question: "Do students receive progress tracking?",
    answer:
      "Yes. Programs are designed around milestones, feedback, attendance rhythm, and assessment checkpoints so students and families can see meaningful movement.",
  },
  {
    id: "faq-4",
    question: "Can families enroll multiple children?",
    answer:
      "Yes. The platform is being shaped for family-friendly admissions, including course matching, guardian details, and support for different age groups.",
  },
  {
    id: "faq-5",
    question: "Will certificates be available?",
    answer:
      "Yes. Completion certificates are part of the learning flow, and the larger LMS roadmap includes downloadable verification-ready certificates.",
  },
];
