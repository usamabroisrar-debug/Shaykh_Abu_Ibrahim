"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { searchSiteContent } from "@/services/search/search.service";

export function useSiteSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    return searchSiteContent(deferredQuery);
  }, [deferredQuery]);

  return {
    query,
    setQuery,
    results,
    hasQuery: Boolean(query.trim()),
  };
}
