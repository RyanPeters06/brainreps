"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { exercises, categoryColors, difficultyConfig } from "@/lib/exercises";

export default function Home() {
  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-16 md:py-20">
        <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#C96B8A" }}>
          Cognitive Training
        </p>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-4 max-w-lg">
          Train your brain. Zero fluff.
        </h1>
        <p className="text-base mb-8 max-w-md" style={{ color: "#8A8A8A" }}>
          Science-backed training across memory, attention, logic, and flexibility.
          No account required to start.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/problems"
            className="px-5 py-2.5 rounded text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#C96B8A", color: "#fff" }}
          >
            Start Training
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded text-sm transition-colors hover:text-white"
            style={{ border: "1px solid #3A3A3A", color: "#8A8A8A" }}
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Exercise grid */}
      <section style={{ borderTop: "1px solid #2E2E2E" }} className="px-6 py-12 md:py-16">
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <p className="text-xs uppercase tracking-widest mb-8 text-center" style={{ color: "#5A5A5A" }}>
            The Library
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {exercises.map((ex) => {
              const cat = categoryColors[ex.category];
              const diff = difficultyConfig[ex.difficulty];
              return (
                <Link
                  key={ex.slug}
                  href={ex.route!}
                  className="group rounded-lg p-5 flex flex-col gap-3 transition-colors"
                  style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C96B8A")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3A3A3A")}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs tabular-nums" style={{ color: "#5A5A5A" }}>#{ex.num}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: diff.bg, color: diff.text }}
                    >
                      {ex.difficulty}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">{ex.title}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: cat.bg, color: cat.text }}
                    >
                      {ex.category}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#5A5A5A" }}>{ex.benefit}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ borderTop: "1px solid #2E2E2E" }} className="px-6 py-12 text-center">
        <p className="text-sm mb-4" style={{ color: "#8A8A8A" }}>
          Sign up to save your progress, build streaks, and track improvement.
        </p>
        <Link
          href="/signup"
          className="inline-block px-6 py-2.5 rounded text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#C96B8A", color: "#fff" }}
        >
          Create Free Account
        </Link>
      </section>
    </div>
  );
}
