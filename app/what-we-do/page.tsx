'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const steps = [
  { number: '01', title: 'SUBMIT', description: 'Input your core data into the encrypted studio terminal. Our structured application captures every critical dimension of your venture.' },
  { number: '02', title: 'VALIDATE', description: 'Investor-tier review protocols verify growth potential, market fit, and team dynamics through our proprietary scoring matrix.' },
  { number: '03', title: 'CONNECT', description: 'Direct uplink to verified venture capital nodes. High-probability matches get warm introductions to partner funds.' },
];

export default function WhatWeDoPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <section className="px-15 py-30 relative z-1">
        <div className="max-w-300 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-[0.7rem] text-neutral-500 tracking-widest mb-5 font-semibold">PROCESS</div>
            <h1 className="font-extrabold leading-tight tracking-tighter mb-10" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              What We Do
            </h1>
            <p className="max-w-150 text-lg leading-relaxed opacity-70 font-light mb-20">
              We deconstruct the fundraising process into a repeatable, data-driven sequence. No cold emails. No warm intros. Just signal.
            </p>
          </motion.div>

          <div className="grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="border-l border-white/40 p-10 bg-white/[0.03] backdrop-blur rounded-r-lg"
              >
                <div className="text-sm text-neutral-500 mb-5 font-bold font-mono">{step.number}</div>
                <h3 className="text-4xl font-bold mb-5 text-white">{step.title}</h3>
                <p className="opacity-80 leading-relaxed font-light text-lg text-neutral-300">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-20"
          >
            <Link href="/forms" className="btn-zebra-primary">START APPLICATION</Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
