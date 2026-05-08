"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white">
      <Navbar />

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
        <h1 className="text-2xl font-medium mb-1">Good morning</h1>
        <p className="text-sm mb-10" style={{ color: "#8A8A8A" }}>
          Ready for your daily reps?
        </p>

        <div className="flex items-center gap-2 mb-8">
          <span>🔥</span>
          <span className="text-sm font-medium">3 Day Streak</span>
        </div>

        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
        >
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#5A5A5A" }}>Today</p>
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
