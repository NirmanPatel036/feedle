"use client";

import { format } from "date-fns";
import type { Article } from "@/hooks/useArticles";
import { cn } from "@/lib/utils";

const COLUMN_COUNT = 5;
const COLUMN_VISIBILITY = [
  "",
  "hidden sm:block",
  "hidden lg:block",
  "hidden xl:block",
  "hidden 2xl:block",
];
const HEIGHT_CLASSES = [
  "min-h-[120px]",
  "min-h-[140px]",
  "min-h-[160px]",
  "min-h-[180px]",
];

const formatDate = (value: string) => {
  try {
    return format(new Date(value), "MMM d");
  } catch {
    return value;
  }
};

const formatCategory = (value: string) => {
  if (!value) return "News";
  return value
    .split(/[-\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export function AllNewsWall({
  articles,
  onOpen,
}: {
  articles: Article[];
  onOpen: (id: string) => void;
}) {
  const columns = Array.from({ length: COLUMN_COUNT }, () => [] as Article[]);
  articles.forEach((article, index) => {
    columns[index % COLUMN_COUNT].push(article);
  });

  return (
    <section className="relative">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3 border border-zinc-700 px-4 py-2 w-fit">
          <div className="h-2.5 w-2.5 bg-amber-500" />
          <span className="text-sm font-medium text-zinc-400 tracking-wide">
            All News
          </span>
        </div>
        <h2 className="text-3xl font-normal tracking-tight text-white md:text-4xl">
          The Live News Wall
        </h2>
        <p className="mt-3 text-sm text-zinc-400">
          Stay informed with a continuous stream of breaking news, top stories,
          and trending topics, all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {columns.map((column, columnIndex) => {
          const loopItems = column.length ? [...column, ...column] : [];
          const directionClass =
            columnIndex % 2 === 0 ? "marquee-up" : "marquee-down";
          const columnVisibility = COLUMN_VISIBILITY[columnIndex] ?? "";

          return (
            <div
              key={`column-${columnIndex}`}
              className={cn(
                "news-wall-column group relative h-[520px] overflow-hidden",
                "md:h-[600px] lg:h-[680px]",
                columnVisibility,
              )}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-zinc-900 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-zinc-900 to-transparent" />
              <div className="absolute inset-0 border border-zinc-700/40 bg-zinc-800/20" />

              <div className="relative h-full overflow-hidden">
                <div
                  className={cn(
                    "news-wall-marquee flex flex-col gap-4 px-3 py-4 will-change-transform",
                    directionClass,
                  )}
                >
                  {loopItems.map((article, index) => (
                    <button
                      key={`${article._id}-${index}`}
                      type="button"
                      onClick={() => onOpen(article._id)}
                      className={cn(
                        "news-wall-card group/card flex flex-col gap-3 border border-zinc-700/60 bg-zinc-800/60 px-4 py-3 text-left backdrop-blur-sm",
                        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
                        "transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-[0_0_24px_rgba(245,158,11,0.12)]",
                        HEIGHT_CLASSES[index % HEIGHT_CLASSES.length],
                      )}
                    >
                      <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-wide text-amber-500/80">
                        <span className="truncate">
                          {formatCategory(article.category)}
                        </span>
                        <span className="text-zinc-500">
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-white line-clamp-3">
                        {article.title}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {article.source}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .marquee-up {
          animation: marquee-up 42s linear infinite;
        }

        .marquee-down {
          animation: marquee-down 46s linear infinite;
        }

        .news-wall-column:hover .marquee-up,
        .news-wall-column:hover .marquee-down,
        .news-wall-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes marquee-down {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-up,
          .marquee-down {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
