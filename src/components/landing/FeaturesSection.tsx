"use client";

import { useRef } from "react";
import { m, useInView } from "framer-motion";
import { Calculator, FileText, Lock, Clock } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
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

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div
      className="p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300"
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
        style={{ background: 'rgba(37, 99, 235, 0.08)' }}
      >
        <Icon className="w-4 h-4 text-[#60A5FA]" />
      </div>
      <h3 className="text-sm font-semibold text-[#E5E7EB] mb-2">{title}</h3>
      <p className="text-[#94A3B8] text-xs leading-relaxed">{description}</p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB] mb-4">
            Fitur Unggulan UMKM
          </h2>
          <p className="text-[#94A3B8] text-sm max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk kalkulasi dan pelaporan PPh Final UMKM secara instan
          </p>
        </AnimatedSection>

        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <m.div variants={fadeInUp}>
            <FeatureCard
              icon={Calculator}
              title="PP 55/2022 Akurat"
              description="Kalkulasi presisi mengikuti batas bebas pajak Rp500 Juta Orang Pribadi & tarif final 0.5%"
            />
          </m.div>
          <m.div variants={fadeInUp}>
            <FeatureCard
              icon={FileText}
              title="PDF Export Receipt"
              description="Ekspor slip rekap perhitungan PPh bulanan berformat profesional untuk kebutuhan pembukuan"
            />
          </m.div>
          <m.div variants={fadeInUp}>
            <FeatureCard
              icon={Lock}
              title="100% Privat"
              description="Seluruh proses komputasi berjalan di browser lokal. Data omzet aman di perangkat Anda"
            />
          </m.div>
          <m.div variants={fadeInUp}>
            <FeatureCard
              icon={Clock}
              title="Real-time Engine"
              description="Hasil perhitungan status PPh Nihil atau Kurang Bayar langsung terupdate saat omzet diinput"
            />
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
