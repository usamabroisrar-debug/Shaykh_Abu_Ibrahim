"use client";

import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { themeCookieName, type SiteTheme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

type ThemeToggleProps = {
  activeTheme: SiteTheme;
  className?: string;
};

export function ThemeToggle({ activeTheme, className }: ThemeToggleProps) {
  const router = useRouter();

  function toggleTheme() {
    const nextTheme: SiteTheme = activeTheme === "dark" ? "light" : "dark";
    document.cookie = `${themeCookieName}=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.setAttribute("data-theme", nextTheme);
    router.refresh();
  }

  return (
    <button
      type="button"
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
      onClick={toggleTheme}
      aria-label={activeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={activeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {activeTheme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
