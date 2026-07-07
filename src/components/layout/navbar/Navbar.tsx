"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, UserRound } from "lucide-react";
import { useState } from "react";
import styles from "./Navbar.module.css";
import { NavLinks } from "./NavLinks";
import { SearchBox } from "./SearchBox";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.container}>
          <Link href="/" className={styles.logoWrap}>
            <Image
              src="/images/logo-transparent.webp"
              alt="Shaykh Abu Ibrahim"
              width={58}
              height={58}
              priority
              className={styles.logo}
            />

            <div>
              <span className={styles.logoTitle}>Shaykh Abu Ibrahim</span>
              <p className={styles.logoText}>Islamic Learning Platform</p>
            </div>
          </Link>

          <NavLinks />

          <div className={styles.actions}>
            <SearchBox />

            <Link href="/login" className={styles.loginButton}>
              <UserRound size={17} />
              Login
            </Link>

            <Link href="/admission" className={styles.admissionButton}>
              Apply Now
            </Link>

            <button
              className={styles.menuButton}
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />
    </>
  );
}
