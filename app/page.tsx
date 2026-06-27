'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Loader from '@/components/layout/Loader';

// ─── Satellite node config ────────────────────────────────────────────────────
interface NodeCfg {
  id: string;
  glyph: 'arrow' | 'dot' | 'zigzag' | 'grid' | 'bloom' | 'dotbig';
  cy: number;
  cx: number;
  side: 'left' | 'right';
  bendX: number;
  delay: number;
  pulseDelay: number;
}

const VB_W = 1000;
const VB_H = 420;
const CHIP_X = VB_W / 2;
const CHIP_Y = VB_H / 2 + 6;
const CHIP_HALF = 46;
const NODE_HALF = 22;

const NODES: NodeCfg[] = [
  { id: 'n1', glyph: 'arrow',  side: 'left',  cx: 130,        cy: CHIP_Y - 78, bendX: 330,        delay: 0.05, pulseDelay: 0.0  },
  { id: 'n2', glyph: 'dot',    side: 'left',  cx: 60,         cy: CHIP_Y,      bendX: 0,          delay: 0.18, pulseDelay: 0.85 },
  { id: 'n3', glyph: 'zigzag', side: 'left',  cx: 130,        cy: CHIP_Y + 92, bendX: 300,        delay: 0.31, pulseDelay: 1.7  },
  { id: 'n4', glyph: 'dotbig', side: 'right', cx: VB_W - 130, cy: CHIP_Y - 78, bendX: VB_W - 330, delay: 0.11, pulseDelay: 0.42 },
  { id: 'n5', glyph: 'grid',   side: 'right', cx: VB_W - 60,  cy: CHIP_Y,      bendX: 0,          delay: 0.24, pulseDelay: 1.28 },
  { id: 'n6', glyph: 'bloom',  side: 'right', cx: VB_W - 130, cy: CHIP_Y + 92, bendX: VB_W - 300, delay: 0.37, pulseDelay: 2.1  },
];

function nodePath(n: NodeCfg): string {
  const chipEdgeX = n.side === 'left' ? CHIP_X - CHIP_HALF : CHIP_X + CHIP_HALF;
  const nodeEdgeX = n.side === 'left' ? n.cx + NODE_HALF : n.cx - NODE_HALF;
  if (n.cy === CHIP_Y) return `M ${chipEdgeX},${CHIP_Y} H ${nodeEdgeX}`;
  return `M ${chipEdgeX},${n.cy <= CHIP_Y ? CHIP_Y - 14 : CHIP_Y + 14} H ${n.bendX} L ${nodeEdgeX},${n.cy}`;
}

const PIN_COUNT = 4;
const PIN_SPACING = 13;

// ─── Scroll budget (in vh units) ─────────────────────────────────────────────
const WHITE_SLIDE_END     = 1;
const WHITE_CONTENT_END   = 3;
const DARK_SLIDE_START    = 3;
const DARK_SLIDE_END      = 4;
const DARK_CONTENT_END    = 7.5;
const CONTACT_SLIDE_START = -1;
const CONTACT_SLIDE_END   = 0;
const CONTACT_CONTENT_END = 3;
const CONTACT_CONTENT_LEAD = 1.2;
const TOP_TOTAL_VH         = 750;
const CONTACT_TOTAL_VH     = 300;

