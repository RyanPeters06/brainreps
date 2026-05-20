"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

const COLORS = ["#EF4444", "#C96B8A", "#E8C547", "#2DB55D", "#4A82B8", "#9B82C4"];
const CODE_LEN = 4;
const MAX_GUESSES = 8;

type Phase = "play" | "won" | "lost";
type Feedback = { black: number; white: number };

function randomCode(): string[] {
  return Array.from({ length: CODE_LEN }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
}

function getFeedback(guess: string[], secret: string[]): Feedback {
  let black = 0;
  const gRem: string[] = [];
  const sRem: string[] = [];
  for (let i = 0; i < CODE_LEN; i++) {
    if (guess[i] === secret[i]) black++;
    else { gRem.push(guess[i]); sRem.push(secret[i]); }
  }
  let white = 0;
  for (const c of gRem) {
    const idx = sRem.indexOf(c);
    if (idx !== -1) { white++; sRem.splice(idx, 1); }
  }
  return { black, white };
}

export default function MastermindPage() {
  const [secret] = useState<string[]>(randomCode);
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [current, setCurrent] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("play");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  function pickColor(color: string) {
    if (phase !== "play" || current.length >= CODE_LEN) return;
    setCurrent((prev) => [...prev, color]);
  }

  function clearSlot(idx: number) {
    if (phase !== "play") return;
    setCurrent((prev) => prev.filter((_, i) => i !== idx));
  }

  function submitGuess() {
    if (current.length !== CODE_LEN || phase !== "play") return;
    const fb = getFeedback(current, secret);
    const newGuesses = [...guesses, current];
    const newFeedbacks = [...feedbacks, fb];
    setGuesses(newGuesses);
    setFeedbacks(newFeedbacks);
    setCurrent([]);
    if (fb.black === CODE_LEN) setPhase("won");
    else if (newGuesses.length >= MAX_GUESSES) setPhase("lost");
  }

  const handleTryAgain = useCallback(() => window.location.reload(), []);
  const showBanner = (phase === "won" || phase === "lost") && isLoggedIn === false && !bannerDismissed;

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8">
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          {(phase === "play") && (
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>
              Guess {guesses.length + 1} of {MAX_GUESSES}
            </p>
          )}
          {(phase === "won" || phase === "lost") && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-medium" style={{ color: phase === "won" ? "#2DB55D" : "#EF4444" }}>
                {phase === "won" ? "Code cracked!" : "Code unbroken"}
              </p>
              <div className="flex gap-2">
                {secret.map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          )}

          {/* Previous guesses */}
          <div className="flex flex-col gap-2 w-full">
            {guesses.map((g, gi) => (
              <div key={gi} className="flex items-center gap-3">
                <div className="flex gap-2">
                  {g.map((c, ci) => (
                    <div key={ci} className="w-9 h-9 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 ml-2" style={{ width: 48 }}>
                  {Array.from({ length: feedbacks[gi].black }).map((_, i) => (
                    <div key={`b${i}`} className="w-4 h-4 rounded-full" style={{ backgroundColor: "#fff" }} />
                  ))}
                  {Array.from({ length: feedbacks[gi].white }).map((_, i) => (
                    <div key={`w${i}`} className="w-4 h-4 rounded-full" style={{ border: "1px solid #8A8A8A" }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Current guess row */}
          {phase === "play" && (
            <div className="flex gap-2">
              {Array.from({ length: CODE_LEN }).map((_, i) => (
                <button key={i} onClick={() => i < current.length && clearSlot(i)}
                  className="w-9 h-9 rounded-full"
                  style={{ backgroundColor: current[i] ?? "transparent", border: `2px solid ${current[i] ? current[i] : "#3A3A3A"}` }} />
              ))}
            </div>
          )}

          {/* Color picker */}
          {phase === "play" && (
            <div className="flex gap-3 flex-wrap justify-center">
              {COLORS.map((c) => (
                <button key={c} onClick={() => pickColor(c)}
                  className="w-10 h-10 rounded-full hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          )}

          {phase === "play" && (
            <button onClick={submitGuess} disabled={current.length !== CODE_LEN}
              className="px-6 py-2 rounded text-sm font-medium disabled:cursor-not-allowed"
              style={{ backgroundColor: current.length === CODE_LEN ? "#C96B8A" : "#262626", color: current.length === CODE_LEN ? "#fff" : "#5A5A5A", border: current.length === CODE_LEN ? "none" : "1px solid #3A3A3A" }}>
              Submit Guess
            </button>
          )}

          {(phase === "won" || phase === "lost") && (
            <div className="flex gap-3">
              <button onClick={handleTryAgain} className="px-5 py-2 rounded text-sm font-medium hover:text-white transition-colors"
                style={{ border: "1px solid #3A3A3A", color: "#8A8A8A", backgroundColor: "transparent" }}>Try Again</button>
              <Link href="/problems" className="px-5 py-2 rounded text-sm font-medium hover:opacity-90"
                style={{ backgroundColor: "#C96B8A", color: "#fff" }}>Next Exercise</Link>
            </div>
          )}
        </div>
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
