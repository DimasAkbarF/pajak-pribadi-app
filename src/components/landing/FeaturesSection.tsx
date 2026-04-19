"use client";

import { useRef } from "react";
import { m, useInView } from "framer-motion";
import { Calculator, FileText, Lock, Clock } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </m.div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: { icon: any; title: string; description: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className={`p-6 rounded-2xl border ${colorClasses[color]} backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}>
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color].split(" ")[0]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Fitur Unggulan
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk perhitungan pajak yang akurat dan mudah
          </p>
        </AnimatedSection>

        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <m.div variants={fadeInUp}>
            <FeatureCard
              icon={Calculator}
              title="4 Modul Pajak"
              description="Karyawan, UMKM, Norma, dan Profesi Bebas dengan perhitungan sesuai regulasi terbaru"
              color="blue"
            />
          </m.div>
          <m.div variants={fadeInUp}>
            <FeatureCard
              icon={FileText}
              title="PDF Export Pro"
              description="Generate laporan PDF profesional dengan format standar untuk arsip atau pelaporan"
              color="emerald"
            />
          </m.div>
          <m.div variants={fadeInUp}>
            <FeatureCard
              icon={Lock}
              title="100% Privat"
              description="Semua perhitungan dilakukan di browser. Data tidak tersimpan tanpa izin Anda"
              color="violet"
            />
          </m.div>
          <m.div variants={fadeInUp}>
            <FeatureCard
              icon={Clock}
              title="Real-time"
              description="Hasil perhitungan muncul instan saat Anda menginput data. Tidak perlu menunggu"
              color="amber"
            />
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
