"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await createClient().auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-medium mb-1">Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: "#8A8A8A" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "#C96B8A" }} className="hover:opacity-80 transition-opacity">
              Sign up
            </Link>
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm" style={{ color: "#8A8A8A" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="px-3 py-2.5 rounded text-sm text-white placeholder-[#5A5A5A] focus:outline-none transition-colors"
                style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
                onFocus={(e) => (e.target.style.borderColor = "#C96B8A")}
                onBlur={(e)  => (e.target.style.borderColor = "#3A3A3A")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm" style={{ color: "#8A8A8A" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="px-3 py-2.5 rounded text-sm text-white placeholder-[#5A5A5A] focus:outline-none transition-colors"
                style={{ backgroundColor: "#262626", border: "1px solid #3A3A3A" }}
                onFocus={(e) => (e.target.style.borderColor = "#C96B8A")}
                onBlur={(e)  => (e.target.style.borderColor = "#3A3A3A")}
              />
            </div>

            {error && (
              <p
                className="text-sm px-3 py-2.5 rounded"
                style={{ color: "#EF4444", backgroundColor: "#2E1A1A", border: "1px solid #3A2020" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 py-2.5 rounded text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: "#C96B8A", color: "#fff" }}
            >
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
