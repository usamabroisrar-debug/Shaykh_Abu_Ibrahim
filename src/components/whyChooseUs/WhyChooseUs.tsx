import { BookOpenCheck, Clock, Globe2, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Authentic Islamic Knowledge",
    description:
      "Courses are designed with a focus on reliable Islamic learning, clear explanations, and practical understanding.",
    icon: <ShieldCheck size={28} />,
  },
  {
    title: "Structured Learning Path",
    description:
      "Every course follows a step-by-step path so students can learn Quran, Hadith, and Islamic studies with clarity.",
    icon: <BookOpenCheck size={28} />,
  },
  {
    title: "Flexible Online Classes",
    description:
      "Learn from anywhere with online classes suitable for children, adults, beginners, and advanced learners.",
    icon: <Globe2 size={28} />,
  },
  {
    title: "Progress Focused System",
    description:
      "Students can follow lessons, complete quizzes, and track learning progress as the platform grows.",
    icon: <Clock size={28} />,
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
            Why Choose Us
          </p>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-950 md:text-5xl">
            A trusted platform for Quran and Islamic education
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600">
            Our goal is to provide a clean, structured, and accessible Islamic
            learning experience where students can learn with confidence and
            consistency.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-amber-300 hover:bg-white hover:shadow-xl"
            >
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-800 text-amber-300">
                {feature.icon}
              </div>

              <h3 className="text-lg font-bold text-slate-950">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}