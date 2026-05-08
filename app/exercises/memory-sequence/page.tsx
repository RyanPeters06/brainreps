"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Phase = "memorize" | "recall" | "result";

const MEMORIZE_DURATION = 3000;
const SEQUENCE_LENGTH = 5;

function generateSequence(): number[] {
  return Array.from({ length: SEQUENCE_LENGTH }, () => Math.floor(Math.random() * 9) + 1);
}

export default function MemorySequencePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("memorize");
  const [sequence, setSequence] = useState<number[]>(generateSequence);
  const [inputs, setInputs] = useState<string[]>(Array(SEQUENCE_LENGTH).fill(""));
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const startTime = useRef<number>(Date.now());
  const animFrame = useRef<number | null>(null);

  const correctCount = sequence.filter((n, i) => Number(inputs[i]) === n).length;
  const allFilled = inputs.every((v) => v !== "");

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  // Countdown bar animation
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
          setPhase("recall");
          setVisible(true);
          setTimeout(() => inputRefs.current[0]?.focus(), 50);
        }, 300);
      }
    }

    animFrame.current = requestAnimationFrame(tick);
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [phase]);

  function handleInput(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...inputs];
    next[index] = digit;
    setInputs(next);
    if (digit && index < SEQUENCE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && inputs[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleSubmit() {
    setVisible(false);
    setTimeout(() => {
      setPhase("result");
      setVisible(true);
    }, 300);
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
    <div style={{ backgroundColor: "#0A0A0A" }} className="min-h-screen text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 border-b border-white/5">
        <Link
          href="/problems"
          style={{ color: "#ADFF2F" }}
          className="text-xl font-bold tracking-tight"
        >
          BrainReps
        </Link>
        <span className="text-xs text-gray-500 uppercase tracking-widest">
          Memory Sequence
        </span>
      </nav>

      {/* Countdown bar */}
      <div className="h-1 w-full bg-white/5">
        <div
          className="h-full transition-none"
          style={{
            width: `${phase === "memorize" ? progress : 0}%`,
            backgroundColor: "#ADFF2F",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="flex flex-1 flex-col items-center justify-center px-6 text-center pb-24"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
      >
        {/* PHASE 1 — MEMORIZE */}
        {phase === "memorize" && (
          <div className="flex flex-col items-center gap-10">
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              Memorize the sequence
            </p>
            <div className="flex gap-4 md:gap-6">
              {sequence.map((n, i) => (
                <span
                  key={i}
                  className="text-6xl md:text-8xl font-black tabular-nums"
                  style={{ color: "#ADFF2F" }}
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
            <p className="text-gray-400 text-sm uppercase tracking-widest">
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
                  className="w-14 h-16 md:w-16 md:h-20 text-center text-3xl md:text-4xl font-black rounded-xl border-2 bg-white/5 text-white focus:outline-none transition-colors"
                  style={{ borderColor: val ? "#ADFF2F" : "rgba(255,255,255,0.15)" }}
                />
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!allFilled}
              style={{
                backgroundColor: allFilled ? "#ADFF2F" : "rgba(255,255,255,0.08)",
                color: allFilled ? "#0A0A0A" : "#6b7280",
              }}
              className="px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        )}

        {/* PHASE 3 — RESULT */}
        {phase === "result" && (
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-400 text-sm uppercase tracking-widest">Results</p>
              <p className="text-5xl font-black">
                <span style={{ color: "#ADFF2F" }}>{correctCount}</span>
                <span className="text-gray-600">/{SEQUENCE_LENGTH}</span>
                <span className="text-2xl font-semibold text-gray-400 ml-3">Correct</span>
              </p>
            </div>

            <div className="flex gap-3 md:gap-4">
              {sequence.map((n, i) => {
                const correct = Number(inputs[i]) === n;
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className="w-14 h-16 md:w-16 md:h-20 rounded-xl border-2 flex items-center justify-center text-3xl md:text-4xl font-black"
                      style={{
                        borderColor: correct ? "#ADFF2F" : "#ef4444",
                        backgroundColor: correct ? "rgba(173,255,47,0.08)" : "rgba(239,68,68,0.08)",
                        color: correct ? "#ADFF2F" : "#ef4444",
                      }}
                    >
                      {n}
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{ color: correct ? "#ADFF2F" : "#ef4444" }}
                    >
                      {inputs[i] || "—"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleTryAgain}
                className="px-6 py-3 rounded-full font-bold text-sm border border-white/10 text-gray-300 hover:border-white/30 hover:text-white transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/problems"
                style={{ backgroundColor: "#ADFF2F", color: "#0A0A0A" }}
                className="px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Next Exercise
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Signup nudge banner — only for logged-out users on result screen */}
      {showBanner && (
        <div
          className="fixed bottom-0 left-0 right-0 flex items-center justify-between gap-4 px-6 py-4 md:px-12"
          style={{
            backgroundColor: "#111",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-sm text-gray-300">
            Want to save your progress and build a streak?
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/signup"
              style={{ backgroundColor: "#ADFF2F", color: "#0A0A0A" }}
              className="px-4 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Create Free Account
            </Link>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors whitespace-nowrap"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
