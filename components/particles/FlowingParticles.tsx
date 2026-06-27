'use client';

import { useRef, useEffect, useState } from 'react';
import { generateTextShape, generateBuildingShape, generateNetworkShape, generatePhoneShape, Point } from '@/utils/particleShapes';
import { homeSections } from '@/config/homeSections';

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  r: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  hue: number;
}

interface FlowingParticlesProps {
  sectionRefs: React.RefObject<(HTMLElement | null)[]>;
}

export default function FlowingParticles({ sectionRefs }: FlowingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const formationsRef = useRef<Point[][]>([]);
  const rafIdRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let W = window.innerWidth;
    let H = document.documentElement.scrollHeight;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas) return;
      W = window.innerWidth;
      H = document.documentElement.scrollHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      generateFormations();
    }

    function generateFormations() {
      const sections = sectionRefs.current;
      if (!sections) return;

      formationsRef.current = [];

      sections.forEach((section, idx) => {
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const sectionConfig = homeSections[idx];
        const isLeft = sectionConfig.alignment === 'left';
        
        // Position particles in 40% column with responsive adjustments
        const isMobile = W < 1024;
        const centerX = isMobile ? W / 2 : (isLeft ? W * 0.75 : W * 0.25);
        const centerY = rect.top + window.scrollY + rect.height / 2;

        let points: Point[] = [];

        switch (sectionConfig.shapeType) {
          case 'text':
            points = generateTextShape('PITCH\nSTUDIO', centerX, centerY, Math.min(400, W * 0.8), 300);
            break;
          case 'building':
            points = generateBuildingShape(centerX, centerY, isMobile ? 0.8 : 1.2);
            break;
          case 'network':
            points = generateNetworkShape(centerX, centerY, isMobile ? 0.8 : 1.2);
            break;
          case 'phone':
            points = generatePhoneShape(centerX, centerY, isMobile ? 0.8 : 1.2);
            break;
        }

        formationsRef.current.push(points);
      });

      initParticles();
    }

    function initParticles() {
      if (formationsRef.current.length === 0) return;

      const firstFormation = formationsRef.current[0];
      
      // Fade in animation on init
      if (particlesRef.current.length === 0) {
        particlesRef.current = firstFormation.map((point) => {
          const hue = 190 + Math.random() * 50;
          return {
            x: point.x,
            y: point.y,
            tx: point.x,
            ty: point.y,
            r: 1 + Math.random() * 1,
            alpha: 0,
            baseAlpha: 0.3 + Math.random() * 0.2, // More subtle
            hue,
            color: `hsl(${hue}, ${70 + Math.random() * 20}%, ${60 + Math.random() * 25}%)`,
          };
        });
        
        // Staggered fade in
        particlesRef.current.forEach((p, i) => {
          setTimeout(() => {
            p.alpha = p.baseAlpha;
          }, i * 0.3);
        });
      }
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function bezierPoint(p0: Point, p1: Point, t: number): Point {
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const curvature = 0.35;
      
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      const cpX = midX - dy * curvature * (dist / 300);
      const cpY = midY + dx * curvature * (dist / 300);

      const mt = 1 - t;
      return {
        x: mt * mt * p0.x + 2 * mt * t * cpX + t * t * p1.x,
        y: mt * mt * p0.y + 2 * mt * t * cpY + t * t * p1.y,
      };
    }

    function updateParticles(deltaTime: number) {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const sections = sectionRefs.current;
      
      if (!sections) return;

      let activeSectionIdx = 0;
      let transitionProgress = 0;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section) continue;

        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const sectionBottom = sectionTop + rect.height;

        if (scrollY + viewportHeight / 2 >= sectionTop && scrollY + viewportHeight / 2 < sectionBottom) {
          activeSectionIdx = i;
          const sectionProgress = (scrollY + viewportHeight / 2 - sectionTop) / rect.height;
          
          if (i < sections.length - 1 && sectionProgress > 0.5) {
            transitionProgress = (sectionProgress - 0.5) / 0.5;
          }
          break;
        }
      }

      const currentFormation = formationsRef.current[activeSectionIdx];
      const nextFormation = formationsRef.current[activeSectionIdx + 1];

      if (!currentFormation) return;

      particlesRef.current.forEach((particle, i) => {
        const targetPoint = currentFormation[i % currentFormation.length];
        
        if (transitionProgress > 0 && nextFormation) {
          const nextPoint = nextFormation[i % nextFormation.length];
          
          if (transitionProgress < 0.5) {
            // Burst outward - smoother
            const burstProgress = transitionProgress / 0.5;
            const burstEase = burstProgress * burstProgress * (3 - 2 * burstProgress); // Smoother ease
            const angle = (i / particlesRef.current.length) * Math.PI * 2;
            const burstDist = 120 * burstEase; // Reduced distance
            
            particle.x = targetPoint.x + Math.cos(angle) * burstDist;
            particle.y = targetPoint.y + Math.sin(angle) * burstDist;
            particle.alpha = particle.baseAlpha * (1 - burstEase * 0.6);
            
          } else {
            // Join at next section - smoother
            const joinProgress = (transitionProgress - 0.5) / 0.5;
            const joinEase = joinProgress * joinProgress * (3 - 2 * joinProgress);
            
            particle.x = targetPoint.x + Math.cos((i / particlesRef.current.length) * Math.PI * 2) * 120 * (1 - joinEase) 
                         + (nextPoint.x - targetPoint.x) * joinEase;
            particle.y = targetPoint.y + Math.sin((i / particlesRef.current.length) * Math.PI * 2) * 120 * (1 - joinEase)
                         + (nextPoint.y - targetPoint.y) * joinEase;
            particle.alpha = particle.baseAlpha * (0.4 + joinEase * 0.6);
          }
        } else {
          particle.x = targetPoint.x;
          particle.y = targetPoint.y;
          particle.alpha = particle.baseAlpha;
        }

        // Viewport fade
        const screenY = particle.y - scrollY;
        const distFromCenter = Math.abs(screenY - viewportHeight / 2);
        const fadeStart = viewportHeight * 0.45;
        const fadeEnd = viewportHeight * 0.7;
        
        if (distFromCenter > fadeStart) {
          particle.alpha *= Math.max(0, 1 - (distFromCenter - fadeStart) / (fadeEnd - fadeStart));
        }
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      
      particlesRef.current.forEach((particle) => {
        if (particle.alpha < 0.01) return;
        
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        
        // Subtle glow
        ctx.shadowBlur = particle.r * 3;
        ctx.shadowColor = particle.color;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    function animate(currentTime: number) {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      updateParticles(deltaTime);
      draw();
      rafIdRef.current = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    
    setTimeout(() => {
      generateFormations();
      setMounted(true);
      lastTimeRef.current = performance.now();
      animate(lastTimeRef.current);
    }, 100);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [sectionRefs]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none z-10" />
      {mounted && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
          <p className="text-white/30 text-xs tracking-[0.2em] uppercase">Scroll to explore</p>
        </div>
      )}
    </>
  );
}
