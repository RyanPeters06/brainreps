"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Navbar({ logoHeight = 38 }: { logoHeight?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        setUserEmail(data.user?.email ?? null);
        setLoaded(true);
      });
  }, []);

  async function handleLogout() {
    await createClient().auth.signOut();
    router.push("/problems");
    router.refresh();
  }

  const homeHref = loaded && userEmail ? "/dashboard" : "/";
  const navLinks = [
    { href: homeHref, label: "Home", exact: true },
    { href: "/problems", label: "Problems", exact: false },
    { href: "/doomscroll-cure", label: "Doomscroll Cure", exact: false },
    { href: "/about", label: "About", exact: false },
  ];

  const username = userEmail ? userEmail.split("@")[0] : null;

  return (
    <nav
      style={{ backgroundColor: "#1F1F1F", borderBottom: "1px solid #3A3A3A", position: "sticky", top: 0, zIndex: 50 }}
      className="flex items-center justify-between px-6 py-4 md:px-10"
    >
      <Link href={homeHref} className="shrink-0">
        <img src="/logo.png" alt="BrainReps" style={{ height: logoHeight, width: "auto" }} />
      </Link>

      <div className="hidden md:flex items-center gap-7 text-sm absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors"
            style={{ color: (link.exact ? pathname === link.href : pathname.startsWith(link.href)) ? "#C96B8A" : "#8A8A8A" }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm">
        {!loaded ? (
          <span style={{ color: "#3A3A3A" }}>·</span>
        ) : username ? (
          <>
            <Link href="/profile" style={{ color: "#8A8A8A" }} className="hover:text-white transition-colors hidden sm:block">
              {username}
            </Link>
            <button
              onClick={handleLogout}
              style={{ color: "#8A8A8A" }}
              className="hover:text-white transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: "#8A8A8A" }} className="hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="px-3 py-1.5 rounded text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#C96B8A", color: "#fff" }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
