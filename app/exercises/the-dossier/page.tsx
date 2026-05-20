"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Phase = "read" | "answer" | "result";

const READ_DURATION = 30000;

const STORIES = [
  {
    text: "Detective Mara received a call at 7pm on a Tuesday. A painting had gone missing from the Harlow Museum. The security guard reported seeing a man in a red jacket leave through the east exit at 6:45pm. No alarms were triggered. The painting was valued at $200,000.",
    questions: [
      { q: "What day did the call happen?", options: ["Monday", "Tuesday", "Wednesday", "Thursday"], a: 1 },
      { q: "What time did the call come in?", options: ["6:45pm", "7pm", "7:15pm", "8pm"], a: 1 },
      { q: "What color jacket was the man wearing?", options: ["Blue", "Black", "Red", "Green"], a: 2 },
      { q: "Which exit did the man use?", options: ["North", "South", "East", "West"], a: 2 },
      { q: "What was the painting valued at?", options: ["$100,000", "$150,000", "$200,000", "$250,000"], a: 2 },
    ],
  },
  {
    text: "The last train from Eastbrook left at 11:30pm. Passenger seat 14B was reserved for a Dr. Chen, but she never boarded. Her luggage — two black bags — was found in the third car. The conductor noted the bags at 11:45pm when the train reached Millfield.",
    questions: [
      { q: "What time did the train leave?", options: ["11:00pm", "11:15pm", "11:30pm", "11:45pm"], a: 2 },
      { q: "What was the passenger's seat number?", options: ["12B", "13A", "14B", "15C"], a: 2 },
      { q: "How many bags were found?", options: ["One", "Two", "Three", "Four"], a: 1 },
      { q: "Which car were the bags in?", options: ["First", "Second", "Third", "Fourth"], a: 2 },
      { q: "When did the conductor find the bags?", options: ["11:30pm", "11:45pm", "12:00am", "12:15am"], a: 1 },
    ],
  },
  {
    text: "Agent Torres intercepted a message on March 3rd. The message referenced a drop location at pier 9, scheduled for 6am. The contact used the codename Falcon. Three packages were to be exchanged. Torres had 12 hours to set up surveillance.",
    questions: [
      { q: "When was the message intercepted?", options: ["March 1st", "March 2nd", "March 3rd", "March 4th"], a: 2 },
      { q: "What was the drop location?", options: ["Pier 7", "Pier 8", "Pier 9", "Pier 10"], a: 2 },
      { q: "What time was the exchange scheduled?", options: ["4am", "5am", "6am", "7am"], a: 2 },
      { q: "What was the contact's codename?", options: ["Eagle", "Falcon", "Raven", "Hawk"], a: 1 },
      { q: "How many packages were to be exchanged?", options: ["Two", "Three", "Four", "Five"], a: 1 },
    ],
  },
];

