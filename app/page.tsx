'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Loader from '@/components/layout/Loader';

// ─── Types ────────────────────────────────────────────────────────────────────
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

interface CardData {
  title: string;
  desc: string;
  accentColor: string;
  glowColor: string;
  visual: string;
  videoSrc?: string;
  details?: string[];
  compact?: boolean;
  colSpan?: number;
}
// ─── Constants ────────────────────────────────────────────────────────────────
const VB_W = 1000;
const VB_H = 460;
const CHIP_X = VB_W / 2;
const CHIP_Y = VB_H / 2 + 6;
const CHIP_HALF = 56;
const NODE_HALF = 27;
const PIN_COUNT = 4;
const PIN_SPACING = 15;

const NODES: NodeCfg[] = [
  { id: 'n1', glyph: 'arrow',  side: 'left',  cx: 130,        cy: CHIP_Y - 78, bendX: 330,        delay: 0.05, pulseDelay: 0.0  },
  { id: 'n2', glyph: 'dot',    side: 'left',  cx: 60,         cy: CHIP_Y,      bendX: 0,          delay: 0.18, pulseDelay: 0.85 },
  { id: 'n3', glyph: 'zigzag', side: 'left',  cx: 130,        cy: CHIP_Y + 92, bendX: 300,        delay: 0.31, pulseDelay: 1.7  },
  { id: 'n4', glyph: 'dotbig', side: 'right', cx: VB_W - 130, cy: CHIP_Y - 78, bendX: VB_W - 330, delay: 0.11, pulseDelay: 0.42 },
  { id: 'n5', glyph: 'grid',   side: 'right', cx: VB_W - 60,  cy: CHIP_Y,      bendX: 0,          delay: 0.24, pulseDelay: 1.28 },
  { id: 'n6', glyph: 'bloom',  side: 'right', cx: VB_W - 130, cy: CHIP_Y + 92, bendX: VB_W - 300, delay: 0.37, pulseDelay: 2.1  },
];

const DARK_CARDS: CardData[] = [
  { title: 'A network spanning 160+ markets',  desc: 'Connect with active investors and operators across 160+ regions, with deal flow moving in an average of 30 minutes from intro to first call.', accentColor: 'rgba(255,138,61,0.18)',  glowColor: 'rgba(255,138,61,0.07)',  visual: 'globe',   videoSrc: '/vid1.mp4', details: ['160+ regional investor networks', '30-minute average response time', 'Automatic founder-investor matching'], colSpan: 3 },
  { title: 'One dashboard for every raise',     desc: 'Manage your cap table, investor updates, and fundraising pipeline from a single, unified workspace.',                                          accentColor: 'rgba(124,92,255,0.18)',  glowColor: 'rgba(124,92,255,0.07)',  visual: 'chip',    videoSrc: '/vid2.mp4', details: ['One unified workspace', 'Live pipeline tracking'], colSpan: 2 },
  { title: 'Confidential by default',          desc: 'Share financials and data rooms with bank-grade encryption, visible only to the people you invite.',                                         accentColor: 'rgba(232,69,69,0.14)',   glowColor: 'rgba(232,69,69,0.06)',   visual: 'lock',    videoSrc: '/vid3.mp4', details: ['End-to-end encrypted data rooms', 'Granular access controls'], colSpan: 2 },
  { title: 'Unlimited document storage',       desc: 'Keep every pitch deck, term sheet, and cap table version in one secure data room that scales with your company.',                            accentColor: 'rgba(61,200,255,0.14)',  glowColor: 'rgba(61,200,255,0.06)',  visual: 'storage', videoSrc: '/vid4.mp4', details: ['Version history for every document', 'Pay only as you grow'], colSpan: 2 },
  { title: 'Curated investor matches',          desc: 'Get matched with investors from our network or bring your own list.',                                                                       accentColor: 'rgba(255,200,61,0.12)', glowColor: 'rgba(255,200,61,0.05)', visual: 'model',   videoSrc: '/vid5.mp4', compact: true, colSpan: 1 },
  { title: 'Built to scale with your raise',    desc: 'Run a seed round or a Series C from the same platform. Add seats and tools as your team and round size grow.',                               accentColor: 'rgba(80,255,160,0.10)', glowColor: 'rgba(80,255,160,0.05)', visual: 'scale',   videoSrc: '/vid6.mp4', details: ['Scales from pre-seed to growth stage', 'Pay only for what you use'], colSpan: 3 },
  { title: 'Real-time diligence analytics',     desc: 'Track investor engagement on your data room in real time, down to the slide and the minute.',                                               accentColor: 'rgba(100,220,60,0.10)', glowColor: 'rgba(100,220,60,0.04)', visual: 'gpu',     videoSrc: '/vid1.mp4', details: ['Slide-by-slide engagement tracking', 'Built for fast-moving diligence'], colSpan: 2 },
];

const FEATURES = [
  { icon: '●',  color: '#FF8A3D', label: 'Investor updates',     tag: 'Sent automatically' },
  { icon: '◎',  color: '#E84545', label: 'Data room access',     tag: 'Multi-investor'      },
  { icon: 'S.', color: '#7C5CFF', label: 'Term sheet review',    tag: 'Real-time turnaround' },
];

// Scroll budget constants
const WHITE_SLIDE_END      = 1;
const DARK_SLIDE_START     = 3;
const DARK_SLIDE_END       = 4;
const CONTACT_SLIDE_START  = -1;
const CONTACT_SLIDE_END    = 0;
const CONTACT_CONTENT_LEAD = 1.2;
const TOP_TOTAL_VH         = 1150;
const CONTACT_TOTAL_VH     = 300;

// ─── Utility functions ────────────────────────────────────────────────────────
const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const mr = (v: number, i0: number, i1: number, o0: number, o1: number) =>
  o0 + (o1 - o0) * clamp((v - i0) / (i1 - i0));

function nodePath(n: NodeCfg): string {
  const chipEdgeX = n.side === 'left' ? CHIP_X - CHIP_HALF : CHIP_X + CHIP_HALF;
  const nodeEdgeX = n.side === 'left' ? n.cx + NODE_HALF : n.cx - NODE_HALF;
  if (n.cy === CHIP_Y) return `M ${chipEdgeX},${CHIP_Y} H ${nodeEdgeX}`;
  return `M ${chipEdgeX},${n.cy <= CHIP_Y ? CHIP_Y - 14 : CHIP_Y + 14} H ${n.bendX} L ${nodeEdgeX},${n.cy}`;
}

