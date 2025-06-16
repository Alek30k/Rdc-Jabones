"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/sanity.types";
import { searchProducts } from "@/sanity/queriesSearch";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await searchProducts(searchQuery);
      setResults(searchResults || []);
    } catch (err) {
      setError("Error al buscar productos");
      setResults([]);
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce automático
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    search,
  };
}
