"use client";

import { useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();

  function updateLocale(locale: SiteLocale) {
    if (locale === activeLocale || isPending) {
      return;
    }

    document.cookie = `${localeCookieName}=${locale}; path=/; max-age=31536000; samesite=lax`;

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      {isPending ? (
        <div className={styles.pageLoader} role="status" aria-label="Loading">
          <span className={styles.pageLoaderBar} />
        </div>
      ) : null}
      <div
        className={styles.languageDropdown}
        data-pending={isPending ? "true" : undefined}
      >
        <label className={styles.languageLabel} htmlFor="site-language">
          {languageLabel[activeLocale]}
        </label>
        <div className={styles.selectWrap}>
          <select
            id="site-language"
            className={styles.languageSelect}
            aria-label="Language switcher"
            value={activeLocale}
            disabled={isPending}
            onChange={(event) => updateLocale(event.target.value as SiteLocale)}
          >
            {supportedLocales.map((locale) => (
              <option key={locale} value={locale}>
                {labels[locale]}
              </option>
            ))}
          </select>
          {isPending ? (
            <span className={styles.selectSpinner} aria-hidden="true" />
          ) : (
            <ChevronDown size={16} className={styles.selectIcon} />
          )}
        </div>
      </div>
    </>
  );
}