// ─── Shared hooks ─────────────────────────────────────────────────────────────
function useIntersection(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────
function Badge({ color = '#FF8A3D', children, style }: { color?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EDEAFF]/12 bg-[#EDEAFF]/[0.04] font-mono text-[10px] tracking-[0.2em] uppercase text-[#EDEAFF]/50"
      style={style}
    >
      <span style={{ color }}>✦</span> {children}
    </div>
  );
}

function Starfield({ count, maxTop = 100 }: { count: number; maxTop?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${(i * 41) % maxTop}%`,
          left: `${(i * 59) % 100}%`,
          width: (i % 3) + 0.5,
          height: (i % 3) + 0.5,
          borderRadius: '50%',
          background: '#EDEAFF',
          opacity: 0.25 + (i % 4) * 0.1,
        }} />
      ))}
    </div>
  );
}

function FadeIn({
  children,
  visible,
  delay = 0,
  type = 'fadeUp',
  style,
  className,
}: {
  children: React.ReactNode;
  visible: boolean;
  delay?: number;
  type?: 'fadeUp' | 'scale' | 'fadeOnly';
  style?: React.CSSProperties;
  className?: string;
}) {
  const transforms: Record<string, string> = {
    fadeUp:   visible ? 'translateY(0)' : 'translateY(14px)',
    scale:    visible ? 'scale(1)' : 'scale(1.3)',
    fadeOnly: 'none',
  };
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: transforms[type],
        transition: `opacity 700ms ease-out ${delay}ms, transform 700ms ease-out ${delay}ms`,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function FeatureList({ small }: { small?: boolean }) {
  return (
    <div className="flex flex-col">
      {FEATURES.map((feat) => (
        <div key={feat.label} className={`flex items-center justify-between border-b border-[#0A090D]/8 last:border-0 ${small ? 'py-3.5' : 'py-4'}`}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold w-5 text-center leading-none" style={{ color: feat.color }}>{feat.icon}</span>
            <span className="text-[#0A090D] text-sm font-medium">{feat.label}</span>
          </div>
          <span className={`text-[#0A090D]/30 font-mono tracking-widest ${small ? 'text-[10px]' : 'text-xs'}`}>{feat.tag}</span>
        </div>
      ))}
    </div>
  );
}

function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2" style={{ opacity: visible ? 1 : 0, transition: 'opacity 700ms' }}>
      <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#EDEAFF]/30">scroll</span>
      <div className="w-px h-5 bg-gradient-to-b from-[#7C5CFF]/60 to-transparent" />
    </div>
  );
}

function DragHandle({ color = '#EDEAFF' }: { color?: string }) {
  return (
    <div style={{
      position: 'absolute', top: 12, left: '50%',
      transform: 'translateX(-50%)', width: 48, height: 5,
      borderRadius: 4, background: color, opacity: 0.1, zIndex: 2,
    }} />
  );
}

function SlidingPanel({
  zIndex, background, translateY, showHandle, handleColor, children, style,
}: {
  zIndex: number;
  background: string;
  translateY: number;
  showHandle: boolean;
  handleColor?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 pointer-events-auto flex flex-col"
      style={{
        height: '100vh',
        zIndex,
        background,
        transform: `translateY(${translateY}%)`,
        borderRadius: translateY > 0.5 ? '24px 24px 0 0' : '0px',
        willChange: 'transform, border-radius',
        transition: 'border-radius 0.2s ease-out',
        ...style,
      }}
    >
      {showHandle && <DragHandle color={handleColor} />}
      {children}
    </div>
  );
}

