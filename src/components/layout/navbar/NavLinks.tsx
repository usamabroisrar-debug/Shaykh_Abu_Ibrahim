"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { primaryNavigation } from "@/data/navigation";
import styles from "./NavLinks.module.css";
import { MegaMenu } from "./MegaMenu";

export function NavLinks() {
  return (
    <nav className={styles.nav}>
      {primaryNavigation.slice(0, 2).map((link) => (
        <Link key={link.href} href={link.href} className={styles.link}>
          {link.label}
        </Link>
      ))}

      <div className={styles.dropdown}>
        <button className={styles.dropdownButton}>
          Courses <ChevronDown size={15} />
        </button>

        <MegaMenu />
      </div>

      {primaryNavigation.slice(2).map((link) => (
        <Link key={link.href} href={link.href} className={styles.link}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
