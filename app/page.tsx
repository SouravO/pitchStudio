'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Loader from '@/components/layout/Loader';
import ParticleHero from '@/components/particles/ParticleHero';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const contentOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.25, 0.45], [40, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      scrollRef.current = v;
    });
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen">
      <Loader loading={loading} />

      <Navbar />

      <ParticleHero scrollRef={scrollRef} />

      <section className="min-h-screen flex flex-col items-center justify-center text-center px-10">
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-white/80 mb-16 max-w-3xl mx-auto">
            We engineer the bridge between visionary founders and institutional capital through high-fidelity pitch sequences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {[
              { number: '500+', label: 'Startups Reviewed' },
              { number: '$500M', label: 'Capital Deployed' },
              { number: '50+', label: 'Investor Partners' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</p>
                <p className="text-sm text-white/40 tracking-widest uppercase">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-5 justify-center">
            <Link href="/forms" className="btn-zebra-primary">START APPLICATION</Link>
            <Link href="/what-we-do" className="btn-zebra-outline">HOW IT WORKS</Link>
          </div>
        </motion.div>

        <div className="flex-1" />
      </section>

      <Footer />
    </div>
  );
}
