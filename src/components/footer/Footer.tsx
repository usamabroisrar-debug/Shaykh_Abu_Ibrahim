import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-transparent.webp"
              alt="Shaykh Abu Ibrahim"
              width={56}
              height={56}
            />
            <div>
              <p className="text-lg font-bold">Shaykh Abu Ibrahim</p>
              <p className="text-sm text-slate-400">
                Islamic Learning Platform
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            Quran, Hadith, Fiqh, Tafseer aur Islamic learning ke liye aik
            modern aur professional online platform.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Courses</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-400">
            <Link href="/courses/qaida">Qaida</Link>
            <Link href="/courses/nazra">Nazra</Link>
            <Link href="/courses/hifz">Hifz</Link>
            <Link href="/courses/tajweed">Tajweed</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Quick Links</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-400">
            <Link href="/blog">Blog</Link>
            <Link href="/quiz">Quiz</Link>
            <Link href="/admission">Admission</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Shaykh Abu Ibrahim. All rights reserved.
      </div>
    </footer>
  );
}