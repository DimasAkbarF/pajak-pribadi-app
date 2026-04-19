"use client";

import { useRef } from "react";
import { m, useInView } from "framer-motion";
import { Calculator, TrendingUp, Download, ArrowRight } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
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
    <section id="how-it-works" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Cara Penggunaan
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Hitung pajak Anda dalam 3 langkah sederhana
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Pilih Modul",
              desc: "Pilih jenis wajib pajak yang sesuai dengan profesi Anda",
              icon: Calculator,
            },
            {
              step: "02",
              title: "Input Data",
              desc: "Masukkan penghasilan bruto, PTKP, dan kredit pajak",
              icon: TrendingUp,
            },
            {
              step: "03",
              title: "Dapatkan Hasil",
              desc: "Lihat status pajak dan download laporan PDF",
              icon: Download,
            },
          ].map((item, i) => (
            <AnimatedSection key={i} className="relative">
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-5xl font-bold text-white/10 mb-4">{item.step}</div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-white/20" />
                </div>
              )}
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
