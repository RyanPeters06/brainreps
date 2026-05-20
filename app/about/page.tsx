import Link from "next/link";
import Navbar from "@/components/Navbar";
import { exercises, categoryList } from "@/lib/exercises";

const categoryCounts = Object.fromEntries(
  categoryList.slice(1).map((cat) => [cat, exercises.filter((e) => e.category === cat).length])
);

const values = [
  {
    title: "Deliberate, not addictive",
    body: "BrainReps is built around 10-minute sessions — not endless scrolling or dopamine loops. Every exercise has a clear purpose tied to a specific cognitive domain.",
  },
  {
    title: "Science-backed exercises",
    body: "Each exercise is grounded in cognitive psychology research: working memory, selective attention, cognitive flexibility, processing speed, and executive function.",
  },
  {
    title: "Progress you can see",
    body: "Streaks, session history, and category breakdowns give you a clear picture of where you're improving — and where to focus next.",
  },
  {
    title: "No account required to start",
    body: "Every exercise is free to try without signing up. Create an account only when you want to save your progress and build a streak.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white">
      <Navbar />

      {/* Hero */}
      <section className="px-6 py-20 text-center" style={{ borderBottom: "1px solid #2E2E2E" }}>
        <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#C96B8A" }}>
          About BrainReps
        </p>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-5 max-w-2xl mx-auto">
          Cognitive training built for consistency
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: "#8A8A8A" }}>
          BrainReps is a daily cognitive training platform. 14 exercises. 5 cognitive domains. 10 minutes a day. No ads, no filler — just deliberate mental reps.
        </p>
      </section>

      {/* What we built */}
      <section className="px-6 py-16 md:py-20" style={{ borderBottom: "1px solid #2E2E2E" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p className="text-xs uppercase tracking-widest mb-10 text-center" style={{ color: "#5A5A5A" }}>
            The library
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {categoryList.slice(1).map((cat) => (
              <div
                key={cat}
                className="rounded-lg p-5 flex items-center justify-between"
                style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
              >
                <span className="text-sm font-medium">{cat}</span>
                <span className="text-sm tabular-nums" style={{ color: "#5A5A5A" }}>
                  {categoryCounts[cat]} exercise{categoryCounts[cat] !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-center mt-8" style={{ color: "#5A5A5A" }}>
            {exercises.filter((e) => e.built).length} exercises live ·{" "}
            {exercises.filter((e) => !e.built).length} coming soon ·{" "}
            {exercises.length} total
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-16 md:py-20" style={{ borderBottom: "1px solid #2E2E2E" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p className="text-xs uppercase tracking-widest mb-10 text-center" style={{ color: "#5A5A5A" }}>
            How we think about this
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title}>
                <h3 className="text-sm font-medium mb-2">{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8A8A8A" }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 md:py-20" style={{ borderBottom: "1px solid #2E2E2E" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p className="text-xs uppercase tracking-widest mb-10 text-center" style={{ color: "#5A5A5A" }}>
            How it works
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Browse the library", body: "Explore 14 exercises across memory, attention, logic, and cognitive flexibility. Filter by category or difficulty." },
              { num: "02", title: "Do your daily reps", body: "One featured exercise per day keeps your streak alive. Sessions are short by design — 10 minutes is enough." },
              { num: "03", title: "Track your progress", body: "Sign up to save results, build a streak, and see category-level breakdowns of your cognitive training over time." },
            ].map((s) => (
              <div key={s.num}>
                <p className="text-2xl font-medium mb-3" style={{ color: "#3A3A3A" }}>{s.num}</p>
                <h3 className="text-sm font-medium mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8A8A8A" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#5A5A5A" }}>
          These aren&apos;t games. They&apos;re reps.
        </p>
        <h2 className="text-2xl font-medium mb-6">Ready to start training?</h2>
        <div className="flex items-center gap-3 justify-center flex-wrap">
          <Link
            href="/problems"
            className="px-6 py-2.5 rounded text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#C96B8A", color: "#fff" }}
          >
            Open the Training Library
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2.5 rounded text-sm transition-colors"
            style={{ border: "1px solid #3A3A3A", color: "#8A8A8A" }}
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
