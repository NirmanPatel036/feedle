"use client";

import React from "react";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
  idPrefix?: string;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onChange,
  idPrefix = "tab",
}: CategoryTabsProps) {
  return (
    <div className="mb-8 flex flex-nowrap gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const slug = category.toLowerCase().replace(/\s+/g, "-");
        return (
          <button
            key={category}
            id={`${idPrefix}-${slug}`}
            onClick={() => onChange(category)}
            className={`shrink-0 px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeCategory === category
                ? "bg-amber-500 text-black"
                : "border border-zinc-700 bg-transparent text-zinc-400 hover:border-zinc-500 hover:text-white"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
