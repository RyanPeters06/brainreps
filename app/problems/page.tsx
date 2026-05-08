"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Category = "All" | "Memory" | "Quick Thinking" | "Critical Thinking" | "Attention Training" | "Cognitive Flexibility";
type Difficulty = "All" | "Easy" | "Medium" | "Hard";

const categoryColors: Record<string, { bg: string; text: string }> = {
  "Memory":                { bg: "#1E1828", text: "#9B82C4" },
  "Quick Thinking":        { bg: "#221A12", text: "#B87E4A" },
  "Critical Thinking":     { bg: "#121828", text: "#4A82B8" },
  "Attention Training":    { bg: "#121E16", text: "#4A9B6A" },
  "Cognitive Flexibility": { bg: "#22121C", text: "#B84A82" },
};

const difficultyConfig: Record<string, { text: string; bg: string }> = {
  Easy:   { text: "#2DB55D", bg: "#1A2E22" },
  Medium: { text: "#C96B8A", bg: "#2E1A22" },
  Hard:   { text: "#EF4444", bg: "#2E1A1A" },
};

const exercises = [
  { num: "001", title: "Sequence Recall",  slug: "sequence-recall",  category: "Memory",               difficulty: "Easy",   time: "2 min", built: true,  route: "/exercises/memory-sequence" },
  { num: "002", title: "Word Pairs",       slug: "word-pairs",       category: "Memory",               difficulty: "Medium", time: "3 min", built: false, route: null },
  { num: "003", title: "Rapid Sort",       slug: "rapid-sort",       category: "Quick Thinking",       difficulty: "Easy",   time: "2 min", built: false, route: null },
  { num: "004", title: "Stroop Challenge", slug: "stroop-challenge", category: "Attention Training",   difficulty: "Medium", time: "3 min", built: false, route: null },
  { num: "005", title: "Pattern Breaker",  slug: "pattern-breaker",  category: "Critical Thinking",    difficulty: "Medium", time: "4 min", built: false, route: null },
  { num: "006", title: "Mini Logic Grid",  slug: "mini-logic-grid",  category: "Critical Thinking",    difficulty: "Hard",   time: "5 min", built: false, route: null },
  { num: "007", title: "Focus Filter",     slug: "focus-filter",     category: "Attention Training",   difficulty: "Medium", time: "3 min", built: false, route: null },
  { num: "008", title: "Sustained Watch",  slug: "sustained-watch",  category: "Attention Training",   difficulty: "Hard",   time: "5 min", built: false, route: null },
  { num: "009", title: "Task Switch",      slug: "task-switch",      category: "Cognitive Flexibility", difficulty: "Hard",  time: "4 min", built: false, route: null },
  { num: "010", title: "Reverse It",       slug: "reverse-it",       category: "Cognitive Flexibility", difficulty: "Easy",  time: "2 min", built: false, route: null },
];

const categories: Category[] = ["All", "Memory", "Quick Thinking", "Critical Thinking", "Attention Training", "Cognitive Flexibility"];
const difficulties: Difficulty[] = ["All", "Easy", "Medium", "Hard"];

