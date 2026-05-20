"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Phase = "play" | "result";

const WORDS = ["BRAIN", "FOCUS", "RAPID", "LOGIC", "TRAIN", "SHARP", "SWIFT", "SOLVE", "TRACK", "THINK"];

export default function SwitchbackPage() {
  const [phase, setPhase] = useState<Phase>("play");
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  const word = WORDS[current];
  const reversed = word.split("").reverse().join("");

  function handleSubmit() {
    if (!input.trim()) return;
    setAnswers((prev) => [...prev, input.toUpperCase()]);
    setSubmitted(true);
  }

  function handleNext() {
    const next = current + 1;
    if (next >= WORDS.length) {
      setPhase("result");
    } else {
      setCurrent(next);
      setInput("");
      setSubmitted(false);
    }
  }

  const handleTryAgain = useCallback(() => {
    setCurrent(0);
    setInput("");
    setAnswers([]);
    setSubmitted(false);
    setPhase("play");
  }, []);

  const score = answers.filter((a, i) => a === WORDS[i].split("").reverse().join("")).length;
  const showBanner = phase === "result" && isLoggedIn === false && !bannerDismissed;

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center pb-16">
        {phase === "play" && (
          <div className="flex flex-col items-center gap-8">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>{current + 1} / {WORDS.length}</p>
            <p className="text-5xl font-bold tracking-widest" style={{ color: "#C96B8A" }}>{word}</p>
            {!submitted ? (
              <>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                  placeholder="Type reversed..."
                  autoFocus
                  className="text-center text-2xl font-medium rounded px-4 py-3 focus:outline-none w-48"
                  style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A", color: "#fff", letterSpacing: "0.15em" }}
                />
                <button onClick={handleSubmit} disabled={!input.trim()}
                  className="px-6 py-2 rounded text-sm font-medium disabled:cursor-not-allowed"
                  style={{ backgroundColor: input.trim() ? "#C96B8A" : "#262626", color: input.trim() ? "#fff" : "#5A5A5A", border: input.trim() ? "none" : "1px solid #3A3A3A" }}>
                  Submit
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                {answers[current] === reversed ? (
                  <p className="text-lg font-medium" style={{ color: "#2DB55D" }}>Correct!</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-medium" style={{ color: "#EF4444" }}>Wrong</p>
                    <p className="text-sm" style={{ color: "#8A8A8A" }}>Answer: <span style={{ color: "#fff" }}>{reversed}</span></p>
                  </div>
                )}
                <button onClick={handleNext}
                  className="px-6 py-2 rounded text-sm font-medium hover:opacity-90"
                  style={{ backgroundColor: "#C96B8A", color: "#fff" }}>
                  {current + 1 < WORDS.length ? "Next" : "See Results"}
                </button>
              </div>
            )}
          </div>
        )}
        {phase === "result" && (
          <div className="flex flex-col items-center gap-8 w-full max-w-xs">
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Results</p>
              <p className="text-4xl font-medium">
                <span style={{ color: "#C96B8A" }}>{score}</span>
                <span style={{ color: "#3A3A3A" }}>/{WORDS.length}</span>
                <span className="text-xl font-normal ml-2" style={{ color: "#8A8A8A" }}>Correct</span>
              </p>
            </div>
            <div className="w-full flex flex-col gap-2">
              {WORDS.map((w, i) => {
                const rev = w.split("").reverse().join("");
                const correct = answers[i] === rev;
                return (
                  <div key={i} className="flex items-center justify-between rounded px-3 py-2"
                    style={{ backgroundColor: "#262626", border: `1px solid ${correct ? "#2DB55D" : "#EF4444"}` }}>
                    <span className="text-sm font-medium" style={{ color: "#C96B8A" }}>{w}</span>
                    <span className="text-sm" style={{ color: "#8A8A8A" }}>→ {rev}</span>
                    <span className="text-sm ml-2" style={{ color: correct ? "#2DB55D" : "#EF4444" }}>{correct ? "✓" : answers[i] || "—"}</span>
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
