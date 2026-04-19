import HeroSection from "@/components/landing/HeroSection";
import ClientLandingSections from "@/components/landing/ClientLandingSections";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Mesh Gradient Background - Static CSS background for speed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-900/10 via-slate-950 to-violet-900/10 blur-3xl opacity-40" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-indigo-900/10 via-transparent to-transparent blur-2xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-900/10 via-transparent to-transparent blur-2xl opacity-20" />
      </div>

      {/* Hero - Critical Path (Server Component) */}
      <HeroSection />

      {/* Below the fold - Lazy Loaded (Client Components) */}
      <ClientLandingSections />
    </main>
  );
}
