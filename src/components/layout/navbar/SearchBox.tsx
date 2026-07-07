"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { searchSiteContent } from "@/lib/search";
import styles from "./SearchBox.module.css";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    if (!deferredQuery.trim()) {
      return [];
    }

    return searchSiteContent(deferredQuery).slice(0, 6);
  }, [deferredQuery]);

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
          placeholder="Search website..."
          aria-label="Search website"
        />
        {query ? (
          <button
            type="button"
            className={styles.clearButton}
            aria-label="Clear search"
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
              <strong>Search across the full website</strong>
              <span>Courses, teachers, books, and blog posts appear here instantly.</span>
            </div>
          ) : results.length ? (
            <>
              <div className={styles.results}>
                {results.map((result) => (
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
                View all results for &quot;{query}&quot;
              </Link>
            </>
          ) : (
            <div className={styles.emptyState}>
              <strong>No instant matches found</strong>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className={styles.emptyLink}
                onClick={() => setIsOpen(false)}
              >
                Open full search results page
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
