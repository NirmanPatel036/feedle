import Link from "next/link";
import { Newspaper } from "lucide-react";

export default function TermsPage() {
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
              Terms
            </span>
          </div>
          <h1 className="text-3xl font-normal tracking-tight text-white md:text-4xl">
            Terms of Use
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Simple guidelines for using Feedle.
          </p>
        </div>

        <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-medium text-white">Use of service</h2>
            <p>
              Feedle is provided as-is for reading and saving news. Do not misuse
              the service or attempt to disrupt it.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-white">Accounts</h2>
            <p>
              You are responsible for keeping your login credentials secure.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-white">Content</h2>
            <p>
              Article content and images are owned by their respective sources.
              Feedle only aggregates and links to them.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-medium text-white">Changes</h2>
            <p>
              We may update these terms as the project evolves. Continued use
              means you accept the latest version.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
