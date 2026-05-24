"use client";

import { useRef } from "react";
import { m, useInView } from "framer-motion";
import { Calculator, TrendingUp, Download, ArrowRight } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
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

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB] mb-4">
            Cara Penggunaan
          </h2>
          <p className="text-[#94A3B8] text-sm max-w-2xl mx-auto">
            Hitung pajak UMKM Anda dalam 3 langkah mudah
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Pilih Bulan Masa Pajak",
              desc: "Pilih masa bulan operasional usaha yang akan Anda simulasikan pajaknya",
              icon: Calculator,
            },
            {
              step: "02",
              title: "Masukkan Omzet",
              desc: "Masukkan omzet kotor bulan berjalan dan total kumulatif bruto dari Januari",
              icon: TrendingUp,
            },
            {
              step: "03",
              title: "Peroleh Slip Pajak",
              desc: "Lihat rincian PPh 0.5% secara instan dan ekspor laporan rekap berformat PDF",
              icon: Download,
            },
          ].map((item, i) => (
            <AnimatedSection key={i} className="relative">
              <div
                className="p-8 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div className="text-4xl font-bold text-[#1e293b] mb-4">{item.step}</div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: 'rgba(37, 99, 235, 0.08)' }}
                >
                  <item.icon className="w-5 h-5 text-[#60A5FA]" />
                </div>
                <h3 className="text-base font-semibold text-[#E5E7EB] mb-2">{item.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{item.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-white/10" />
                </div>
              )}
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
