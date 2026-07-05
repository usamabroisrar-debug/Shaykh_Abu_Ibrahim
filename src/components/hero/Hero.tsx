import Image from "next/image";
import Link from "next/link";
import { BookOpen, GraduationCap, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,#facc15,transparent_35%),radial-gradient(circle_at_bottom_right,#34d399,transparent_35%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-amber-300/40 bg-white/10 px-4 py-2 text-sm text-amber-200">
            Online Islamic Academy
          </p>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl">
            Learn Quran, Hadith & Islamic Knowledge Online
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-emerald-50/85">
            Join our comprehensive Islamic learning platform and study Qaida, Nazra, Hifz, Tajweed, Quran Translation, Tafseer, and Hadith through structured, interactive, and authentic online courses.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/courses"
              className="inline-flex min-w-[150px] items-center justify-center rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300"
            >
              Explore Courses
            </Link>

            <Link
              href="/quiz"
              className="inline-flex min-w-[150px] items-center justify-center rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
            >
              Start Quiz
            </Link>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <BookOpen className="mb-2 h-6 w-6 text-amber-300" />
              <p className="text-2xl font-bold">12+</p>
              <p className="text-xs text-emerald-50/70">Courses</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <GraduationCap className="mb-2 h-6 w-6 text-amber-300" />
              <p className="text-2xl font-bold">500+</p>
              <p className="text-xs text-emerald-50/70">Students</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <ShieldCheck className="mb-2 h-6 w-6 text-amber-300" />
              <p className="text-2xl font-bold">100%</p>
              <p className="text-xs text-emerald-50/70">Authentic</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-6 rounded-full bg-amber-300/20 blur-3xl" />

          <Image
            src="/images/hero.webp"
            alt="Islamic learning"
            width={620}
            height={620}
            priority
            className="relative w-full rounded-[2rem] object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}