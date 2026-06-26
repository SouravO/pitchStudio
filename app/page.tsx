'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Loader from '@/components/layout/Loader';
import FlowingParticles from '@/components/particles/FlowingParticles';
import { homeSections } from '@/config/homeSections';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen relative">
      <Loader loading={loading} />
      <Navbar />
      
      <div className="relative">
        <FlowingParticles sectionRefs={sectionRefs} />

        {homeSections.map((section, idx) => {
        const isLeft = section.alignment === 'left';
        const isHero = idx === 0;

        return (
          <section
            key={section.id}
            ref={(el) => {
              sectionRefs.current[idx] = el;
            }}
            className={`min-h-screen flex items-center ${isHero ? 'justify-center' : ''} px-6 md:px-12 lg:px-20 py-20`}
          >
            <div className={`w-full max-w-7xl mx-auto flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
              {/* Content Area - 60% */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`w-full lg:w-3/5 ${isHero ? 'text-center lg:text-left' : 'text-left'}`}
              >
                <h2 className={`font-extrabold tracking-tight mb-6 ${isHero ? 'text-5xl md:text-6xl lg:text-7xl' : 'text-4xl md:text-5xl lg:text-6xl'}`}>
                  {section.title}
                </h2>
                
                <p className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-white/70 mb-10 max-w-2xl">
                  {section.description}
                </p>

                {isHero && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                    {[
                      { number: '500+', label: 'Startups Reviewed' },
                      { number: '$500M', label: 'Capital Deployed' },
                      { number: '50+', label: 'Investor Partners' },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center lg:text-left">
                        <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</p>
                        <p className="text-xs text-white/40 tracking-widest uppercase">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.ctaText && section.ctaLink && (
                  <div className={isHero ? 'flex flex-wrap gap-4 justify-center lg:justify-start' : ''}>
                    <Link
                      href={section.ctaLink}
                      className={section.ctaStyle === 'primary' ? 'btn-zebra-primary' : 'btn-zebra-outline'}
                    >
                      {section.ctaText}
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* Particle Area - 40% (handled by FlowingParticles component) */}
              <div className="w-full lg:w-2/5 h-64 lg:h-96" />
            </div>
          </section>
        );
      })}
      </div>

      <Footer />
    </div>
  );
}
