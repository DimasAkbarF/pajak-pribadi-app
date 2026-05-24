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
    blue: "bg-blue-500/5 text-blue-400 border-blue-500/10",
    cyan: "bg-cyan-500/5 text-cyan-400 border-cyan-500/10",
    indigo: "bg-indigo-500/5 text-indigo-400 border-indigo-500/10",
    slate: "bg-slate-500/5 text-slate-300 border-slate-500/10",
  };

  return (
    <div className={`p-6 rounded-2xl border ${colorClasses[color]} backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}>
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color].split(" ")[0]} flex items-center justify-center mb-4`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Fitur Unggulan UMKM
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk kalkulasi dan pelaporan PPh Final UMKM secara instan
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
              title="PP 55/2022 Akurat"
              description="Kalkulasi presisi mengikuti batas bebas pajak Rp500 Juta Orang Pribadi & tarif final 0.5%"
              color="blue"
            />
          </m.div>
          <m.div variants={fadeInUp}>
            <FeatureCard
              icon={FileText}
              title="PDF Export Receipt"
              description="Ekspor slip rekap perhitungan PPh bulanan berformat profesional untuk kebutuhan pembukuan"
              color="cyan"
            />
          </m.div>
          <m.div variants={fadeInUp}>
            <FeatureCard
              icon={Lock}
              title="100% Privat"
              description="Seluruh proses komputasi berjalan di browser lokal. Data omzet aman di perangkat Anda"
              color="indigo"
            />
          </m.div>
          <m.div variants={fadeInUp}>
            <FeatureCard
              icon={Clock}
              title="Real-time Engine"
              description="Hasil perhitungan status PPh Nihil atau Kurang Bayar langsung terupdate saat omzet diinput"
              color="slate"
            />
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