export default function ProblemsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory]   = useState<Category>("All");
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>("All");
  const [hoveredRow, setHoveredRow]           = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn]           = useState<boolean | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  const filtered = exercises.filter((ex) => {
    const catMatch  = activeCategory === "All"   || ex.category   === activeCategory;
    const diffMatch = activeDifficulty === "All" || ex.difficulty === activeDifficulty;
    return catMatch && diffMatch;
  });

  function handleRowClick(ex: typeof exercises[0]) {
    router.push(ex.route ?? `/problems/${ex.slug}`);
  }

  return (
    <div style={{ backgroundColor: "#1A1A1A" }} className="min-h-screen text-white">
      <nav
        style={{ backgroundColor: "#1F1F1F", borderBottom: "1px solid #3A3A3A" }}
        className="flex items-center justify-between px-6 py-4 md:px-12"
      >
        <span style={{ color: "#C96B8A" }} className="text-base font-medium">
          BrainReps
        </span>
        <div className="flex items-center gap-5 text-sm">
          {isLoggedIn === true && (
            <Link href="/dashboard" style={{ color: "#8A8A8A" }} className="hover:text-white transition-colors">
              Dashboard
            </Link>
          )}
          {isLoggedIn === false && (
            <>
              <Link href="/login" style={{ color: "#8A8A8A" }} className="hover:text-white transition-colors">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 rounded text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#C96B8A", color: "#fff" }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-medium mb-1">Training Library</h1>
          <p className="text-sm" style={{ color: "#8A8A8A" }}>These aren&apos;t games. They&apos;re reps.</p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1 rounded text-sm transition-all duration-150"
              style={{
                backgroundColor: activeCategory === cat ? "#C96B8A" : "#262626",
                color:           activeCategory === cat ? "#fff"     : "#8A8A8A",
                border:          activeCategory === cat ? "1px solid #C96B8A" : "1px solid #3A3A3A",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty filters */}
        <div className="flex gap-2 mb-8 items-center">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setActiveDifficulty(diff)}
              className="px-3 py-1 rounded text-sm transition-all duration-150"
              style={{
                backgroundColor: activeDifficulty === diff ? "#262626" : "transparent",
                color: activeDifficulty === diff
                  ? diff === "All" ? "#fff" : difficultyConfig[diff]?.text
                  : "#5A5A5A",
                border: `1px solid ${activeDifficulty === diff ? "#3A3A3A" : "transparent"}`,
              }}
            >
              {diff}
            </button>
          ))}
          <span className="ml-auto text-xs" style={{ color: "#5A5A5A" }}>
            {filtered.length} exercise{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2E2E2E" }}>
          {/* Header */}
          <div
            className="grid px-4 py-2.5 text-xs uppercase tracking-widest"
            style={{
              gridTemplateColumns: "3rem 1fr 11rem 6rem 5rem 3rem",
              color: "#5A5A5A",
              borderBottom: "1px solid #2E2E2E",
              backgroundColor: "#1F1F1F",
            }}
          >
            <span>#</span>
            <span>Title</span>
            <span>Category</span>
            <span>Difficulty</span>
            <span>Time</span>
            <span></span>
          </div>

          {filtered.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm" style={{ color: "#5A5A5A" }}>
              No exercises match these filters.
            </div>
          ) : (
            filtered.map((ex) => {
              const cat   = categoryColors[ex.category];
              const diff  = difficultyConfig[ex.difficulty];
              const isHov = hoveredRow === ex.slug;
              return (
                <div
                  key={ex.slug}
                  onClick={() => handleRowClick(ex)}
                  onMouseEnter={() => setHoveredRow(ex.slug)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className="grid items-center px-4 py-3.5 cursor-pointer transition-colors duration-100"
                  style={{
                    gridTemplateColumns: "3rem 1fr 11rem 6rem 5rem 3rem",
                    backgroundColor: isHov ? "#2A2A2A" : "transparent",
                    borderBottom: "1px solid #2E2E2E",
                  }}
                >
                  <span className="text-xs font-mono" style={{ color: "#5A5A5A" }}>{ex.num}</span>

                  <span
                    className="text-sm transition-colors duration-100"
                    style={{ color: isHov ? "#C96B8A" : "#fff" }}
                  >
                    {ex.title}
                  </span>

                  <span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor: cat.bg, color: cat.text }}
                    >
                      {ex.category}
                    </span>
                  </span>

                  <span className="text-sm" style={{ color: diff.text }}>
                    {ex.difficulty}
                  </span>

                  <span className="text-sm" style={{ color: "#5A5A5A" }}>{ex.time}</span>

                  <span className="text-xs" style={{ color: ex.built ? "#2DB55D" : "#3A3A3A" }}>
                    {ex.built ? "●" : "○"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
