"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSiteSearch } from "@/hooks/useSiteSearch";
import { getLocaleContent, type SiteLocale } from "@/lib/locale";
import styles from "./SearchBox.module.css";

type SearchBoxProps = {
  locale: SiteLocale;
};

export function SearchBox({ locale }: SearchBoxProps) {
  const { query, setQuery, results } = useSiteSearch();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const content = getLocaleContent(locale);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const input = wrapperRef.current?.querySelector("input");
        input?.focus();
        setIsOpen(true);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  return (
    <div
      className={`${styles.wrapper} ${isOpen ? styles.open : ""}`}
      ref={wrapperRef}
    >
      <div className={styles.search}>
        <Search size={17} />
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={content.search.placeholder}
          aria-label={content.search.ariaLabel}
        />
        {query ? (
          <button
            type="button"
            className={styles.clearButton}
            aria-label={content.search.clear}
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
          >
            <X size={15} />
          </button>
        ) : (
          <kbd>Ctrl K</kbd>
        )}
      </div>

      {isOpen ? (
        <div className={styles.panel}>
          {!query.trim() ? (
            <div className={styles.emptyState}>
              <strong>{content.search.emptyTitle}</strong>
              <span>{content.search.emptyText}</span>
            </div>
          ) : results.length ? (
            <>
              <div className={styles.results}>
                {results.slice(0, 6).map((result) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    className={styles.resultItem}
                    onClick={() => setIsOpen(false)}
                  >
                    <div>
                      <span className={styles.resultType}>{result.type}</span>
                      <strong>{result.title}</strong>
                    </div>
                    <span className={styles.resultMeta}>{result.meta}</span>
                  </Link>
                ))}
              </div>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className={styles.viewAll}
                onClick={() => setIsOpen(false)}
              >
                {content.search.viewAll} &quot;{query}&quot;
              </Link>
            </>
          ) : (
            <div className={styles.emptyState}>
              <strong>{content.search.noMatches}</strong>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className={styles.emptyLink}
                onClick={() => setIsOpen(false)}
              >
                {content.search.fullResults}
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
