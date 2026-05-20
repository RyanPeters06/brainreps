"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Phase = "show" | "track" | "answer" | "feedback" | "result";

const ROUNDS = 5;
const DOT_COUNT = 8;
const DOT_R = 8;
const W = 400;
const H = 300;
const SHOW_MS = 2000;
const TRACK_MS = 3000;
const FEEDBACK_MS = 1000;
const TICK_MS = 50;

type Dot = { x: number; y: number; vx: number; vy: number };

function randomDots(): Dot[] {
  return Array.from({ length: DOT_COUNT }, () => ({
    x: DOT_R + Math.random() * (W - DOT_R * 2),
    y: DOT_R + Math.random() * (H - DOT_R * 2),
    vx: (Math.random() * 4 - 2) || 1,
    vy: (Math.random() * 4 - 2) || 1,
  }));
}

function moveDots(dots: Dot[]): Dot[] {
  return dots.map((d) => {
    let { x, y, vx, vy } = d;
    x += vx; y += vy;
    if (x <= DOT_R || x >= W - DOT_R) { vx = -vx; x = Math.max(DOT_R, Math.min(W - DOT_R, x)); }
    if (y <= DOT_R || y >= H - DOT_R) { vy = -vy; y = Math.max(DOT_R, Math.min(H - DOT_R, y)); }
    return { x, y, vx, vy };
  });
}

export default function AirTrafficPage() {
  const [phase, setPhase] = useState<Phase>("show");
  const [round, setRound] = useState(0);
  const [dots, setDots] = useState<Dot[]>(randomDots);
  const [targetIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [trackMs, setTrackMs] = useState(TRACK_MS);
  const [visible, setVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  // Show phase: transition to track after SHOW_MS
  useEffect(() => {
    if (phase !== "show") return;
    const t = setTimeout(() => setPhase("track"), SHOW_MS);
    return () => clearTimeout(t);
  }, [phase, round]);

  // Track phase: animate dots, countdown
  useEffect(() => {
    if (phase !== "track") return;
    setTrackMs(TRACK_MS);
    let elapsed = 0;
    intervalRef.current = setInterval(() => {
      elapsed += TICK_MS;
      setDots((prev) => moveDots(prev));
      setTrackMs(Math.max(0, TRACK_MS - elapsed));
      if (elapsed >= TRACK_MS) {
        clearInterval(intervalRef.current!);
        setPhase("answer");
      }
    }, TICK_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, round]);

  function handleDotClick(idx: number) {
    if (phase !== "answer") return;
    setChosen(idx);
    const correct = idx === targetIdx;
    setResults((prev) => [...prev, correct]);
    setPhase("feedback");
    setTimeout(() => {
      const nextRound = round + 1;
      setVisible(false);
      setTimeout(() => {
        if (nextRound >= ROUNDS) {
          setPhase("result");
        } else {
          setRound(nextRound);
          setDots(randomDots());
          setChosen(null);
          setPhase("show");
        }
        setVisible(true);
      }, 300);
    }, FEEDBACK_MS);
  }

  const handleTryAgain = useCallback(() => {
    setPhase("show");
    setRound(0);
    setDots(randomDots());
    setChosen(null);
    setResults([]);
    setVisible(true);
  }, []);

  const score = results.filter(Boolean).length;
  const showBanner = phase === "result" && isLoggedIn === false && !bannerDismissed;

  function dotColor(idx: number): string {
    if (phase === "show") return idx === targetIdx ? "#EF4444" : "#5A5A5A";
    if (phase === "feedback") {
      if (idx === targetIdx) return "#2DB55D";
      if (idx === chosen && chosen !== targetIdx) return "#EF4444";
      return "#8A8A8A";
    }
    return "#8A8A8A";
  }

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center pb-16" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}>
        {(phase === "show" || phase === "track" || phase === "answer" || phase === "feedback") && (
          <div className="flex flex-col items-center gap-6">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>
              {phase === "show" && "Track the red dot"}
              {phase === "track" && `Tracking... ${(trackMs / 1000).toFixed(1)}s`}
              {phase === "answer" && "Click the dot you were tracking"}
              {phase === "feedback" && (chosen === targetIdx ? "Correct!" : "Wrong")}
              {" — "}Round {round + 1}/{ROUNDS}
            </p>
            <div style={{ position: "relative", width: W, height: H, backgroundColor: "#141414", borderRadius: 8, border: "1px solid #3A3A3A", overflow: "hidden", cursor: phase === "answer" ? "default" : "default" }}>
              {dots.map((d, i) => (
                <div key={i}
                  onClick={() => handleDotClick(i)}
                  style={{
                    position: "absolute",
                    left: d.x - DOT_R,
                    top: d.y - DOT_R,
                    width: DOT_R * 2,
                    height: DOT_R * 2,
                    borderRadius: "50%",
                    backgroundColor: dotColor(i),
                    cursor: phase === "answer" ? "pointer" : "default",
                    transition: phase === "show" || phase === "feedback" ? "background-color 0.2s" : "none",
                  }} />
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
                <span style={{ color: "#3A3A3A" }}>/{ROUNDS}</span>
                <span className="text-xl font-normal ml-2" style={{ color: "#8A8A8A" }}>Rounds Correct</span>
              </p>
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
