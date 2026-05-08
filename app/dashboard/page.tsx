"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div style={{ backgroundColor: "#0A0A0A" }} className="min-h-screen text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 border-b border-white/5">
        <span style={{ color: "#ADFF2F" }} className="text-xl font-bold tracking-tight">
          BrainReps
        </span>
        <div className="flex items-center gap-6">
          <Link href="/problems" className="text-sm text-gray-400 hover:text-white transition-colors">
            Library
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        {/* Welcome */}
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">
          Good morning,
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          Ready for your daily reps?
        </p>

        {/* Streak */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl">🔥</span>
          <span className="text-lg font-bold">1 Day Streak</span>
        </div>

        {/* Today's Session card */}
        <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
            Today
          </p>
          <h2 className="text-xl font-bold mb-1">Today&apos;s Session</h2>
          <p className="text-gray-400 text-sm mb-6">
            10 minutes · Mixed cognitive training
          </p>
          <button
            onClick={() => router.push("/exercises/memory-sequence")}
            style={{ backgroundColor: "#ADFF2F", color: "#0A0A0A" }}
            className="px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Begin Session
          </button>
        </div>
      </main>
    </div>
  );
}
