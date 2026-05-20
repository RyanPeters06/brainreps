"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Phase = "memorize" | "recall" | "feedback" | "result";

const GRID = 4;
const ROUNDS = 5;
const HIGHLIGHTED = 5;
const MEMORIZE_DURATION = 3000;
const FEEDBACK_MS = 2000;

function randomCells(): Set<number> {
  const cells = new Set<number>();
  while (cells.size < HIGHLIGHTED) cells.add(Math.floor(Math.random() * GRID * GRID));
  return cells;
}

export default function PolaroidPage() {
  const [phase, setPhase] = useState<Phase>("memorize");
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState<Set<number>>(randomCells);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(true);
  const [roundScores, setRoundScores] = useState<number[]>([]);
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
        setTimeout(() => { setPhase("recall"); setVisible(true); }, 300);
      }
    }
    animFrame.current = requestAnimationFrame(tick);
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current); };
  }, [phase, round]);

  function toggleCell(idx: number) {
    if (phase !== "recall") return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }

  function handleSubmit() {
    const correct = Array.from(selected).filter((c) => target.has(c)).length;
    const pct = correct / HIGHLIGHTED;
    setRoundScores((prev) => [...prev, pct]);
    setPhase("feedback");
    setTimeout(() => {
      const nextRound = round + 1;
      setVisible(false);
      setTimeout(() => {
        if (nextRound >= ROUNDS) {
          setPhase("result");
        } else {
          setRound(nextRound);
          setTarget(randomCells());
          setSelected(new Set());
          setProgress(100);
          setPhase("memorize");
        }
        setVisible(true);
      }, 300);
    }, FEEDBACK_MS);
  }

  const handleTryAgain = useCallback(() => {
    setPhase("memorize");
    setRound(0);
    setTarget(randomCells());
    setSelected(new Set());
    setProgress(100);
    setRoundScores([]);
    setVisible(true);
  }, []);

  const avgAccuracy = roundScores.length ? Math.round((roundScores.reduce((a, b) => a + b, 0) / roundScores.length) * 100) : 0;
  const showBanner = phase === "result" && isLoggedIn === false && !bannerDismissed;

  function cellStyle(idx: number): React.CSSProperties {
    let bg = "#262626", border = "#3A3A3A";
    if (phase === "memorize" && target.has(idx)) { bg = "#C96B8A"; border = "#C96B8A"; }
    if (phase === "recall" && selected.has(idx)) { bg = "#2E1A22"; border = "#C96B8A"; }
    if (phase === "feedback") {
      if (target.has(idx) && selected.has(idx)) { bg = "#1A2E22"; border = "#2DB55D"; }
      else if (target.has(idx)) { bg = "#1A2E22"; border = "#2DB55D"; }
      else if (selected.has(idx)) { bg = "#2E1A1A"; border = "#EF4444"; }
    }
    return { width: 56, height: 56, backgroundColor: bg, border: `1px solid ${border}`, borderRadius: 6, cursor: phase === "recall" ? "pointer" : "default", transition: "background-color 0.2s" };
  }

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white flex flex-col">
      <Navbar />
      <div style={{ height: 2, backgroundColor: "#2E2E2E" }}>
        <div style={{ height: "100%", width: `${phase === "memorize" ? progress : 0}%`, backgroundColor: "#C96B8A", transition: "none" }} />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center pb-16" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}>
        {(phase === "memorize" || phase === "recall" || phase === "feedback") && (
          <div className="flex flex-col items-center gap-8">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>
              {phase === "memorize" ? "Memorize the pattern" : phase === "recall" ? "Reproduce the pattern" : "Feedback"}
              {" "}— Round {round + 1}/{ROUNDS}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID}, 56px)`, gap: 4 }}>
              {Array.from({ length: GRID * GRID }).map((_, i) => (
                <div key={i} style={cellStyle(i)} onClick={() => toggleCell(i)} />
              ))}
            </div>
            {phase === "recall" && (
              <button onClick={handleSubmit}
                className="px-6 py-2 rounded text-sm font-medium hover:opacity-90"
                style={{ backgroundColor: "#C96B8A", color: "#fff" }}>
                Submit
              </button>
            )}
          </div>
        )}
        {phase === "result" && (
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Results</p>
              <p className="text-4xl font-medium">
                <span style={{ color: "#C96B8A" }}>{avgAccuracy}%</span>
                <span className="text-xl font-normal ml-2" style={{ color: "#8A8A8A" }}>Avg Accuracy</span>
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
