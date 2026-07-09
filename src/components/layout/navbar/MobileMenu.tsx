"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { getLocaleContent, type SiteLocale } from "@/lib/locale";
import styles from "./MobileMenu.module.css";

type MobileMenuProps = {
  locale: SiteLocale;
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ locale, isOpen, onClose }: MobileMenuProps) {
  const content = getLocaleContent(locale);
  const links = [
    { label: content.nav.home, href: "/" },
    { label: content.nav.about, href: "/about" },
    { label: content.nav.teachers, href: "/teachers" },
    { label: content.nav.books, href: "/books" },
    { label: content.nav.blog, href: "/blog" },
    { label: content.nav.quiz, href: "/quiz" },
    { label: content.nav.contact, href: "/contact" },
    { label: content.nav.courses, href: "/courses" },
    { label: content.nav.admission, href: "/admission" },
    { label: content.nav.login, href: "/login" },
  ];

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`}>
      <button className={styles.backdrop} onClick={onClose} />

      <aside className={styles.drawer}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Image
              src="/images/logo-transparent.webp"
              alt="Shaykh Abu Ibrahim"
              width={50}
              height={50}
            />
            <div>
              <strong>Shaykh Abu Ibrahim</strong>
              <span>{content.subtitle}</span>
            </div>
          </div>

          <button className={styles.close} onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <nav className={styles.links}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose}>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
