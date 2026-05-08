import Link from "next/link";

export default function Home() {
  return (
    <div style={{ backgroundColor: "#1A1A1A" }} className="min-h-screen text-white">
      <nav
        style={{ backgroundColor: "#1F1F1F", borderBottom: "1px solid #3A3A3A" }}
        className="flex items-center justify-between px-6 py-4 md:px-12"
      >
        <span style={{ color: "#C96B8A" }} className="text-base font-medium tracking-tight">
          BrainReps
        </span>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/login" style={{ color: "#8A8A8A" }} className="hover:text-white transition-colors">
            Login
          </Link>
          <Link
            href="/signup"
            style={{ backgroundColor: "#C96B8A", color: "#fff" }}
            className="px-4 py-1.5 rounded text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-57px)] px-6">
        <h1 className="text-5xl md:text-6xl font-medium tracking-tight leading-tight mb-4">
          Brain<span style={{ color: "#C96B8A" }}>Reps</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-md" style={{ color: "#8A8A8A" }}>
          Train your mind daily. 10 minutes. No excuses.
        </p>
        <Link
          href="/problems"
          style={{ backgroundColor: "#C96B8A", color: "#fff" }}
          className="px-6 py-2.5 rounded text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Start Today&apos;s Session
        </Link>
        <p className="mt-5 text-sm max-w-xs" style={{ color: "#8A8A8A" }}>
          Brush your teeth twice a day. Train your brain once.
        </p>
      </section>
    </div>
  );
}
