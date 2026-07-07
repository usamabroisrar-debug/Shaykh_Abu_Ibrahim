import {
  BookOpen,
  BookText,
  Languages,
  Medal,
  ScrollText,
  GraduationCap,
} from "lucide-react";

const journey = [
  {
    title: "Qaida",
    description: "Learn Arabic letters, pronunciation and Noorani Qaida.",
    icon: <BookOpen size={28} />,
  },
  {
    title: "Nazra Quran",
    description: "Read the Holy Quran fluently with proper guidance.",
    icon: <BookText size={28} />,
  },
  {
    title: "Tajweed",
    description: "Master the rules of Quranic recitation.",
    icon: <Languages size={28} />,
  },
  {
    title: "Hifz & Tarjuma",
    description: "Memorize and understand the meanings of the Quran.",
    icon: <GraduationCap size={28} />,
  },
  {
    title: "Tafseer",
    description: "Study the explanation and wisdom of the Quran.",
    icon: <ScrollText size={28} />,
  },
  {
    title: "Hadith & Fiqh",
    description: "Complete your Islamic education with authentic Hadith and Fiqh.",
    icon: <Medal size={28} />,
  },
];

export function LearningJourney() {
  return (
    <section className="bg-slate-950 py-24 px-4 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="text-center max-w-3xl mx-auto">
          <p className="uppercase tracking-[4px] text-amber-400 text-sm font-semibold">
            Learning Journey
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            Your Complete Islamic Learning Path
          </h2>

          <p className="mt-6 text-slate-300 leading-8">
            Start from the basics and progress step by step until you build
            a strong foundation in Quran and Islamic knowledge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {journey.map((item, index) => (

            <div
              key={item.title}
              className="relative rounded-3xl bg-white/5 border border-white/10 p-8 hover:border-amber-400 hover:bg-white/10 transition"
            >

              <div className="absolute top-6 right-6 text-6xl font-bold text-white/5">
                {index + 1}
              </div>

              <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-amber-300 flex items-center justify-center">
                {item.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                {item.description}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}