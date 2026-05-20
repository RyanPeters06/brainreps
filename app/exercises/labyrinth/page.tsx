"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Phase = "play" | "result";

const PUZZLES = [
  {
    premise: "Alex, Jordan, and Sam each have a different pet.",
    items: ["Cat", "Dog", "Fish"],
    people: ["Alex", "Jordan", "Sam"],
    clues: ["Jordan owns the Dog.", "Sam does not own the Fish.", "Alex does not own the Cat."],
    answers: { Alex: "Fish", Jordan: "Dog", Sam: "Cat" },
  },
  {
    premise: "Riley, Morgan, and Casey each have a different job.",
    items: ["Chef", "Teacher", "Artist"],
    people: ["Riley", "Morgan", "Casey"],
    clues: ["Casey is the Teacher.", "Riley is not the Chef.", "Morgan is not the Artist."],
    answers: { Riley: "Artist", Morgan: "Chef", Casey: "Teacher" },
  },
  {
    premise: "Blake, Drew, and Taylor each have a favorite color.",
    items: ["Red", "Blue", "Green"],
    people: ["Blake", "Drew", "Taylor"],
    clues: ["Taylor's favorite is Blue.", "Blake's favorite is not Green.", "Drew's favorite is not Red."],
    answers: { Blake: "Red", Drew: "Green", Taylor: "Blue" },
  },
];

export default function LabyrinthPage() {
  const [phase, setPhase] = useState<Phase>("play");
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [puzzleResults, setPuzzleResults] = useState<boolean[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  const puzzle = PUZZLES[puzzleIdx];
  const allSelected = puzzle.people.every((p) => selections[p]);

  function select(person: string, item: string) {
    if (submitted) return;
    setSelections((prev) => ({ ...prev, [person]: item }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  function handleNext() {
    const newResults = puzzle.people.map((p) => selections[p] === puzzle.answers[p as keyof typeof puzzle.answers]);
    setPuzzleResults((prev) => [...prev, ...newResults]);
    if (puzzleIdx + 1 >= PUZZLES.length) {
      setPhase("result");
    } else {
      setPuzzleIdx((i) => i + 1);
      setSelections({});
      setSubmitted(false);
    }
  }

  const handleTryAgain = useCallback(() => {
    setPuzzleIdx(0);
    setSelections({});
    setSubmitted(false);
    setPuzzleResults([]);
    setPhase("play");
  }, []);

  const totalCorrect = puzzleResults.filter(Boolean).length;
  const showBanner = phase === "result" && isLoggedIn === false && !bannerDismissed;

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8">
        {phase === "play" && (
          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Puzzle {puzzleIdx + 1} of {PUZZLES.length}</p>
            <p className="text-sm" style={{ color: "#fff" }}>{puzzle.premise}</p>
            <div className="w-full rounded p-3 flex flex-col gap-1.5" style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}>
              {puzzle.clues.map((c, i) => (
                <p key={i} className="text-sm text-left" style={{ color: "#8A8A8A" }}>• {c}</p>
              ))}
            </div>
            <div className="w-full flex flex-col gap-3">
              {puzzle.people.map((person) => {
                const sel = selections[person];
                const correct = puzzle.answers[person as keyof typeof puzzle.answers];
                return (
                  <div key={person} className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-left" style={{ color: "#8A8A8A" }}>{person}</p>
                    <div className="flex gap-2 flex-wrap">
                      {puzzle.items.map((item) => {
                        const isSelected = sel === item;
                        let bg = "#262626", border = "#3A3A3A", color = "#8A8A8A";
                        if (submitted && isSelected) {
                          bg = sel === correct ? "#1A2E22" : "#2E1A1A";
                          border = sel === correct ? "#2DB55D" : "#EF4444";
                          color = sel === correct ? "#2DB55D" : "#EF4444";
                        } else if (!submitted && isSelected) {
                          bg = "#2E1A22"; border = "#C96B8A"; color = "#C96B8A";
                        }
                        return (
                          <button key={item} onClick={() => select(person, item)}
                            className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                            style={{ backgroundColor: bg, border: `1px solid ${border}`, color }}>
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            {!submitted ? (
              <button onClick={handleSubmit} disabled={!allSelected}
                className="px-6 py-2 rounded text-sm font-medium disabled:cursor-not-allowed"
                style={{ backgroundColor: allSelected ? "#C96B8A" : "#262626", color: allSelected ? "#fff" : "#5A5A5A", border: allSelected ? "none" : "1px solid #3A3A3A" }}>
                Submit
              </button>
            ) : (
              <button onClick={handleNext}
                className="px-6 py-2 rounded text-sm font-medium hover:opacity-90"
                style={{ backgroundColor: "#C96B8A", color: "#fff" }}>
                {puzzleIdx + 1 < PUZZLES.length ? "Next Puzzle" : "See Results"}
              </button>
            )}
          </div>
        )}
        {phase === "result" && (
          <div className="flex flex-col items-center gap-8 w-full max-w-md">
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Results</p>
              <p className="text-4xl font-medium">
                <span style={{ color: "#C96B8A" }}>{totalCorrect}</span>
                <span style={{ color: "#3A3A3A" }}>/{PUZZLES.length * 3}</span>
                <span className="text-xl font-normal ml-2" style={{ color: "#8A8A8A" }}>Correct</span>
              </p>
            </div>
            {PUZZLES.map((puz, pi) => (
              <div key={pi} className="w-full rounded p-3 flex flex-col gap-2" style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}>
                <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Puzzle {pi + 1}</p>
                {puz.people.map((person) => {
                  const ans = puz.answers[person as keyof typeof puz.answers];
                  return (
                    <div key={person} className="flex justify-between text-sm">
                      <span style={{ color: "#8A8A8A" }}>{person}</span>
                      <span style={{ color: "#2DB55D" }}>{ans}</span>
                    </div>
                  );
                })}
              </div>
            ))}
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
