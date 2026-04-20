"use client";

import { useRef } from "react";
import { m, useInView } from "framer-motion";
import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";

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

export default function CTASection() {
  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="p-8 md:p-12 rounded-3xl bg-slate-950/40 border border-white/10 backdrop-blur-sm relative overflow-hidden group">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="text-center relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-6">
                <Award className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Siap untuk Menghitung <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Pajak Anda?
                </span>
              </h2>
              <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Bergabung dengan ribuan pengguna yang telah menggunakan KalkulatorPajak
                untuk perhitungan pajak yang akurat dan cepat.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-lg transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                Mulai Sekarang Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
