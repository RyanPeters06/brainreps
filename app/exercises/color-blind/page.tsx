"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Phase = "play" | "result";

const COLORS = ["Red", "Blue", "Green", "Yellow"] as const;
type Color = typeof COLORS[number];
const COLOR_HEX: Record<Color, string> = {
  Red: "#EF4444", Blue: "#4A82B8", Green: "#2DB55D", Yellow: "#E8C547",
};
const TOTAL = 20;
const TIMER_DURATION = 3000;

type Item = { word: Color; ink: Color };

function generateItems(): Item[] {
  return Array.from({ length: TOTAL }, () => {
    const word = COLORS[Math.floor(Math.random() * COLORS.length)];
    const others = COLORS.filter((c) => c !== word);
    const ink = others[Math.floor(Math.random() * others.length)];
    return { word, ink };
  });
}

export default function ColorBlindPage() {
  const [phase, setPhase] = useState<Phase>("play");
  const [items] = useState<Item[]>(generateItems);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const startTime = useRef<number>(Date.now());
  const animFrame = useRef<number | null>(null);
  const answered = useRef(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  const advance = useCallback((chosen: Color | null) => {
    if (answered.current) return;
    answered.current = true;
    if (animFrame.current) cancelAnimationFrame(animFrame.current);

    const correct = chosen === items[current].ink;
    if (correct) setScore((s) => s + 1);

    setVisible(false);
    setTimeout(() => {
      const nextIdx = current + 1;
      if (nextIdx >= TOTAL) {
        setPhase("result");
      } else {
        setCurrent(nextIdx);
        setProgress(100);
        answered.current = false;
      }
      setVisible(true);
    }, 300);
  }, [current, items]);

  useEffect(() => {
    if (phase !== "play") return;
    answered.current = false;
    startTime.current = Date.now();
    function tick() {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, 100 - (elapsed / TIMER_DURATION) * 100);
      setProgress(remaining);
      if (remaining > 0) {
        animFrame.current = requestAnimationFrame(tick);
      } else {
        advance(null);
      }
    }
    animFrame.current = requestAnimationFrame(tick);
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current); };
  }, [phase, current, advance]);

  const handleTryAgain = useCallback(() => {
    window.location.reload();
  }, []);

  const showBanner = phase === "result" && isLoggedIn === false && !bannerDismissed;
  const pct = Math.round((score / TOTAL) * 100);

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white flex flex-col">
      <Navbar />
      <div style={{ height: 2, backgroundColor: "#2E2E2E" }}>
        <div style={{ height: "100%", width: `${phase === "play" ? progress : 0}%`, backgroundColor: "#C96B8A", transition: "none" }} />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center pb-16" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}>
        {phase === "play" && (
          <div className="flex flex-col items-center gap-10">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>{current + 1} / {TOTAL} — Tap the ink color</p>
            <p className="text-6xl md:text-7xl font-bold" style={{ color: COLOR_HEX[items[current].ink] }}>
              {items[current].word}
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              {COLORS.map((c) => (
                <button key={c} onClick={() => advance(c)}
                  className="w-16 h-16 rounded-full hover:opacity-80 transition-opacity border-2"
                  style={{ backgroundColor: COLOR_HEX[c], borderColor: COLOR_HEX[c] }}
                  aria-label={c} />
              ))}
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
