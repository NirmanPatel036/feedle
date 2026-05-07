"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { format } from "date-fns";
import { Newspaper, ExternalLink } from "lucide-react";
import api from "@/lib/api";
import type { Article } from "@/hooks/useArticles";
import { ShareBar } from "@/components/ShareBar";

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const backHref = categoryParam
    ? `/feed?category=${encodeURIComponent(categoryParam)}`
    : "/feed";

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const jspUrl = `${process.env.NEXT_PUBLIC_JSP_URL}/article/${id}`;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/api/articles/${id}`)
      .then(({ data }) => setArticle(data))
      .catch(() => setError("Could not load article."))
      .finally(() => setLoading(false));
  }, [id]);

  const formattedDate = (() => {
    if (!article?.publishedAt) return "";
    try {
      return format(new Date(article.publishedAt), "MMMM d, yyyy");
    } catch {
      return article.publishedAt;
    }
  })();

  return (
    <>
      {/* SEO Head — og:url always points to JSP canonical URL */}
      {article && (
        <Head>
          <title>{article.title} — Feedle</title>
          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={article.description ?? ""} />
          <meta property="og:image" content={article.urlToImage ?? ""} />
          {/* Canonical URL points to JSP layer, not this Next.js route */}
          <meta property="og:url" content={jspUrl} />
          <link rel="canonical" href={jspUrl} />
        </Head>
      )}

      <div className="min-h-screen bg-zinc-900">
        {/* Nav */}
        <nav className="sticky top-0 z-50 border-b border-zinc-700/30 bg-zinc-900/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Newspaper className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Feedle</span>
            </Link>
            <Link
              href={backHref}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              ← Back to Feed
            </Link>
          </div>
        </nav>

        <main className="mx-auto max-w-4xl px-6 py-12 md:px-12">
          {loading && (
            <div className="space-y-6">
              <div className="h-8 w-3/4 animate-pulse bg-zinc-800" />
              <div className="aspect-video w-full animate-pulse bg-zinc-800" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 animate-pulse bg-zinc-800" />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-zinc-400">{error}</p>
              <Link
                href="/feed"
                className="mt-4 text-sm text-amber-500 hover:text-amber-400"
              >
                Return to feed
              </Link>
            </div>
          )}

          {article && !loading && (
            <article>
              {/* Category + date */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {article.category && (
                  <span className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-500">
                    {article.category}
                  </span>
                )}
                <span className="text-sm text-zinc-500">{formattedDate}</span>
                <span className="text-sm text-zinc-600">·</span>
                <span className="text-sm text-zinc-500">{article.source}</span>
              </div>

              {/* Title */}
              <h1 className="mb-6 text-balance text-3xl font-normal leading-tight tracking-tight text-white md:text-4xl">
                {article.title}
              </h1>

              {/* Hero image */}
              {article.urlToImage && (
                <div className="mb-8 aspect-video w-full overflow-hidden bg-zinc-800">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Description */}
              {article.description && (
                <p className="mb-8 text-lg leading-relaxed text-zinc-300">
                  {article.description}
                </p>
              )}

              {/* Read original */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-zinc-600 bg-transparent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Read original article
                <ExternalLink className="h-4 w-4" />
              </a>

              {/* Share Bar */}
              <div className="mt-12 border-t border-zinc-700/30 pt-8">
                <ShareBar url={jspUrl} title={article.title} />
              </div>
            </article>
          )}
        </main>
      </div>
    </>
  );
}
