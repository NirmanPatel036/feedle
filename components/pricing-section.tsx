"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  label: string;
  description: string;
  features: string[];
  context: string;
}

const plans: PricingPlan[] = [
  {
    id: "global",
    name: "Global Pulse",
    label: "24/7 Coverage",
    description:
      "World affairs, geopolitics, and policy updates as they happen.",
    features: [
      "World headlines",
      "Politics & policy",
      "Environment & climate",
      "Breaking updates",
    ],
    context: "Best for staying ahead of global events and policy shifts.",
  },
  {
    id: "business",
    name: "Markets & Tech",
    label: "Live Market Pulse",
    description: "Business, startups, science, and technology in one stream.",
    features: [
      "Business & markets",
      "Technology & startups",
      "Science breakthroughs",
      "Health innovations",
    ],
    context: "Ideal for founders, analysts, and builders who follow momentum.",
  },
  {
    id: "culture",
    name: "Culture & Life",
    label: "Daily Briefings",
    description:
      "Culture, sports, travel, and entertainment from around the world.",
    features: [
      "Culture & arts",
      "Sports highlights",
      "Travel inspiration",
      "Entertainment news",
    ],
    context: "Perfect for lifestyle readers who want smart, lighter coverage.",
  },
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="w-full bg-zinc-900 py-24 md:py-32 border-b border-zinc-700/30"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-4 py-2 border border-zinc-700 w-fit">
            <div className="w-2.5 h-2.5 bg-amber-500" />
            <span className="text-sm font-medium text-zinc-400 tracking-wide">
              Coverage
            </span>
          </div>
          <h2 className="text-balance text-4xl md:text-5xl tracking-tight leading-tight font-normal text-white">
            <span className="block">
              {"Explore the coverage".split(" ").map((word, i) => (
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
            </span>
            <span className="block text-zinc-500">
              {"that fits your interests".split(" ").map((word, i) => (
                <motion.span
                  key={i + 3}
                  initial={{ filter: "blur(10px)", opacity: 0 }}
                  whileInView={{ filter: "blur(0px)", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i + 3) * 0.05 }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h2>
        </div>

        {/* Highlights and Plans Container */}
        <div className="flex flex-col gap-10 w-full">
          {/* Coverage Highlights */}
          <div className="flex flex-wrap items-center gap-3 border border-zinc-700/50 bg-zinc-800/30 px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-amber-500">
              Coverage highlights
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span className="text-sm text-zinc-400">
              Updated every 15 minutes
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span className="text-sm text-zinc-400">
              Multi-source APIs + RSS
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span className="text-sm text-zinc-400">
              Personalized subscriptions
            </span>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{
                  scale: 1.02,
                }}
                className="relative flex flex-col gap-6 p-6 transition-all duration-300 bg-zinc-800/50 border border-zinc-700/50"
              >
                {/* Card Head */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-normal text-white">
                      {plan.name}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-normal text-white tracking-tight">
                      {plan.label}
                    </h3>
                    <span className="text-xs uppercase tracking-wide text-amber-500/80">
                      Coverage
                    </span>
                  </div>

                  <p className="text-balance text-sm leading-relaxed text-zinc-400 min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                <div className="border border-zinc-700/50 bg-zinc-900/40 px-4 py-3 text-xs text-zinc-400">
                  {plan.context}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-[1px] bg-zinc-700" />
                  <span className="text-xs text-zinc-500 shrink-0">
                    Features
                  </span>
                  <div className="flex-1 h-[1px] bg-zinc-700" />
                </div>

                {/* Features List */}
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 group">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
