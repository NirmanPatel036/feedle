"use client";

import { useEffect, useMemo, useState } from "react";
import { useArticles } from "@/hooks/useArticles";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryTabs } from "@/components/CategoryTabs";
import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { AllNewsWall } from "@/components/AllNewsWall";

const CATEGORIES = [
  "All",
  "For You",
  "Technology",
  "Business",
  "World",
  "Politics",
  "Science",
  "Health",
  "Sports",
  "Environment",
  "Culture",
  "Travel",
  "Entertainment",
] as const;

type Category = (typeof CATEGORIES)[number];

const FEED_STATE_KEY = "feedle_feed_state";

const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, "-");

const getLabelFromSlug = (slug: string | null) => {
  if (!slug) return null;
  return CATEGORIES.find((category) => slugify(category) === slug) ?? null;
};

export default function FeedPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const { bookmarkedIds, toggleBookmark } = useBookmarks();
  const { user, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);

  const activeSlug = useMemo(() => slugify(activeCategory), [activeCategory]);
  const isAll = activeSlug === "all";
  const isPersonalized = activeSlug === "for-you";

  const personalizedCategories = useMemo(
    () => (subscriptions.length ? subscriptions : ["__none__"]),
    [subscriptions],
  );

  const categoryParam = isAll || isPersonalized ? "" : activeSlug;
  const { articles, loading, hasMore, loadMore } = useArticles(categoryParam, {
    categories: isPersonalized ? personalizedCategories : undefined,
    random: isAll,
    limit: isAll ? 60 : 20,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem("feedle_token")) {
        router.push("/register");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [token, router]);

  useEffect(() => {
    if (!token) return;
    setSubsLoading(true);
    api
      .get("/api/subscriptions")
      .then(({ data }) => {
        const topics: string[] = Array.isArray(data)
          ? data
          : (data.subscriptions ?? []);
        setSubscriptions(
          topics.map((topic) => String(topic).toLowerCase().trim()),
        );
      })
      .catch(() => {})
      .finally(() => setSubsLoading(false));
  }, [token]);

  useEffect(() => {
    const param = searchParams.get("category");
    const label = getLabelFromSlug(param);
    if (label && label !== activeCategory) {
      setActiveCategory(label);
    }
  }, [activeCategory, searchParams]);

  useEffect(() => {
    if (searchParams.get("category")) return;
    const stored = sessionStorage.getItem(FEED_STATE_KEY);
    if (!stored) return;
    try {
      const saved = JSON.parse(stored) as { category?: string };
      const label = getLabelFromSlug(saved.category ?? null);
      if (label) setActiveCategory(label);
    } catch {
      // ignore invalid storage
    }
  }, [searchParams]);

  useEffect(() => {
    const stored = sessionStorage.getItem(FEED_STATE_KEY);
    if (!stored || loading) return;
    try {
      const saved = JSON.parse(stored) as {
        category?: string;
        scrollY?: number;
      };
      if (!saved.category || saved.category !== activeSlug) return;
      requestAnimationFrame(() => {
        window.scrollTo({ top: saved.scrollY ?? 0, behavior: "auto" });
      });
      sessionStorage.removeItem(FEED_STATE_KEY);
    } catch {
      // ignore invalid storage
    }
  }, [activeSlug, loading]);

  const handleCategoryChange = (category: string) => {
    const label = category as Category;
    setActiveCategory(label);
    const slug = slugify(label);
    router.replace(`/feed?category=${encodeURIComponent(slug)}`);
  };

  const handleOpenArticle = (id: string) => {
    sessionStorage.setItem(
      FEED_STATE_KEY,
      JSON.stringify({ category: activeSlug, scrollY: window.scrollY }),
    );
    const query = activeSlug
      ? `?category=${encodeURIComponent(activeSlug)}`
      : "";
    router.push(`/article/${id}${query}`);
  };

  const initials = useMemo(() => {
    const source = user?.name || user?.email || "";
    const parts = source.split(" ").filter(Boolean);
    if (!parts.length) return "FU";
    const letters = parts.map((part) => part[0]).join("");
    return letters.slice(0, 2).toUpperCase();
  }, [user]);

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Simple top bar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-700/30 bg-zinc-900/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Newspaper className="h-5 w-5 text-amber-500" />
            <span className="font-medium">Feedle</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link
                href="/bookmarks"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Bookmarks
              </Link>
              <Link
                href="/subscriptions"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Subscriptions
              </Link>
            </div>

            {user ? (
              <div className="flex items-center gap-3 border border-zinc-700/60 bg-zinc-800/40 px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center border border-amber-500/40 bg-amber-500/10 text-xs font-semibold text-amber-500">
                  {initials}
                </div>
                <div className="text-right leading-tight">
                  <div className="text-sm text-white">
                    {user.name || "Feedle Member"}
                  </div>
                  <div className="text-xs text-zinc-500">{user.email}</div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-12 lg:px-16">
        {/* Category Tabs */}
        <CategoryTabs
          categories={[...CATEGORIES]}
          activeCategory={activeCategory}
          onChange={handleCategoryChange}
        />

        {/* Article Grid / All Wall */}
        {isAll ? (
          loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse bg-zinc-800/50 border border-zinc-700/30"
                />
              ))}
            </div>
          ) : articles.length ? (
            <AllNewsWall articles={articles} onOpen={handleOpenArticle} />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Newspaper className="mb-4 h-10 w-10 text-zinc-600" />
              <p className="text-zinc-400">No articles found yet.</p>
            </div>
          )
        ) : isPersonalized ? (
          !token ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Newspaper className="mb-4 h-10 w-10 text-zinc-600" />
              <p className="text-zinc-400">
                Sign in to see your personalized feed.
              </p>
              <Link
                href="/login"
                className="mt-4 text-sm text-amber-500 hover:text-amber-400"
              >
                Go to sign in
              </Link>
            </div>
          ) : subsLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse bg-zinc-800/50 border border-zinc-700/30"
                />
              ))}
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Newspaper className="mb-4 h-10 w-10 text-zinc-600" />
              <p className="text-zinc-400">
                Pick a few topics to personalize your feed.
              </p>
              <Link
                href="/subscriptions"
                className="mt-4 text-sm text-amber-500 hover:text-amber-400"
              >
                Choose subscriptions
              </Link>
            </div>
          ) : articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard
                    key={article._id}
                    article={article}
                    bookmarkedIds={bookmarkedIds}
                    toggleBookmark={toggleBookmark}
                    onOpen={handleOpenArticle}
                  />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <Button
                    onClick={loadMore}
                    disabled={loading}
                    variant="outline"
                    className="border-zinc-600 bg-transparent px-8 text-white hover:bg-zinc-800"
                  >
                    {loading ? "Loading…" : "Load More"}
                  </Button>
                </div>
              )}
            </>
          ) : loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse bg-zinc-800/50 border border-zinc-700/30"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Newspaper className="mb-4 h-10 w-10 text-zinc-600" />
              <p className="text-zinc-400">
                No articles found for your subscriptions yet.
              </p>
            </div>
          )
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  bookmarkedIds={bookmarkedIds}
                  toggleBookmark={toggleBookmark}
                  onOpen={handleOpenArticle}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  className="border-zinc-600 bg-transparent px-8 text-white hover:bg-zinc-800"
                >
                  {loading ? "Loading…" : "Load More"}
                </Button>
              </div>
            )}
          </>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse bg-zinc-800/50 border border-zinc-700/30"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Newspaper className="mb-4 h-10 w-10 text-zinc-600" />
            <p className="text-zinc-400">
              No articles found for {activeCategory}.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
