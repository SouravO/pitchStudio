'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Loader from '@/components/layout/Loader';

const Scene3DHome = dynamic(() => import('@/components/3d/Scene3DHome'), { ssr: false });

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen">
      <Loader loading={loading} />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Scene3DHome />
      </div>

      <Navbar />

      <section className="h-screen flex flex-col items-center justify-center text-center px-10 relative z-1">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white text-black px-4 py-1.5 text-[0.7rem] font-bold mb-7.5 rounded-sm"
        >
          DROP SEQUENCE 2026
        </motion.div>

        <motion.h1
          className="font-extrabold leading-none tracking-tighter uppercase"
          style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}
        >
          Unfold <br /> The Void
        </motion.h1>

        <motion.p className="max-w-150 mt-10 text-lg opacity-60 leading-relaxed font-light">
          Engineering the bridge between raw ideas and institutional capital through high-fidelity pitch sequences.
        </motion.p>

        <div className="mt-15 flex gap-5">
          <Link href="/forms" className="btn-zebra-primary">START APPLICATION</Link>
          <Link href="/what-we-do" className="btn-zebra-outline">HOW IT WORKS</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
