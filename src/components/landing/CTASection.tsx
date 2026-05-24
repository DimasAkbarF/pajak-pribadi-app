"use client";

import { useRef } from "react";
import { m, useInView } from "framer-motion";
import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";

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

export default function CTASection() {
  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div
            className="p-8 md:p-12 rounded-3xl relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div className="text-center relative z-10">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
                style={{ background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.12)' }}
              >
                <Award className="w-7 h-7 text-[#60A5FA]" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-[#E5E7EB] mb-4 tracking-tight">
                Siap untuk Menghitung <br className="hidden md:block" />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1)' }}
                >
                  Pajak Anda?
                </span>
              </h2>
              <p className="text-[#94A3B8] text-base mb-10 max-w-2xl mx-auto leading-relaxed">
                Bergabung dengan ribuan pelaku usaha yang telah mensimulasikan PPh Final PP 55/2022 mereka secara akurat.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: 'linear-gradient(to right, #2563EB, #4F46E5)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.15)',
                }}
              >
                Mulai Sekarang Gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
