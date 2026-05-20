"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Phase = "play" | "result";

const SHAPES = ["Circle", "Square", "Triangle"] as const;
const ITEM_COLORS = ["Red", "Blue", "Green"] as const;
const SHAPE_GLYPH: Record<string, string> = { Circle: "●", Square: "■", Triangle: "▲" };
const COLOR_HEX: Record<string, string> = { Red: "#EF4444", Blue: "#4A82B8", Green: "#2DB55D" };
const RULES = ["Select RED items", "Select CIRCLES", "Select BLUE items"] as const;
const TOTAL = 15;

type Item = { shape: string; color: string };

function generateItems(): Item[] {
  return Array.from({ length: TOTAL }, () => ({
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    color: ITEM_COLORS[Math.floor(Math.random() * ITEM_COLORS.length)],
  }));
}

function matchesRule(item: Item, ruleIdx: number): boolean {
  if (ruleIdx === 0) return item.color === "Red";
  if (ruleIdx === 1) return item.shape === "Circle";
  return item.color === "Blue";
}

export default function ShapeShifterPage() {
  const [phase, setPhase] = useState<Phase>("play");
  const [items] = useState<Item[]>(generateItems);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  const ruleIdx = Math.floor(current / 5) % RULES.length;
  const item = items[current];

  function answer(userSaysMatch: boolean) {
    const correct = matchesRule(item, ruleIdx) === userSaysMatch;
    if (correct) setScore((s) => s + 1);
    setVisible(false);
    setTimeout(() => {
      const next = current + 1;
      if (next >= TOTAL) setPhase("result");
      else setCurrent(next);
      setVisible(true);
    }, 200);
  }

  const handleTryAgain = useCallback(() => window.location.reload(), []);
  const showBanner = phase === "result" && isLoggedIn === false && !bannerDismissed;
  const pct = Math.round((score / TOTAL) * 100);

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center pb-16" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s ease" }}>
        {phase === "play" && (
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>{current + 1} / {TOTAL}</p>
              <p className="text-lg font-semibold" style={{ color: "#C96B8A" }}>{RULES[ruleIdx]}</p>
            </div>
            <p style={{ fontSize: 80, color: COLOR_HEX[item.color], lineHeight: 1 }}>{SHAPE_GLYPH[item.shape]}</p>
            <div className="flex gap-4">
              <button onClick={() => answer(true)}
                className="px-8 py-4 rounded text-lg font-medium hover:opacity-90"
                style={{ backgroundColor: "#1A2E22", border: "1px solid #2DB55D", color: "#2DB55D" }}>
                ✓ Matches
              </button>
              <button onClick={() => answer(false)}
                className="px-8 py-4 rounded text-lg font-medium hover:opacity-90"
                style={{ backgroundColor: "#2E1A1A", border: "1px solid #EF4444", color: "#EF4444" }}>
                ✗ No Match
              </button>
            </div>
          </div>
        )}
        {phase === "result" && (
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Results</p>
              <p className="text-4xl font-medium">
                <span style={{ color: "#C96B8A" }}>{score}</span>
                <span style={{ color: "#3A3A3A" }}>/{TOTAL}</span>
                <span className="text-xl font-normal ml-2" style={{ color: "#8A8A8A" }}>Correct</span>
              </p>
              <p className="text-sm mt-1" style={{ color: "#8A8A8A" }}>{pct}% accuracy</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleTryAgain} className="px-5 py-2 rounded text-sm font-medium hover:text-white transition-colors"
                style={{ border: "1px solid #3A3A3A", color: "#8A8A8A", backgroundColor: "transparent" }}>Try Again</button>
              <Link href="/problems" className="px-5 py-2 rounded text-sm font-medium hover:opacity-90"
                style={{ backgroundColor: "#C96B8A", color: "#fff" }}>Next Exercise</Link>
            </div>
          </div>
        )}
      </div>
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between gap-4 px-6 py-3 md:px-12"
          style={{ backgroundColor: "#1F1F1F", borderTop: "1px solid #3A3A3A" }}>
          <p className="text-sm" style={{ color: "#8A8A8A" }}>Want to save your progress and build a streak?</p>
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/signup" className="px-4 py-1.5 rounded text-sm font-medium hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: "#C96B8A", color: "#fff" }}>Create Free Account</Link>
            <button onClick={() => setBannerDismissed(true)} className="text-xs hover:text-white whitespace-nowrap" style={{ color: "#5A5A5A" }}>Maybe later</button>
          </div>
        </div>
      )}
    </div>
  );
}
