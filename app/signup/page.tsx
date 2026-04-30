"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div
      style={{ backgroundColor: "#0A0A0A" }}
      className="min-h-screen text-white flex flex-col"
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <Link
          href="/"
          style={{ color: "#ADFF2F" }}
          className="text-xl font-bold tracking-tight"
        >
          BrainReps
        </Link>
      </nav>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {success ? (
            <div className="text-center">
              <h1 className="text-3xl font-black tracking-tight mb-3">
                Check your email
              </h1>
              <p className="text-gray-400 text-sm">
                We sent a confirmation link to{" "}
                <span className="text-white font-medium">{email}</span>.
                Click it to activate your account.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-black tracking-tight mb-2">
                Create your account
              </h1>
              <p className="text-gray-400 text-sm mb-8">
                Already have an account?{" "}
                <Link
                  href="/login"
                  style={{ color: "#ADFF2F" }}
                  className="font-medium hover:opacity-80 transition-opacity"
                >
                  Log in
                </Link>
              </p>

              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ADFF2F] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ADFF2F] transition-colors"
                  />
                  <p className="text-xs text-gray-600 mt-0.5">
                    Minimum 6 characters
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "#ADFF2F", color: "#0A0A0A" }}
                  className="mt-2 rounded-full py-3 font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating account…" : "Create Account"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
