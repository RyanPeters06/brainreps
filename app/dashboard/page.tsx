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
    <div style={{ backgroundColor: "#1A1A1A" }} className="min-h-screen text-white">
      <nav
        style={{ backgroundColor: "#1F1F1F", borderBottom: "1px solid #3A3A3A" }}
        className="flex items-center justify-between px-6 py-4 md:px-12"
      >
        <span style={{ color: "#C96B8A" }} className="text-base font-medium">
          BrainReps
        </span>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/problems" style={{ color: "#8A8A8A" }} className="hover:text-white transition-colors">
            Library
          </Link>
          <button
            onClick={handleLogout}
            style={{ color: "#8A8A8A" }}
            className="hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-medium mb-1">Good morning</h1>
        <p className="text-sm mb-10" style={{ color: "#8A8A8A" }}>
          Ready for your daily reps?
        </p>

        <div className="flex items-center gap-2 mb-8">
          <span className="text-xl">🔥</span>
          <span className="text-sm font-medium">1 Day Streak</span>
        </div>

        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
        >
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#8A8A8A" }}>
            Today
          </p>
          <h2 className="text-base font-medium mb-1">Today&apos;s Session</h2>
          <p className="text-sm mb-6" style={{ color: "#8A8A8A" }}>
            10 minutes · Mixed cognitive training
          </p>
          <button
            onClick={() => router.push("/exercises/memory-sequence")}
            className="px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#C96B8A", color: "#fff" }}
          >
            Begin Session
          </button>
        </div>
      </main>
    </div>
  );
}
