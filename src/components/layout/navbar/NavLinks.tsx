"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import styles from "./NavLinks.module.css";
import { MegaMenu } from "./MegaMenu";

const links = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Quiz", href: "/quiz" },
  { label: "Contact", href: "/contact" },
];

export function NavLinks() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.link}>
        Home
      </Link>

      <div className={styles.dropdown}>
        <button className={styles.dropdownButton}>
          Courses <ChevronDown size={15} />
        </button>

        <MegaMenu />
      </div>

      {links.slice(1).map((link) => (
        <Link key={link.href} href={link.href} className={styles.link}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}