import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Article } from "@/hooks/useArticles";

interface UseBookmarksResult {
  bookmarkedIds: Set<string>;
  bookmarks: Article[];
  toggleBookmark: (articleId: string) => Promise<void>;
  loading: boolean;
}

export function useBookmarks(): UseBookmarksResult {
  const { token } = useAuth();
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .get("/api/bookmarks")
      .then(({ data }) => {
        const articles: Article[] = Array.isArray(data)
          ? data
          : data.bookmarks ?? [];
        setBookmarks(articles);
        setBookmarkedIds(new Set(articles.map((a) => a._id)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const toggleBookmark = useCallback(
    async (articleId: string) => {
      const isBookmarked = bookmarkedIds.has(articleId);
      // Optimistic update
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isBookmarked) {
          next.delete(articleId);
        } else {
          next.add(articleId);
        }
        return next;
      });
      try {
        if (isBookmarked) {
          await api.delete(`/api/bookmarks/${articleId}`);
          setBookmarks((prev) => prev.filter((a) => a._id !== articleId));
        } else {
          await api.post("/api/bookmarks", { articleId });
        }
      } catch {
        // Rollback on error
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          if (isBookmarked) {
            next.add(articleId);
          } else {
            next.delete(articleId);
          }
          return next;
        });
      }
    },
    [bookmarkedIds]
  );

  return { bookmarkedIds, bookmarks, toggleBookmark, loading };
}
