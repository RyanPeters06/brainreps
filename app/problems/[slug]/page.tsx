import Link from "next/link";
import { notFound } from "next/navigation";
import { getExercise, getSimilar, categoryColors, difficultyConfig } from "@/lib/exercises";

export default function ExerciseDetailPage({ params }: { params: { slug: string } }) {
  const ex = getExercise(params.slug);
  if (!ex) notFound();

  const similar  = getSimilar(ex.similar);
  const cat      = categoryColors[ex.category];
  const diff     = difficultyConfig[ex.difficulty];

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white">
      {/* Compact nav */}
      <nav
        style={{ backgroundColor: "#1F1F1F", borderBottom: "1px solid #3A3A3A" }}
        className="flex items-center gap-3 px-6 py-3 md:px-10 text-sm"
      >
        <Link href="/problems" style={{ color: "#C96B8A" }} className="font-medium">BrainReps</Link>
        <span style={{ color: "#3A3A3A" }}>/</span>
        <Link href="/problems" style={{ color: "#8A8A8A" }} className="hover:text-white transition-colors">Problems</Link>
        <span style={{ color: "#3A3A3A" }}>/</span>
        <span style={{ color: "#8A8A8A" }}>{ex.title}</span>
      </nav>

      <div className="flex" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", gap: 32 }}>
        {/* ── LEFT PANEL ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title row */}
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <span className="text-xs font-mono" style={{ color: "#5A5A5A" }}>#{ex.num}</span>
            <h1 className="text-xl font-medium">{ex.title}</h1>
          </div>
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: diff.bg, color: diff.text }}>
              {ex.difficulty}
            </span>
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: cat.bg, color: cat.text }}>
              {ex.category}
            </span>
            <span className="text-xs" style={{ color: "#5A5A5A" }}>{ex.time}</span>
            <span className="text-xs" style={{ color: "#5A5A5A" }}>·</span>
            <span className="text-xs" style={{ color: "#5A5A5A" }}>{ex.benefit}</span>
          </div>

          {/* About */}
          <section className="mb-7">
            <h2 className="text-sm font-medium mb-3" style={{ color: "#C96B8A" }}>About this exercise</h2>
            {ex.about.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#C0C0C0" }}>
                {para}
              </p>
            ))}
          </section>

          {/* How it works */}
          <section className="mb-7">
            <h2 className="text-sm font-medium mb-3" style={{ color: "#C96B8A" }}>How it works</h2>
            <ol className="flex flex-col gap-2">
              {ex.howItWorks.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm" style={{ color: "#C0C0C0" }}>
                  <span
                    className="shrink-0 flex items-center justify-center rounded-full text-xs font-medium"
                    style={{
                      width: 22,
                      height: 22,
                      backgroundColor: "#2E1A22",
                      color: "#C96B8A",
                      marginTop: 1,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Tips */}
          <section className="mb-8">
            <h2 className="text-sm font-medium mb-3" style={{ color: "#C96B8A" }}>Tips</h2>
            <ul className="flex flex-col gap-2">
              {ex.tips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm" style={{ color: "#C0C0C0" }}>
                  <span style={{ color: "#C96B8A", marginTop: 1 }}>›</span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          {ex.built && ex.route ? (
            <Link
              href={ex.route}
              className="inline-block px-6 py-2.5 rounded text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#C96B8A", color: "#fff" }}
            >
              Start Exercise →
            </Link>
          ) : (
            <div>
              <button
                disabled
                className="px-6 py-2.5 rounded text-sm font-medium cursor-not-allowed"
                style={{ backgroundColor: "#262626", color: "#5A5A5A", border: "1px solid #3A3A3A" }}
              >
                Coming Soon
              </button>
              <p className="text-xs mt-2" style={{ color: "#5A5A5A" }}>
                This exercise is under development.
              </p>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="hidden md:flex flex-col gap-4" style={{ width: 240, flexShrink: 0 }}>
          {/* Stats card */}
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
          >
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ color: "#5A5A5A" }}>
              Stats
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: "#8A8A8A" }}>Completion rate</span>
                <span style={{ color: diff.text }}>{ex.completionRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#8A8A8A" }}>Avg score</span>
                <span className="text-white">
                  {ex.difficulty === "Easy" ? "4.1" : ex.difficulty === "Medium" ? "3.6" : "3.1"} / 5
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#8A8A8A" }}>Total attempts</span>
                <span className="text-white">
                  {ex.difficulty === "Easy" ? "12.4k" : ex.difficulty === "Medium" ? "8.1k" : "4.9k"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#8A8A8A" }}>Difficulty</span>
                <span style={{ color: diff.text }}>{ex.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Tags card */}
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
          >
            <h3 className="text-xs uppercase tracking-widest mb-3" style={{ color: "#5A5A5A" }}>
              Category
            </h3>
            <span
              className="text-xs px-2.5 py-1 rounded"
              style={{ backgroundColor: cat.bg, color: cat.text }}
            >
              {ex.category}
            </span>
          </div>

          {/* Similar */}
          {similar.length > 0 && (
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
            >
              <h3 className="text-xs uppercase tracking-widest mb-3" style={{ color: "#5A5A5A" }}>
                Similar Exercises
              </h3>
              <div className="flex flex-col gap-2">
                {similar.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/problems/${s.slug}`}
                    className="flex items-center justify-between text-sm hover:opacity-80 transition-opacity"
                  >
                    <span style={{ color: "#C0C0C0" }}>{s.title}</span>
                    <span
                      className="text-xs"
                      style={{ color: difficultyConfig[s.difficulty].text }}
                    >
                      {s.difficulty}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
