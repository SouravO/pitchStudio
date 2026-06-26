'use client';

import { useRef, useEffect } from 'react';

interface ParticleHeroProps {
  scrollRef: React.RefObject<number>;
}

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  ox: number;
  oy: number;
  bx: number;
  by: number;
  alpha: number;
  r: number;
  color: string;
}

export default function ParticleHero({ scrollRef }: ParticleHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const root = rootRef.current!;
    const hint = hintRef.current;
    const sub = subRef.current;

    const ctx = canvas.getContext('2d')!;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let textPixels: { x: number; y: number }[] = [];
    let currentBurst = 0;
    let rafId = 0;
    let prevScroll = -1;

    const PARTICLE_SPACING = 4;
    const PARTICLE_R = 1.5;
    const TEXT_SCALE = 0.9;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      const rect = root.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sampleText();
      createParticles();
      snapToText();
      drawFrame();
    }

    function sampleText() {
      textPixels = [];
      const offscreen = document.createElement('canvas');
      offscreen.width = W;
      offscreen.height = H;
      const oc = offscreen.getContext('2d')!;
      const fontFamily = getComputedStyle(document.body).fontFamily;
      const fs = Math.min(W / 5.2, 88) * TEXT_SCALE;
      oc.fillStyle = '#fff';
      oc.font = `500 ${fs}px ${fontFamily}`;
      oc.textAlign = 'center';
      oc.textBaseline = 'middle';
      oc.fillText('PITCH', W / 2, H / 2 - fs * 0.62);
      oc.fillText('STUDIO', W / 2, H / 2 + fs * 0.62);
      const data = oc.getImageData(0, 0, W, H).data;
      for (let y = 0; y < H; y += PARTICLE_SPACING) {
        for (let x = 0; x < W; x += PARTICLE_SPACING) {
          const i = (y * W + x) * 4;
          if (data[i + 3] > 120) textPixels.push({ x, y });
        }
      }
    }

    function createParticles() {
      particles = textPixels.map((tp) => ({
        x: tp.x + (Math.random() - 0.5) * 2,
        y: tp.y + (Math.random() - 0.5) * 2,
        tx: tp.x,
        ty: tp.y,
        ox: tp.x,
        oy: tp.y,
        bx: (Math.random() - 0.5) * W * 2.4,
        by: (Math.random() - 0.5) * H * 2.4 + H * 0.5,
        alpha: 1,
        r: PARTICLE_R + Math.random() * 0.7,
        color: `hsl(${200 + Math.random() * 30},${60 + Math.random() * 30}%,${75 + Math.random() * 20}%)`,
      }));
    }

    function snapToText() {
      for (const p of particles) {
        p.x = p.tx;
        p.y = p.ty;
        p.alpha = 1;
      }
    }

    function drawFrame() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
      ctx.globalAlpha = 1;
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function easeInOutQuad(t: number) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function updateBurst(prog: number) {
      const ease = easeInOutQuad(prog);
      for (const p of particles) {
        p.x = lerp(p.ox, p.ox + p.bx * 1.6, ease);
        p.y = lerp(p.oy, p.oy + p.by * 1.6, ease);
        p.alpha = 1 - ease * 0.98;
      }
      if (sub) sub.style.color = `rgba(255,255,255,${ease * 0.75})`;
      if (hint) hint.style.opacity = String(1 - ease);
    }

    function snapReturn() {
      for (const p of particles) {
        p.x = p.tx;
        p.y = p.ty;
        p.alpha = 1;
      }
      if (sub) sub.style.color = 'rgba(255,255,255,0)';
      if (hint) hint.style.opacity = '1';
    }

    function loop() {
      const raw = scrollRef.current;
      const mapped = Math.min(1, raw / 0.3);
      const diff = mapped - currentBurst;

      if (Math.abs(diff) > 0.0001) {
        currentBurst += diff * 0.12;
        if (Math.abs(diff) < 0.001) currentBurst = mapped;

        if (currentBurst > 0.01) {
          updateBurst(Math.min(currentBurst, 1));
        } else {
          snapReturn();
        }
        drawFrame();
      }

      rafId = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [scrollRef]);

  return (
    <div ref={rootRef} className="relative w-full h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <p
        ref={hintRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/35 text-xs tracking-[0.15em] pointer-events-none transition-opacity duration-400"
      >
        scroll to burst
      </p>
      <p
        ref={subRef}
        className="absolute bottom-0 left-0 w-full text-center pb-7 pt-7 text-white/0 text-xs tracking-[0.25em] pointer-events-none transition-colors duration-800"
      >
        WHERE FOUNDERS MEET CAPITAL
      </p>
    </div>
  );
}
