"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { themeCookieName, type SiteTheme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

type ThemeToggleProps = {
  activeTheme: SiteTheme;
  className?: string;
};

export function ThemeToggle({ activeTheme, className }: ThemeToggleProps) {
  const [theme, setTheme] = useState(activeTheme);

  function toggleTheme() {
    const nextTheme: SiteTheme = theme === "dark" ? "light" : "dark";
    document.cookie = `${themeCookieName}=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.setAttribute("data-theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
