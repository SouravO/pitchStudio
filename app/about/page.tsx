'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import { gsap } from 'gsap';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// ─── Shared motion variants ─────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Shared UI primitives ───────────────────────────────────────────────────
function SectionBadge({ children, color = '#7C5CFF' }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 mb-5">
      <span style={{ color }}>✦</span> {children}
    </div>
  );
}

function GridBackdrop({ opacity = 0.03, mask }: { opacity?: number; mask?: string }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage: 'linear-gradient(#EDEAFF 1px, transparent 1px), linear-gradient(90deg, #EDEAFF 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        maskImage: mask ?? 'radial-gradient(ellipse 85% 75% at 50% 40%, black, transparent 100%)',
        WebkitMaskImage: mask ?? 'radial-gradient(ellipse 85% 75% at 50% 40%, black, transparent 100%)',
      }}
    />
  );
}

function Starfield({ count, maxTop = 100 }: { count: number; maxTop?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        top: `${(i * 41) % maxTop}%`,
        left: `${(i * 59) % 100}%`,
        size: (i % 3) + 0.5,
        opacity: 0.25 + (i % 4) * 0.1,
      })),
    [count, maxTop]
  );
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.5 }}>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{ position: 'absolute', top: s.top, left: s.left, width: s.size, height: s.size, borderRadius: '50%', background: '#EDEAFF', opacity: s.opacity }}
        />
      ))}
    </div>
  );
}