// ─── Circuit SVG shared components ────────────────────────────────────────────
function CircuitDefs({ prefix }: { prefix: string }) {
  return (
    <defs>
      <radialGradient id={`pulseGlow${prefix}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FF8A3D" stopOpacity="1" />
        <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`dashGlow${prefix}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FF8A3D" stopOpacity="0" />
        <stop offset="45%" stopColor="#FF8A3D" stopOpacity="1" />
        <stop offset="55%" stopColor="#FFB07A" stopOpacity="1" />
        <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`dashGlowV${prefix}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF8A3D" stopOpacity="0" />
        <stop offset="45%" stopColor="#FF8A3D" stopOpacity="1" />
        <stop offset="55%" stopColor="#FFB07A" stopOpacity="1" />
        <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

function CircuitSVG({ stage, prefix }: { stage: number; prefix: string }) {
  return (
    <>
      {NODES.map((n) => (
        <path key={`trace-${n.id}`} d={nodePath(n)} fill="none" stroke="#EDEAFF" strokeOpacity={0.38} strokeWidth={2} strokeLinecap="round" pathLength={1}
          style={{ strokeDasharray: 1, strokeDashoffset: stage >= 5 ? 0 : 1, transition: `stroke-dashoffset 850ms ease-out ${n.delay}s` }} />
      ))}
      {[-1, 1].map((dir) =>
        [-1, -0.33, 0.33, 1].map((m, i) => {
          const y = CHIP_Y + m * 30;
          const x1 = CHIP_X + dir * CHIP_HALF;
          return <line key={`sp-${dir}-${i}`} x1={x1} y1={y} x2={x1 + dir * 10} y2={y} stroke="#EDEAFF" strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round"
            style={{ opacity: stage >= 4 ? 1 : 0, transition: `opacity 400ms ease-out ${0.1 + i * 0.05}s` }} />;
        })
      )}
      {Array.from({ length: PIN_COUNT }).map((_, i) => {
        const x = CHIP_X - ((PIN_COUNT - 1) * PIN_SPACING) / 2 + i * PIN_SPACING;
        return <line key={`pin-${i}`} x1={x} y1={CHIP_Y + CHIP_HALF} x2={x} y2={CHIP_Y + CHIP_HALF + 96} stroke="#EDEAFF" strokeOpacity={0.45} strokeWidth={2.5} strokeLinecap="round" pathLength={1}
          style={{ strokeDasharray: 1, strokeDashoffset: stage >= 4 ? 0 : 1, transition: `stroke-dashoffset 450ms ease-out ${0.15 + i * 0.07}s` }} />;
      })}
      {stage >= 7 && NODES.map((n) => (
        <rect key={`dash-${n.id}`} x={-22} y={-2.2} width={44} height={4.4} rx={2.2} fill={`url(#dashGlow${prefix})`}>
          <animateMotion dur="2.8s" begin={`${n.pulseDelay}s`} repeatCount="indefinite" path={nodePath(n)} rotate="auto" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.82;1" dur="2.8s" begin={`${n.pulseDelay}s`} repeatCount="indefinite" />
        </rect>
      ))}
      {stage >= 7 && Array.from({ length: PIN_COUNT }).map((_, i) => {
        const x = CHIP_X - ((PIN_COUNT - 1) * PIN_SPACING) / 2 + i * PIN_SPACING;
        const topY = CHIP_Y + CHIP_HALF;
        return (
          <rect key={`pd-${i}`} x={x - 1.6} y={topY - 14} width={3.2} height={28} rx={1.6} fill={`url(#dashGlowV${prefix})`}>
            <animateMotion dur="1.5s" begin={`${i * 0.42}s`} repeatCount="indefinite" path={`M 0,0 L 0,96`} />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.78;1" dur="1.5s" begin={`${i * 0.42}s`} repeatCount="indefinite" />
          </rect>
        );
      })}
      {NODES.map((n) => (
        <g key={n.id} style={{ opacity: stage >= 6 ? 1 : 0, transition: `opacity 550ms ease-out ${n.delay + 0.35}s` }}>
          <circle cx={n.side === 'left' ? n.cx + NODE_HALF + 5 : n.cx - NODE_HALF - 5} cy={n.cy} r={2.5} fill="#0A090D" stroke="#EDEAFF" strokeOpacity={0.4} />
          <rect x={n.cx - NODE_HALF} y={n.cy - NODE_HALF} width={NODE_HALF * 2} height={NODE_HALF * 2} rx={14} fill="#13121A" stroke="#EDEAFF" strokeOpacity={0.22} strokeWidth={1.2} />
          <NodeGlyph glyph={n.glyph} cx={n.cx} cy={n.cy} />
        </g>
      ))}
      <g style={{ opacity: stage >= 4 ? 1 : 0, transition: 'opacity 500ms ease-out' }}>
        <rect x={CHIP_X - CHIP_HALF} y={CHIP_Y - CHIP_HALF} width={CHIP_HALF * 2} height={CHIP_HALF * 2} rx={18} fill="#13121A" stroke="#7C5CFF" strokeOpacity={0.75} strokeWidth={2} />
        <rect x={CHIP_X - CHIP_HALF} y={CHIP_Y - CHIP_HALF} width={CHIP_HALF * 2} height={CHIP_HALF * 2} rx={18} fill={`url(#pulseGlow${prefix})`} opacity={0.12} />
        <text x={CHIP_X} y={CHIP_Y + 7} textAnchor="middle" fontSize={24} fontWeight={700} fill="#EDEAFF" style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.01em' }}>VC</text>
      </g>
    </>
  );
}
// ─── Node glyph icons ─────────────────────────────────────────────────────────
function NodeGlyph({ glyph, cx, cy }: { glyph: NodeCfg['glyph']; cx: number; cy: number }) {
  const s = '#EDEAFF', op = 0.8;
  switch (glyph) {
    case 'arrow':   return <path d={`M ${cx-10},${cy+7} L ${cx},${cy-9} L ${cx+10},${cy+7} M ${cx-5},${cy+2} L ${cx+5},${cy+2}`} fill="none" stroke={s} strokeOpacity={op} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />;
    case 'dot':     return <circle cx={cx} cy={cy} r={3.5} fill={s} fillOpacity={op} />;
    case 'dotbig':  return <><circle cx={cx-4} cy={cy} r={3} fill={s} fillOpacity={op} /><circle cx={cx+5} cy={cy} r={1.6} fill={s} fillOpacity={op * 0.7} /></>;
    case 'zigzag':  return <path d={`M ${cx-9},${cy-8} L ${cx-9},${cy+8} L ${cx},${cy-4} L ${cx},${cy+8} L ${cx+9},${cy-8} L ${cx+9},${cy+8}`} fill="none" stroke={s} strokeOpacity={op} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />;
    case 'grid':    return <>{[-1,1].map(dx=>[-1,1].map(dy=><rect key={`${dx}-${dy}`} x={cx+dx*6-3} y={cy+dy*6-3} width={6} height={6} rx={1.5} fill={s} fillOpacity={op}/>))}</>;
    case 'bloom':   return <g>{Array.from({length:6}).map((_,i)=>{const a=(i/6)*Math.PI*2; return <ellipse key={i} cx={cx+Math.cos(a)*6} cy={cy+Math.sin(a)*6} rx={5.5} ry={3} fill="none" stroke={s} strokeOpacity={op*0.85} strokeWidth={1.4} transform={`rotate(${(a*180)/Math.PI} ${cx+Math.cos(a)*6} ${cy+Math.sin(a)*6})`}/>})}</g>;
    default:        return null;
  }
}

