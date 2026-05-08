"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

const requirements = [
  { label: "At least 8 characters",   test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter",     test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter",     test: (p: string) => /[a-z]/.test(p) },
  { label: "One number",               test: (p: string) => /[0-9]/.test(p) },
  { label: "One symbol (!@#$%^&*…)",  test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const strengthColors = ["#EF4444", "#EF4444", "#f59e0b", "#f59e0b", "#C96B8A", "#C96B8A"];
const strengthLabels  = ["", "Weak", "Weak", "Fair", "Fair", "Strong", "Strong"];

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const checks   = useMemo(() => requirements.map((r) => r.test(password)), [password]);
  const metCount = checks.filter(Boolean).length;
  const allMet   = metCount === requirements.length;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!allMet) return;
    setError("");
    setLoading(true);

    const { data, error } = await createClient().auth.signUp({ email, password });

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
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {success ? (
            <div className="text-center">
              <h1 className="text-2xl font-medium mb-2">Check your email</h1>
              <p className="text-sm" style={{ color: "#8A8A8A" }}>
                We sent a confirmation link to{" "}
                <span className="text-white">{email}</span>. Click it to activate your account.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-medium mb-1">Create your account</h1>
              <p className="text-sm mb-8" style={{ color: "#8A8A8A" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "#C96B8A" }} className="hover:opacity-80 transition-opacity">
                  Log in
                </Link>
              </p>

              <form onSubmit={handleSignup} className="flex flex-col gap-4">
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

                  {password.length > 0 && (
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="flex gap-1 h-1">
                        {requirements.map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-full transition-all duration-300"
                            style={{ backgroundColor: i < metCount ? strengthColors[metCount] : "#3A3A3A" }}
                          />
                        ))}
                      </div>
                      <p className="text-xs transition-colors" style={{ color: metCount > 0 ? strengthColors[metCount] : "transparent" }}>
                        {strengthLabels[metCount]}
                      </p>
                      <ul className="flex flex-col gap-1 mt-0.5">
                        {requirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs">
                            <span style={{ color: checks[i] ? "#2DB55D" : "#5A5A5A" }}>{checks[i] ? "✓" : "✗"}</span>
                            <span style={{ color: checks[i] ? "#d1d5db" : "#5A5A5A" }}>{req.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                  disabled={loading || !allMet}
                  className="mt-1 py-2.5 rounded text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: allMet ? "#C96B8A" : "#2A2A2A",
                    color:           allMet ? "#fff"    : "#5A5A5A",
                    border:          allMet ? "none"    : "1px solid #3A3A3A",
                  }}
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
