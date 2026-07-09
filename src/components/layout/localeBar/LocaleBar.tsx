import {
  getDualDates,
  getLocaleContent,
  type SiteLocale,
} from "@/lib/locale";
import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./LocaleBar.module.css";

type LocaleBarProps = {
  locale: SiteLocale;
};

export function LocaleBar({ locale }: LocaleBarProps) {
  const content = getLocaleContent(locale);
  const dates = getDualDates(locale);

  return (
    <div className={styles.bar}>
      <div className={styles.container}>
        <div className={styles.dateBlock}>
          <strong>{content.datesTitle}</strong>
          <span>
            {dates.hijri} | {dates.gregorian}
          </span>
        </div>

        <span className={styles.bismillah}>{content.bismillah}</span>

        <LanguageSwitcher
          activeLocale={locale}
          labels={{
            en: "English",
            ur: "اردو",
            ar: "العربية",
          }}
        />
      </div>
    </div>
  );
}
