import Link from "next/link";
import { Newspaper } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-900">
      <nav className="sticky top-0 z-50 border-b border-zinc-700/30 bg-zinc-900/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Newspaper className="h-5 w-5 text-amber-500" />
            <span className="font-medium">Feedle</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-12">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3 border border-zinc-700 px-4 py-2 w-fit">
            <div className="h-2.5 w-2.5 bg-amber-500" />
            <span className="text-sm font-medium text-zinc-400 tracking-wide">
              Privacy
            </span>
          </div>
          <h1 className="text-3xl font-normal tracking-tight text-white md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Short and simple summary of how Feedle handles data.
          </p>
        </div>

        <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-medium text-white">What we collect</h2>
            <p>
              We store your account email, hashed password, and any preferences
              such as bookmarks and subscriptions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-white">How we use it</h2>
            <p>
              We use your data to authenticate you, personalize your feed, and
              keep your saved items available across sessions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-white">Cookies & storage</h2>
            <p>
              We store a session token in local storage to keep you signed in.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-white">Third-party APIs</h2>
            <p>
              Article content and images come from external providers (NewsAPI,
              GNews, Guardian, and RSS feeds). Their policies apply to that
              content.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-white">Contact</h2>
            <p>
              If you have questions, reach out to the project maintainer.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
