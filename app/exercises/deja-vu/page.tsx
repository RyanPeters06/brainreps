"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Phase = "memorize" | "recall" | "result";

const MEMORIZE_DURATION = 8000;
const PAIR_COUNT = 6;

const POOL: [string, string][] = [
  ["Storm", "Shelter"], ["Clock", "Tower"], ["Ocean", "Anchor"],
  ["Candle", "Shadow"], ["Iron", "Forge"], ["Crown", "Throne"],
  ["Arrow", "Quiver"], ["Glass", "Mirror"], ["Flame", "Phoenix"],
  ["Frost", "Ember"], ["Bridge", "Crossing"], ["Lens", "Focus"],
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickPairs(): [string, string][] {
  return shuffle(POOL).slice(0, PAIR_COUNT);
}

function buildOptions(correctRight: string, allPairs: [string, string][]): string[] {
  const others = allPairs.map(([, r]) => r).filter((r) => r !== correctRight);
  return shuffle([correctRight, ...shuffle(others).slice(0, 3)]);
}

export default function DejaVuPage() {
  const [phase, setPhase] = useState<Phase>("memorize");
  const [pairs] = useState<[string, string][]>(pickPairs);
  const [recallOrder] = useState<number[]>(() => shuffle(Array.from({ length: PAIR_COUNT }, (_, i) => i)));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const startTime = useRef<number>(Date.now());
  const animFrame = useRef<number | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  useEffect(() => {
    if (phase !== "memorize") return;
    startTime.current = Date.now();
    function tick() {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, 100 - (elapsed / MEMORIZE_DURATION) * 100);
      setProgress(remaining);
      if (remaining > 0) {
        animFrame.current = requestAnimationFrame(tick);
      } else {
        setVisible(false);
        setTimeout(() => {
          setOptions(buildOptions(pairs[recallOrder[0]][1], pairs));
          setPhase("recall");
          setVisible(true);
        }, 300);
      }
    }
    animFrame.current = requestAnimationFrame(tick);
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current); };
  }, [phase, pairs, recallOrder]);

  function handleAnswer(answer: string) {
    setAnswers((prev) => [...prev, answer]);
    const next = current + 1;
    setVisible(false);
    setTimeout(() => {
      if (next >= PAIR_COUNT) {
        setPhase("result");
      } else {
        setCurrent(next);
        setOptions(buildOptions(pairs[recallOrder[next]][1], pairs));
      }
      setVisible(true);
    }, 200);
  }

  const handleTryAgain = useCallback(() => window.location.reload(), []);
  const score = answers.filter((a, i) => a === pairs[recallOrder[i]][1]).length;
  const showBanner = phase === "result" && isLoggedIn === false && !bannerDismissed;

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white flex flex-col">
      <Navbar />
      <div style={{ height: 2, backgroundColor: "#2E2E2E" }}>
        <div style={{ height: "100%", width: `${phase === "memorize" ? progress : 0}%`, backgroundColor: "#C96B8A", transition: "none" }} />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center pb-16" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}>
        {phase === "memorize" && (
          <div className="flex flex-col items-center gap-8">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Memorize these pairs</p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              {pairs.map(([left, right], i) => (
                <div key={i} className="flex items-center justify-between rounded px-4 py-2.5"
                  style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}>
                  <span className="font-medium" style={{ color: "#C96B8A" }}>{left}</span>
                  <span style={{ color: "#5A5A5A" }}>→</span>
                  <span className="font-medium" style={{ color: "#fff" }}>{right}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {phase === "recall" && (
          <div className="flex flex-col items-center gap-8">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>{current + 1} / {PAIR_COUNT} — What pairs with...</p>
            <p className="text-4xl font-bold" style={{ color: "#C96B8A" }}>{pairs[recallOrder[current]][0]}</p>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {options.map((opt) => (
                <button key={opt} onClick={() => handleAnswer(opt)}
                  className="w-full px-4 py-2.5 rounded text-sm font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A", color: "#fff" }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
        {phase === "result" && (
          <div className="flex flex-col items-center gap-8 w-full max-w-xs">
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Results</p>
              <p className="text-4xl font-medium">
                <span style={{ color: "#C96B8A" }}>{score}</span>
                <span style={{ color: "#3A3A3A" }}>/{PAIR_COUNT}</span>
                <span className="text-xl font-normal ml-2" style={{ color: "#8A8A8A" }}>Correct</span>
              </p>
            </div>
            <div className="w-full flex flex-col gap-2">
              {recallOrder.map((pairIdx, i) => {
                const [left, right] = pairs[pairIdx];
                const correct = answers[i] === right;
                return (
                  <div key={i} className="flex items-center justify-between rounded px-3 py-2"
                    style={{ backgroundColor: "#262626", border: `1px solid ${correct ? "#2DB55D" : "#EF4444"}` }}>
                    <span className="text-sm font-medium" style={{ color: "#C96B8A" }}>{left}</span>
                    <span className="text-sm" style={{ color: "#5A5A5A" }}>→</span>
                    <span className="text-sm" style={{ color: correct ? "#2DB55D" : "#EF4444" }}>{right}</span>
                    <span className="text-sm ml-2" style={{ color: correct ? "#2DB55D" : "#EF4444" }}>{correct ? "✓" : "✗"}</span>
                  </div>
                );
              })}
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
