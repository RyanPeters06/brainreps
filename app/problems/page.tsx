"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Category = "All" | "Memory" | "Quick Thinking" | "Critical Thinking" | "Attention Training" | "Cognitive Flexibility";
type Difficulty = "All" | "Easy" | "Medium" | "Hard";

const categoryColors: Record<string, { bg: string; text: string }> = {
  Memory:               { bg: "rgba(168,85,247,0.15)",  text: "#c084fc" },
  "Quick Thinking":     { bg: "rgba(249,115,22,0.15)",  text: "#fb923c" },
  "Critical Thinking":  { bg: "rgba(59,130,246,0.15)",  text: "#60a5fa" },
  "Attention Training": { bg: "rgba(34,197,94,0.15)",   text: "#4ade80" },
  "Cognitive Flexibility": { bg: "rgba(236,72,153,0.15)", text: "#f472b6" },
};

const difficultyColors: Record<string, string> = {
  Easy:   "#4ade80",
  Medium: "#fbbf24",
  Hard:   "#f87171",
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
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>("All");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  const filtered = exercises.filter((ex) => {
    const catMatch = activeCategory === "All" || ex.category === activeCategory;
    const diffMatch = activeDifficulty === "All" || ex.difficulty === activeDifficulty;
    return catMatch && diffMatch;
  });

  function handleRowClick(ex: typeof exercises[0]) {
    if (ex.route) {
      router.push(ex.route);
    } else {
      router.push(`/problems/${ex.slug}`);
    }
  }

  return (
    <div style={{ backgroundColor: "#0A0A0A" }} className="min-h-screen text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 border-b border-white/5">
        <span style={{ color: "#ADFF2F" }} className="text-xl font-bold tracking-tight">
          BrainReps
        </span>
        <div className="flex items-center gap-5 text-sm">
          {isLoggedIn === true && (
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              Dashboard
            </Link>
          )}
          {isLoggedIn === false && (
            <>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                href="/signup"
                style={{ backgroundColor: "#ADFF2F", color: "#0A0A0A" }}
                className="px-4 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-1">Training Library</h1>
          <p className="text-gray-500 text-sm">These aren&apos;t games. They&apos;re reps.</p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: activeCategory === cat ? "#ADFF2F" : "rgba(255,255,255,0.06)",
                color: activeCategory === cat ? "#0A0A0A" : "#9ca3af",
                border: activeCategory === cat ? "none" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty filters */}
        <div className="flex gap-2 mb-8">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setActiveDifficulty(diff)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: activeDifficulty === diff ? "rgba(255,255,255,0.1)" : "transparent",
                color: activeDifficulty === diff
                  ? diff === "All" ? "white" : difficultyColors[diff]
                  : "#6b7280",
                border: `1px solid ${activeDifficulty === diff ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              {diff}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-600 self-center">
            {filtered.length} exercise{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-white/5 overflow-hidden">
          {/* Table header */}
          <div
            className="grid text-xs uppercase tracking-widest text-gray-600 px-5 py-3 border-b border-white/5"
            style={{ gridTemplateColumns: "3rem 1fr 10rem 6rem 5rem 3rem" }}
          >
            <span>#</span>
            <span>Title</span>
            <span>Category</span>
            <span>Difficulty</span>
            <span>Est. Time</span>
            <span></span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-gray-600 text-sm">
              No exercises match these filters.
            </div>
          ) : (
            filtered.map((ex) => {
              const cat = categoryColors[ex.category];
              const isHovered = hoveredRow === ex.slug;
              return (
                <div
                  key={ex.slug}
                  onClick={() => handleRowClick(ex)}
                  onMouseEnter={() => setHoveredRow(ex.slug)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className="grid items-center px-5 py-4 border-b border-white/5 last:border-0 cursor-pointer transition-colors duration-100"
                  style={{
                    gridTemplateColumns: "3rem 1fr 10rem 6rem 5rem 3rem",
                    backgroundColor: isHovered ? "rgba(255,255,255,0.04)" : "transparent",
                  }}
                >
                  {/* Number */}
                  <span className="text-xs text-gray-600 font-mono">{ex.num}</span>

                  {/* Title */}
                  <span
                    className="text-sm font-semibold transition-colors duration-100"
                    style={{ color: isHovered ? "#ADFF2F" : "white" }}
                  >
                    {ex.title}
                  </span>

                  {/* Category badge */}
                  <span>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: cat.bg, color: cat.text }}
                    >
                      {ex.category}
                    </span>
                  </span>

                  {/* Difficulty */}
                  <span
                    className="text-sm font-medium"
                    style={{ color: difficultyColors[ex.difficulty] }}
                  >
                    {ex.difficulty}
                  </span>

                  {/* Time */}
                  <span className="text-sm text-gray-500">{ex.time}</span>

                  {/* Status */}
                  <span className="text-gray-700 text-base">
                    {ex.built ? (
                      <span style={{ color: "#ADFF2F" }} title="Available">●</span>
                    ) : (
                      <span title="Coming soon">🔒</span>
                    )}
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
