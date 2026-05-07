"use client";

import { Button } from "@/components/ui/button";
import { Newspaper, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface GuardianAsset {
  file?: string;
  typeData?: { width?: number; height?: number };
}
interface GuardianElement {
  type?: string;
  assets?: GuardianAsset[];
}
interface GuardianResult {
  elements?: GuardianElement[];
}

function enhanceGuardianImage(url: string) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("width", "1800");
    parsed.searchParams.set("quality", "80");
    parsed.searchParams.set("dpr", "2");
    parsed.searchParams.set("fit", "bounds");
    return parsed.toString();
  } catch {
    return url;
  }
}

async function fetchGuardianImages(): Promise<string[]> {
  const apiKey = process.env.NEXT_PUBLIC_GUARDIAN_API_KEY;
  if (!apiKey || apiKey === "your_guardian_api_key_here") return [];

  const url =
    `https://content.guardianapis.com/search` +
    `?api-key=${apiKey}` +
    `&show-elements=image` +
    `&page-size=20` +
    `&order-by=newest` +
    `&type=article`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    const results: GuardianResult[] = data?.response?.results ?? [];

    return results
      .map((result) => {
        const imageEl = result.elements?.find((el) => el.type === "image");
        if (!imageEl) return null;

        // Pick the widest available rendition
        const best = [...(imageEl.assets ?? [])]
          .filter((a) => a.file && (a.typeData?.width ?? 0) > 0)
          .sort(
            (a, b) => (b.typeData?.width ?? 0) - (a.typeData?.width ?? 0),
          )[0];

        if (!best?.file) return null;
        return enhanceGuardianImage(best.file);
      })
      .filter((u): u is string => Boolean(u));
  } catch {
    return [];
  }
}

const LINE_2A = "Stay informed with stories";
const LINE_2B = "that matter to you.";

const DOTTED_GRID_STYLE: React.CSSProperties = {
  backgroundColor: "#080808",
  backgroundImage: [
    "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
    "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)",
  ].join(", "),
  backgroundSize: "28px 28px, 100% 100%",
};

export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();
  const initials = useMemo(() => {
    const source = user?.name || user?.email || "";
    const parts = source.split(" ").filter(Boolean);
    if (!parts.length) return "FU";
    const letters = parts.map((part) => part[0]).join("");
    return letters.slice(0, 2).toUpperCase();
  }, [user]);

  useEffect(() => {
    fetchGuardianImages().then((imgs) => {
      if (imgs.length > 0) setImages(imgs);
    });
  }, []);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(
      () => setCurrentIndex((p) => (p + 1) % images.length),
      6000,
    );
    return () => clearInterval(id);
  }, [images.length]);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background: Guardian image slider — dotted grid while loading / as fallback */}
      <div className="absolute inset-0">
        {images.length > 0 ? (
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${images[currentIndex]}')` }}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.32, 0.72, 0, 1] }}
            />
          </AnimatePresence>
        ) : (
          /* Minimal B&W dotted grid — pure CSS, no external image */
          <div className="absolute inset-0" style={DOTTED_GRID_STYLE} />
        )}
      </div>

      {/* Overlay — keeps text readable over both photos and the grid */}
      <div className="absolute inset-0 bg-slate-950/55" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Navigation */}
        <nav className="relative z-50 px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Newspaper className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Feedle</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-6 text-sm text-white/70 lg:flex">
              <a
                href="#about"
                onClick={(e) => scrollToSection(e, "about")}
                className="transition-colors hover:text-white"
              >
                About
              </a>
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, "features")}
                className="transition-colors hover:text-white"
              >
                Features
              </a>
              <a
                href="#testimonials"
                onClick={(e) => scrollToSection(e, "testimonials")}
                className="transition-colors hover:text-white"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, "pricing")}
                className="transition-colors hover:text-white"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={(e) => scrollToSection(e, "faq")}
                className="transition-colors hover:text-white"
              >
                FAQ
              </a>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-2 border border-zinc-700/60 bg-zinc-900/40 px-2.5 py-1.5">
                  <div className="flex h-7 w-7 items-center justify-center border border-amber-500/40 bg-amber-500/10 text-[10px] font-semibold text-amber-500">
                    {initials}
                  </div>
                  <div className="hidden sm:block text-right leading-tight">
                    <div className="text-xs text-white">
                      {user.name || "Feedle Member"}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {user.email}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/register"
                  className="hidden text-sm font-medium text-white transition-colors hover:text-white/80 lg:block"
                >
                  Get Started
                </Link>
              )}

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white lg:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute left-0 right-0 top-full bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-700/30 lg:hidden">
              <div className="flex flex-col px-6 py-6 gap-4">
                <a
                  href="#about"
                  className="text-white/70 transition-colors hover:text-white py-2"
                  onClick={(e) => scrollToSection(e, "about")}
                >
                  About
                </a>
                <a
                  href="#features"
                  className="text-white/70 transition-colors hover:text-white py-2"
                  onClick={(e) => scrollToSection(e, "features")}
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="text-white/70 transition-colors hover:text-white py-2"
                  onClick={(e) => scrollToSection(e, "testimonials")}
                >
                  Testimonials
                </a>
                <a
                  href="#pricing"
                  className="text-white/70 transition-colors hover:text-white py-2"
                  onClick={(e) => scrollToSection(e, "pricing")}
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  className="text-white/70 transition-colors hover:text-white py-2"
                  onClick={(e) => scrollToSection(e, "faq")}
                >
                  FAQ
                </a>
                <Link
                  href="/register"
                  className="mt-2 text-white font-medium py-2 border-t border-zinc-700/30"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="max-w-4xl text-5xl font-normal tracking-tight text-white md:text-6xl lg:text-7xl">
            {/* Line 1: "Stay informed with stories" */}
            <span className="block">
              {LINE_2A.split(" ").map((word, i) => (
                <motion.span
                  key={`l2a-${i}`}
                  initial={{ filter: "blur(10px)", opacity: 0 }}
                  whileInView={{ filter: "blur(0px)", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.05,
                  }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            {/* Line 2: "that matter to you." */}
            <span className="block">
              {LINE_2B.split(" ").map((word, i) => (
                <motion.span
                  key={`l2b-${i}`}
                  initial={{ filter: "blur(10px)", opacity: 0 }}
                  whileInView={{ filter: "blur(0px)", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: (LINE_2A.split(" ").length + i) * 0.05,
                  }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-center text-sm leading-relaxed text-white/70 md:text-base">
            Feedle curates articles from top sources across Technology,
            Business, Health, Science, Sports, and Entertainment — personalised
            to your interests.
          </p>

          {/* CTAs - Two buttons side by side */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-white px-6 text-slate-900 hover:bg-white/90"
              asChild
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/feed">Browse Feed</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator - At bottom */}
      </div>
    </section>
  );
}
