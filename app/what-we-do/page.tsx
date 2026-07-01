'use client';

import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// ─── Constants & Data ────────────────────────────────────────────────────────
const PROTOCOLS = [
  {
    id: 'p1',
    num: '01',
    title: 'SUBMIT',
    subtitle: 'Data Ingestion & Encryption',
    desc: 'Input your venture dimensions into our studio terminal. High-fidelity parsing nodes process your metrics, cap tables, and legal structures into a cryptographically isolated deal-room ecosystem.',
    accent: '#7C5CFF',
  },
  {
    id: 'p2',
    num: '02',
    title: 'VALIDATE',
    subtitle: 'Algorithmic Scoring Matrix',
    desc: 'Investor-grade evaluation protocols instantly benchmark your performance indices against historical market cohorts, stress-testing your model for authentic growth vectors.',
    accent: '#FF8A3D',
  },
  {
    id: 'p3',
    num: '03',
    title: 'CONNECT',
    subtitle: 'Synaptic Node Routing',
    desc: 'Direct uplink to verified venture capital infrastructure. Your matching profile bypasses filters to land immediately in the execution pipelines of active, partner-level check writers.',
    accent: '#50FFA0',
  },
];

type ProtocolStep = (typeof PROTOCOLS)[number];

const CAPABILITIES = [
  {
    metric: '30m',
    label: 'AVG INTRO TIMING',
    title: 'Zero wasted telemetry',
    desc: 'Cold pitching is dead. Our routing layer maps your signal to institutional investors explicitly mandated for your sector, geography, and traction.',
    accent: '#7C5CFF',
  },
  {
    metric: '100%',
    label: 'SLIDE-BY-SLIDE VISIBILITY',
    title: 'Real-time diligence data',
    desc: 'Track intent down to the second. See exactly which institutional nodes are reviewing your models, decks, and data rooms as it happens.',
    accent: '#FF8A3D',
  },
  {
    metric: '160+',
    label: 'DEPLOYMENT MARKETS',
    title: 'One unified pipeline',
    desc: 'Manage inbound requests, process security keys, and finalize allocation tracking from a single secure execution surface.',
    accent: '#50FFA0',
  },
];

// ─── Shared Primitive UI ─────────────────────────────────────────────────────
function SectionBadge({ children, accent = '#7C5CFF' }: { children: React.ReactNode; accent?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EDEAFF]/10 bg-[#EDEAFF]/[0.02] backdrop-blur-sm font-mono text-[10px] tracking-[0.25em] uppercase text-[#EDEAFF]/50 mb-6">
      <span style={{ color: accent }} className="animate-pulse">✦</span> {children}
    </div>
  );
}

// Simple, robust scroll-into-view reveal — fires once, no scroll-linked math.
function Reveal({
  children,
  delay = 0,
  y = 24,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Cursor-reactive magnetic wrapper for primary CTAs. Mouse-driven only.
function MagneticLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 14, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 150, damping: 14, mass: 0.4 });

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (shouldReduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-block w-full sm:w-auto">
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={className}
      >
        {children}
      </Link>
    </motion.div>
  );
}

