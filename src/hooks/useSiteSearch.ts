"use client";

import { useDeferredValue, useEffect, useState } from "react";
import type { SearchResult } from "@/services/search/search.service";

export function useSiteSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const search = deferredQuery.trim();

    if (!search) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(search)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Search request failed.");
        }

        return (await response.json()) as SearchResult[];
      })
      .then((items) => {
        setResults(items);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      });

    return () => controller.abort();
  }, [deferredQuery]);

  return {
    query,
    setQuery,
    results,
    hasQuery: Boolean(query.trim()),
  };
}