// ─── Root ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [loading, setLoading]         = useState(true);
  const [stage, setStage]             = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contactScrollProgress, setContactScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const contactTrackRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 1900);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading) return;
    const timers: number[] = [];
    const s = (n: number, ms: number) => timers.push(window.setTimeout(() => setStage(n), ms));
    s(1, 80); s(2, 480); s(3, 820); s(4, 1150); s(5, 1500); s(6, 2200); s(7, 2700);
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  useEffect(() => {
    const onScroll = () => {
      setScrollProgress(window.scrollY / window.innerHeight);

      const el = contactTrackRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const distanceScrolledIntoTrack = -rect.top;
        setContactScrollProgress(distanceScrolledIntoTrack / window.innerHeight);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const whiteSlideProgress = clamp01(scrollProgress / WHITE_SLIDE_END);
  const whitePanelTranslateY = (1 - whiteSlideProgress) * 100;

  const darkSlideProgress = clamp01((scrollProgress - DARK_SLIDE_START) / (DARK_SLIDE_END - DARK_SLIDE_START));
  const darkPanelTranslateY = (1 - darkSlideProgress) * 100;

  const contactSlideProgress = clamp01((contactScrollProgress - CONTACT_SLIDE_START) / (CONTACT_SLIDE_END - CONTACT_SLIDE_START));
  const contactPanelTranslateY = (1 - contactSlideProgress) * 100;

  const whiteInner = scrollProgress - WHITE_SLIDE_END;
  const darkInner = scrollProgress - DARK_SLIDE_END;
  const contactInner = contactScrollProgress - CONTACT_SLIDE_END + CONTACT_CONTENT_LEAD;

  // ── On mobile, render static sections without scroll-pinning ──
  if (isMobile) {
    return (
      <div
        className="bg-[#070708] text-[#EDEAFF] selection:bg-[#7C5CFF] selection:text-black"
        style={{ overflowX: 'hidden', maxWidth: '100vw' }}
      >
        <Loader loading={loading} />

        {/* Mobile Hero - static, no fixed positioning */}
        <div className="relative z-10" style={{ overflowX: 'hidden' }}>
          <Navbar />
          <MobileHeroSection stage={stage} />
        </div>

        {/* Mobile White Section */}
        <div className="relative z-10 bg-white" style={{ overflowX: 'hidden' }}>
          <MobileWhiteSection />
        </div>

        {/* Mobile Dark Section */}
        <div className="relative z-10" style={{ background: '#08080C', overflowX: 'hidden' }}>
          <MobileDarkSection />
        </div>

        {/* Mobile Globe Section */}
        <div className="relative z-10 bg-black" style={{ overflowX: 'hidden' }}>
          <MobileGlobeSection />
        </div>

        {/* Mobile Contact Section */}
        <div className="relative z-10" style={{ background: '#050507', overflowX: 'hidden' }}>
          <MobileContactSection />
        </div>

        {/* Footer */}
        <div className="relative z-20 bg-white shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
          <Footer />
        </div>

        <style jsx global>{`
          @media (prefers-reduced-motion: reduce) {
            * { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; }
          }
          @media (max-width: 767px) {
            html, body { overflow-x: hidden; max-width: 100vw; }
          }
        `}</style>
      </div>
    );
  }

  // ── Desktop view (unchanged) ──
  return (
    <div className="bg-[#070708] text-[#EDEAFF] selection:bg-[#7C5CFF] selection:text-black">
      <Loader loading={loading} />

      {/* ── FIXED HERO BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="pointer-events-auto relative z-50">
          <Navbar />
        </div>
        <div className="w-full h-screen overflow-hidden">
          <HeroSection stage={stage} />
        </div>
      </div>

      {/* ── TOP SCROLL TRACK (white + dark) ── */}
      <div className="relative z-10" style={{ height: `${TOP_TOTAL_VH}vh` }}>

        {/* Sticky container — white & dark panels live here */}
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">

          {/* ── WHITE PANEL ── */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-auto bg-white flex flex-col shadow-2xl"
            style={{
              height: '100vh',
              zIndex: 10,
              transform: `translateY(${whitePanelTranslateY}%)`,
              borderRadius: whitePanelTranslateY > 0.5 ? '24px 24px 0 0' : '0px',
              willChange: 'transform, border-radius',
              transition: 'border-radius 0.2s ease-out',
            }}
          >
            {scrollProgress > 0.05 && scrollProgress < WHITE_SLIDE_END - 0.02 && (
              <div style={{
                position: 'absolute', top: 12, left: '50%',
                transform: 'translateX(-50%)', width: 48, height: 5,
                borderRadius: 4, background: '#0A090D', opacity: 0.15, zIndex: 2,
              }} />
            )}
            <WhiteSectionContent whiteInner={whiteInner} />
          </div>

          {/* ── DARK PANEL ── */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-auto flex flex-col"
            style={{
              height: '100vh',
              zIndex: 20,
              background: '#08080C',
              transform: `translateY(${darkPanelTranslateY}%)`,
              borderRadius: darkPanelTranslateY > 0.5 ? '24px 24px 0 0' : '0px',
              willChange: 'transform, border-radius',
              transition: 'border-radius 0.2s ease-out',
              boxShadow: '0 -12px 80px rgba(0,0,0,0.7)',
            }}
          >
            {darkSlideProgress > 0.05 && darkSlideProgress < 0.98 && (
              <div style={{
                position: 'absolute', top: 12, left: '50%',
                transform: 'translateX(-50%)', width: 48, height: 5,
                borderRadius: 4, background: '#EDEAFF', opacity: 0.1, zIndex: 2,
              }} />
            )}
            <DarkSectionContent darkInner={darkInner} />
          </div>

        </div>
      </div>

      {/* ── GLOBE SECTION ── */}
      <div className="relative z-10 bg-black min-h-screen w-full">
        <GlobeSectionContent />
      </div>

      {/* ── BOTTOM SCROLL TRACK (contact) ── */}
      <div ref={contactTrackRef} className="relative z-10 bg-black" style={{ height: `${CONTACT_TOTAL_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none bg-black">
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-auto flex flex-col"
            style={{
              height: '100vh',
              zIndex: 40,
              background: '#050507',
              transform: `translateY(${contactPanelTranslateY}%)`,
              borderRadius: contactPanelTranslateY > 0.5 ? '24px 24px 0 0' : '0px',
              willChange: 'transform, border-radius',
              transition: 'border-radius 0.2s ease-out',
              boxShadow: '0 -12px 80px rgba(0,0,0,0.7)',
            }}
          >
            {contactSlideProgress > 0.05 && contactSlideProgress < 0.98 && (
              <div style={{
                position: 'absolute', top: 12, left: '50%',
                transform: 'translateX(-50%)', width: 48, height: 5,
                borderRadius: 4, background: '#EDEAFF', opacity: 0.1, zIndex: 2,
              }} />
            )}
            <ContactSectionContent contactInner={contactInner} />
          </div>
        </div>
      </div>

      {/* Footer after scroll track */}
      <div className="relative z-20 bg-white shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <Footer />
      </div>

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── MOBILE-ONLY SECTIONS ──────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function MobileHeroSection({ stage }: { stage: number }) {
  return (
    <section className="relative w-full flex flex-col items-center justify-center px-5 pt-16 pb-10 bg-[#070708] min-h-[100svh]" style={{ overflow: 'hidden' }}>
      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-[1500ms]" style={{
        opacity: stage >= 1 ? 0.022 : 0,
        backgroundImage: 'linear-gradient(#EDEAFF 1px, transparent 1px), linear-gradient(90deg, #EDEAFF 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        maskImage: 'radial-gradient(ellipse 55% 50% at 50% 28%, black, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at 50% 28%, black, transparent 100%)',
      }} />

      {/* Orange glow top-right — contained within the section */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] pointer-events-none transition-opacity duration-[2000ms] ease-out" style={{
        opacity: stage >= 1 ? 0.7 : 0,
        background: 'radial-gradient(circle at 80% 10%, rgba(255,138,61,0.28), transparent 60%)',
        filter: 'blur(30px)',
      }} />

      <div className="relative z-10 w-full flex flex-col items-center text-center">
        {/* Badge */}
        <div
          className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-[#EDEAFF]/12 bg-[#EDEAFF]/[0.03] font-mono text-[9px] tracking-[0.2em] uppercase text-[#EDEAFF]/55 transition-all duration-700 ease-out"
          style={{ opacity: stage >= 1 ? 1 : 0, transform: stage >= 1 ? 'translateY(0)' : 'translateY(10px)' }}
        >
          <span className="text-[#7C5CFF]">✦</span> Beta release
        </div>

        {/* Heading */}
        <h1
          className="font-bold tracking-tight leading-[1.05] text-[2.4rem] mb-4 transition-all duration-[900ms] ease-out"
          style={{ opacity: stage >= 1 ? 1 : 0, transform: stage >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)' }}
        >
          Intelligence at{' '}
          <span className="bg-gradient-to-br from-[#EDEAFF] via-[#EDEAFF] to-[#7C5CFF] bg-clip-text text-transparent">
            the Core
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="text-sm font-light text-[#EDEAFF]/45 leading-relaxed mb-6 max-w-xs transition-all duration-700 ease-out"
          style={{ opacity: stage >= 2 ? 1 : 0, transform: stage >= 2 ? 'translateY(0)' : 'translateY(14px)' }}
        >
          Deploy and scale your AI workloads globally with infrastructure built for speed, reliability, and zero compromise on performance.
        </p>

        {/* CTAs */}
        <div
          className="flex items-center gap-3 mb-8 transition-all duration-700 ease-out"
          style={{ opacity: stage >= 3 ? 1 : 0, transform: stage >= 3 ? 'translateY(0)' : 'translateY(14px)' }}
        >
          <Link href="/forms" className="px-5 py-2.5 rounded-full bg-[#7C5CFF] text-white text-sm font-semibold tracking-wide">
            Get started
          </Link>
          <Link href="/contact" className="px-5 py-2.5 rounded-full border border-[#EDEAFF]/15 text-[#EDEAFF]/80 text-sm font-medium tracking-wide">
            Book a demo
          </Link>
        </div>

        {/* Circuit SVG — simplified, scaled down for mobile */}
        <div
          className="w-full transition-all duration-700 ease-out"
          style={{ opacity: stage >= 4 ? 1 : 0, overflow: 'hidden' }}
        >
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" style={{ display: 'block', overflow: 'hidden' }}>
            <defs>
              <radialGradient id="pulseGlowM" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF8A3D" stopOpacity="1" />
                <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="dashGlowM" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF8A3D" stopOpacity="0" />
                <stop offset="45%" stopColor="#FF8A3D" stopOpacity="1" />
                <stop offset="55%" stopColor="#FFB07A" stopOpacity="1" />
                <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="dashGlowVM" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF8A3D" stopOpacity="0" />
                <stop offset="45%" stopColor="#FF8A3D" stopOpacity="1" />
                <stop offset="55%" stopColor="#FFB07A" stopOpacity="1" />
                <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0" />
              </linearGradient>
            </defs>

            {NODES.map((n) => (
              <path key={`trace-${n.id}`} d={nodePath(n)} fill="none" stroke="#EDEAFF" strokeOpacity={0.22} strokeWidth={1.5} strokeLinecap="round" pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: stage >= 5 ? 0 : 1, transition: `stroke-dashoffset 850ms ease-out ${n.delay}s` }} />
            ))}
            {[-1, 1].map((dir) =>
              [-1, -0.33, 0.33, 1].map((m, i) => {
                const y = CHIP_Y + m * 30;
                const x1 = CHIP_X + dir * CHIP_HALF;
                const x2 = x1 + dir * 10;
                return <line key={`sp-${dir}-${i}`} x1={x1} y1={y} x2={x2} y2={y} stroke="#EDEAFF" strokeOpacity={0.3} strokeWidth={2.5} strokeLinecap="round"
                  style={{ opacity: stage >= 4 ? 1 : 0, transition: `opacity 400ms ease-out ${0.1 + i * 0.05}s` }} />;
              })
            )}
            {Array.from({ length: PIN_COUNT }).map((_, i) => {
              const x = CHIP_X - ((PIN_COUNT - 1) * PIN_SPACING) / 2 + i * PIN_SPACING;
              const botY = CHIP_Y + CHIP_HALF + 96;
              return <line key={`pin-${i}`} x1={x} y1={CHIP_Y + CHIP_HALF} x2={x} y2={botY} stroke="#EDEAFF" strokeOpacity={0.3} strokeWidth={2} strokeLinecap="round" pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: stage >= 4 ? 0 : 1, transition: `stroke-dashoffset 450ms ease-out ${0.15 + i * 0.07}s` }} />;
            })}
            {stage >= 7 && NODES.map((n) => (
              <rect key={`dash-${n.id}`} x={-22} y={-2.2} width={44} height={4.4} rx={2.2} fill="url(#dashGlowM)">
                <animateMotion dur="2.8s" begin={`${n.pulseDelay}s`} repeatCount="indefinite" path={nodePath(n)} rotate="auto" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.82;1" dur="2.8s" begin={`${n.pulseDelay}s`} repeatCount="indefinite" />
              </rect>
            ))}
            {stage >= 7 && Array.from({ length: PIN_COUNT }).map((_, i) => {
              const x = CHIP_X - ((PIN_COUNT - 1) * PIN_SPACING) / 2 + i * PIN_SPACING;
              const topY = CHIP_Y + CHIP_HALF;
              const botY = topY + 96;
              return (
                <rect key={`pd-${i}`} x={x - 1.6} y={topY - 14} width={3.2} height={28} rx={1.6} fill="url(#dashGlowVM)">
                  <animateMotion dur="1.5s" begin={`${i * 0.42}s`} repeatCount="indefinite" path={`M 0,0 L 0,${botY - topY}`} />
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.78;1" dur="1.5s" begin={`${i * 0.42}s`} repeatCount="indefinite" />
                </rect>
              );
            })}
            {NODES.map((n) => (
              <g key={n.id} style={{ opacity: stage >= 6 ? 1 : 0, transition: `opacity 550ms ease-out ${n.delay + 0.35}s` }}>
                <circle cx={n.side === 'left' ? n.cx + NODE_HALF + 5 : n.cx - NODE_HALF - 5} cy={n.cy} r={2.5} fill="#0A090D" stroke="#EDEAFF" strokeOpacity={0.4} />
                <rect x={n.cx - NODE_HALF} y={n.cy - NODE_HALF} width={NODE_HALF * 2} height={NODE_HALF * 2} rx={12} fill="#13121A" stroke="#EDEAFF" strokeOpacity={0.1} />
                <NodeGlyph glyph={n.glyph} cx={n.cx} cy={n.cy} />
              </g>
            ))}
            <g style={{ opacity: stage >= 4 ? 1 : 0, transition: 'opacity 500ms ease-out' }}>
              <rect x={CHIP_X - CHIP_HALF} y={CHIP_Y - CHIP_HALF} width={CHIP_HALF * 2} height={CHIP_HALF * 2} rx={18} fill="#13121A" stroke="#7C5CFF" strokeOpacity={0.45} strokeWidth={1.5} />
              <rect x={CHIP_X - CHIP_HALF} y={CHIP_Y - CHIP_HALF} width={CHIP_HALF * 2} height={CHIP_HALF * 2} rx={18} fill="url(#pulseGlowM)" opacity={0.06} />
              <text x={CHIP_X} y={CHIP_Y + 7} textAnchor="middle" fontSize={19} fontWeight={700} fill="#EDEAFF" style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.01em' }}>AI</text>
            </g>
          </svg>
        </div>

        {/* Scroll hint */}
        <div className="flex flex-col items-center gap-2 mt-2" style={{ opacity: stage >= 7 ? 1 : 0, transition: 'opacity 700ms' }}>
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#EDEAFF]/30">scroll</span>
          <div className="w-px h-5 bg-gradient-to-b from-[#7C5CFF]/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function MobileWhiteSection() {
  return (
    <div className="w-full bg-white flex flex-col px-5 pt-10 pb-10">
      {/* Heading */}
      <h2 className="text-[#0A090D] text-2xl font-bold tracking-tight text-center leading-tight mb-8">
        Use AI faster and more efficiently right on your device!
      </h2>

      {/* Video card */}
      <div className="w-full rounded-[20px] overflow-hidden shadow-xl mb-8"
        style={{ aspectRatio: '4/3', background: 'radial-gradient(ellipse 70% 55% at 45% 35%, rgba(210,160,120,0.45) 0%, #2a2520 50%, #181410 100%)' }}
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 36px, rgba(255,255,255,0.02) 36px, rgba(255,255,255,0.02) 37px)' }} />
          <video src="/video1.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-55 mix-blend-luminosity" />
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <p className="text-white/75 text-xs font-medium leading-snug">
              Try <span className="text-white font-semibold">AI Inference</span>{' '}
              <span className="italic text-white/55">At The Edge</span>
            </p>
          </div>
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col">
        <p className="text-[#0A090D] text-base font-semibold leading-snug mb-2">
          AI Inference at the Edge reduces the latency of your ML model output and improves the performance of AI-enabled applications.
        </p>
        <p className="text-[#0A090D]/45 text-sm leading-relaxed mb-6">
          It's particularly useful for AI apps that need immediate processing and minimal delay, like generative AI and real-time object detection.
        </p>

        {/* Feature list */}
        <div className="flex flex-col">
          {[
            { icon: '●',  color: '#FF8A3D', label: 'Text generation',    tag: 'Streaming output'   },
            { icon: '◎',  color: '#E84545', label: 'Speech recognition', tag: 'Multi-language'     },
            { icon: 'S.', color: '#7C5CFF', label: 'Image generation',   tag: 'Sub-second latency' },
          ].map((feat) => (
            <div key={feat.label} className="flex items-center justify-between py-3.5 border-b border-[#0A090D]/8 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold w-5 text-center leading-none" style={{ color: feat.color }}>{feat.icon}</span>
                <span className="text-[#0A090D] text-sm font-medium">{feat.label}</span>
              </div>
              <span className="text-[#0A090D]/30 text-[10px] font-mono tracking-widest">{feat.tag}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Link href="/forms" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a1920] text-white text-sm font-semibold tracking-wide">
            Get started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

function MobileDarkSection() {
  return (
    <div className="relative w-full flex flex-col items-center px-4 pt-10 pb-10" style={{ background: '#08080C', overflow: 'hidden' }}>
      {/* Ambient top glow */}
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(124,92,255,0.07) 0%, transparent 65%)',
      }} />

      {/* Badge */}
      <div className="flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full border border-[#EDEAFF]/12 bg-[#EDEAFF]/[0.04] font-mono text-[9px] tracking-[0.2em] uppercase text-[#EDEAFF]/50">
        <span style={{ color: '#FF8A3D' }}>✦</span> AI potential
      </div>

      {/* Heading */}
      <h2 className="text-[#EDEAFF] text-2xl font-bold tracking-tight text-center leading-tight mb-8 max-w-xs">
        Unleash your AI application's full potential
      </h2>

      {/* Cards — stacked vertically on mobile */}
      <div className="w-full flex flex-col gap-3">
        {[
          { title: 'Low-latency global network', desc: 'Minimize model response time with our 160+ location CDN, providing an average global latency of 30 ms.', accentColor: 'rgba(255,138,61,0.18)', glowColor: 'rgba(255,138,61,0.07)', visual: 'globe', videoSrc: '/vid1.mp4' },
          { title: 'Single end-point for all AI tasks', desc: 'Automated infrastructure management for AI applications with real-time inference.', accentColor: 'rgba(124,92,255,0.18)', glowColor: 'rgba(124,92,255,0.07)', visual: 'chip', videoSrc: '/vid2.mp4' },
          { title: 'Data privacy and security', desc: 'Use pre-trained foundational models from the Gcore ML Model Hub or your own trained models.', accentColor: 'rgba(232,69,69,0.14)', glowColor: 'rgba(232,69,69,0.06)', visual: 'lock', videoSrc: '/vid3.mp4' },
          { title: 'Unlimited object storage', desc: 'Use scalable S3-compatible cloud storage that grows with your needs.', accentColor: 'rgba(61,200,255,0.14)', glowColor: 'rgba(61,200,255,0.06)', visual: 'storage', videoSrc: '/vid4.mp4' },
          { title: 'Pre-trained ML models', desc: 'Access Gcore ML Model Hub or bring your own.', accentColor: 'rgba(255,200,61,0.12)', glowColor: 'rgba(255,200,61,0.05)', visual: 'model', videoSrc: '/vid5.mp4' },
          { title: 'Model autoscaling', desc: 'Set up autoscaling to handle load spikes. Use and pay only for what you need.', accentColor: 'rgba(80,255,160,0.10)', glowColor: 'rgba(80,255,160,0.05)', visual: 'scale', videoSrc: '/vid6.mp4' },
          { title: 'NVIDIA L40S GPUs', desc: 'Run inference on cutting-edge NVIDIA L40S GPUs for maximum throughput.', accentColor: 'rgba(100,220,60,0.10)', glowColor: 'rgba(100,220,60,0.04)', visual: 'gpu', videoSrc: '/vid1.mp4' },
        ].map((card) => (
          <MobileDarkCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}

function MobileDarkCard({ title, desc, accentColor, glowColor, visual, videoSrc }: {
  title: string; desc: string; accentColor: string; glowColor: string; visual: string; videoSrc?: string;
}) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-[#EDEAFF]/[0.07] flex flex-col"
      style={{
        background: 'linear-gradient(145deg, #111118 0%, #0c0c12 100%)',
        boxShadow: `0 0 50px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.04)`,
        minHeight: 110,
      }}
    >
      {/* Background video */}
      {videoSrc && (
        <video src={videoSrc} autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.4 }} />
      )}
      {/* Dark scrim */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(8,8,10,0.85) 0%, rgba(8,8,10,0.55) 40%, rgba(8,8,10,0.65) 100%)' }} />
      {/* Accent glow */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse 90% 55% at 50% 110%, ${accentColor} 0%, transparent 65%)` }} />
      {/* Visual — bottom right, clipped by parent overflow-hidden */}
      <div className="absolute bottom-0 right-0 pointer-events-none" style={{ opacity: 0.25, maxWidth: '45%', overflow: 'hidden' }}>
        <CardVisual visual={visual} compact />
      </div>
      {/* Text — given enough width so it never wraps past the card */}
      <div className="relative z-10 p-4 flex flex-col gap-1" style={{ maxWidth: '72%' }}>
        <h3 className="text-[#EDEAFF] font-semibold leading-snug text-sm">{title}</h3>
        <p className="text-[#EDEAFF]/40 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function MobileGlobeSection() {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full overflow-hidden flex flex-col bg-black px-5 pt-10 pb-8" style={{ overflowX: 'hidden' }}>
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.5 }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: `${(i * 37) % 100}%`, left: `${(i * 53) % 100}%`,
            width: (i % 3) + 0.5, height: (i % 3) + 0.5, borderRadius: '50%',
            background: '#EDEAFF', opacity: 0.25 + (i % 4) * 0.1,
          }} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full border border-[#EDEAFF]/12 bg-[#EDEAFF]/[0.04] font-mono text-[9px] tracking-[0.2em] uppercase text-[#EDEAFF]/50 transition-all duration-700 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
        >
          <span style={{ color: '#FF8A3D' }}>✦</span> Global network
        </div>

        {/* Heading */}
        <h2 className="text-[#EDEAFF] text-2xl font-bold tracking-tight text-center leading-tight mb-3 transition-all duration-700 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(1.2)', transitionDelay: '80ms' }}
        >
          A truly global network for lightning-fast inference
        </h2>

        {/* Subtext */}
        <p className="text-[#EDEAFF]/45 text-sm text-center leading-relaxed mb-6 transition-all duration-700 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transitionDelay: '200ms' }}
        >
          Gcore global network consists of more than 160 locations, allowing you to reach your users anywhere in the world.
        </p>

        {/* Video */}
        <div className="w-full transition-all duration-700 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transitionDelay: '350ms' }}
        >
          <video src="/video2.mp4" autoPlay loop muted playsInline className="w-full h-auto block rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function MobileContactSection() {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full overflow-hidden flex flex-col" style={{ background: '#050507', minHeight: '60vh', overflowX: 'hidden' }}>
      {/* Fire glow */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: '80%', opacity: visible ? 1 : 0, transition: 'opacity 1.2s ease-out 0.2s' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 95% at 50% 100%, rgba(255,150,70,0.75) 0%, rgba(220,100,40,0.45) 32%, rgba(140,60,20,0.18) 55%, transparent 76%)' }} />
        <div className="absolute inset-x-0 bottom-0" style={{ height: '60%', background: 'radial-gradient(ellipse 65% 100% at 50% 100%, rgba(255,180,100,0.85) 0%, rgba(255,130,55,0.5) 38%, transparent 78%)' }} />
        <div className="absolute inset-x-0 bottom-0" style={{ height: '28%', background: 'radial-gradient(ellipse 55% 100% at 50% 100%, rgba(255,250,240,0.9) 0%, rgba(255,200,140,0.6) 40%, transparent 80%)', filter: 'blur(2px)' }} />
      </div>

      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: `${(i * 41) % 70}%`, left: `${(i * 59) % 100}%`,
            width: (i % 3) + 0.5, height: (i % 3) + 0.5, borderRadius: '50%',
            background: '#EDEAFF', opacity: 0.25 + (i % 4) * 0.1,
          }} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-5 pt-14 pb-16">
        {/* Heading */}
        <h2 className="text-[#EDEAFF] text-2xl font-bold tracking-tight text-center leading-tight mb-4 transition-all duration-700 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
        >
          Contact us to discuss your project
        </h2>

        {/* Subtext */}
        <p className="text-[#EDEAFF]/55 text-sm text-center leading-relaxed mb-8 transition-all duration-700 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transitionDelay: '150ms' }}
        >
          Get in touch with us, and we'll guide you through running your ML model on Gcore Inference at the Edge.
        </p>

        {/* Button */}
        <div className="transition-all duration-700 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transitionDelay: '300ms' }}
        >
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0A090D] text-sm font-semibold tracking-wide">
            Talk to an expert
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── DESKTOP-ONLY SECTIONS (untouched) ────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function WhiteSectionContent({ whiteInner }: { whiteInner: number }) {
  const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
  const mr = (v: number, i0: number, i1: number, o0: number, o1: number) => {
    const p = clamp((v - i0) / (i1 - i0), 0, 1);
    return o0 + (o1 - o0) * p;
  };

  const headingScale   = mr(whiteInner, 0,   0.6, 2.4, 1);
  const headingOpacity = mr(whiteInner, 0,   0.5, 0,   1);
  const videoOpacity   = mr(whiteInner, 0.5, 1.0, 0,   1);
  const videoScale     = mr(whiteInner, 0.5, 1.0, 0.85, 1);
  const videoTranslY   = mr(whiteInner, 0.5, 1.0, 60,  0);
  const rightOpacity   = mr(whiteInner, 0.9, 1.4, 0,   1);
  const rightTranslX   = mr(whiteInner, 0.9, 1.4, 80,  0);

  const headingText = "Use AI faster and more efficiently right on your device!";
  const words = headingText.split(' ');

  return (
    <div className="flex-1 w-full flex flex-col justify-center max-w-6xl mx-auto px-6 py-12 lg:py-0">
      <h2
        className="text-[#0A090D] text-[1.8rem] md:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-center leading-tight mb-12 lg:mb-20 max-w-2xl mx-auto"
        style={{
          transform: `scale(${headingScale})`,
          opacity: headingOpacity,
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
        }}
      >
        {words.map((word, i) => {
          const ws = 0 + (i / words.length) * 0.4;
          const we = ws + 0.2;
          const wo = mr(whiteInner, ws, we, 0, 1);
          const wb = mr(whiteInner, ws, we, 12, 0);
          return (
            <React.Fragment key={i}>
              <span style={{ opacity: wo, filter: `blur(${wb}px)`, display: 'inline-block', willChange: 'opacity, filter' }}>
                {word}
              </span>
              {i !== words.length - 1 && ' '}
            </React.Fragment>
          );
        })}
      </h2>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16">
        <div
          className="w-full max-w-md lg:max-w-none lg:w-[42%] flex-shrink-0"
          style={{ opacity: videoOpacity, transform: `translateY(${videoTranslY}px) scale(${videoScale})`, willChange: 'transform, opacity' }}
        >
          <div
            className="relative w-full rounded-[20px] overflow-hidden shadow-xl"
            style={{ aspectRatio: '3/4', background: 'radial-gradient(ellipse 70% 55% at 45% 35%, rgba(210,160,120,0.45) 0%, #2a2520 50%, #181410 100%)' }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 36px, rgba(255,255,255,0.02) 36px, rgba(255,255,255,0.02) 37px)' }} />
            <video src="/video1.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-55 mix-blend-luminosity" />
            <div className="absolute bottom-5 left-5 right-5 z-10">
              <p className="text-white/75 text-sm font-medium leading-snug">
                Try <span className="text-white font-semibold">AI Inference</span>{' '}
                <span className="italic text-white/55">At The Edge</span>
              </p>
            </div>
          </div>
        </div>

        <div
          className="flex-1 flex flex-col justify-center w-full max-w-md lg:max-w-none"
          style={{ opacity: rightOpacity, transform: `translateX(${rightTranslX}px)`, willChange: 'transform, opacity' }}
        >
          <p className="text-[#0A090D] text-lg md:text-xl font-semibold leading-snug mb-3">
            AI Inference at the Edge reduces the latency of your ML model output and improves the performance of AI-enabled applications.
          </p>
          <p className="text-[#0A090D]/45 text-sm md:text-base leading-relaxed mb-8">
            It's particularly useful for AI apps that need immediate processing and minimal delay, like generative AI and real-time object detection.
          </p>
          <div className="flex flex-col">
            {[
              { icon: '●',  color: '#FF8A3D', label: 'Text generation',    tag: 'Streaming output'   },
              { icon: '◎',  color: '#E84545', label: 'Speech recognition', tag: 'Multi-language'     },
              { icon: 'S.', color: '#7C5CFF', label: 'Image generation',   tag: 'Sub-second latency' },
            ].map((feat) => (
              <div key={feat.label} className="flex items-center justify-between py-4 border-b border-[#0A090D]/8 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold w-5 text-center leading-none" style={{ color: feat.color }}>{feat.icon}</span>
                  <span className="text-[#0A090D] text-sm font-medium">{feat.label}</span>
                </div>
                <span className="text-[#0A090D]/30 text-xs font-mono tracking-widest">{feat.tag}</span>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/forms" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a1920] text-white text-sm font-semibold tracking-wide hover:bg-[#2a2838] hover:shadow-[0_0_24px_rgba(124,92,255,0.2)] transition-all duration-300">
              Get started
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DarkSectionContent({ darkInner }: { darkInner: number }) {
  const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
  const mr = (v: number, i0: number, i1: number, o0: number, o1: number) => {
    const p = clamp((v - i0) / (i1 - i0), 0, 1);
    return o0 + (o1 - o0) * p;
  };

  const badgeOpacity = mr(darkInner, 0.0, 0.4, 0, 1);
  const badgeY       = mr(darkInner, 0.0, 0.4, 20, 0);
  const headingScale = mr(darkInner, 0.0, 0.7, 2.0, 1);
  const headingOpacity = mr(darkInner, 0.0, 0.5, 0, 1);

  const words = "Unleash your AI application's full potential".split(' ');

  const cardStarts = [0.6, 0.95, 1.4, 1.8, 2.2, 2.6, 3.0];

  const getCardAnim = (idx: number) => {
    const start = cardStarts[idx] ?? 0.6 + idx * 0.4;
    const end = start + 0.45;
    return {
      opacity:    mr(darkInner, start, end, 0, 1),
      translateY: mr(darkInner, start, end, 72, 0),
      scale:      mr(darkInner, start, end, 0.92, 1),
    };
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 35% at 50% 0%, rgba(124,92,255,0.07) 0%, transparent 65%)',
      }} />

      <div className="relative z-10 w-full h-full flex flex-col items-center px-5 pt-12 pb-6 overflow-hidden">
        <div
          className="flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border border-[#EDEAFF]/12 bg-[#EDEAFF]/[0.04] font-mono text-[10px] tracking-[0.2em] uppercase text-[#EDEAFF]/50"
          style={{ opacity: badgeOpacity, transform: `translateY(${badgeY}px)`, willChange: 'opacity, transform' }}
        >
          <span style={{ color: '#FF8A3D' }}>✦</span> AI potential
        </div>

        <h2
          className="text-[#EDEAFF] text-3xl md:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-center leading-tight mb-8 max-w-2xl"
          style={{
            transform: `scale(${headingScale})`,
            opacity: headingOpacity,
            transformOrigin: 'center top',
            willChange: 'transform, opacity',
          }}
        >
          {words.map((word, i) => {
            const ws = 0.05 + (i / words.length) * 0.45;
            const we = ws + 0.18;
            const wo = mr(darkInner, ws, we, 0, 1);
            const wb = mr(darkInner, ws, we, 10, 0);
            return (
              <React.Fragment key={i}>
                <span style={{ opacity: wo, filter: `blur(${wb}px)`, display: 'inline-block', willChange: 'opacity, filter' }}>
                  {word}
                </span>
                {i !== words.length - 1 && ' '}
              </React.Fragment>
            );
          })}
        </h2>

        <div className="w-full max-w-6xl flex flex-col gap-3">
          <div className="grid grid-cols-5 gap-3" style={{ height: 210 }}>
            <div className="col-span-3" style={{ opacity: getCardAnim(0).opacity, transform: `translateY(${getCardAnim(0).translateY}px) scale(${getCardAnim(0).scale})`, willChange: 'transform, opacity' }}>
              <DarkCard title="Low-latency global network" desc="Minimize model response time with our 160+ location CDN, providing an average global latency of 30 ms." accentColor="rgba(255,138,61,0.18)" glowColor="rgba(255,138,61,0.07)" visual="globe" height="100%" videoSrc="/vid1.mp4" />
            </div>
            <div className="col-span-2" style={{ opacity: getCardAnim(1).opacity, transform: `translateY(${getCardAnim(1).translateY}px) scale(${getCardAnim(1).scale})`, willChange: 'transform, opacity' }}>
              <DarkCard title="Single end-point for all AI tasks" desc="Automated infrastructure management for AI applications with real-time inference." accentColor="rgba(124,92,255,0.18)" glowColor="rgba(124,92,255,0.07)" visual="chip" height="100%" videoSrc="/vid2.mp4" />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3" style={{ height: 175 }}>
            <div className="col-span-2" style={{ opacity: getCardAnim(2).opacity, transform: `translateY(${getCardAnim(2).translateY}px) scale(${getCardAnim(2).scale})`, willChange: 'transform, opacity' }}>
              <DarkCard title="Data privacy and security" desc="Use pre-trained foundational models from the Gcore ML Model Hub or your own trained models." accentColor="rgba(232,69,69,0.14)" glowColor="rgba(232,69,69,0.06)" visual="lock" height="100%" videoSrc="/vid3.mp4" />
            </div>
            <div className="col-span-2" style={{ opacity: getCardAnim(3).opacity, transform: `translateY(${getCardAnim(3).translateY}px) scale(${getCardAnim(3).scale})`, willChange: 'transform, opacity' }}>
              <DarkCard title="Unlimited object storage" desc="Use scalable S3-compatible cloud storage that grows with your needs." accentColor="rgba(61,200,255,0.14)" glowColor="rgba(61,200,255,0.06)" visual="storage" height="100%" videoSrc="/vid4.mp4" />
            </div>
            <div className="col-span-1" style={{ opacity: getCardAnim(4).opacity, transform: `translateY(${getCardAnim(4).translateY}px) scale(${getCardAnim(4).scale})`, willChange: 'transform, opacity' }}>
              <DarkCard title="Pre-trained ML models" desc="Access Gcore ML Model Hub or bring your own." accentColor="rgba(255,200,61,0.12)" glowColor="rgba(255,200,61,0.05)" visual="model" height="100%" compact videoSrc="/vid5.mp4" />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3" style={{ height: 160 }}>
            <div className="col-span-3" style={{ opacity: getCardAnim(5).opacity, transform: `translateY(${getCardAnim(5).translateY}px) scale(${getCardAnim(5).scale})`, willChange: 'transform, opacity' }}>
              <DarkCard title="Model autoscaling" desc="Set up autoscaling to handle load spikes. Use and pay only for what you need." accentColor="rgba(80,255,160,0.10)" glowColor="rgba(80,255,160,0.05)" visual="scale" height="100%" videoSrc="/vid6.mp4" />
            </div>
            <div className="col-span-2" style={{ opacity: getCardAnim(6).opacity, transform: `translateY(${getCardAnim(6).translateY}px) scale(${getCardAnim(6).scale})`, willChange: 'transform, opacity' }}>
              <DarkCard title="NVIDIA L40S GPUs" desc="Run inference on cutting-edge NVIDIA L40S GPUs for maximum throughput." accentColor="rgba(100,220,60,0.10)" glowColor="rgba(100,220,60,0.04)" visual="gpu" height="100%" videoSrc="/vid1.mp4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DarkCard({
  title, desc, accentColor, glowColor, visual, height, compact, videoSrc,
}: {
  title: string; desc: string; accentColor: string; glowColor: string; visual: string; height?: string; compact?: boolean; videoSrc?: string;
}) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-[#EDEAFF]/[0.07] flex flex-col"
      style={{
        height: height ?? 'auto',
        background: 'linear-gradient(145deg, #111118 0%, #0c0c12 100%)',
        boxShadow: `0 0 50px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {videoSrc && (
        <video src={videoSrc} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.55 }} />
      )}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(8,8,10,0.78) 0%, rgba(8,8,10,0.45) 38%, rgba(8,8,10,0.55) 100%)' }} />
      <div className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse 90% 55% at 50% 110%, ${accentColor} 0%, transparent 65%)` }} />
      <div className="absolute bottom-0 right-0 pointer-events-none" style={{ opacity: 0.35 }}>
        <CardVisual visual={visual} compact={compact} />
      </div>
      <div className="relative z-10 p-4 flex flex-col gap-1.5" style={{ maxWidth: compact ? '100%' : '68%' }}>
        <h3 className={`text-[#EDEAFF] font-semibold leading-snug ${compact ? 'text-xs' : 'text-sm lg:text-[0.95rem]'}`}>
          {title}
        </h3>
        {!compact && (
          <p className="text-[#EDEAFF]/40 text-xs leading-relaxed">{desc}</p>
        )}
      </div>
    </div>
  );
}

function CardVisual({ visual, compact }: { visual: string; compact?: boolean }) {
  const size = compact ? 80 : 110;

  switch (visual) {
    case 'globe':
      return (
        <svg viewBox="0 0 120 120" width={size + 20} height={size + 20} fill="none">
          <circle cx="60" cy="60" r="44" stroke="#FF8A3D" strokeOpacity={0.35} strokeWidth={1} />
          <ellipse cx="60" cy="60" rx="24" ry="44" stroke="#FF8A3D" strokeOpacity={0.22} strokeWidth={0.8} />
          <ellipse cx="60" cy="60" rx="44" ry="20" stroke="#FF8A3D" strokeOpacity={0.18} strokeWidth={0.8} />
          <line x1="16" y1="60" x2="104" y2="60" stroke="#FF8A3D" strokeOpacity={0.18} strokeWidth={0.7} />
          <line x1="60" y1="16" x2="60" y2="104" stroke="#FF8A3D" strokeOpacity={0.14} strokeWidth={0.7} />
          <circle cx="60" cy="60" r="5" fill="#FF8A3D" fillOpacity={0.55} />
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const r = (deg * Math.PI) / 180;
            return <circle key={i} cx={60 + 30 * Math.cos(r)} cy={60 + 30 * Math.sin(r)} r={2} fill="#FF8A3D" fillOpacity={0.35} />;
          })}
          <circle cx="60" cy="60" r="44" stroke="#FF8A3D" strokeOpacity={0.08} strokeWidth={8} />
        </svg>
      );
    case 'chip':
      return (
        <svg viewBox="0 0 120 120" width={size} height={size} fill="none">
          <rect x="32" y="32" width="56" height="56" rx="12" stroke="#7C5CFF" strokeOpacity={0.45} strokeWidth={1.2} />
          <rect x="44" y="44" width="32" height="32" rx="6" fill="#7C5CFF" fillOpacity={0.1} stroke="#7C5CFF" strokeOpacity={0.35} strokeWidth={0.8} />
          <text x="60" y="65" textAnchor="middle" fontSize={13} fill="#7C5CFF" fillOpacity={0.65} fontWeight={700}>AI</text>
          {[-1, 1].map(dir =>
            [-1, 0, 1].map((m, i) => (
              <line key={`${dir}-${i}`} x1={dir === -1 ? 32 : 88} y1={60 + m * 14} x2={dir === -1 ? 20 : 100} y2={60 + m * 14} stroke="#7C5CFF" strokeOpacity={0.3} strokeWidth={1} />
            ))
          )}
          {[-1, 1].map(dir =>
            [-1, 0, 1].map((m, i) => (
              <line key={`v-${dir}-${i}`} x1={60 + m * 14} y1={dir === -1 ? 32 : 88} x2={60 + m * 14} y2={dir === -1 ? 20 : 100} stroke="#7C5CFF" strokeOpacity={0.25} strokeWidth={1} />
            ))
          )}
        </svg>
      );
    case 'lock':
      return (
        <svg viewBox="0 0 100 100" width={size - 10} height={size - 10} fill="none">
          <rect x="18" y="46" width="64" height="40" rx="10" stroke="#E84545" strokeOpacity={0.4} strokeWidth={1.2} />
          <path d="M30 46V38a20 20 0 0 1 40 0v8" stroke="#E84545" strokeOpacity={0.38} strokeWidth={1.2} strokeLinecap="round" />
          <circle cx="50" cy="64" r="6" fill="#E84545" fillOpacity={0.35} />
          <line x1="50" y1="70" x2="50" y2="78" stroke="#E84545" strokeOpacity={0.38} strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      );
    case 'storage':
      return (
        <svg viewBox="0 0 110 110" width={size} height={size} fill="none">
          {[0, 1, 2, 3].map(i => (
            <rect key={i} x={16} y={18 + i * 20} width={78} height={16} rx={6}
              stroke="#3DC8FF" strokeOpacity={0.22 + i * 0.06} strokeWidth={1}
              fill="#3DC8FF" fillOpacity={0.03 + i * 0.015} />
          ))}
          {[0, 1, 2, 3].map(i => (
            <circle key={i} cx={82} cy={26 + i * 20} r={3} fill="#3DC8FF" fillOpacity={0.4} />
          ))}
        </svg>
      );
    case 'model':
      return (
        <svg viewBox="0 0 100 100" width={size - 10} height={size - 10} fill="none">
          {([[50, 16], [20, 70], [80, 70]] as [number,number][]).map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={9} stroke="#FFD04A" strokeOpacity={0.4} strokeWidth={1} fill="#FFD04A" fillOpacity={0.06} />
          ))}
          <line x1="50" y1="25" x2="22" y2="61" stroke="#FFD04A" strokeOpacity={0.22} strokeWidth={0.8} />
          <line x1="50" y1="25" x2="78" y2="61" stroke="#FFD04A" strokeOpacity={0.22} strokeWidth={0.8} />
          <line x1="29" y1="70" x2="71" y2="70" stroke="#FFD04A" strokeOpacity={0.22} strokeWidth={0.8} />
        </svg>
      );
    case 'scale':
      return (
        <svg viewBox="0 0 130 100" width={size + 20} height={size} fill="none">
          {[14, 28, 44, 60, 76, 92].map((h, i) => (
            <rect key={i} x={8 + i * 18} y={90 - h} width={14} height={h} rx={4}
              fill="#50FFA0" fillOpacity={0.10 + i * 0.04}
              stroke="#50FFA0" strokeOpacity={0.28} strokeWidth={0.8} />
          ))}
          <polyline points="15,76 33,62 51,48 69,34 87,20 105,8" stroke="#50FFA0" strokeOpacity={0.45} strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'gpu':
      return (
        <svg viewBox="0 0 130 90" width={size + 20} height={size - 10} fill="none">
          <rect x="8" y="18" width="114" height="50" rx="10" stroke="#76DC50" strokeOpacity={0.32} strokeWidth={1} />
          {[0, 1, 2, 3].map(i => (
            <rect key={i} x={18 + i * 24} y={28} width={18} height={30} rx={4}
              fill="#76DC50" fillOpacity={0.07} stroke="#76DC50" strokeOpacity={0.28} strokeWidth={0.8} />
          ))}
          {[14, 32, 50, 68, 86, 104].map((x, i) => (
            <line key={i} x1={x} y1={68} x2={x} y2={76} stroke="#76DC50" strokeOpacity={0.25} strokeWidth={1} />
          ))}
          <text x="65" y="88" textAnchor="middle" fontSize={8} fill="#76DC50" fillOpacity={0.35} fontWeight={600} fontFamily="monospace">NVIDIA L40S</text>
        </svg>
      );
    default:
      return null;
  }
}

