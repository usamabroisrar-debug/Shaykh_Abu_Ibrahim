import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Blog", href: "/blog" },
  { label: "Quiz", href: "/quiz" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo-transparent.webp"
            alt="Shaykh Abu Ibrahim"
            width={56}
            height={56}
            priority
          />
          <div>
            <p className="text-lg font-bold text-emerald-900">
              Shaykh Abu Ibrahim
            </p>
            <p className="text-xs text-muted-foreground">
              Islamic Learning Platform
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/admission"
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Admission
        </Link>
      </div>
    </header>
  );
}