export default function TheDossierPage() {
  const [phase, setPhase] = useState<Phase>("read");
  const [storyIdx, setStoryIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [allAnswers, setAllAnswers] = useState<number[]>([]);
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
    if (phase !== "read") return;
    startTime.current = Date.now();
    function tick() {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, 100 - (elapsed / READ_DURATION) * 100);
      setProgress(remaining);
      if (remaining > 0) animFrame.current = requestAnimationFrame(tick);
      else goToAnswer();
    }
    animFrame.current = requestAnimationFrame(tick);
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current); };
  }, [phase, storyIdx]);

  function goToAnswer() {
    if (animFrame.current) cancelAnimationFrame(animFrame.current);
    setVisible(false);
    setTimeout(() => { setPhase("answer"); setQIdx(0); setSelected(null); setVisible(true); }, 300);
  }

  function handleSelect(optIdx: number) {
    if (selected !== null) return;
    setSelected(optIdx);
  }

  function handleNext() {
    if (selected === null) return;
    const story = STORIES[storyIdx];
    setAllAnswers((prev) => [...prev, selected]);
    const nextQ = qIdx + 1;
    if (nextQ < story.questions.length) {
      setQIdx(nextQ);
      setSelected(null);
    } else {
      const nextStory = storyIdx + 1;
      if (nextStory >= STORIES.length) {
        setPhase("result");
      } else {
        setStoryIdx(nextStory);
        setProgress(100);
        setQIdx(0);
        setSelected(null);
        setPhase("read");
      }
    }
  }

  const handleTryAgain = useCallback(() => {
    setStoryIdx(0);
    setQIdx(0);
    setSelected(null);
    setAllAnswers([]);
    setProgress(100);
    setPhase("read");
    setVisible(true);
  }, []);

  const totalCorrect = allAnswers.filter((ans, i) => {
    const si = Math.floor(i / 5);
    const qi = i % 5;
    return ans === STORIES[si]?.questions[qi]?.a;
  }).length;

  const showBanner = phase === "result" && isLoggedIn === false && !bannerDismissed;
  const story = STORIES[storyIdx];
  const question = phase === "answer" ? story.questions[qIdx] : null;

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white flex flex-col">
      <Navbar />
      <div style={{ height: 2, backgroundColor: "#2E2E2E" }}>
        <div style={{ height: "100%", width: `${phase === "read" ? progress : 0}%`, backgroundColor: "#C96B8A", transition: "none" }} />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}>
        {phase === "read" && (
          <div className="flex flex-col items-center gap-6 w-full max-w-lg">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Briefing {storyIdx + 1} of {STORIES.length} — Read carefully</p>
            <div className="rounded p-5 text-left" style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}>
              <p className="text-sm leading-relaxed" style={{ color: "#fff" }}>{story.text}</p>
            </div>
            <button onClick={goToAnswer}
              className="px-6 py-2 rounded text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: "#C96B8A", color: "#fff" }}>
              Done Reading
            </button>
          </div>
        )}
        {phase === "answer" && question && (
          <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>
              Story {storyIdx + 1} — Q {qIdx + 1}/{story.questions.length}
            </p>
            <p className="text-base font-medium" style={{ color: "#fff" }}>{question.q}</p>
            <div className="w-full flex flex-col gap-2">
              {question.options.map((opt, i) => {
                let bg = "#262626", border = "#3A3A3A", color = "#fff";
                if (selected === i) { bg = "#2E1A22"; border = "#C96B8A"; color = "#C96B8A"; }
                return (
                  <button key={i} onClick={() => handleSelect(i)}
                    className="w-full px-4 py-2.5 rounded text-sm text-left font-medium transition-colors"
                    style={{ backgroundColor: bg, border: `1px solid ${border}`, color }}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {selected !== null && (
              <button onClick={handleNext}
                className="px-6 py-2 rounded text-sm font-medium hover:opacity-90"
                style={{ backgroundColor: "#C96B8A", color: "#fff" }}>
                {qIdx + 1 < story.questions.length || storyIdx + 1 < STORIES.length ? "Next" : "See Results"}
              </button>
            )}
          </div>
        )}
        {phase === "result" && (
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-xs uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Results</p>
              <p className="text-4xl font-medium">
                <span style={{ color: "#C96B8A" }}>{totalCorrect}</span>
                <span style={{ color: "#3A3A3A" }}>/{STORIES.length * 5}</span>
                <span className="text-xl font-normal ml-2" style={{ color: "#8A8A8A" }}>Correct</span>
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {STORIES.map((s, si) => {
                const correct = s.questions.filter((_, qi) => allAnswers[si * 5 + qi] === s.questions[qi].a).length;
                return (
                  <div key={si} className="flex justify-between rounded px-3 py-2"
                    style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}>
                    <span className="text-sm" style={{ color: "#8A8A8A" }}>Briefing {si + 1}</span>
                    <span className="text-sm font-medium" style={{ color: correct >= 4 ? "#2DB55D" : correct >= 2 ? "#C96B8A" : "#EF4444" }}>{correct}/5</span>
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
