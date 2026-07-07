"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import styles from "./MobileMenu.module.css";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const links = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Blog", href: "/blog" },
  { label: "Quiz", href: "/quiz" },
  { label: "Contact", href: "/contact" },
  { label: "Admission", href: "/admission" },
  { label: "Login", href: "/login" },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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
              <span>Islamic Learning Platform</span>
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