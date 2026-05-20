"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import {
  exercises,
  categoryList,
  categoryColors,
  difficultyConfig,
  dailyChallenge,
} from "@/lib/exercises";

type Difficulty = "All" | "Easy" | "Medium" | "Hard";

const categoryCounts = Object.fromEntries(
  categoryList.slice(1).map((cat) => [cat, exercises.filter((e) => e.category === cat).length])
);

export default function ProblemsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>("All");
  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        setUserEmail(data.user?.email ?? null);
        setLoaded(true);
      });
  }, []);

  const filtered = exercises.filter((ex) => {
    const catMatch  = activeCategory === "All" || ex.category === activeCategory;
    const diffMatch = activeDifficulty === "All" || ex.difficulty === activeDifficulty;
    const searchMatch = search === "" || ex.title.toLowerCase().includes(search.toLowerCase());
    return catMatch && diffMatch && searchMatch;
  });

  const username = userEmail ? userEmail.split("@")[0] : "Guest";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", backgroundColor: "#1A1A1A" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      {/* ── SIDEBAR ── */}
      <aside
        className="hidden lg:flex flex-col shrink-0"
        style={{
          width: 260,
          height: "100%",
          overflowY: "auto",
          backgroundColor: "#1F1F1F",
          borderRight: "1px solid #3A3A3A",
        }}
      >

        {/* User profile */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #2E2E2E" }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex items-center justify-center rounded-full text-xs font-medium shrink-0"
              style={{
                width: 36,
                height: 36,
                backgroundColor: loaded && userEmail ? "#2E1A22" : "#262626",
                color: loaded && userEmail ? "#C96B8A" : "#5A5A5A",
                border: "1px solid #3A3A3A",
              }}
            >
              {loaded && userEmail ? username[0].toUpperCase() : "?"}
            </div>
            <div>
              <p className="text-sm font-medium leading-tight">{username}</p>
              <p className="text-xs" style={{ color: "#5A5A5A" }}>
                {loaded && userEmail ? userEmail : "Not signed in"}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs" style={{ color: "#5A5A5A" }}>
            <span className="flex items-center gap-1">
              <span>🔥</span>
              <span>{loaded && userEmail ? "3" : "—"} day streak</span>
            </span>
            <span style={{ color: "#8A8A8A" }}>
              {loaded && userEmail ? "1" : "0"} / {exercises.length} solved
            </span>
          </div>
        </div>

        {/* Category nav */}
        <div style={{ padding: "12px 12px", borderBottom: "1px solid #2E2E2E" }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#5A5A5A", padding: "0 8px" }}>
            Categories
          </p>
          <button
            onClick={() => setActiveCategory("All")}
            className="w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors"
            style={{
              backgroundColor: activeCategory === "All" ? "#2E1A22" : "transparent",
              color: activeCategory === "All" ? "#C96B8A" : "#8A8A8A",
            }}
          >
            <span>All Exercises</span>
            <span className="text-xs" style={{ color: "#5A5A5A" }}>{exercises.length}</span>
          </button>
          {categoryList.slice(1).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors"
              style={{
                backgroundColor: activeCategory === cat ? "#2E1A22" : "transparent",
                color: activeCategory === cat ? "#C96B8A" : "#8A8A8A",
              }}
            >
              <span>{cat}</span>
              <span className="text-xs" style={{ color: "#5A5A5A" }}>{categoryCounts[cat]}</span>
            </button>
          ))}
        </div>

        {/* Sign in CTA */}
        {loaded && !userEmail && (
          <div style={{ padding: "16px 20px", marginTop: "auto", borderTop: "1px solid #2E2E2E" }}>
            <p className="text-xs mb-3" style={{ color: "#5A5A5A" }}>
              Sign in to save your progress and build a streak.
            </p>
            <Link
              href="/login"
              className="block text-center py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#C96B8A", color: "#fff" }}
            >
              Sign In
            </Link>
          </div>
        )}
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, height: "100%", overflowY: "auto" }} className="text-white">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 48px" }}>

          {/* Daily Challenge banner */}
          <div
            className="rounded-lg p-4 mb-6 flex items-center justify-between gap-4"
            style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
          >
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "#C96B8A" }}>
                Daily Challenge
              </p>
              <p className="text-sm font-medium">{dailyChallenge.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "#5A5A5A" }}>
                {dailyChallenge.category} · {dailyChallenge.difficulty} · {dailyChallenge.time}
              </p>
            </div>
            <Link
              href={dailyChallenge.route ?? `/problems/${dailyChallenge.slug}`}
              className="px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
              style={{ backgroundColor: "#C96B8A", color: "#fff" }}
            >
              Start Challenge
            </Link>
          </div>

          {/* Search + filters */}
          <div className="flex gap-2 mb-5 flex-wrap">
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 rounded text-sm text-white placeholder-[#5A5A5A] focus:outline-none transition-colors"
              style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
              onFocus={(e) => (e.target.style.borderColor = "#C96B8A")}
              onBlur={(e) => (e.target.style.borderColor = "#3A3A3A")}
            />
            <select
              value={activeDifficulty}
              onChange={(e) => setActiveDifficulty(e.target.value as Difficulty)}
              className="px-3 py-2 rounded text-sm focus:outline-none"
              style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A", color: "#8A8A8A" }}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            {/* Mobile-only category select */}
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="lg:hidden px-3 py-2 rounded text-sm focus:outline-none"
              style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A", color: "#8A8A8A" }}
            >
              {categoryList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2E2E2E" }}>
            {/* Header */}
            <div
              className="grid text-xs uppercase tracking-widest px-4 py-2.5"
              style={{
                gridTemplateColumns: "3rem 1fr 9rem 6rem 5rem 5rem",
                color: "#5A5A5A",
                backgroundColor: "#1F1F1F",
                borderBottom: "1px solid #2E2E2E",
              }}
            >
              <span>#</span>
              <span>Title</span>
              <span>Category</span>
              <span>Difficulty</span>
              <span>Time</span>
              <span>Rate</span>
            </div>

            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm" style={{ color: "#5A5A5A" }}>
                No exercises match your filters.
              </div>
            ) : (
              filtered.map((ex, idx) => {
                const cat  = categoryColors[ex.category];
                const diff = difficultyConfig[ex.difficulty];
                const isHov = hoveredRow === ex.slug;
                return (
                  <div
                    key={ex.slug}
                    onClick={() => router.push(`/problems/${ex.slug}`)}
                    onMouseEnter={() => setHoveredRow(ex.slug)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="grid items-start px-4 py-3 cursor-pointer transition-colors duration-100"
                    style={{
                      gridTemplateColumns: "3rem 1fr 9rem 6rem 5rem 5rem",
                      backgroundColor: isHov ? "#222222" : idx % 2 === 0 ? "transparent" : "#1D1D1D",
                      borderBottom: "1px solid #222222",
                    }}
                  >
                    <span className="text-xs font-mono pt-0.5" style={{ color: "#5A5A5A" }}>{ex.num}</span>

                    <div>
                      <span
                        className="text-sm transition-colors duration-100 block leading-snug"
                        style={{ color: isHov ? "#C96B8A" : "#E5E5E5" }}
                      >
                        {ex.title}
                      </span>
                      <span className="text-xs block mt-0.5" style={{ color: "#5A5A5A" }}>
                        {ex.benefit}
                      </span>
                    </div>

                    <span className="pt-0.5">
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: cat.bg, color: cat.text }}
                      >
                        {ex.category}
                      </span>
                    </span>

                    <span className="text-sm pt-0.5" style={{ color: diff.text }}>{ex.difficulty}</span>

                    <span className="text-sm pt-0.5" style={{ color: "#5A5A5A" }}>{ex.time}</span>

                    <span className="text-xs pt-0.5" style={{ color: "#5A5A5A" }}>
                      {ex.completionRate}%
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <p className="text-xs mt-3 text-right" style={{ color: "#5A5A5A" }}>
            {filtered.length} of {exercises.length} exercises
          </p>
        </div>
      </main>
      </div>
    </div>
  );
}
