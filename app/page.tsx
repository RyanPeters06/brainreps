import Link from "next/link";

export default function Home() {
  return (
    <div style={{ backgroundColor: "#0A0A0A" }} className="min-h-screen text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <span style={{ color: "#ADFF2F" }} className="text-xl font-bold tracking-tight">
          BrainReps
        </span>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
            Login
          </Link>
          <Link
            href="/signup"
            style={{ backgroundColor: "#ADFF2F", color: "#0A0A0A" }}
            className="px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-72px)] px-6">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-6">
          Brain<span style={{ color: "#ADFF2F" }}>Reps</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-xl mb-10">
          Train your mind daily. 10 minutes. No excuses.
        </p>
        <Link
          href="/problems"
          style={{ backgroundColor: "#ADFF2F", color: "#0A0A0A" }}
          className="px-8 py-4 rounded-full text-base font-bold hover:opacity-90 transition-opacity"
        >
          Start Today&apos;s Session
        </Link>
        <p className="mt-6 text-sm text-gray-500 max-w-sm">
          Brush your teeth twice a day. Train your brain once.
        </p>
      </section>
    </div>
  );
}
