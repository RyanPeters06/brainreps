"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import { categoryColors } from "@/lib/exercises";

// 12 weeks × 7 days of placeholder activity — deterministic pattern
const ACTIVITY: boolean[] = [
  // week 1
  false, false, true, false, false, true, false,
  // week 2
  false, true, false, true, false, false, true,
  // week 3
  true, false, true, false, true, true, false,
  // week 4
  false, true, true, false, false, true, true,
  // week 5
  false, false, true, false, true, false, false,
  // week 6
  true, false, true, true, false, true, true,
  // week 7
  false, true, false, true, false, true, false,
  // week 8
  true, false, false, true, true, false, true,
  // week 9
  false, true, true, false, true, true, true,
  // week 10
  true, false, true, false, true, false, true,
  // week 11
  false, true, true, true, false, true, true,
  // week 12 (current, partial)
  true, false, true, false, false, false, false,
];

const HISTORY = [
  { date: "Today",      title: "Sequence Recall", score: "5 / 5", time: "1m 42s" },
  { date: "Yesterday",  title: "Sequence Recall", score: "4 / 5", time: "1m 58s" },
  { date: "May 5",      title: "Sequence Recall", score: "5 / 5", time: "1m 30s" },
  { date: "May 4",      title: "Sequence Recall", score: "3 / 5", time: "2m 01s" },
  { date: "May 3",      title: "Sequence Recall", score: "4 / 5", time: "1m 49s" },
];

const CATEGORY_PROGRESS = [
  { category: "Memory",               done: 1, total: 5 },
  { category: "Attention Training",   done: 0, total: 4 },
  { category: "Critical Thinking",    done: 0, total: 2 },
  { category: "Cognitive Flexibility",done: 0, total: 2 },
  { category: "Quick Thinking",       done: 0, total: 1 },
];

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function ProfilePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (!data.user) {
          router.push("/login");
          return;
        }
        setUserEmail(data.user.email ?? null);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white">
        <Navbar />
        <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#5A5A5A" }}>
          Loading…
        </div>
      </div>
    );
  }

  const username = userEmail ? userEmail.split("@")[0] : "";
  const initials = username.slice(0, 2).toUpperCase();
  const joinDate = "May 2025";

  const statCards = [
    { label: "Current Streak", value: "3", unit: "days" },
    { label: "Total Completed", value: "12", unit: "exercises" },
    { label: "Best Streak", value: "7", unit: "days" },
    { label: "Avg Score", value: "4.1", unit: "/ 5" },
  ];

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white">
      <Navbar />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Profile header */}
        <div className="flex items-center gap-5 mb-8">
          <div
            className="flex items-center justify-center rounded-full text-xl font-medium"
            style={{
              width: 72,
              height: 72,
              backgroundColor: "#2E1A22",
              color: "#C96B8A",
              border: "2px solid #3A3A3A",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div>
            <h1 className="text-lg font-medium mb-0.5">{username}</h1>
            <p className="text-sm mb-1" style={{ color: "#8A8A8A" }}>{userEmail}</p>
            <p className="text-xs" style={{ color: "#5A5A5A" }}>Member since {joinDate}</p>
          </div>
          <button
            disabled
            className="ml-auto px-4 py-1.5 rounded text-sm cursor-not-allowed"
            style={{ border: "1px solid #3A3A3A", color: "#5A5A5A" }}
          >
            Edit Profile
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="rounded-lg p-4"
              style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
            >
              <p className="text-2xl font-medium mb-0.5">
                {s.value}
                <span className="text-sm font-normal ml-1" style={{ color: "#5A5A5A" }}>{s.unit}</span>
              </p>
              <p className="text-xs" style={{ color: "#8A8A8A" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Streak calendar */}
        <div
          className="rounded-lg p-5 mb-6"
          style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
        >
          <h2 className="text-sm font-medium mb-4">Activity — last 12 weeks</h2>
          <div className="overflow-x-auto">
            <div style={{ display: "inline-flex", gap: 3 }}>
              {/* Day labels column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginRight: 4 }}>
                {DAYS.map((d, i) => (
                  <div
                    key={i}
                    style={{ width: 11, height: 11, fontSize: 9, color: "#5A5A5A", lineHeight: "11px" }}
                  >
                    {i % 2 === 0 ? d : ""}
                  </div>
                ))}
              </div>
              {/* Week columns */}
              {Array.from({ length: 12 }).map((_, week) => (
                <div key={week} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {Array.from({ length: 7 }).map((_, day) => {
                    const active = ACTIVITY[week * 7 + day];
                    return (
                      <div
                        key={day}
                        style={{
                          width: 11,
                          height: 11,
                          borderRadius: 2,
                          backgroundColor: active ? "#C96B8A" : "#2A2A2A",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: "#5A5A5A" }}>
            {ACTIVITY.filter(Boolean).length} active days
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Exercise history */}
          <div
            className="rounded-lg p-5"
            style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
          >
            <h2 className="text-sm font-medium mb-4">Recent Sessions</h2>
            <div className="flex flex-col">
              {HISTORY.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 text-sm"
                  style={{ borderBottom: i < HISTORY.length - 1 ? "1px solid #2E2E2E" : "none" }}
                >
                  <div>
                    <p style={{ color: "#E5E5E5" }}>{h.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#5A5A5A" }}>{h.date} · {h.time}</p>
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{ backgroundColor: "#2E1A22", color: "#C96B8A" }}
                  >
                    {h.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown */}
          <div
            className="rounded-lg p-5"
            style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
          >
            <h2 className="text-sm font-medium mb-4">Category Progress</h2>
            <div className="flex flex-col gap-4">
              {CATEGORY_PROGRESS.map((cp) => {
                const pct = (cp.done / cp.total) * 100;
                const col = categoryColors[cp.category];
                return (
                  <div key={cp.category}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: "#8A8A8A" }}>{cp.category}</span>
                      <span style={{ color: "#5A5A5A" }}>{cp.done} / {cp.total}</span>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 4, backgroundColor: "#3A3A3A" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: col.text }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
