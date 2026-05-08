import Link from "next/link";
import Image from "next/image";

const features = [
  {
    title: "14 Cognitive Exercises",
    description: "Memory, attention, logic, and flexibility — every major cognitive domain covered in one platform.",
    icon: "◈",
  },
  {
    title: "Daily Challenges",
    description: "A new featured exercise every day. Build a streak. Show up consistently.",
    icon: "◉",
  },
  {
    title: "Track Your Progress",
    description: "Session history, streak calendar, and category breakdowns — see exactly where you're improving.",
    icon: "◎",
  },
];

const steps = [
  {
    num: "01",
    title: "Browse the library",
    description: "Explore 14 exercises across memory, attention, logic, and cognitive flexibility.",
  },
  {
    num: "02",
    title: "Complete daily challenges",
    description: "One featured exercise per day keeps your streak alive and your training consistent.",
  },
  {
    num: "03",
    title: "Track your improvement",
    description: "Sign up to save results, build streaks, and see your cognitive growth over time.",
  },
];

export default function Home() {
  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white">
      {/* Nav */}
      <nav
        style={{ backgroundColor: "#1F1F1F", borderBottom: "1px solid #3A3A3A" }}
        className="flex items-center justify-between px-6 py-3 md:px-12"
      >
        <Link href="/">
          <Image src="/logo.png" alt="BrainReps" height={40} width={0} style={{ width: "auto", height: 40 }} priority />
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/login" style={{ color: "#8A8A8A" }} className="hover:text-white transition-colors">
            Login
          </Link>
          <Link
            href="/signup"
            className="px-3 py-1.5 rounded text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#C96B8A", color: "#fff" }}
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
        <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#C96B8A" }}>
          Cognitive Training
        </p>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-5 max-w-xl">
          Train your mind like you train your body
        </h1>
        <p className="text-base mb-8 max-w-md" style={{ color: "#8A8A8A" }}>
          10 minutes a day. 14 science-backed exercises. No ads, no streaks for the sake of streaks — just deliberate cognitive training.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/problems"
            className="px-5 py-2.5 rounded text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#C96B8A", color: "#fff" }}
          >
            Start Training Free
          </Link>
          <Link
            href="/problems"
            className="px-5 py-2.5 rounded text-sm transition-colors"
            style={{ border: "1px solid #3A3A3A", color: "#8A8A8A" }}
          >
            Browse Exercises
          </Link>
        </div>
        <p className="text-xs mt-5" style={{ color: "#5A5A5A" }}>
          No account required to start. Sign up to save progress.
        </p>
      </section>

      {/* Features */}
      <section style={{ borderTop: "1px solid #2E2E2E" }} className="px-6 py-16 md:py-20">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p className="text-xs uppercase tracking-widest text-center mb-10" style={{ color: "#5A5A5A" }}>
            What you get
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-lg p-5"
                style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
              >
                <span className="text-2xl mb-4 block" style={{ color: "#C96B8A" }}>{f.icon}</span>
                <h3 className="text-sm font-medium mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8A8A8A" }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ borderTop: "1px solid #2E2E2E" }} className="px-6 py-16 md:py-20">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p className="text-xs uppercase tracking-widest text-center mb-10" style={{ color: "#5A5A5A" }}>
            How it works
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num}>
                <p className="text-2xl font-medium mb-3" style={{ color: "#3A3A3A" }}>{s.num}</p>
                <h3 className="text-sm font-medium mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8A8A8A" }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ borderTop: "1px solid #2E2E2E" }} className="px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#5A5A5A" }}>
          These aren&apos;t games. They&apos;re reps.
        </p>
        <h2 className="text-2xl font-medium mb-4">Ready to start?</h2>
        <Link
          href="/problems"
          className="inline-block px-6 py-2.5 rounded text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#C96B8A", color: "#fff" }}
        >
          Open the Training Library
        </Link>
      </section>
    </div>
  );
}