function GlobeSectionContent() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = "A truly global network for lightning-fast inference".split(' ');

  return (
    <div ref={sectionRef} className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center bg-black py-20">
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.5 }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const top = (i * 37) % 100;
          const left = (i * 53) % 100;
          const r = (i % 3) + 0.5;
          return (
            <div key={i} style={{
              position: 'absolute', top: `${top}%`, left: `${left}%`,
              width: r, height: r, borderRadius: '50%',
              background: '#EDEAFF', opacity: 0.25 + (i % 4) * 0.1,
            }} />
          );
        })}
      </div>

      <div className="relative z-10 w-full flex flex-col items-center px-5 overflow-hidden">
        <div className="flex flex-col items-center">
          <div
            className="flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border border-[#EDEAFF]/12 bg-[#EDEAFF]/[0.04] font-mono text-[10px] tracking-[0.2em] uppercase text-[#EDEAFF]/50 transition-all duration-700 ease-out"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0px)' : 'translateY(16px)', willChange: 'opacity, transform' }}
          >
            <span style={{ color: '#FF8A3D' }}>✦</span> Global network
          </div>

          <h2
            className="text-[#EDEAFF] text-3xl md:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-center leading-tight mb-4 max-w-2xl transition-all duration-700 ease-out"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(1.3)', transitionDelay: '80ms', willChange: 'transform, opacity' }}
          >
            {words.map((word, i) => (
              <React.Fragment key={i}>
                <span className="inline-block transition-all duration-500 ease-out"
                  style={{ opacity: visible ? 1 : 0, filter: visible ? 'blur(0px)' : 'blur(10px)', transitionDelay: `${160 + i * 60}ms`, willChange: 'opacity, filter' }}>
                  {word}
                </span>
                {i !== words.length - 1 && ' '}
              </React.Fragment>
            ))}
          </h2>

          <p
            className="text-[#EDEAFF]/45 text-sm md:text-base text-center max-w-xl leading-relaxed transition-all duration-700 ease-out"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0px)' : 'translateY(14px)', transitionDelay: '420ms', willChange: 'opacity, transform' }}
          >
            Gcore global network consists of more than 160 locations, allowing you to reach your users anywhere in the world.
          </p>
        </div>

        <div
          className="w-full max-w-3xl -mt-4 transition-all duration-700 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0px) scale(1)' : 'translateY(50px) scale(0.92)', transitionDelay: '550ms', willChange: 'transform, opacity' }}
        >
          <video src="/video2.mp4" autoPlay loop muted playsInline className="w-full h-auto block" />
        </div>
      </div>
    </div>
  );
}

