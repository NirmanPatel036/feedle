import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import api from "@/lib/api";

export interface Article {
  _id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: string;
  category: string;
}

interface UseArticlesOptions {
  categories?: string[];
  random?: boolean;
  limit?: number;
}

interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

export function useArticles(
  category: string,
  options?: UseArticlesOptions,
): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const normalizedCategories = useMemo(
    () =>
      (options?.categories ?? [])
        .map((value) => value.toLowerCase())
        .filter(Boolean),
    [options?.categories],
  );
  const limit = options?.limit ?? 20;
  const optionsKey = JSON.stringify({
    category,
    categories: normalizedCategories,
    random: options?.random ?? false,
    limit,
  });
  const requestKeyRef = useRef<string | null>(null);

  const fetchArticles = useCallback(
    async (fetchPage: number, reset: boolean) => {
      setLoading(true);
      try {
        const params: Record<string, string | number | boolean> = {
          page: fetchPage,
          limit,
        };

        if (normalizedCategories.length) {
          params.categories = normalizedCategories.join(",");
        } else if (category) {
          params.category = category.toLowerCase();
        }

        if (options?.random) {
          params.random = true;
        }

        const { data } = await api.get("/api/articles", { params });
        const fetched: Article[] = Array.isArray(data)
          ? data
          : (data.articles ?? []);
        setArticles((prev) => (reset ? fetched : [...prev, ...fetched]));
        setHasMore(fetched.length === limit);
      } catch {
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [category, limit, normalizedCategories, options?.random],
  );

  // Re-fetch from page 1 when request options change
  useEffect(() => {
    if (requestKeyRef.current !== optionsKey) {
      requestKeyRef.current = optionsKey;
      setPage(1);
      setArticles([]);
      setHasMore(true);
      fetchArticles(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey, fetchArticles]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticles(nextPage, false);
    }
  }, [loading, hasMore, page, fetchArticles]);

  return { articles, loading, hasMore, loadMore };
}
