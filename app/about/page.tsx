'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <section className="px-15 py-30 relative z-1">
        <div className="max-w-200 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-[0.7rem] text-neutral-500 tracking-widest mb-5 font-semibold">ABOUT</div>
            <h1 className="font-extrabold leading-tight tracking-tighter mb-10" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              The Studio
            </h1>
            <p className="text-lg leading-relaxed opacity-70 font-light mb-7.5">
              Pitch Studio is a venture acceleration platform built for the next generation of founders. We provide the infrastructure,
              tools, and investor network to transform raw concepts into fundable ventures.
            </p>
            <p className="text-lg leading-relaxed opacity-70 font-light mb-7.5">
              Our team comprises seasoned operators, investors, and technologists who have collectively deployed over $500M in venture
              capital across deep tech, SaaS, and frontier markets.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 grid gap-7.5"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
          >
            {[
              { value: '500+', label: 'STARTUPS REVIEWED' },
              { value: '$500M', label: 'CAPITAL DEPLOYED' },
              { value: '98%', label: 'SUCCESS RATE' },
              { value: '50+', label: 'INVESTOR PARTNERS' },
            ].map((stat, i) => (
              <div key={i} className="border-l border-neutral-800 p-5">
                <div className="text-4xl font-extrabold tracking-tight mb-2">{stat.value}</div>
                <div className="text-[0.7rem] text-neutral-500 tracking-wider font-semibold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