// ─── Card visuals ─────────────────────────────────────────────────────────────
function CardVisual({ visual, compact }: { visual: string; compact?: boolean }) {
  const size = compact ? 90 : 130;
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
          {[0,60,120,180,240,300].map((deg, i) => {
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
          <text x="60" y="65" textAnchor="middle" fontSize={13} fill="#7C5CFF" fillOpacity={0.65} fontWeight={700}>VC</text>
          {[-1,1].map(dir=>[-1,0,1].map((m,i)=>(
            <line key={`${dir}-${i}`} x1={dir===-1?32:88} y1={60+m*14} x2={dir===-1?20:100} y2={60+m*14} stroke="#7C5CFF" strokeOpacity={0.3} strokeWidth={1} />
          )))}
          {[-1,1].map(dir=>[-1,0,1].map((m,i)=>(
            <line key={`v-${dir}-${i}`} x1={60+m*14} y1={dir===-1?32:88} x2={60+m*14} y2={dir===-1?20:100} stroke="#7C5CFF" strokeOpacity={0.25} strokeWidth={1} />
          )))}
        </svg>
      );
    case 'lock':
      return (
        <svg viewBox="0 0 100 100" width={size-10} height={size-10} fill="none">
          <rect x="18" y="46" width="64" height="40" rx="10" stroke="#E84545" strokeOpacity={0.4} strokeWidth={1.2} />
          <path d="M30 46V38a20 20 0 0 1 40 0v8" stroke="#E84545" strokeOpacity={0.38} strokeWidth={1.2} strokeLinecap="round" />
          <circle cx="50" cy="64" r="6" fill="#E84545" fillOpacity={0.35} />
          <line x1="50" y1="70" x2="50" y2="78" stroke="#E84545" strokeOpacity={0.38} strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      );
    case 'storage':
      return (
        <svg viewBox="0 0 110 110" width={size} height={size} fill="none">
          {[0,1,2,3].map(i=>(
            <rect key={i} x={16} y={18+i*20} width={78} height={16} rx={6} stroke="#3DC8FF" strokeOpacity={0.22+i*0.06} strokeWidth={1} fill="#3DC8FF" fillOpacity={0.03+i*0.015} />
          ))}
          {[0,1,2,3].map(i=><circle key={i} cx={82} cy={26+i*20} r={3} fill="#3DC8FF" fillOpacity={0.4} />)}
        </svg>
      );
    case 'model':
      return (
        <svg viewBox="0 0 100 100" width={size-10} height={size-10} fill="none">
          {([[50,16],[20,70],[80,70]] as [number,number][]).map(([cx,cy],i)=>(
            <circle key={i} cx={cx} cy={cy} r={9} stroke="#FFD04A" strokeOpacity={0.4} strokeWidth={1} fill="#FFD04A" fillOpacity={0.06} />
          ))}
          <line x1="50" y1="25" x2="22" y2="61" stroke="#FFD04A" strokeOpacity={0.22} strokeWidth={0.8} />
          <line x1="50" y1="25" x2="78" y2="61" stroke="#FFD04A" strokeOpacity={0.22} strokeWidth={0.8} />
          <line x1="29" y1="70" x2="71" y2="70" stroke="#FFD04A" strokeOpacity={0.22} strokeWidth={0.8} />
        </svg>
      );
    case 'scale':
      return (
        <svg viewBox="0 0 130 100" width={size+20} height={size} fill="none">
          {[14,28,44,60,76,92].map((h,i)=>(
            <rect key={i} x={8+i*18} y={90-h} width={14} height={h} rx={4} fill="#50FFA0" fillOpacity={0.10+i*0.04} stroke="#50FFA0" strokeOpacity={0.28} strokeWidth={0.8} />
          ))}
          <polyline points="15,76 33,62 51,48 69,34 87,20 105,8" stroke="#50FFA0" strokeOpacity={0.45} strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'gpu':
      return (
        <svg viewBox="0 0 130 90" width={size+20} height={size-10} fill="none">
          <rect x="8" y="18" width="114" height="50" rx="10" stroke="#76DC50" strokeOpacity={0.32} strokeWidth={1} />
          {[0,1,2,3].map(i=>(
            <rect key={i} x={18+i*24} y={28} width={18} height={30} rx={4} fill="#76DC50" fillOpacity={0.07} stroke="#76DC50" strokeOpacity={0.28} strokeWidth={0.8} />
          ))}
          {[14,32,50,68,86,104].map((x,i)=>(
            <line key={i} x1={x} y1={68} x2={x} y2={76} stroke="#76DC50" strokeOpacity={0.25} strokeWidth={1} />
          ))}
          <text x="65" y="88" textAnchor="middle" fontSize={8} fill="#76DC50" fillOpacity={0.35} fontWeight={600} fontFamily="monospace">LIVE ANALYTICS</text>
        </svg>
      );
    default: return null;
  }
}
// ─── Dark card (shared by desktop + mobile) ───────────────────────────────────
function DarkCard({ title, desc, accentColor, glowColor, visual, height, compact, videoSrc, details, mobile }: CardData & { height?: string; mobile?: boolean }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-[#EDEAFF]/[0.07] flex flex-col"
      style={{
        height: height ?? 'auto',
        background: 'linear-gradient(145deg, #111118 0%, #0c0c12 100%)',
        boxShadow: `0 0 50px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.04)`,
        ...(mobile ? { minHeight: 110 } : {}),
      }}
    >
      {videoSrc && (
        <video src={videoSrc} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: mobile ? 0.4 : 0.55 }} />
      )}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(8,8,10,0.78) 0%, rgba(8,8,10,0.45) 38%, rgba(8,8,10,0.55) 100%)' }} />
      <div className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse 90% 55% at 50% 110%, ${accentColor} 0%, transparent 65%)` }} />
      <div className="absolute bottom-0 right-0 pointer-events-none" style={{ opacity: mobile ? 0.25 : 0.35, ...(mobile ? { maxWidth: '45%', overflow: 'hidden' } : {}) }}>
        <CardVisual visual={visual} compact={compact} />
      </div>
      <div className="relative z-10 p-4 md:p-5 flex flex-col gap-1 md:gap-2" style={{ maxWidth: compact ? '100%' : '72%' }}>
        <h3 className={`text-[#EDEAFF] font-semibold leading-snug ${compact || mobile ? 'text-sm' : 'text-base lg:text-lg'}`}>{title}</h3>
        {!compact && <p className="text-[#EDEAFF]/40 md:text-[#EDEAFF]/45 text-xs md:text-sm leading-relaxed">{desc}</p>}
        {!compact && !mobile && details && (
          <ul className="flex flex-col gap-1 mt-2">
            {details.map((d) => (
              <li key={d} className="text-[#EDEAFF]/35 text-xs flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#EDEAFF]/40 flex-shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
// ─── Mobile sections ──────────────────────────────────────────────────────────
function MobileHeroSection({ stage }: { stage: number }) {
  return (
    <section className="relative w-full flex flex-col items-center justify-center px-5 pt-16 pb-10 bg-[#070708] min-h-[100svh]" style={{ overflow: 'hidden' }}>
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-[1500ms]" style={{
        opacity: stage >= 1 ? 0.022 : 0,
        backgroundImage: 'linear-gradient(#EDEAFF 1px, transparent 1px), linear-gradient(90deg, #EDEAFF 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        maskImage: 'radial-gradient(ellipse 55% 50% at 50% 28%, black, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at 50% 28%, black, transparent 100%)',
      }} />
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] pointer-events-none transition-opacity duration-[2000ms] ease-out" style={{
        opacity: stage >= 1 ? 0.7 : 0,
        background: 'radial-gradient(circle at 80% 10%, rgba(255,138,61,0.28), transparent 60%)',
        filter: 'blur(30px)',
      }} />
      <div className="relative z-10 w-full flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-[#EDEAFF]/12 bg-[#EDEAFF]/[0.03] font-mono text-[9px] tracking-[0.2em] uppercase text-[#EDEAFF]/55 transition-all duration-700 ease-out"
          style={{ opacity: stage >= 1 ? 1 : 0, transform: stage >= 1 ? 'translateY(0)' : 'translateY(10px)' }}>
          <span className="text-[#7C5CFF]">✦</span> Now in beta
        </div>
        <h1 className="font-bold tracking-tight leading-[1.05] text-[2.4rem] mb-4 transition-all duration-[900ms] ease-out"
          style={{ opacity: stage >= 1 ? 1 : 0, transform: stage >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)' }}>
          Where founders{' '}
          <span className="bg-gradient-to-br from-[#EDEAFF] via-[#EDEAFF] to-[#7C5CFF] bg-clip-text text-transparent">meet capital</span>
        </h1>
        <p className="text-sm font-light text-[#EDEAFF]/45 leading-relaxed mb-6 max-w-xs transition-all duration-700 ease-out"
          style={{ opacity: stage >= 2 ? 1 : 0, transform: stage >= 2 ? 'translateY(0)' : 'translateY(14px)' }}>
          Run your fundraise on a platform built for speed, security, and zero wasted time chasing the wrong investors.
        </p>
        <div className="flex items-center gap-3 mb-8 transition-all duration-700 ease-out"
          style={{ opacity: stage >= 3 ? 1 : 0, transform: stage >= 3 ? 'translateY(0)' : 'translateY(14px)' }}>
          <Link href="/forms" className="px-5 py-2.5 rounded-full bg-[#7C5CFF] text-white text-sm font-semibold tracking-wide">Get started</Link>
          <Link href="/contact" className="px-5 py-2.5 rounded-full border border-[#EDEAFF]/15 text-[#EDEAFF]/80 text-sm font-medium tracking-wide">Book a demo</Link>
        </div>
        <div className="w-full transition-all duration-700 ease-out" style={{ opacity: stage >= 4 ? 1 : 0, overflow: 'hidden' }}>
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" style={{ display: 'block', overflow: 'hidden' }}>
            <CircuitDefs prefix="M" />
            <CircuitSVG stage={stage} prefix="M" />
          </svg>
        </div>
        <div className="mt-2"><ScrollHint visible={stage >= 7} /></div>
      </div>
    </section>
  );
}

function MobileWhiteSection() {
  return (
    <div className="w-full bg-white flex flex-col px-5 pt-10 pb-10">
      <h2 className="text-[#0A090D] text-2xl font-bold tracking-tight text-center leading-tight mb-8">
        Raise faster with everything in one place
      </h2>
      <div className="w-full rounded-[20px] overflow-hidden shadow-xl mb-8"
        style={{ aspectRatio: '4/3', background: 'radial-gradient(ellipse 70% 55% at 45% 35%, rgba(210,160,120,0.45) 0%, #2a2520 50%, #181410 100%)' }}>
        <div className="relative w-full h-full">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 36px, rgba(255,255,255,0.02) 36px, rgba(255,255,255,0.02) 37px)' }} />
          <video src="/video1.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-55 mix-blend-luminosity" />
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <p className="text-white/75 text-xs font-medium leading-snug">Try the <span className="text-white font-semibold">Founder Dashboard</span> <span className="italic text-white/55">live</span></p>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-[#0A090D] text-base font-semibold leading-snug mb-2">The Founder Dashboard cuts the time between your first investor intro and a signed term sheet.</p>
        <p className="text-[#0A090D]/45 text-sm leading-relaxed mb-6">It's built for fast-moving rounds that need immediate follow-up and zero delay, like competitive seed and Series A processes.</p>
        <FeatureList small />
        <div className="mt-8">
          <Link href="/forms" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a1920] text-white text-sm font-semibold tracking-wide">
            Get started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

function MobileDarkSection() {
  return (
    <div className="relative w-full flex flex-col items-center px-4 pt-10 pb-10" style={{ background: '#08080C', overflow: 'hidden' }}>
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(124,92,255,0.07) 0%, transparent 65%)' }} />
      <Badge style={{ marginBottom: 16 }}>Fundraising tools</Badge>
      <h2 className="text-[#EDEAFF] text-2xl font-bold tracking-tight text-center leading-tight mb-8 max-w-xs">
        Unlock your fundraise's full potential
      </h2>
      <div className="w-full flex flex-col gap-3">
        {DARK_CARDS.map((card) => <DarkCard key={card.title} {...card} mobile />)}
      </div>
    </div>
  );
}

function MobileGlobeSection() {
  const { ref, visible } = useIntersection();
  return (
    <div ref={ref} className="relative w-full overflow-hidden flex flex-col bg-black px-5 pt-10 pb-8" style={{ overflowX: 'hidden' }}>
      <Starfield count={25} />
      <div className="relative z-10 flex flex-col items-center">
        <FadeIn visible={visible} style={{ marginBottom: 16 }}><Badge>Investor network</Badge></FadeIn>
        <FadeIn visible={visible} delay={80} type="scale" style={{ marginBottom: 12 }}>
          <h2 className="text-[#EDEAFF] text-2xl font-bold tracking-tight text-center leading-tight">A truly global network of active investors</h2>
        </FadeIn>
        <FadeIn visible={visible} delay={200} style={{ marginBottom: 24 }}>
          <p className="text-[#EDEAFF]/45 text-sm text-center leading-relaxed">Our network spans more than 160 regions, helping you reach the right investors wherever they're writing checks.</p>
        </FadeIn>
        <FadeIn visible={visible} delay={350} className="w-full">
          <video src="/video2.mp4" autoPlay loop muted playsInline className="w-full h-auto block rounded-2xl" />
        </FadeIn>
      </div>
    </div>
  );
}

function MobileContactSection() {
  const { ref, visible } = useIntersection();
  return (
    <div ref={ref} className="relative w-full overflow-hidden flex flex-col" style={{ background: '#050507', minHeight: '60vh', overflowX: 'hidden' }}>
      <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: '80%', opacity: visible ? 1 : 0, transition: 'opacity 1.2s ease-out 0.2s' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 95% at 50% 100%, rgba(255,150,70,0.75) 0%, rgba(220,100,40,0.45) 32%, rgba(140,60,20,0.18) 55%, transparent 76%)' }} />
        <div className="absolute inset-x-0 bottom-0" style={{ height: '60%', background: 'radial-gradient(ellipse 65% 100% at 50% 100%, rgba(255,180,100,0.85) 0%, rgba(255,130,55,0.5) 38%, transparent 78%)' }} />
        <div className="absolute inset-x-0 bottom-0" style={{ height: '28%', background: 'radial-gradient(ellipse 55% 100% at 50% 100%, rgba(255,250,240,0.9) 0%, rgba(255,200,140,0.6) 40%, transparent 80%)', filter: 'blur(2px)' }} />
      </div>
      <Starfield count={20} maxTop={70} />
      <div className="relative z-10 flex flex-col items-center justify-center px-5 pt-14 pb-16">
        <FadeIn visible={visible} style={{ marginBottom: 16 }}>
          <h2 className="text-[#EDEAFF] text-2xl font-bold tracking-tight text-center leading-tight">Talk to us about your raise</h2>
        </FadeIn>
        <FadeIn visible={visible} delay={150} style={{ marginBottom: 32 }}>
          <p className="text-[#EDEAFF]/55 text-sm text-center leading-relaxed">Get in touch, and we'll walk you through running your fundraise on our platform from first intro to closed round.</p>
        </FadeIn>
        <FadeIn visible={visible} delay={300}>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0A090D] text-sm font-semibold tracking-wide">Talk to an expert</Link>
        </FadeIn>
      </div>
    </div>
  );
}

