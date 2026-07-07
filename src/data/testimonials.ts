export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  outcome: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Ayesha Khalid",
    role: "Parent of Hifz Student",
    quote:
      "The structure is what changed everything for us. We finally had clear goals, regular feedback, and a teacher who genuinely cared about steady progress.",
    outcome: "Memorization consistency improved within six weeks",
  },
  {
    id: "testimonial-2",
    name: "Omar Rahman",
    role: "Adult Tajweed Student",
    quote:
      "I had studied before, but this was the first time the corrections felt systematic. The lessons are elegant, focused, and easy to stay committed to.",
    outcome: "Recitation confidence increased across live classes",
  },
  {
    id: "testimonial-3",
    name: "Sumayyah Noor",
    role: "Quran Translation Student",
    quote:
      "The academy balances scholarship and clarity beautifully. It never feels overwhelming, yet every week I walk away understanding something meaningful.",
    outcome: "Completed translation pathway with distinction",
  },
];