function ContactSectionContent({ contactInner }: { contactInner: number }) {
  const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
  const mr = (v: number, i0: number, i1: number, o0: number, o1: number) => {
    const p = clamp((v - i0) / (i1 - i0), 0, 1);
    return o0 + (o1 - o0) * p;
  };

  const glowTranslateY = mr(contactInner, 0.0, 1.3, 100, 0);
  const glowOpacity     = mr(contactInner, 0.0, 0.5, 0,   1);
  const glowBrightness  = mr(contactInner, 0.4, 1.6, 0.55, 1);

  const headingScale   = mr(contactInner, 0.0, 0.5, 1.6, 1);
  const headingOpacity = mr(contactInner, 0.0, 0.35, 0, 1);
  const words = "Contact us to discuss your project".split(' ');

  const subOpacity = mr(contactInner, 0.45, 0.8, 0, 1);
  const subY       = mr(contactInner, 0.45, 0.8, 14, 0);

  const btnOpacity = mr(contactInner, 0.85, 1.2, 0, 1);
  const btnY       = mr(contactInner, 0.85, 1.2, 16, 0);
  const btnScale    = mr(contactInner, 0.85, 1.2, 0.92, 1);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <div className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: '85%', opacity: glowOpacity, transform: `translateY(${glowTranslateY}%)`, filter: `brightness(${glowBrightness})`, willChange: 'opacity, transform, filter' }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 95% at 50% 100%, rgba(255,150,70,0.85) 0%, rgba(220,100,40,0.55) 32%, rgba(140,60,20,0.22) 55%, transparent 76%)' }} />
        <div className="absolute inset-x-0 bottom-0" style={{ height: '60%', background: 'radial-gradient(ellipse 65% 100% at 50% 100%, rgba(255,180,100,0.9) 0%, rgba(255,130,55,0.6) 38%, transparent 78%)' }} />
        <div className="absolute inset-x-0 bottom-0" style={{ height: '30%', background: 'radial-gradient(ellipse 55% 100% at 50% 100%, rgba(255,250,240,0.95) 0%, rgba(255,200,140,0.7) 40%, transparent 80%)', filter: 'blur(2px)' }} />
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const top = (i * 41) % 70;
          const left = (i * 59) % 100;
          const r = (i % 3) + 0.5;
          return (
            <div key={i} style={{
              position: 'absolute', top: `${top}%`, left: `${left}%`,
              width: r, height: r, borderRadius: '50%',
              background: '#EDEAFF', opacity: 0.25 + (i % 4) * 0.1,
            }} />
          );
        })}
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-5 pb-20">
        <h2
          className="text-[#EDEAFF] text-3xl md:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-center leading-tight mb-4 max-w-2xl"
          style={{ transform: `scale(${headingScale})`, opacity: headingOpacity, transformOrigin: 'center center', willChange: 'transform, opacity' }}
        >
          {words.map((word, i) => {
            const ws = 0.02 + (i / words.length) * 0.35;
            const we = ws + 0.16;
            const wo = mr(contactInner, ws, we, 0, 1);
            const wb = mr(contactInner, ws, we, 10, 0);
            return (
              <React.Fragment key={i}>
                <span style={{ opacity: wo, filter: `blur(${wb}px)`, display: 'inline-block', willChange: 'opacity, filter' }}>{word}</span>
                {i !== words.length - 1 && ' '}
              </React.Fragment>
            );
          })}
        </h2>

        <p className="text-[#EDEAFF]/55 text-sm md:text-base text-center max-w-lg leading-relaxed mb-8"
          style={{ opacity: subOpacity, transform: `translateY(${subY}px)`, willChange: 'opacity, transform' }}
        >
          Get in touch with us, and we'll guide you through running your ML model on Gcore Inference at the Edge. Together, we'll explore how our service can benefit you and your users.
        </p>

        <div style={{ opacity: btnOpacity, transform: `translateY(${btnY}px) scale(${btnScale})`, willChange: 'opacity, transform' }}>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0A090D] text-sm font-semibold tracking-wide hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:-translate-y-0.5 transition-all duration-300">
            Talk to an expert
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Hero (desktop only, untouched) ──────────────────────────────────────────
function HeroSection({ stage }: { stage: number }) {
  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center px-6 py-8 bg-[#070708]">
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-[1500ms]" style={{
        opacity: stage >= 1 ? 0.022 : 0,
        backgroundImage: 'linear-gradient(#EDEAFF 1px, transparent 1px), linear-gradient(90deg, #EDEAFF 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        maskImage: 'radial-gradient(ellipse 55% 50% at 50% 28%, black, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at 50% 28%, black, transparent 100%)',
      }} />
      <div className="absolute pointer-events-none transition-opacity duration-[2000ms] ease-out" style={{
        opacity: stage >= 1 ? 1 : 0,
        top: '-25%', right: '-45%', width: '140vw', height: '140vw',
        background: 'linear-gradient(90deg, transparent 0%, transparent 47%, rgba(124,92,255,0.13) 48.7%, rgba(255,150,80,0.6) 50%, rgba(124,92,255,0.13) 51.3%, transparent 53%, transparent 100%)',
        transform: 'rotate(27deg)', filter: 'blur(12px)',
        maskImage: 'radial-gradient(ellipse 70% 60% at 75% 20%, black 35%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 75% 20%, black 35%, transparent 78%)',
      }} />
      <div className="absolute -top-10 -right-10 w-[50vw] h-[50vw] pointer-events-none transition-opacity duration-[2000ms] ease-out" style={{
        opacity: stage >= 1 ? 0.9 : 0,
        background: 'radial-gradient(circle at 80% 10%, rgba(255,138,61,0.3), transparent 60%)',
        filter: 'blur(50px)',
      }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center pt-[10vh]">
        <div
          className="flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border border-[#EDEAFF]/12 bg-[#EDEAFF]/[0.03] font-mono text-[10px] tracking-[0.2em] uppercase text-[#EDEAFF]/55 transition-all duration-700 ease-out"
          style={{ opacity: stage >= 1 ? 1 : 0, transform: stage >= 1 ? 'translateY(0)' : 'translateY(10px)', filter: stage >= 1 ? 'blur(0px)' : 'blur(6px)' }}
        >
          <span className="text-[#7C5CFF]">✦</span> Beta release
        </div>
        <h1
          className="font-bold tracking-tight leading-[1.05] text-[10vw] sm:text-5xl md:text-[3.4rem] lg:text-[3.8rem] mb-5 transition-all duration-[900ms] ease-out"
          style={{ opacity: stage >= 1 ? 1 : 0, transform: stage >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)', filter: stage >= 1 ? 'blur(0px)' : 'blur(10px)' }}
        >
          Intelligence at{' '}
          <span className="bg-gradient-to-br from-[#EDEAFF] via-[#EDEAFF] to-[#7C5CFF] bg-clip-text text-transparent">
            the Core
          </span>
        </h1>
        <p
          className="max-w-lg text-sm md:text-base font-light text-[#EDEAFF]/45 leading-relaxed mb-7 transition-all duration-700 ease-out"
          style={{ opacity: stage >= 2 ? 1 : 0, transform: stage >= 2 ? 'translateY(0)' : 'translateY(14px)', filter: stage >= 2 ? 'blur(0px)' : 'blur(6px)' }}
        >
          Deploy and scale your AI workloads globally with infrastructure built for speed, reliability, and zero compromise on performance.
        </p>
        <div
          className="flex items-center gap-3 mb-8 transition-all duration-700 ease-out"
          style={{ opacity: stage >= 3 ? 1 : 0, transform: stage >= 3 ? 'translateY(0)' : 'translateY(14px)' }}
        >
          <Link href="/forms" className="px-5 py-2.5 rounded-full bg-[#7C5CFF] text-white text-sm font-semibold tracking-wide hover:shadow-[0_0_30px_rgba(124,92,255,0.5)] hover:-translate-y-0.5 transition-all duration-300">
            Get started
          </Link>
          <Link href="/contact" className="px-5 py-2.5 rounded-full border border-[#EDEAFF]/15 text-[#EDEAFF]/80 text-sm font-medium tracking-wide hover:border-[#EDEAFF]/40 hover:text-[#EDEAFF] transition-all duration-300">
            Book a demo
          </Link>
        </div>
      </div>

      {/* Circuit diagram */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 mt-6">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF8A3D" stopOpacity="1" />
              <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="dashGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF8A3D" stopOpacity="0" />
              <stop offset="45%" stopColor="#FF8A3D" stopOpacity="1" />
              <stop offset="55%" stopColor="#FFB07A" stopOpacity="1" />
              <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="dashGlowV" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF8A3D" stopOpacity="0" />
              <stop offset="45%" stopColor="#FF8A3D" stopOpacity="1" />
              <stop offset="55%" stopColor="#FFB07A" stopOpacity="1" />
              <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0" />
            </linearGradient>
          </defs>

          {NODES.map((n) => (
            <path key={`trace-${n.id}`} d={nodePath(n)} fill="none" stroke="#EDEAFF" strokeOpacity={0.22} strokeWidth={1.5} strokeLinecap="round" pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: stage >= 5 ? 0 : 1, transition: `stroke-dashoffset 850ms ease-out ${n.delay}s` }} />
          ))}
          {[-1, 1].map((dir) =>
            [-1, -0.33, 0.33, 1].map((m, i) => {
              const y = CHIP_Y + m * 30;
              const x1 = CHIP_X + dir * CHIP_HALF;
              const x2 = x1 + dir * 10;
              return <line key={`sp-${dir}-${i}`} x1={x1} y1={y} x2={x2} y2={y} stroke="#EDEAFF" strokeOpacity={0.3} strokeWidth={2.5} strokeLinecap="round"
                style={{ opacity: stage >= 4 ? 1 : 0, transition: `opacity 400ms ease-out ${0.1 + i * 0.05}s` }} />;
            })
          )}
          {Array.from({ length: PIN_COUNT }).map((_, i) => {
            const x = CHIP_X - ((PIN_COUNT - 1) * PIN_SPACING) / 2 + i * PIN_SPACING;
            const botY = CHIP_Y + CHIP_HALF + 96;
            return <line key={`pin-${i}`} x1={x} y1={CHIP_Y + CHIP_HALF} x2={x} y2={botY} stroke="#EDEAFF" strokeOpacity={0.3} strokeWidth={2} strokeLinecap="round" pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: stage >= 4 ? 0 : 1, transition: `stroke-dashoffset 450ms ease-out ${0.15 + i * 0.07}s` }} />;
          })}
          {stage >= 7 && NODES.map((n) => (
            <rect key={`dash-${n.id}`} x={-22} y={-2.2} width={44} height={4.4} rx={2.2} fill="url(#dashGlow)">
              <animateMotion dur="2.8s" begin={`${n.pulseDelay}s`} repeatCount="indefinite" path={nodePath(n)} rotate="auto" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.82;1" dur="2.8s" begin={`${n.pulseDelay}s`} repeatCount="indefinite" />
            </rect>
          ))}
          {stage >= 7 && Array.from({ length: PIN_COUNT }).map((_, i) => {
            const x = CHIP_X - ((PIN_COUNT - 1) * PIN_SPACING) / 2 + i * PIN_SPACING;
            const topY = CHIP_Y + CHIP_HALF;
            const botY = topY + 96;
            return (
              <rect key={`pd-${i}`} x={x - 1.6} y={topY - 14} width={3.2} height={28} rx={1.6} fill="url(#dashGlowV)">
                <animateMotion dur="1.5s" begin={`${i * 0.42}s`} repeatCount="indefinite" path={`M 0,0 L 0,${botY - topY}`} />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.78;1" dur="1.5s" begin={`${i * 0.42}s`} repeatCount="indefinite" />
              </rect>
            );
          })}
          {NODES.map((n) => (
            <g key={n.id} style={{ opacity: stage >= 6 ? 1 : 0, transform: stage >= 6 ? 'translateY(0px)' : 'translateY(8px)', transition: `opacity 550ms ease-out ${n.delay + 0.35}s, transform 550ms ease-out ${n.delay + 0.35}s`, transformOrigin: `${n.cx}px ${n.cy}px` }}>
              <circle cx={n.side === 'left' ? n.cx + NODE_HALF + 5 : n.cx - NODE_HALF - 5} cy={n.cy} r={2.5} fill="#0A090D" stroke="#EDEAFF" strokeOpacity={0.4} />
              <rect x={n.cx - NODE_HALF} y={n.cy - NODE_HALF} width={NODE_HALF * 2} height={NODE_HALF * 2} rx={12} fill="#13121A" stroke="#EDEAFF" strokeOpacity={0.1} />
              <NodeGlyph glyph={n.glyph} cx={n.cx} cy={n.cy} />
            </g>
          ))}
          <g style={{ opacity: stage >= 4 ? 1 : 0, transform: stage >= 4 ? 'scale(1)' : 'scale(0.85)', transition: 'opacity 500ms ease-out, transform 500ms ease-out', transformOrigin: `${CHIP_X}px ${CHIP_Y}px` }}>
            <rect x={CHIP_X - CHIP_HALF} y={CHIP_Y - CHIP_HALF} width={CHIP_HALF * 2} height={CHIP_HALF * 2} rx={18} fill="#13121A" stroke="#7C5CFF" strokeOpacity={0.45} strokeWidth={1.5} />
            <rect x={CHIP_X - CHIP_HALF} y={CHIP_Y - CHIP_HALF} width={CHIP_HALF * 2} height={CHIP_HALF * 2} rx={18} fill="url(#pulseGlow)" opacity={0.06} />
            <text x={CHIP_X} y={CHIP_Y + 7} textAnchor="middle" fontSize={19} fontWeight={700} fill="#EDEAFF" style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.01em' }}>AI</text>
          </g>
        </svg>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700" style={{ opacity: stage >= 7 ? 1 : 0 }}>
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#EDEAFF]/30">scroll</span>
        <div className="w-px h-6 bg-gradient-to-b from-[#7C5CFF]/60 to-transparent" />
      </div>
    </section>
  );
}

