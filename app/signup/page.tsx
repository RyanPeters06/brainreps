"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const requirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number",           test: (p: string) => /[0-9]/.test(p) },
  { label: "One symbol (!@#$%^&*…)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const strengthColors = ["#ef4444", "#ef4444", "#f59e0b", "#f59e0b", "#84cc16", "#ADFF2F"];
const strengthLabels = ["", "Weak", "Weak", "Fair", "Fair", "Strong", "Strong"];

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const checks = useMemo(() => requirements.map((r) => r.test(password)), [password]);
  const metCount = checks.filter(Boolean).length;
  const allMet = metCount === requirements.length;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!allMet) return;
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
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
                {/* Email */}
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

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ADFF2F] transition-colors"
                  />

                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="flex gap-1 h-1">
                        {requirements.map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor:
                                i < metCount
                                  ? strengthColors[metCount]
                                  : "rgba(255,255,255,0.1)",
                            }}
                          />
                        ))}
                      </div>
                      <p
                        className="text-xs font-medium transition-colors duration-300"
                        style={{ color: metCount > 0 ? strengthColors[metCount] : "transparent" }}
                      >
                        {strengthLabels[metCount]}
                      </p>

                      {/* Requirements checklist */}
                      <ul className="flex flex-col gap-1 mt-1">
                        {requirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs">
                            <span
                              className="transition-colors duration-200"
                              style={{ color: checks[i] ? "#ADFF2F" : "#6b7280" }}
                            >
                              {checks[i] ? "✓" : "✗"}
                            </span>
                            <span
                              className="transition-colors duration-200"
                              style={{ color: checks[i] ? "#d1d5db" : "#6b7280" }}
                            >
                              {req.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !allMet}
                  style={{
                    backgroundColor: allMet ? "#ADFF2F" : "rgba(255,255,255,0.08)",
                    color: allMet ? "#0A0A0A" : "#6b7280",
                  }}
                  className="mt-2 rounded-full py-3 font-bold text-sm transition-all duration-300 disabled:cursor-not-allowed hover:opacity-90"
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
