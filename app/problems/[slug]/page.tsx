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
    <div style={{ backgroundColor: "#0A0A0A" }} className="min-h-screen text-white flex flex-col">
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 border-b border-white/5">
        <Link href="/dashboard" style={{ color: "#ADFF2F" }} className="text-xl font-bold tracking-tight">
          BrainReps
        </Link>
        <Link href="/problems" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Training Library
        </Link>
      </nav>

      <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">Coming Soon</p>
        <h1 className="text-4xl font-black tracking-tight mb-3">{title}</h1>
        <p className="text-gray-500 text-sm max-w-xs mb-8">
          This exercise is under construction. Check back soon.
        </p>
        <Link
          href="/problems"
          style={{ backgroundColor: "#ADFF2F", color: "#0A0A0A" }}
          className="px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Back to Library
        </Link>
      </div>
    </div>
  );
}
