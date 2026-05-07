import { Suspense } from "react";
import FeedClient from "./FeedClient";

export default function FeedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-900">
          <div className="mx-auto max-w-7xl px-6 py-24 text-center text-zinc-400">
            Loading feed...
          </div>
        </div>
      }
    >
      <FeedClient />
    </Suspense>
  );
}
