"use client";

import { format } from "date-fns";
import { Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Article } from "@/hooks/useArticles";

const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  technology: "/placeholders/technology.svg",
  business: "/placeholders/business.svg",
  world: "/placeholders/world.svg",
  politics: "/placeholders/politics.svg",
  science: "/placeholders/science.svg",
  health: "/placeholders/health.svg",
  sports: "/placeholders/sports.svg",
  environment: "/placeholders/environment.svg",
  culture: "/placeholders/culture.svg",
  travel: "/placeholders/travel.svg",
  entertainment: "/placeholders/entertainment.svg",
};

interface ArticleCardProps {
  article: Article;
  bookmarkedIds: Set<string>;
  toggleBookmark: (id: string) => Promise<void>;
  onOpen?: (id: string) => void;
}

export function ArticleCard({
  article,
  bookmarkedIds,
  toggleBookmark,
  onOpen,
}: ArticleCardProps) {
  const jspUrl = `${process.env.NEXT_PUBLIC_JSP_URL}/article/${article._id}`;
  const isBookmarked = bookmarkedIds.has(article._id);
  const isClickable = Boolean(onOpen);

  const handleOpen = () => {
    onOpen?.(article._id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url: jspUrl });
        return;
      } catch {
        // Fall back to clipboard
      }
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(jspUrl);
        return;
      } catch {
        // Fall back to legacy copy
      }
    }

    // Legacy fallback for older browsers
    const el = document.createElement("textarea");
    el.value = jspUrl;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  const formattedDate = (() => {
    try {
      return format(new Date(article.publishedAt), "MMM d, yyyy");
    } catch {
      return article.publishedAt;
    }
  })();

  const imageSrc =
    article.urlToImage ||
    CATEGORY_PLACEHOLDERS[article.category?.toLowerCase() ?? ""] ||
    "/placeholders/default.svg";

  return (
    <article
      className={`group flex flex-col bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600/60 transition-all duration-200 ${
        isClickable ? "cursor-pointer" : ""
      }`}
      onClick={isClickable ? handleOpen : undefined}
      onKeyDown={
        isClickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleOpen();
              }
            }
          : undefined
      }
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        <img
          src={imageSrc}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholders/default.svg";
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Category badge */}
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-500">
            {article.category}
          </span>
          <span className="text-xs text-zinc-500">{formattedDate}</span>
        </div>

        {/* Title */}
        <h3 className="text-balance text-base font-medium leading-snug text-white line-clamp-2">
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p className="text-sm leading-relaxed text-zinc-400 line-clamp-3">
            {article.description}
          </p>
        )}

        {/* Source */}
        <p className="text-xs text-zinc-500">{article.source}</p>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-3 border-t border-zinc-700/30">
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white hover:bg-transparent"
            onClick={(event) => {
              event.stopPropagation();
              toggleBookmark(article._id);
            }}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark article"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-amber-500" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {isBookmarked ? "Saved" : "Save"}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white hover:bg-transparent"
            onClick={(event) => {
              event.stopPropagation();
              handleShare();
            }}
            aria-label="Copy article link"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </article>
  );
}