// ─── Node glyph icons ─────────────────────────────────────────────────────────
function NodeGlyph({ glyph, cx, cy }: { glyph: NodeCfg['glyph']; cx: number; cy: number }) {
  const stroke = '#EDEAFF';
  const op = 0.8;
  switch (glyph) {
    case 'arrow':   return <path d={`M ${cx-10},${cy+7} L ${cx},${cy-9} L ${cx+10},${cy+7} M ${cx-5},${cy+2} L ${cx+5},${cy+2}`} fill="none" stroke={stroke} strokeOpacity={op} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />;
    case 'dot':     return <circle cx={cx} cy={cy} r={3.5} fill={stroke} fillOpacity={op} />;
    case 'dotbig':  return <><circle cx={cx-4} cy={cy} r={3} fill={stroke} fillOpacity={op} /><circle cx={cx+5} cy={cy} r={1.6} fill={stroke} fillOpacity={op*0.7} /></>;
    case 'zigzag':  return <path d={`M ${cx-9},${cy-8} L ${cx-9},${cy+8} L ${cx},${cy-4} L ${cx},${cy+8} L ${cx+9},${cy-8} L ${cx+9},${cy+8}`} fill="none" stroke={stroke} strokeOpacity={op} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />;
    case 'grid':    return <>{[-1,1].map(dx=>[-1,1].map(dy=><rect key={`${dx}-${dy}`} x={cx+dx*6-3} y={cy+dy*6-3} width={6} height={6} rx={1.5} fill={stroke} fillOpacity={op}/>))}</>;
    case 'bloom':   return <g>{Array.from({length:6}).map((_,i)=>{const a=(i/6)*Math.PI*2;return<ellipse key={i} cx={cx+Math.cos(a)*6} cy={cy+Math.sin(a)*6} rx={5.5} ry={3} fill="none" stroke={stroke} strokeOpacity={op*0.85} strokeWidth={1.4} transform={`rotate(${(a*180)/Math.PI} ${cx+Math.cos(a)*6} ${cy+Math.sin(a)*6})`}/>})}</g>;
    default:        return null;
  }
}