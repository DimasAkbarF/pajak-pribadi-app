import HeroSection from "@/components/landing/HeroSection";
import ClientLandingSections from "@/components/landing/ClientLandingSections";

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: '#050B18' }}>
      {/* Subtle layered navy background — no bright glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(ellipse at 30% 20%, #0B1730 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-0 right-0 w-1/2 h-1/2 blur-3xl opacity-15"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, #101B36 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-1/2 h-1/2 blur-3xl opacity-10"
          style={{ background: 'radial-gradient(ellipse at 40% 80%, #0B1730 0%, transparent 70%)' }}
        />
      </div>

      {/* Hero - Critical Path (Server Component) */}
      <HeroSection />

      {/* Below the fold - Lazy Loaded (Client Components) */}
      <ClientLandingSections />
    </main>
  );
}
