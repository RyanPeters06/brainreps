import Navbar from "@/components/Navbar";

export default function DoomscrollCurePage() {
  return (
    <div style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }} className="text-white">
      <Navbar />
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#C96B8A" }}>
          Coming Soon
        </p>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-4 max-w-xl">
          Doomscroll Cure
        </h1>
        <p className="text-base max-w-md" style={{ color: "#8A8A8A" }}>
          A gamified way to reclaim your attention and build habits that pull you away from the screen.
        </p>
      </section>
    </div>
  );
}