function ValueGlyph({ type, color }: { type: string; color: string }) {
  const stroke = { fill: 'none' as const, stroke: color, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (type) {
    case 'bolt':
      return (
        <svg width="30" height="30" viewBox="0 0 40 40">
          <path d="M22 4 L10 24 H19 L17 36 L30 15 H21 Z" {...stroke} strokeOpacity={0.85} />
        </svg>
      );
    case 'globe':
      return (
        <svg width="30" height="30" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="15" {...stroke} strokeOpacity={0.55} />
          <ellipse cx="20" cy="20" rx="7" ry="15" {...stroke} strokeOpacity={0.45} />
          <line x1="5" y1="20" x2="35" y2="20" {...stroke} strokeOpacity={0.45} />
        </svg>
      );
    case 'shield':
      return (
        <svg width="30" height="30" viewBox="0 0 40 40">
          <path d="M20 5 L33 10 V20 C33 29 27 34 20 36 C13 34 7 29 7 20 V10 Z" {...stroke} strokeOpacity={0.65} />
          <path d="M14 20 L18 24 L27 14" {...stroke} strokeOpacity={0.9} />
        </svg>
      );
    case 'compass':
      return (
        <svg width="30" height="30" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="15" {...stroke} strokeOpacity={0.5} />
          <path d="M25 14 L17 18 L14 26 L22 22 Z" fill={color} fillOpacity={0.6} stroke="none" />
        </svg>
      );
    case 'signal':
      return (
        <svg width="30" height="30" viewBox="0 0 40 40">
          <circle cx="20" cy="28" r="2.4" fill={color} fillOpacity={0.85} stroke="none" />
          <path d="M13 21 a10 10 0 0 1 14 0" {...stroke} strokeOpacity={0.55} />
          <path d="M7 15 a19 19 0 0 1 26 0" {...stroke} strokeOpacity={0.35} />
        </svg>
      );
    case 'heart':
      return (
        <svg width="30" height="30" viewBox="0 0 40 40">
          <path d="M20 33 C8 25 5 17 11 12 C15 9 20 11 20 16 C20 11 25 9 29 12 C35 17 32 25 20 33 Z" {...stroke} strokeOpacity={0.75} />
        </svg>
      );
    default:
      return null;
  }
}

// ─── Flowing diagonal shapes (hero ambient background) ──────────────────────
type FlowShape = {
  left: number;
  top: number;
  kind: 'pill' | 'cross';
  color: string;
  width: number;
  opacity: number;
};

const FLOW_SPACING_X = 190;
const FLOW_SPACING_Y = 150;
const FLOW_BOX_W = 2600;
const FLOW_BOX_H = 2000;

function useFlowShapes(): FlowShape[] {
  return useMemo(() => {
    const shapes: FlowShape[] = [];
    let n = 0;
    for (let row = -3; row <= 13; row++) {
      const rowOffset = row % 2 === 0 ? 0 : FLOW_SPACING_X / 2;
      for (let col = -3; col <= 14; col++) {
        n++;
        const left = FLOW_BOX_W / 2 + col * FLOW_SPACING_X + rowOffset;
        const top = FLOW_BOX_H / 2 + row * FLOW_SPACING_Y;
        const pick = n % 9;
        const kind: FlowShape['kind'] = pick === 4 || pick === 8 ? 'cross' : 'pill';
        let color = 'rgba(237,234,255,0.12)';
        if (pick === 0) color = 'rgba(255,138,61,0.85)';
        else if (pick === 6) color = 'rgba(255,255,255,0.8)';
        else if (pick === 3) color = 'rgba(237,234,255,0.24)';
        const width = 64 + ((n * 7) % 3) * 18;
        const opacity = 0.45 + ((n * 3) % 5) * 0.1;
        shapes.push({ left, top, kind, color, width, opacity });
      }
    }
    return shapes;
  }, []);
}

function FlowingShapesBackground() {
  const shapes = useFlowShapes();
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="flow-shapes-track"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: FLOW_BOX_W,
          height: FLOW_BOX_H,
          marginLeft: -FLOW_BOX_W / 2,
          marginTop: -FLOW_BOX_H / 2,
        }}
      >
        {shapes.map((s, i) =>
          s.kind === 'pill' ? (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: s.left,
                top: s.top,
                width: s.width,
                height: 26,
                borderRadius: 999,
                border: `2px solid ${s.color}`,
                opacity: s.opacity,
                transform: 'rotate(-25deg)',
              }}
            />
          ) : (
            <svg
              key={i}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              style={{ position: 'absolute', left: s.left, top: s.top, opacity: s.opacity }}
            >
              <path
                d="M8 1.5 H12 V8 H18.5 V12 H12 V18.5 H8 V12 H1.5 V8 H8 Z"
                fill="none"
                stroke={s.color}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </svg>
          )
        )}
      </div>

      {/* Soft vignette so the tiled field fades into the section edges */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 95% 85% at 50% 45%, transparent 25%, #070708 90%)',
        }}
      />

      <style jsx>{`
        .flow-shapes-track {
          animation: flowShapes 16s linear infinite;
          will-change: transform;
        }
        @keyframes flowShapes {
          from {
            transform: translate(0px, 0px);
          }
          to {
            transform: translate(${-FLOW_SPACING_X / 2}px, ${-FLOW_SPACING_Y}px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .flow-shapes-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Section 1: Hero ─────────────────────────────────────────────────────────
const MARQUEE_ITEMS = ['500+ raises supported', '$500M deployed', '160+ investor regions', '98% founder success rate'];

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  const headingWords = 'We close the distance between founders and capital.'.split(' ');

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-10 overflow-hidden bg-[#070708]">
      <FlowingShapesBackground />
      <GridBackdrop opacity={0.035} />
      <motion.div
        className="absolute -top-10 -right-10 w-[55vw] h-[55vw] pointer-events-none"
        style={{ opacity: glowOpacity, y: glowY, background: 'radial-gradient(circle at 75% 15%, rgba(255,138,61,0.3), transparent 60%)', filter: 'blur(60px)' }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-[45vw] h-[45vw] pointer-events-none"
        style={{ opacity: glowOpacity, background: 'radial-gradient(circle at 30% 80%, rgba(124,92,255,0.24), transparent 60%)', filter: 'blur(60px)' }}
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <SectionBadge color="#FF8A3D">About Pitch Studio</SectionBadge>
        </motion.div>

        <h1 className="font-extrabold tracking-tight leading-[1.05] mb-6" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.4rem)' }}>
          {headingWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.28em]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="text-base md:text-lg text-white/45 font-light leading-relaxed max-w-xl mb-9"
        >
          Pitch Studio started as a spreadsheet passed between three friends tracking their own fundraise. Today it&apos;s the
          operating layer hundreds of founders use to run a raise — from first outreach to a signed term sheet.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-14"
        >
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-[#7C5CFF] text-white text-sm font-semibold tracking-wide hover:shadow-[0_0_30px_rgba(124,92,255,0.5)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Talk to an expert
          </Link>
          <a
            href="#team"
            className="px-5 py-2.5 rounded-full border border-white/15 text-white/80 text-sm font-medium tracking-wide hover:border-white/40 hover:text-white transition-all duration-300"
          >
            Meet the team
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="relative z-10 w-full max-w-lg overflow-hidden"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)',
        }}
      >
        <div className="marquee-track flex gap-8 whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-[11px] tracking-[0.15em] uppercase text-white/35 font-mono">
              {item}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { duration: 0.8, delay: 1.3 }, y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">scroll</span>
        <div className="w-px h-6 bg-gradient-to-b from-[#7C5CFF]/60 to-transparent" />
      </motion.div>

      <style jsx>{`
        .marquee-track {
          animation: marqueeScroll 22s linear infinite;
        }
        @keyframes marqueeScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

// ─── Section 2: Values — animated bounce cards ───────────────────────────────
type ValueItem = {
  title: string;
  desc: string;
  icon: string;
  color: string;
};

const VALUES: ValueItem[] = [
  { title: 'Speed', desc: 'Every hour a data room sits unopened is momentum lost. We build for pace, not process.', icon: 'bolt', color: '#FF8A3D' },
  { title: 'Access', desc: 'Great companies come from everywhere. Our network spans 160+ regions so location never gates opportunity.', icon: 'globe', color: '#3DC8FF' },
  { title: 'Trust', desc: 'Bank-grade encryption and granular permissions. Your cap table is not a marketing asset.', icon: 'shield', color: '#E84545' },
  { title: 'Craft', desc: 'We sweat the details other tools skip, from term sheet redlines to investor follow-up timing.', icon: 'compass', color: '#7C5CFF' },
  { title: 'Signal over noise', desc: "We'd rather make ten real introductions than list ten thousand cold names.", icon: 'signal', color: '#FFD04A' },
  { title: 'Founder-first', desc: 'Every roadmap decision starts with the same question: does this get a founder to a closed round faster?', icon: 'heart', color: '#50FFA0' },
];

// Fan-out transform for each card position (rotate + horizontal offset from center).
// Same mechanism as the React Bits BounceCards component, just with one more
// slot to cover all six values instead of five images.
const VALUE_CARD_TRANSFORMS = [
  'rotate(-8deg) translate(-500px)',
  'rotate(4deg) translate(-300px)',
  'rotate(-4deg) translate(-100px)',
  'rotate(4deg) translate(100px)',
  'rotate(-4deg) translate(300px)',
  'rotate(8deg) translate(500px)',
];

interface BounceValueCardsProps {
  className?: string;
  values: ValueItem[];
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
}

function BounceValueCards({
  className = '',
  values,
  containerWidth = 1440,
  containerHeight = 640,
  animationDelay = 0.3,
  animationStagger = 0.08,
  easeType = 'elastic.out(1, 0.6)',
  transformStyles = VALUE_CARD_TRANSFORMS,
  enableHover = true,
}: BounceValueCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.value-bounce-card',
        { scale: 0 },
        {
          scale: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationStagger, easeType, animationDelay]);

  const getNoRotationTransform = (transformStr: string) => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
    } else if (transformStr === 'none') {
      return 'rotate(0deg)';
    } else {
      return `${transformStr} rotate(0deg)`;
    }
  };

  const getPushedTransform = (baseTransform: string, offsetX: number) => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    } else {
      return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
    }
  };

  const pushSiblings = (hoveredIdx: number) => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);
    values.forEach((_, i) => {
      const selector = q(`.value-card-${i}`);
      gsap.killTweensOf(selector);
      const baseTransform = transformStyles[i] || 'none';

      if (i === hoveredIdx) {
        const noRotation = getNoRotationTransform(baseTransform);
        gsap.to(selector, {
          transform: noRotation,
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: 'auto',
        });
      } else {
        const offsetX = i < hoveredIdx ? -300 : 300;
        const pushedTransform = getPushedTransform(baseTransform, offsetX);
        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.05;

        gsap.to(selector, {
          transform: pushedTransform,
          duration: 0.4,
          ease: 'back.out(1.4)',
          delay,
          overwrite: 'auto',
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);
    values.forEach((_, i) => {
      const selector = q(`.value-card-${i}`);
      gsap.killTweensOf(selector);
      const baseTransform = transformStyles[i] || 'none';
      gsap.to(selector, {
        transform: baseTransform,
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto',
      });
    });
  };

  return (
    <div className="value-cards-shell w-full overflow-x-auto overflow-y-visible py-6" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div
        ref={containerRef}
        className={`value-cards-stage relative mx-auto flex items-center justify-center ${className}`}
        style={{
          width: 'min(90vw, 1480px)',
          maxWidth: containerWidth,
          minHeight: containerHeight,
        }}
      >
        {values.map((v, idx) => (
          <div
            key={v.title}
            className={`value-bounce-card value-card-${idx} absolute rounded-3xl border border-white/[0.08] overflow-hidden`}
            style={{
              width: 'clamp(250px, 17vw, 350px)',
              minHeight: 'clamp(300px, 24vw, 390px)',
              padding: 'clamp(1.25rem, 2vw, 1.75rem)',
              transform: transformStyles[idx] || 'none',
              background: 'linear-gradient(160deg, #111118 0%, #0c0c12 100%)',
              boxShadow: '0 14px 34px rgba(0,0,0,0.5)',
              transformOrigin: 'center center',
            }}
            onMouseEnter={() => pushSiblings(idx)}
            onMouseLeave={resetSiblings}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-70"
              style={{ background: `radial-gradient(circle at 30% 15%, ${v.color}26, transparent 60%)` }}
            />
            <div className="relative z-10 flex h-full min-h-[240px] flex-col">
              <div className="mb-5">
                <ValueGlyph type={v.icon} color={v.color} />
              </div>
              <h3 className="relative z-10 text-xl md:text-2xl font-semibold mb-3 leading-tight">{v.title}</h3>
              <p className="relative z-10 text-white/45 text-sm md:text-base leading-relaxed max-w-[24ch]">{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @media (max-width: 1024px) {
          .value-cards-shell {
            overflow-x: visible;
          }

          .value-cards-stage {
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1rem;
          }

          .value-bounce-card {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            transform: none !important;
            width: 100% !important;
            min-height: 260px !important;
          }
        }

        @media (max-width: 640px) {
          .value-cards-stage {
            grid-template-columns: 1fr;
          }

          .value-bounce-card {
            min-height: 240px !important;
          }
        }
      `}</style>
    </div>
  );
}

function ValuesSection() {
  return (
    <section className="relative bg-[#08080C] px-4 sm:px-8 lg:px-12 py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(124,92,255,0.08) 0%, transparent 65%)' }} />
      <div className="relative z-10 w-full max-w-[92vw] xl:max-w-[1500px] mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} className="max-w-2xl mb-10 md:mb-14 mx-auto text-center">
          <SectionBadge>Principles</SectionBadge>
          <h2 className="font-extrabold tracking-tight leading-tight mb-4" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)' }}>
            What we stand for
          </h2>
          <p className="text-white/45 leading-relaxed text-base md:text-lg">
            Six ideas guide every product decision, every investor conversation, and every line of code we ship.
          </p>
        </motion.div>

        <BounceValueCards values={VALUES} />
      </div>
    </section>
  );
}

// ─── Section 3: Story timeline (scroll-linked line reveal) ──────────────────
const MILESTONES: { year: string; title: string; desc: string }[] = [
  { year: '2021', title: 'Three operators, one shared doc', desc: 'Founded after watching friends waste months chasing cold investor lists with nothing but a spreadsheet.' },
  { year: '2022', title: 'First 50 rounds', desc: 'Opened a private beta to fifty seed-stage founders and rebuilt the product around what they actually needed.' },
  { year: '2023', title: 'A global network', desc: 'Crossed 160 investor regions and cut the average intro-to-first-call time down to 30 minutes.' },
  { year: '2024', title: 'Series-stage infrastructure', desc: 'Shipped data rooms, diligence analytics, and term sheet tooling built for Series A and B raises.' },
  { year: 'Today', title: '500+ raises supported', desc: 'Now the operating layer founders reach for when they need to run a competitive round, anywhere in the world.' },
];

function StorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="relative bg-black px-6 sm:px-10 lg:px-16 py-24 md:py-32 overflow-hidden">
      <Starfield count={36} />
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="text-center mb-16 md:mb-24"
        >
          <SectionBadge color="#FF8A3D">Our story</SectionBadge>
          <h2 className="font-extrabold tracking-tight leading-tight" style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.6rem)' }}>
            How we got here
          </h2>
        </motion.div>

        <div className="relative pl-10 md:pl-14">
          <div className="absolute left-[3px] md:left-[5px] top-1 bottom-1 w-px bg-white/10" />
          <motion.div
            style={{ scaleY: lineScale, transformOrigin: 'top' }}
            className="absolute left-[3px] md:left-[5px] top-1 bottom-1 w-px bg-gradient-to-b from-[#7C5CFF] via-[#FF8A3D] to-[#FFD04A]"
          />
          <div className="flex flex-col gap-14 md:gap-16">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <span className="absolute -left-10 md:-left-14 top-1.5 w-2.5 h-2.5 rounded-full bg-[#EDEAFF] ring-4 ring-black" />
                <div className="text-[0.7rem] tracking-widest text-[#FF8A3D] font-semibold mb-2">{m.year}</div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">{m.title}</h3>
                <p className="text-white/45 leading-relaxed max-w-lg">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Team grid ────────────────────────────────────────────────────
const TEAM: { name: string; role: string; bio: string; gradient: string }[] = [
  { name: 'Mia Torres', role: 'Co-founder & CEO', bio: 'Ex-growth lead who ran three seed-to-Series-B raises before starting Pitch Studio.', gradient: 'linear-gradient(135deg, #7C5CFF, #3DC8FF)' },
  { name: 'Daniel Osei', role: 'Co-founder & CTO', bio: 'Built fundraising and payments infrastructure at two fintech scaleups.', gradient: 'linear-gradient(135deg, #FF8A3D, #E84545)' },
  { name: 'Priya Nair', role: 'Head of Investor Relations', bio: 'Six years on the LP side, now building the network from the other side of the table.', gradient: 'linear-gradient(135deg, #50FFA0, #3DC8FF)' },
  { name: 'Lucas Meyer', role: 'Head of Product', bio: 'Obsessive about founder workflows and the small frictions that slow a raise down.', gradient: 'linear-gradient(135deg, #FFD04A, #FF8A3D)' },
  { name: 'Sara Kim', role: 'Head of Design', bio: 'Believes software should feel calm and clear, especially when the stakes are high.', gradient: 'linear-gradient(135deg, #7C5CFF, #E84545)' },
  { name: 'Owen Bright', role: 'Head of Platform Security', bio: 'Keeps every data room, cap table, and term sheet locked down tight.', gradient: 'linear-gradient(135deg, #3DC8FF, #7C5CFF)' },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
}

function TeamSection() {
  return (
    <section id="team" className="relative bg-[#0A090D] px-6 sm:px-10 lg:px-16 py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,138,61,0.06) 0%, transparent 65%)' }} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} className="max-w-xl mb-14 md:mb-20">
          <SectionBadge>Team</SectionBadge>
          <h2 className="font-extrabold tracking-tight leading-tight mb-4" style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.6rem)' }}>
            The people behind it
          </h2>
          <p className="text-white/45 leading-relaxed">
            A small team of operators, investors, and engineers who&apos;ve been on both sides of the table.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerParent}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TEAM.map((m) => (
            <motion.div
              key={m.name}
              variants={cardReveal}
              className="group rounded-2xl border border-white/[0.07] p-6 md:p-7 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
              style={{ background: 'linear-gradient(160deg, #111118 0%, #0c0c12 100%)' }}
            >
              <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center font-bold text-base mb-5 text-white" style={{ background: m.gradient }}>
                {initials(m.name)}
              </div>
              <h3 className="text-base font-semibold mb-1">{m.name}</h3>
              <div className="text-[#7C5CFF] text-xs tracking-wide font-medium mb-3">{m.role}</div>
              <p className="text-white/45 text-sm leading-relaxed">{m.bio}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section 5: Stats counters + closing CTA ────────────────────────────────
const STATS: { target: number; prefix?: string; suffix?: string; label: string }[] = [
  { target: 500, suffix: '+', label: 'STARTUPS REVIEWED' },
  { target: 500, prefix: '$', suffix: 'M', label: 'CAPITAL DEPLOYED' },
  { target: 98, suffix: '%', label: 'SUCCESS RATE' },
  { target: 160, suffix: '+', label: 'INVESTOR REGIONS' },
];

function Counter({ target, prefix = '', suffix = '', duration = 1.4 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTs: number | null = null;
    let raf = 0;
    const step = (ts: number) => {
      if (startTs === null) startTs = ts;
      const progress = Math.min((ts - startTs) / (duration * 1000), 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

function StatsCtaSection() {
  return (
    <section className="relative isolate bg-[#050507] px-6 sm:px-10 lg:px-16 pt-24 md:pt-28 pb-28 md:pb-36 overflow-hidden">
      <div className="absolute bottom-0 inset-x-[-18vw] pointer-events-none" style={{ height: '75%' }}>
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 90% at 50% 100%, rgba(255,150,70,0.55) 0%, rgba(220,100,40,0.32) 32%, rgba(140,60,20,0.14) 55%, transparent 76%)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ height: '55%', background: 'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(255,180,100,0.6) 0%, rgba(255,130,55,0.35) 38%, transparent 78%)' }}
        />
      </div>
      <Starfield count={24} maxTop={55} />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerParent}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 pb-16 md:pb-20 mb-16 md:mb-20 border-b border-white/10"
        >
          {STATS.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="text-center md:text-left">
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                <Counter target={s.target} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="text-[0.68rem] tracking-widest text-white/40 font-semibold">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} className="text-center max-w-xl mx-auto">
          <h2 className="font-extrabold tracking-tight leading-tight mb-4" style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)' }}>
            Ready to run your raise with us?
          </h2>
          <p className="text-white/50 leading-relaxed mb-8">
            Tell us where you are in your raise and we&apos;ll walk you through the platform, from first investor intro to a closed round.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/forms"
              className="px-6 py-3 rounded-full bg-white text-[#0A090D] text-sm font-semibold tracking-wide hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Get started
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full border border-white/20 text-white/80 text-sm font-medium tracking-wide hover:border-white/40 hover:text-white transition-all duration-300"
            >
              Talk to an expert
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="bg-[#070708] text-[#EDEAFF] min-h-screen selection:bg-[#7C5CFF] selection:text-black overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ValuesSection />
      <StorySection />
      <TeamSection />
      <StatsCtaSection />
      <Footer />
    </div>
  );
}