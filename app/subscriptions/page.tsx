"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Circle, Newspaper } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const CATEGORY_OPTIONS = [
  { label: "Technology", value: "technology" },
  { label: "Business", value: "business" },
  { label: "World", value: "world" },
  { label: "Politics", value: "politics" },
  { label: "Science", value: "science" },
  { label: "Health", value: "health" },
  { label: "Sports", value: "sports" },
  { label: "Environment", value: "environment" },
  { label: "Culture", value: "culture" },
  { label: "Travel", value: "travel" },
  { label: "Entertainment", value: "entertainment" },
] as const;

export default function SubscriptionsPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [subscribed, setSubscribed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<Set<string>>(new Set());

  // Auth guard
  useEffect(() => {
    if (token === null && !loading) return; // still mounting
    // Give AuthContext time to hydrate from localStorage
    const timer = setTimeout(() => {
      if (!localStorage.getItem("feedle_token")) {
        router.push("/register");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [token, loading, router]);

  // Fetch current subscriptions
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .get("/api/subscriptions")
      .then(({ data }) => {
        const topics: string[] = Array.isArray(data)
          ? data
          : (data.subscriptions ?? []);
        setSubscribed(
          new Set(topics.map((topic) => String(topic).toLowerCase().trim())),
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleToggle = async (topic: string) => {
    const normalized = topic.toLowerCase();
    const isSubscribed = subscribed.has(normalized);
    // Optimistic update
    setSubscribed((prev) => {
      const next = new Set(prev);
      if (isSubscribed) {
        next.delete(normalized);
      } else {
        next.add(normalized);
      }
      return next;
    });
    setToggling((prev) => new Set(prev).add(normalized));

    try {
      if (isSubscribed) {
        await api.delete(`/api/subscriptions/${normalized}`);
      } else {
        await api.post("/api/subscriptions", { topic: normalized });
      }
    } catch {
      // Rollback on error
      setSubscribed((prev) => {
        const next = new Set(prev);
        if (isSubscribed) {
          next.add(normalized);
        } else {
          next.delete(normalized);
        }
        return next;
      });
    } finally {
      setToggling((prev) => {
        const next = new Set(prev);
        next.delete(normalized);
        return next;
      });
    }
  };

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

      <main className="mx-auto max-w-2xl px-6 py-16 md:px-12">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3 border border-zinc-700 px-4 py-2 w-fit">
            <div className="h-2.5 w-2.5 bg-amber-500" />
            <span className="text-sm font-medium text-zinc-400 tracking-wide">
              Subscriptions
            </span>
          </div>
          <h1 className="text-3xl font-normal tracking-tight text-white md:text-4xl">
            Your Interests
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Toggle topics to personalise your feed.
          </p>
        </div>

        {/* Category list */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse bg-zinc-800/50 border border-zinc-700/30"
              />
            ))}
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {CATEGORY_OPTIONS.map((option) => {
              const isOn = subscribed.has(option.value);
              const isToggling = toggling.has(option.value);
              return (
                <li key={option.value}>
                  <button
                    id={`sub-toggle-${option.value}`}
                    onClick={() => handleToggle(option.value)}
                    disabled={isToggling}
                    className={`group flex w-full items-center justify-between border px-6 py-4 text-left transition-all duration-200 ${
                      isOn
                        ? "border-amber-500/40 bg-amber-500/5"
                        : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600"
                    }`}
                  >
                    <span
                      className={`text-base font-medium transition-colors ${
                        isOn
                          ? "text-white"
                          : "text-zinc-400 group-hover:text-white"
                      }`}
                    >
                      {option.label}
                    </span>
                    {isOn ? (
                      <CheckCircle2 className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
