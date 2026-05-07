"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function CtaSection() {
  const DOTTED_GRID_STYLE: React.CSSProperties = {
    backgroundColor: "#080808",
    backgroundImage: [
      "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
      "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)",
    ].join(", "),
    backgroundSize: "28px 28px, 100% 100%",
  };

  return (
    <section
      className="relative w-full overflow-hidden min-h-[400px]"
      style={DOTTED_GRID_STYLE}
    >
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-24 md:py-32 lg:py-40 flex flex-col items-center text-center">
        <div className="max-w-3xl">
          <h2 className="text-balance text-4xl font-normal tracking-tight text-white md:text-5xl lg:text-6xl">
            {"Your news, your way. Start reading today."
              .split(" ")
              .map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ filter: "blur(10px)", opacity: 0 }}
                  whileInView={{ filter: "blur(0px)", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
          </h2>
          <p className="text-balance mt-6 mx-auto max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            Join thousands of readers who trust Feedle for their daily dose of
            high-quality, personalized journalism. No clutter, just news.
          </p>
          <Button
            size="lg"
            className="mt-8 bg-white px-8 text-black hover:bg-white/90"
            asChild
          >
            <Link href="/register">Get Started Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
