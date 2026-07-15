"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { localeCookieName, supportedLocales, type SiteLocale } from "@/lib/locale";
import styles from "./LocaleBar.module.css";

type LanguageSwitcherProps = {
  activeLocale: SiteLocale;
  labels: Record<SiteLocale, string>;
};

const languageLabel: Record<SiteLocale, string> = {
  en: "Language",
  ur: "زبان",
  ar: "اللغة",
};

export function LanguageSwitcher({
  activeLocale,
  labels,
}: LanguageSwitcherProps) {
  const router = useRouter();

  function updateLocale(locale: SiteLocale) {
    document.cookie = `${localeCookieName}=${locale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div className={styles.languageDropdown}>
      <label className={styles.languageLabel} htmlFor="site-language">
        {languageLabel[activeLocale]}
      </label>
      <div className={styles.selectWrap}>
        <select
          id="site-language"
          className={styles.languageSelect}
          aria-label="Language switcher"
          value={activeLocale}
          onChange={(event) => updateLocale(event.target.value as SiteLocale)}
        >
          {supportedLocales.map((locale) => (
            <option key={locale} value={locale}>
              {labels[locale]}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className={styles.selectIcon} />
      </div>
    </div>
  );
}
