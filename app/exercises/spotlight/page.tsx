"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Phase = "show" | "recall" | "feedback" | "result";

const GRID = 4;
const ROUNDS = 5;
const SHOW_MS = 1500;
const FEEDBACK_MS = 1000;

function randomCell() {
  return Math.floor(Math.random() * GRID * GRID);
}

export default function SpotlightPage() {
  const [phase, setPhase] = useState<Phase>("show");
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState<number>(randomCell);
  const [chosen, setChosen] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [visible, setVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  useEffect(() => {
    if (phase !== "show") return;
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => { setPhase("recall"); setVisible(true); }, 300);
    }, SHOW_MS);
    return () => clearTimeout(t);
  }, [phase, round]);

  function handleClick(idx: number) {
    if (phase !== "recall") return;
    setChosen(idx);
    const correct = idx === target;
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
          setTarget(randomCell());
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
    setTarget(randomCell());
    setChosen(null);
    setResults([]);
    setVisible(true);
  }, []);

  const score = results.filter(Boolean).length;
  const showBanner = phase === "result" && isLoggedIn === false && !bannerDismissed;

  function cellStyle(idx: number): React.CSSProperties {
    let bg = "#262626";
    let border = "#3A3A3A";
    if (phase === "show" && idx === target) { bg = "#C96B8A"; border = "#C96B8A"; }
    if (phase === "feedback") {
      if (idx === target) { bg = "#1A2E22"; border = "#2DB55D"; }
      else if (idx === chosen && chosen !== target) { bg = "#2E1A1A"; border = "#EF4444"; }
    }
    return { width: 56, height: 56, backgroundColor: bg, border: `1px solid ${border}`, borderRadius: 6, cursor: phase === "recall" ? "pointer" : "default", transition: "background-color 0.2s" };
  }

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center pb-16" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}>
        {(phase === "show" || phase === "recall" || phase === "feedback") && (
          <div className="flex flex-col items-center gap-8">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>
              {phase === "show" ? "Remember this cell" : phase === "recall" ? "Where was it?" : ""}
              {" "}Round {round + 1}/{ROUNDS}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID}, 56px)`, gap: 4 }}>
              {Array.from({ length: GRID * GRID }).map((_, i) => (
                <div key={i} style={cellStyle(i)} onClick={() => handleClick(i)} />
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
                <span className="text-xl font-normal ml-2" style={{ color: "#8A8A8A" }}>Correct</span>
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