// Protocol card — reveal on view, cursor-tracking tilt & glow on hover.
// All motion here is either load/view-triggered once, or mouse-driven. No scroll math.
function ProtocolCard({ step, index }: { step: ProtocolStep; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), { stiffness: 260, damping: 24 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), { stiffness: 260, damping: 24 });
  const glowX = useTransform(mouseX, [0, 1], ['0%', '100%']);
  const glowY = useTransform(mouseY, [0, 1], ['0%', '100%']);
  const glowBackground = useMotionTemplate`radial-gradient(280px circle at ${glowX} ${glowY}, ${step.accent}33, transparent 70%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-2xl border border-[#EDEAFF]/[0.06] h-full overflow-hidden transition-colors duration-500"
        style={
          {
            perspective: 1000,
            background: 'linear-gradient(160deg, #111116 0%, #08080B 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
            '--accent': step.accent,
          } as React.CSSProperties
        }
      >
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: glowBackground }}
        />

        <motion.div
          style={shouldReduceMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative z-10 p-8 lg:p-10 flex flex-col justify-between h-full"
        >
          <div>
            <div className="flex items-center justify-between mb-8">
              <span
                className="font-mono text-xs tracking-widest font-bold px-2.5 py-1 rounded-md"
                style={{ color: step.accent, backgroundColor: `${step.accent}1A` }}
              >
                {step.num}
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#EDEAFF]/20 group-hover:text-[#EDEAFF]/40 transition-colors">
                READY
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-white mb-2 transition-colors duration-300 group-hover:text-[var(--accent)]">
              {step.title}
            </h3>
            <div className="font-mono text-[10px] tracking-wider text-[#EDEAFF]/40 uppercase mb-4">
              {step.subtitle}
            </div>
            <p className="text-[#EDEAFF]/40 group-hover:text-[#EDEAFF]/50 text-sm font-light leading-relaxed transition-colors">
              {step.desc}
            </p>
          </div>

          <div className="mt-10 pt-4 border-t border-white/[0.04] flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-widest text-[#EDEAFF]/30 group-hover:text-white transition-colors">
              EXECUTE NODE
            </span>
            <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:translate-x-0.5 transition-all duration-300">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Capability card — lighter hover treatment (lift + border), no tilt.
function CapabilityCard({ item, index }: { item: (typeof CAPABILITIES)[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl border border-white/[0.06] p-7 bg-[#0B0B10] hover:border-white/20 hover:-translate-y-1.5 transition-all duration-400"
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: item.accent }}
      />
      <div className="font-mono text-3xl font-black tracking-tight mb-1" style={{ color: item.accent }}>
        {item.metric}
      </div>
      <div className="font-mono text-[9px] tracking-[0.25em] text-[#EDEAFF]/30 uppercase mb-5">{item.label}</div>
      <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
      <p className="text-[#EDEAFF]/40 text-sm font-light leading-relaxed">{item.desc}</p>
    </motion.div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function WhatWeDoPage() {
  return (
    <div className="bg-[#070708] text-[#EDEAFF] selection:bg-[#7C5CFF] selection:text-black overflow-x-hidden antialiased">
      <Navbar />

      {/* ─── SECTION 1: HERO ───
          Fixed height, load-triggered animations only. No scroll-linked
          scale/blur/opacity math — that's what caused the blank-screen bug. */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Ambient looping backdrop video — gentle self-contained zoom, not tied to scroll */}
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen select-none"
        >
          <video
            src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-loop-27402-large.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070708] via-transparent to-[#070708]" />
          <div className="absolute inset-0 bg-[#070708]/40" />
        </motion.div>

        {/* Static vector grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              'linear-gradient(#EDEAFF 1px, transparent 1px), linear-gradient(90deg, #EDEAFF 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 w-full max-w-5xl text-center flex flex-col items-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
            <SectionBadge accent="#7C5CFF">System Protocol v4.0</SectionBadge>
          </motion.div>

          <h1 className="font-black tracking-tight leading-[1.02] text-[2.8rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] mb-6 max-w-4xl">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Fundraising,
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="block bg-gradient-to-tr from-[#7C5CFF] via-[#EDEAFF] to-[#FF8A3D] bg-clip-text text-transparent"
              >
                Deconstructed to Signal.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="max-w-xl text-sm md:text-base font-light text-[#EDEAFF]/45 leading-relaxed mb-10"
          >
            We architect institutional-grade interfaces connecting premium ventures directly to verified capital nodes. No cold loops. No platform noise. Just velocity.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.64 }}>
            <MagneticLink
              href="/forms"
              className="relative group overflow-hidden px-8 py-3.5 rounded-full bg-white text-[#0A090D] font-mono text-xs tracking-widest font-bold transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(124,92,255,0.4)] hover:scale-[1.02] inline-block"
            >
              <span className="relative z-10">INITIALIZE ACCESS NODE</span>
              <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-[#7C5CFF] transition-transform duration-300 ease-out z-0" />
            </MagneticLink>
          </motion.div>
        </div>

        {/* Simple CSS-driven scroll cue — no JS scroll tracking needed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#EDEAFF]/20">SCROLL</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#7C5CFF]/80 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* ─── SECTION 2: WHAT WE DO ───
          Process cards + capability strip. All motion is whileInView
          (fires once, plain fade/slide) or hover-driven — no scroll scrubbing. */}
      <section className="relative bg-[#08080C] border-t border-[#EDEAFF]/5 py-28 md:py-36 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-20">
            <SectionBadge accent="#FF8A3D">What We Do</SectionBadge>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-5">
              An execution loop optimized for speed.
            </h2>
            <p className="text-[#EDEAFF]/40 font-light text-sm md:text-base leading-relaxed">
              Every stage of your interface deployment is monitored and routed through isolated digital consensus primitives to clear capital friction.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-24">
            {PROTOCOLS.map((step, i) => (
              <ProtocolCard key={step.id} step={step} index={i} />
            ))}
          </div>

          <Reveal className="text-center max-w-xl mx-auto mb-12">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#EDEAFF]/30 mb-3">Why It Works</div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Built for high-velocity allocations.</h3>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {CAPABILITIES.map((item, i) => (
              <CapabilityCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: CTA ─── */}
      <section className="relative bg-[#050507] py-28 md:py-32 px-6 border-t border-white/5 text-center overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full bg-gradient-to-t from-[#FF8A3D]/10 via-[#7C5CFF]/5 to-transparent blur-[120px]"
          />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <Reveal>
            <SectionBadge accent="#FF8A3D">Network Expansion</SectionBadge>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-6">
              Ready to capture pure allocation velocity?
            </h2>
            <p className="text-[#EDEAFF]/40 text-sm md:text-base font-light mb-10 max-w-xl mx-auto leading-relaxed">
              Deploy your dashboard configurations and interface directly into our checked-and-verified global allocation network.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticLink
              href="/forms"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#7C5CFF] text-white font-mono text-xs tracking-widest font-bold transition-all duration-300 hover:bg-[#6b4ee6] hover:shadow-[0_0_40px_rgba(124,92,255,0.4)] hover:scale-[1.02] inline-block"
            >
              APPLY FOR PLATFORM SEAT
            </MagneticLink>
            <MagneticLink
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/10 text-white font-mono text-xs tracking-widest font-bold transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:scale-[1.02] inline-block"
            >
              REQUEST SYSTEM LIVE DEMO
            </MagneticLink>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}