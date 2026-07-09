"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { primaryNavigation } from "@/data/navigation";
import { getLocaleContent, type SiteLocale } from "@/lib/locale";
import styles from "./NavLinks.module.css";
import { MegaMenu } from "./MegaMenu";

type NavLinksProps = {
  locale: SiteLocale;
};

export function NavLinks({ locale }: NavLinksProps) {
  const content = getLocaleContent(locale);
  const labels = {
    "/": content.nav.home,
    "/about": content.nav.about,
    "/teachers": content.nav.teachers,
    "/books": content.nav.books,
    "/blog": content.nav.blog,
    "/quiz": content.nav.quiz,
    "/contact": content.nav.contact,
  } as const;

  return (
    <nav className={styles.nav}>
      {primaryNavigation.slice(0, 2).map((link) => (
        <Link key={link.href} href={link.href} className={styles.link}>
          {labels[link.href as keyof typeof labels] || link.label}
        </Link>
      ))}

      <div className={styles.dropdown}>
        <button className={styles.dropdownButton}>
          {content.nav.courses} <ChevronDown size={15} />
        </button>

        <MegaMenu />
      </div>

      {primaryNavigation.slice(2).map((link) => (
        <Link key={link.href} href={link.href} className={styles.link}>
          {labels[link.href as keyof typeof labels] || link.label}
        </Link>
      ))}
    </nav>
  );
}
