"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Phase = "intro" | "watch" | "answer" | "feedback" | "result";

const ROUNDS = 5;
const FLASH_MS = 400;
const SEQ_LEN = 20;

function buildSequence(target: number): number[] {
  const count = Math.floor(Math.random() * 5) + 3;
  const seq: number[] = Array.from({ length: SEQ_LEN - count }, () => {
    let n = Math.floor(Math.random() * 9) + 1;
    while (n === target) n = Math.floor(Math.random() * 9) + 1;
    return n;
  });
  for (let i = 0; i < count; i++) seq.push(target);
  return seq.sort(() => Math.random() - 0.5);
}

export default function TheGauntletPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [flashIdx, setFlashIdx] = useState(-1);
  const [answer, setAnswer] = useState<number | null>(null);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  function startRound() {
    const t = Math.floor(Math.random() * 9) + 1;
    const seq = buildSequence(t);
    setTarget(t);
    setSequence(seq);
    setFlashIdx(0);
    setPhase("watch");
  }

  useEffect(() => {
    if (phase !== "watch") return;
    let idx = 0;
    setFlashIdx(0);
    intervalRef.current = setInterval(() => {
      idx++;
      if (idx >= SEQ_LEN) {
        clearInterval(intervalRef.current!);
        setFlashIdx(-1);
        setPhase("answer");
      } else {
        setFlashIdx(idx);
      }
    }, FLASH_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, round]);

  function submitAnswer(n: number) {
    if (phase !== "answer") return;
    setAnswer(n);
    const trueCount = sequence.filter((x) => x === target).length;
    const correct = n === trueCount;
    setFeedbackCorrect(correct);
    setResults((prev) => [...prev, correct]);
    setPhase("feedback");
    setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound >= ROUNDS) {
        setPhase("result");
      } else {
        setRound(nextRound);
        setAnswer(null);
        setPhase("intro");
      }
    }, 1500);
  }

  const handleTryAgain = useCallback(() => {
    setPhase("intro");
    setRound(0);
    setResults([]);
    setAnswer(null);
  }, []);

  const score = results.filter(Boolean).length;
  const trueCount = sequence.filter((x) => x === target).length;
  const showBanner = phase === "result" && isLoggedIn === false && !bannerDismissed;

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center pb-16">
        {phase === "intro" && (
          <div className="flex flex-col items-center gap-8">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Round {round + 1} of {ROUNDS}</p>
            <p className="text-lg" style={{ color: "#8A8A8A" }}>Count how many times you see</p>
            <p className="text-8xl font-bold" style={{ color: "#C96B8A" }}>{round === 0 ? "?" : target}</p>
            <button onClick={startRound}
              className="px-6 py-2 rounded text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: "#C96B8A", color: "#fff" }}>
              {round === 0 ? "Start" : "Next Round"}
            </button>
          </div>
        )}
        {phase === "watch" && (
          <div className="flex flex-col items-center gap-8">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Counting {target}s — {flashIdx + 1}/{SEQ_LEN}</p>
            <p className="text-9xl font-bold tabular-nums" style={{ color: "#fff", minWidth: "1ch" }}>
              {flashIdx >= 0 ? sequence[flashIdx] : ""}
            </p>
          </div>
        )}
        {phase === "answer" && (
          <div className="flex flex-col items-center gap-8">
            <p className="text-sm" style={{ color: "#8A8A8A" }}>How many times did you see <span style={{ color: "#C96B8A" }}>{target}</span>?</p>
            <div className="flex gap-3 flex-wrap justify-center">
              {Array.from({ length: 10 }, (_, i) => (
                <button key={i} onClick={() => submitAnswer(i)}
                  className="w-12 h-12 rounded text-lg font-medium hover:opacity-90"
                  style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A", color: "#fff" }}>
                  {i}
                </button>
              ))}
            </div>
          </div>
        )}
        {phase === "feedback" && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-2xl font-medium" style={{ color: feedbackCorrect ? "#2DB55D" : "#EF4444" }}>
              {feedbackCorrect ? "Correct!" : "Wrong"}
            </p>
            {!feedbackCorrect && (
              <p className="text-sm" style={{ color: "#8A8A8A" }}>The answer was <span style={{ color: "#fff" }}>{trueCount}</span>, you said <span style={{ color: "#fff" }}>{answer}</span></p>
            )}
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
