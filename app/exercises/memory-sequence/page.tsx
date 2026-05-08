"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Phase = "memorize" | "recall" | "result";

const MEMORIZE_DURATION = 3000;
const SEQUENCE_LENGTH   = 5;

function generateSequence(): number[] {
  return Array.from({ length: SEQUENCE_LENGTH }, () => Math.floor(Math.random() * 9) + 1);
}

export default function MemorySequencePage() {
  const [phase, setPhase]           = useState<Phase>("memorize");
  const [sequence, setSequence]     = useState<number[]>(generateSequence);
  const [inputs, setInputs]         = useState<string[]>(Array(SEQUENCE_LENGTH).fill(""));
  const [progress, setProgress]     = useState(100);
  const [visible, setVisible]       = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const startTime = useRef<number>(Date.now());
  const animFrame = useRef<number | null>(null);

  const correctCount = sequence.filter((n, i) => Number(inputs[i]) === n).length;
  const allFilled    = inputs.every((v) => v !== "");

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  useEffect(() => {
    if (phase !== "memorize") return;
    startTime.current = Date.now();

    function tick() {
      const elapsed   = Date.now() - startTime.current;
      const remaining = Math.max(0, 100 - (elapsed / MEMORIZE_DURATION) * 100);
      setProgress(remaining);

      if (remaining > 0) {
        animFrame.current = requestAnimationFrame(tick);
      } else {
        setVisible(false);
        setTimeout(() => {
          setPhase("recall");
          setVisible(true);
          setTimeout(() => inputRefs.current[0]?.focus(), 50);
        }, 300);
      }
    }

    animFrame.current = requestAnimationFrame(tick);
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current); };
  }, [phase]);

  function handleInput(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next  = [...inputs];
    next[index] = digit;
    setInputs(next);
    if (digit && index < SEQUENCE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && inputs[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleSubmit() {
    setVisible(false);
    setTimeout(() => { setPhase("result"); setVisible(true); }, 300);
  }

  const handleTryAgain = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setSequence(generateSequence());
      setInputs(Array(SEQUENCE_LENGTH).fill(""));
      setProgress(100);
      setPhase("memorize");
      setVisible(true);
    }, 300);
  }, []);

  const showBanner = phase === "result" && isLoggedIn === false && !bannerDismissed;

  return (
    <div style={{ backgroundColor: "#1A1A1A" }} className="min-h-screen text-white flex flex-col">
      <nav
        style={{ backgroundColor: "#1F1F1F", borderBottom: "1px solid #3A3A3A" }}
        className="flex items-center justify-between px-6 py-4 md:px-12"
      >
        <Link href="/problems" style={{ color: "#C96B8A" }} className="text-base font-medium">
          BrainReps
        </Link>
        <span className="text-xs uppercase tracking-widest" style={{ color: "#5A5A5A" }}>
          Memory Sequence
        </span>
      </nav>

      {/* Progress bar */}
      <div style={{ height: "2px", backgroundColor: "#2E2E2E" }}>
        <div
          style={{
            height: "100%",
            width: `${phase === "memorize" ? progress : 0}%`,
            backgroundColor: "#C96B8A",
            transition: "none",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="flex flex-1 flex-col items-center justify-center px-6 text-center pb-20"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
      >
        {/* PHASE 1 — MEMORIZE */}
        {phase === "memorize" && (
          <div className="flex flex-col items-center gap-10">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>
              Memorize the sequence
            </p>
            <div className="flex gap-4 md:gap-6">
              {sequence.map((n, i) => (
                <span
                  key={i}
                  className="text-6xl md:text-7xl font-medium tabular-nums"
                  style={{ color: "#C96B8A" }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* PHASE 2 — RECALL */}
        {phase === "recall" && (
          <div className="flex flex-col items-center gap-10">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>
              Enter the sequence
            </p>
            <div className="flex gap-3 md:gap-4">
              {inputs.map((val, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  value={val}
                  onChange={(e) => handleInput(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  maxLength={1}
                  className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl md:text-3xl font-medium rounded focus:outline-none transition-colors"
                  style={{
                    backgroundColor: "#262626",
                    border: `1px solid ${val ? "#C96B8A" : "#3A3A3A"}`,
                    color: "#fff",
                  }}
                />
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!allFilled}
              className="px-6 py-2 rounded text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed"
              style={{
                backgroundColor: allFilled ? "#C96B8A" : "#262626",
                color:           allFilled ? "#fff"    : "#5A5A5A",
                border:          allFilled ? "none"    : "1px solid #3A3A3A",
              }}
            >
              Submit
            </button>
          </div>
        )}

        {/* PHASE 3 — RESULT */}
        {phase === "result" && (
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Results</p>
              <p className="text-4xl font-medium">
                <span style={{ color: "#C96B8A" }}>{correctCount}</span>
                <span style={{ color: "#3A3A3A" }}>/{SEQUENCE_LENGTH}</span>
                <span className="text-xl font-normal ml-2" style={{ color: "#8A8A8A" }}>Correct</span>
              </p>
            </div>

            <div className="flex gap-3 md:gap-4">
              {sequence.map((n, i) => {
                const correct = Number(inputs[i]) === n;
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-14 md:w-14 md:h-16 rounded flex items-center justify-center text-2xl md:text-3xl font-medium"
                      style={{
                        border:           `1px solid ${correct ? "#2DB55D" : "#EF4444"}`,
                        backgroundColor:  correct ? "#1A2E22" : "#2E1A1A",
                        color:            correct ? "#2DB55D" : "#EF4444",
                      }}
                    >
                      {n}
                    </div>
                    <span className="text-sm" style={{ color: correct ? "#2DB55D" : "#EF4444" }}>
                      {inputs[i] || "—"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleTryAgain}
                className="px-5 py-2 rounded text-sm font-medium hover:text-white transition-colors"
                style={{ border: "1px solid #3A3A3A", color: "#8A8A8A", backgroundColor: "transparent" }}
              >
                Try Again
              </button>
              <Link
                href="/problems"
                className="px-5 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#C96B8A", color: "#fff" }}
              >
                Next Exercise
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Signup nudge — logged-out users on result screen only */}
      {showBanner && (
        <div
          className="fixed bottom-0 left-0 right-0 flex items-center justify-between gap-4 px-6 py-4 md:px-12"
          style={{ backgroundColor: "#1F1F1F", borderTop: "1px solid #3A3A3A" }}
        >
          <p className="text-sm" style={{ color: "#8A8A8A" }}>
            Want to save your progress and build a streak?
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/signup"
              className="px-4 py-1.5 rounded text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{ backgroundColor: "#C96B8A", color: "#fff" }}
            >
              Create Free Account
            </Link>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-xs hover:text-white transition-colors whitespace-nowrap"
              style={{ color: "#5A5A5A" }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
