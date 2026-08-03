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
        <span className={styles.dateText}>
          {dates.hijri} | {dates.gregorian}
        </span>

        <span className={styles.bismillah}>{content.bismillah}</span>

        <LanguageSwitcher
          activeLocale={locale}
          labels={{
            en: getLocaleContent("en").nativeLabel,
            ur: getLocaleContent("ur").nativeLabel,
            ar: getLocaleContent("ar").nativeLabel,
          }}
        />
      </div>
    </div>
  );
}
