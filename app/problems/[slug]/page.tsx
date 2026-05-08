import Link from "next/link";

export default function ExercisePlaceholderPage({
  params,
}: {
  params: { slug: string };
}) {
  const title = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div style={{ backgroundColor: "#1A1A1A" }} className="min-h-screen text-white flex flex-col">
      <nav
        style={{ backgroundColor: "#1F1F1F", borderBottom: "1px solid #3A3A3A" }}
        className="flex items-center justify-between px-6 py-4 md:px-12"
      >
        <Link href="/problems" style={{ color: "#C96B8A" }} className="text-base font-medium">
          BrainReps
        </Link>
        <Link href="/problems" className="text-sm hover:text-white transition-colors" style={{ color: "#8A8A8A" }}>
          ← Training Library
        </Link>
      </nav>

      <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#5A5A5A" }}>Coming Soon</p>
        <h1 className="text-2xl font-medium mb-2">{title}</h1>
        <p className="text-sm max-w-xs mb-8" style={{ color: "#8A8A8A" }}>
          This exercise is under construction. Check back soon.
        </p>
        <Link
          href="/problems"
          className="px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#C96B8A", color: "#fff" }}
        >
          Back to Library
        </Link>
      </div>
    </div>
  );
}
