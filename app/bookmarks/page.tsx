"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bookmark, Newspaper } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ArticleCard } from "@/components/ArticleCard";

export default function BookmarksPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { bookmarks, bookmarkedIds, toggleBookmark, loading } = useBookmarks();

  // Auth guard
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem("feedle_token")) {
        router.push("/register");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [token, router]);

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-zinc-700/30 bg-zinc-900/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Newspaper className="h-5 w-5 text-amber-500" />
            <span className="font-medium">Feedle</span>
          </Link>
          <Link
            href="/feed"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            ← Back to Feed
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3 border border-zinc-700 px-4 py-2 w-fit">
            <div className="h-2.5 w-2.5 bg-amber-500" />
            <span className="text-sm font-medium text-zinc-400 tracking-wide">
              Bookmarks
            </span>
          </div>
          <h1 className="text-3xl font-normal tracking-tight text-white md:text-4xl">
            Saved Articles
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse bg-zinc-800/50 border border-zinc-700/30"
              />
            ))}
          </div>
        ) : bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((article) => (
              <ArticleCard
                key={article._id}
                article={article}
                bookmarkedIds={bookmarkedIds}
                toggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Bookmark className="mb-4 h-10 w-10 text-zinc-600" />
            <p className="text-zinc-400">No saved articles yet.</p>
            <Link
              href="/feed"
              className="mt-4 text-sm text-amber-500 transition-colors hover:text-amber-400"
            >
              Browse your feed →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