// ─── Desktop sections ─────────────────────────────────────────────────────────
function HeroSection({ stage }: { stage: number }) {
  const words = "Where founders meet capital".split(' ');
  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center px-6 py-8 bg-[#070708]">
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-[1500ms]" style={{
        opacity: stage >= 1 ? 0.035 : 0,
        backgroundImage: 'linear-gradient(#EDEAFF 1px, transparent 1px), linear-gradient(90deg, #EDEAFF 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        maskImage: 'radial-gradient(ellipse 85% 80% at 50% 45%, black, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 45%, black, transparent 100%)',
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
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center pt-[5vh]">
        <div className="flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full border border-[#EDEAFF]/12 bg-[#EDEAFF]/[0.03] font-mono text-[10px] tracking-[0.2em] uppercase text-[#EDEAFF]/55 transition-all duration-700 ease-out"
          style={{ opacity: stage >= 1 ? 1 : 0, transform: stage >= 1 ? 'translateY(0)' : 'translateY(10px)', filter: stage >= 1 ? 'blur(0px)' : 'blur(6px)' }}>
          <span className="text-[#7C5CFF]">✦</span> Now in beta
        </div>
        <h1 className="font-bold tracking-tight leading-[1.05] text-[10vw] sm:text-5xl md:text-[3.4rem] lg:text-[3.8rem] mb-3 transition-all duration-[900ms] ease-out"
          style={{ opacity: stage >= 1 ? 1 : 0, transform: stage >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)', filter: stage >= 1 ? 'blur(0px)' : 'blur(10px)' }}>
          Where founders{' '}
          <span className="bg-gradient-to-br from-[#EDEAFF] via-[#EDEAFF] to-[#7C5CFF] bg-clip-text text-transparent">meet capital</span>
        </h1>
        <p className="max-w-lg text-sm md:text-base font-light text-[#EDEAFF]/45 leading-relaxed mb-5 transition-all duration-700 ease-out"
          style={{ opacity: stage >= 2 ? 1 : 0, transform: stage >= 2 ? 'translateY(0)' : 'translateY(14px)', filter: stage >= 2 ? 'blur(0px)' : 'blur(6px)' }}>
          Run your fundraise on a platform built for speed, security, and zero wasted time chasing the wrong investors.
        </p>
        <div className="flex items-center gap-3 mb-2 transition-all duration-700 ease-out"
          style={{ opacity: stage >= 3 ? 1 : 0, transform: stage >= 3 ? 'translateY(0)' : 'translateY(14px)' }}>
          <Link href="/forms" className="px-5 py-2.5 rounded-full bg-[#7C5CFF] text-white text-sm font-semibold tracking-wide hover:shadow-[0_0_30px_rgba(124,92,255,0.5)] hover:-translate-y-0.5 transition-all duration-300">Get started</Link>
          <Link href="/contact" className="px-5 py-2.5 rounded-full border border-[#EDEAFF]/15 text-[#EDEAFF]/80 text-sm font-medium tracking-wide hover:border-[#EDEAFF]/40 hover:text-[#EDEAFF] transition-all duration-300">Book a demo</Link>
        </div>
        <div className="w-full" style={{ opacity: stage >= 4 ? 1 : 0, transition: 'opacity 600ms ease-out', filter: stage >= 6 ? 'drop-shadow(0 0 24px rgba(255,138,61,0.25)) drop-shadow(0 0 48px rgba(124,92,255,0.12))' : 'none' }}>
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" style={{ overflow: 'visible' }}>
            <CircuitDefs prefix="" />
            <CircuitSVG stage={stage} prefix="" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700" style={{ opacity: stage >= 7 ? 1 : 0 }}>
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#EDEAFF]/30">scroll</span>
        <div className="w-px h-6 bg-gradient-to-b from-[#7C5CFF]/60 to-transparent" />
      </div>
    </section>
  );
}
function WhiteSectionContent({ whiteInner }: { whiteInner: number }) {
  const headingScale   = mr(whiteInner, 0,   0.6, 2.4, 1);
  const headingOpacity = mr(whiteInner, 0,   0.5, 0,   1);
  const videoOpacity   = mr(whiteInner, 0.5, 1.0, 0,   1);
  const videoScale     = mr(whiteInner, 0.5, 1.0, 0.85, 1);
  const videoTranslY   = mr(whiteInner, 0.5, 1.0, 60,  0);
  const rightOpacity   = mr(whiteInner, 0.9, 1.4, 0,   1);
  const rightTranslX   = mr(whiteInner, 0.9, 1.4, 80,  0);
  const words = "Raise faster with everything in one place".split(' ');

  return (
    <div className="flex-1 w-full flex flex-col justify-center max-w-6xl mx-auto px-6 py-12 lg:py-0">
      <h2 className="text-[#0A090D] text-[1.8rem] md:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-center leading-tight mb-12 lg:mb-20 max-w-2xl mx-auto"
        style={{ transform: `scale(${headingScale})`, opacity: headingOpacity, transformOrigin: 'center center', willChange: 'transform, opacity' }}>
        {words.map((word, i) => {
          const ws = (i / words.length) * 0.4;
          return (
            <React.Fragment key={i}>
              <span style={{ opacity: mr(whiteInner, ws, ws + 0.2, 0, 1), filter: `blur(${mr(whiteInner, ws, ws + 0.2, 12, 0)}px)`, display: 'inline-block', willChange: 'opacity, filter' }}>{word}</span>
              {i !== words.length - 1 && ' '}
            </React.Fragment>
          );
        })}
      </h2>
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16">
        <div className="w-full max-w-md lg:max-w-none lg:w-[42%] flex-shrink-0"
          style={{ opacity: videoOpacity, transform: `translateY(${videoTranslY}px) scale(${videoScale})`, willChange: 'transform, opacity' }}>
          <div className="relative w-full rounded-[20px] overflow-hidden shadow-xl" style={{ aspectRatio: '3/4', background: 'radial-gradient(ellipse 70% 55% at 45% 35%, rgba(210,160,120,0.45) 0%, #2a2520 50%, #181410 100%)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 36px, rgba(255,255,255,0.02) 36px, rgba(255,255,255,0.02) 37px)' }} />
            <video src="/video1.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-55 mix-blend-luminosity" />
            <div className="absolute bottom-5 left-5 right-5 z-10">
              <p className="text-white/75 text-sm font-medium leading-snug">Try the <span className="text-white font-semibold">Founder Dashboard</span> <span className="italic text-white/55">live</span></p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center w-full max-w-md lg:max-w-none"
          style={{ opacity: rightOpacity, transform: `translateX(${rightTranslX}px)`, willChange: 'transform, opacity' }}>
          <p className="text-[#0A090D] text-lg md:text-xl font-semibold leading-snug mb-3">The Founder Dashboard cuts the time between your first investor intro and a signed term sheet.</p>
          <p className="text-[#0A090D]/45 text-sm md:text-base leading-relaxed mb-8">It's built for fast-moving rounds that need immediate follow-up and zero delay, like competitive seed and Series A processes.</p>
          <FeatureList />
          <div className="mt-10">
            <Link href="/forms" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a1920] text-white text-sm font-semibold tracking-wide hover:bg-[#2a2838] hover:shadow-[0_0_24px_rgba(124,92,255,0.2)] transition-all duration-300">
              Get started
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
function DarkSectionContent({ darkInner }: { darkInner: number }) {
  const badgeOpacity   = mr(darkInner, 0.0, 0.4, 0, 1);
  const badgeY         = mr(darkInner, 0.0, 0.4, 20, 0);
  const headingScale   = mr(darkInner, 0.0, 0.7, 2.0, 1);
  const headingOpacity = mr(darkInner, 0.0, 0.5, 0, 1);
  const words = "Unlock your fundraise's full potential".split(' ');
  const cardStarts = [0.6, 1.3, 2.2, 3.1, 4.0, 4.9, 5.8];
  const getCardAnim = useCallback((idx: number) => {
    const start = cardStarts[idx] ?? 0.6 + idx * 0.4;
    return {
      opacity:    mr(darkInner, start, start + 0.45, 0, 1),
      translateY: mr(darkInner, start, start + 0.45, 72, 0),
      scale:      mr(darkInner, start, start + 0.45, 0.92, 1),
    };
  }, [darkInner]);

  const rows: [number, number][][] = [[[0,3],[1,2]], [[2,2],[3,2],[4,1]], [[5,3],[6,2]]];

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 35% at 50% 0%, rgba(124,92,255,0.07) 0%, transparent 65%)' }} />
      <div className="relative z-10 w-full h-full flex flex-col items-center px-5 pt-6 pb-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-2 px-3.5 py-1.5 rounded-full border border-[#EDEAFF]/12 bg-[#EDEAFF]/[0.04] font-mono text-[10px] tracking-[0.2em] uppercase text-[#EDEAFF]/50 flex-shrink-0"
          style={{ opacity: badgeOpacity, transform: `translateY(${badgeY}px)`, willChange: 'opacity, transform' }}>
          <span style={{ color: '#FF8A3D' }}>✦</span> Fundraising tools
        </div>
        <h2 className="text-[#EDEAFF] text-2xl md:text-3xl lg:text-[2.1rem] font-bold tracking-tight text-center leading-tight mb-4 max-w-2xl flex-shrink-0"
          style={{ transform: `scale(${headingScale})`, opacity: headingOpacity, transformOrigin: 'center top', willChange: 'transform, opacity' }}>
          {words.map((word, i) => {
            const ws = 0.05 + (i / words.length) * 0.45;
            return (
              <React.Fragment key={i}>
                <span style={{ opacity: mr(darkInner, ws, ws + 0.18, 0, 1), filter: `blur(${mr(darkInner, ws, ws + 0.18, 10, 0)}px)`, display: 'inline-block', willChange: 'opacity, filter' }}>{word}</span>
                {i !== words.length - 1 && ' '}
              </React.Fragment>
            );
          })}
        </h2>
        <div className="w-full max-w-7xl flex-1 flex flex-col gap-3 min-h-0">
          {rows.map((row, rowIdx) => {
            const flexValues = [3, 2.6, 2.4];
            return (
              <div key={rowIdx} className="grid grid-cols-5 gap-3" style={{ flex: flexValues[rowIdx], minHeight: 0 }}>
                {row.map(([cardIdx, colSpan]) => {
                  const anim = getCardAnim(cardIdx);
                  const card = DARK_CARDS[cardIdx];
                  return (
                    <div key={cardIdx} className={`col-span-${colSpan} h-full`}
                      style={{ opacity: anim.opacity, transform: `translateY(${anim.translateY}px) scale(${anim.scale})`, willChange: 'transform, opacity' }}>
                      <DarkCard {...card} height="100%" />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GlobeSectionContent() {
  const { ref, visible } = useIntersection(0.25);
  const words = "A truly global network of active investors".split(' ');
  return (
    <div ref={ref} className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center bg-black py-24 lg:py-28">
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.5 }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', top: `${(i*37)%100}%`, left: `${(i*53)%100}%`, width: (i%3)+0.5, height: (i%3)+0.5, borderRadius: '50%', background: '#EDEAFF', opacity: 0.25+(i%4)*0.1 }} />
        ))}
      </div>
      <div className="relative z-10 w-full flex flex-col items-center px-5 overflow-hidden">
        <div className="flex flex-col items-center gap-4 md:gap-5">
          <div className="flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border border-[#EDEAFF]/12 bg-[#EDEAFF]/[0.04] font-mono text-[10px] tracking-[0.2em] uppercase text-[#EDEAFF]/50 transition-all duration-700 ease-out"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0px)' : 'translateY(16px)', willChange: 'opacity, transform' }}>
            <span style={{ color: '#FF8A3D' }}>✦</span> Investor network
          </div>
          <h2 className="text-[#EDEAFF] text-3xl md:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-center leading-tight max-w-2xl transition-all duration-700 ease-out"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(1.3)', transitionDelay: '80ms', willChange: 'transform, opacity' }}>
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
          <p className="text-[#EDEAFF]/45 text-sm md:text-base text-center max-w-xl leading-relaxed transition-all duration-700 ease-out"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0px)' : 'translateY(14px)', transitionDelay: '420ms', willChange: 'opacity, transform' }}>
            Our network spans more than 160 regions, helping you reach the right investors wherever they're writing checks.
          </p>
        </div>
        <div className="w-full max-w-2xl xl:max-w-[860px] mt-6 md:mt-8 transition-all duration-700 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0px) scale(1)' : 'translateY(50px) scale(0.92)', transitionDelay: '550ms', willChange: 'transform, opacity' }}>
          <video src="/video2.mp4" autoPlay loop muted playsInline className="w-full h-auto max-h-[62vh] object-contain block rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function ContactSectionContent({ contactInner }: { contactInner: number }) {
  const glowTranslateY = mr(contactInner, 0.0, 1.3, 100, 0);
  const glowOpacity    = mr(contactInner, 0.0, 0.5, 0,   1);
  const glowBrightness = mr(contactInner, 0.4, 1.6, 0.55, 1);
  const headingScale   = mr(contactInner, 0.0, 0.5, 1.6, 1);
  const headingOpacity = mr(contactInner, 0.0, 0.35, 0, 1);
  const subOpacity     = mr(contactInner, 0.45, 0.8, 0, 1);
  const subY           = mr(contactInner, 0.45, 0.8, 14, 0);
  const btnOpacity     = mr(contactInner, 0.85, 1.2, 0, 1);
  const btnY           = mr(contactInner, 0.85, 1.2, 16, 0);
  const btnScale       = mr(contactInner, 0.85, 1.2, 0.92, 1);
  const words = "Talk to us about your raise".split(' ');

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      <div className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: '85%', opacity: glowOpacity, transform: `translateY(${glowTranslateY}%)`, filter: `brightness(${glowBrightness})`, willChange: 'opacity, transform, filter' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 95% at 50% 100%, rgba(255,150,70,0.85) 0%, rgba(220,100,40,0.55) 32%, rgba(140,60,20,0.22) 55%, transparent 76%)' }} />
        <div className="absolute inset-x-0 bottom-0" style={{ height: '60%', background: 'radial-gradient(ellipse 65% 100% at 50% 100%, rgba(255,180,100,0.9) 0%, rgba(255,130,55,0.6) 38%, transparent 78%)' }} />
        <div className="absolute inset-x-0 bottom-0" style={{ height: '30%', background: 'radial-gradient(ellipse 55% 100% at 50% 100%, rgba(255,250,240,0.95) 0%, rgba(255,200,140,0.7) 40%, transparent 80%)', filter: 'blur(2px)' }} />
      </div>
      <Starfield count={30} maxTop={70} />
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-5 pb-20">
        <h2 className="text-[#EDEAFF] text-3xl md:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-center leading-tight mb-4 max-w-2xl"
          style={{ transform: `scale(${headingScale})`, opacity: headingOpacity, transformOrigin: 'center center', willChange: 'transform, opacity' }}>
          {words.map((word, i) => {
            const ws = 0.02 + (i / words.length) * 0.35;
            return (
              <React.Fragment key={i}>
                <span style={{ opacity: mr(contactInner, ws, ws + 0.16, 0, 1), filter: `blur(${mr(contactInner, ws, ws + 0.16, 10, 0)}px)`, display: 'inline-block', willChange: 'opacity, filter' }}>{word}</span>
                {i !== words.length - 1 && ' '}
              </React.Fragment>
            );
          })}
        </h2>
        <p className="text-[#EDEAFF]/55 text-sm md:text-base text-center max-w-lg leading-relaxed mb-8"
          style={{ opacity: subOpacity, transform: `translateY(${subY}px)`, willChange: 'opacity, transform' }}>
          Get in touch, and we'll walk you through running your fundraise on our platform, from your first investor intro to a closed round.
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
// ─── Root ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [loading, setLoading]   = useState(true);
  const [stage, setStage]       = useState(0);
  const [scrollProgress, setScrollProgress]         = useState(0);
  const [contactScrollProgress, setContactScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const contactTrackRef = useRef<HTMLDivElement>(null);
  const footerTrackRef = useRef<HTMLDivElement>(null);
  const [hideHero, setHideHero] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 1900);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading) return;
    const timers: number[] = [];
    const s = (n: number, ms: number) => timers.push(window.setTimeout(() => setStage(n), ms));
    s(1,80); s(2,480); s(3,820); s(4,1150); s(5,1500); s(6,2200); s(7,2700);
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  useEffect(() => {
    const onScroll = () => {
      setScrollProgress(window.scrollY / window.innerHeight);
      const el = contactTrackRef.current;
      if (el) setContactScrollProgress(-el.getBoundingClientRect().top / window.innerHeight);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setHideHero(false);
      return;
    }
    const el = footerTrackRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHideHero(entry.isIntersecting),
      { threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile]);

  const whiteSlideProgress   = clamp((scrollProgress) / WHITE_SLIDE_END);
  const whitePanelTranslateY = (1 - whiteSlideProgress) * 100;
  const darkSlideProgress    = clamp((scrollProgress - DARK_SLIDE_START) / (DARK_SLIDE_END - DARK_SLIDE_START));
  const darkPanelTranslateY  = (1 - darkSlideProgress) * 100;
  const contactSlideProgress = clamp((contactScrollProgress - CONTACT_SLIDE_START) / (CONTACT_SLIDE_END - CONTACT_SLIDE_START));
  const contactPanelTranslateY = (1 - contactSlideProgress) * 100;
  const whiteInner   = scrollProgress - WHITE_SLIDE_END;
  const darkInner    = scrollProgress - DARK_SLIDE_END;
  const contactInner = contactScrollProgress - CONTACT_SLIDE_END + CONTACT_CONTENT_LEAD;

  const globalStyle = (
    <style jsx global>{`
      @media (prefers-reduced-motion: reduce) { * { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; } }
      @media (max-width: 767px) { html, body { overflow-x: hidden; max-width: 100vw; } }
    `}</style>
  );

  if (isMobile) {
    return (
      <div className="bg-[#070708] text-[#EDEAFF] selection:bg-[#7C5CFF] selection:text-black" style={{ overflowX: 'hidden', maxWidth: '100vw' }}>
        <Loader loading={loading} />
        <div className="relative z-10" style={{ overflowX: 'hidden' }}><Navbar /><MobileHeroSection stage={stage} /></div>
        <div className="relative z-10 bg-white" style={{ overflowX: 'hidden' }}><MobileWhiteSection /></div>
        <div className="relative z-10" style={{ background: '#08080C', overflowX: 'hidden' }}><MobileDarkSection /></div>
        <div className="relative z-10 bg-black" style={{ overflowX: 'hidden' }}><MobileGlobeSection /></div>
        <div className="relative z-10" style={{ background: '#050507', overflowX: 'hidden' }}><MobileContactSection /></div>
        <div
          className="relative z-[120] isolate w-full bg-black overflow-hidden shadow-[0_-20px_40px_rgba(0,0,0,0.05)]"
          style={{ minHeight: '100svh' }}
        >
          <Footer />
        </div>
        {globalStyle}
      </div>
    );
  }
  return (
    <div className="bg-[#070708] text-[#EDEAFF] selection:bg-[#7C5CFF] selection:text-black">
      <Loader loading={loading} />
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ display: hideHero ? 'none' : 'block' }}
      >
        <div className="pointer-events-auto relative z-50"><Navbar /></div>
        <div className="w-full h-screen overflow-hidden"><HeroSection stage={stage} /></div>
      </div>
      <div className="relative z-10" style={{ height: `${TOP_TOTAL_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
          <SlidingPanel zIndex={10} background="white" translateY={whitePanelTranslateY}
            showHandle={scrollProgress > 0.05 && scrollProgress < WHITE_SLIDE_END - 0.02}
            handleColor="#0A090D"
            style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.15)' }}>
            <WhiteSectionContent whiteInner={whiteInner} />
          </SlidingPanel>
          <SlidingPanel zIndex={20} background="#08080C" translateY={darkPanelTranslateY}
            showHandle={darkSlideProgress > 0.05 && darkSlideProgress < 0.98}
            style={{ boxShadow: '0 -12px 80px rgba(0,0,0,0.7)' }}>
            <DarkSectionContent darkInner={darkInner} />
          </SlidingPanel>
        </div>
      </div>
      <div className="relative z-10 bg-black min-h-screen w-full"><GlobeSectionContent /></div>
      <div ref={contactTrackRef} className="relative z-10 bg-black" style={{ height: `${CONTACT_TOTAL_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none bg-black">
          <SlidingPanel zIndex={40} background="#050507" translateY={contactPanelTranslateY}
            showHandle={contactSlideProgress > 0.05 && contactSlideProgress < 0.98}
            style={{ boxShadow: '0 -12px 80px rgba(0,0,0,0.7)' }}>
            <ContactSectionContent contactInner={contactInner} />
          </SlidingPanel>
        </div>
      </div>
      <div
        ref={footerTrackRef}
        className="relative z-[120] isolate w-full bg-black overflow-hidden shadow-[0_-20px_40px_rgba(0,0,0,0.05)]"
        style={{ minHeight: '100svh' }}
      >
        <Footer />
      </div>
      {globalStyle}
    </div>
  );
}
