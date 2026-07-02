'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: 'STUDIO',
    value: '452 Bowery Street, New York, NY 10012',
    href: 'https://maps.google.com/?q=452+Bowery+Street+New+York+NY',
  },
  {
    icon: Mail,
    label: 'EMAIL',
    value: 'hello@bigrip.com',
    href: 'mailto:hello@bigrip.com',
  },
  {
    icon: Phone,
    label: 'PHONE',
    value: '+1 (212) 555-0173',
    href: 'tel:+12125550173',
  },
];

const wordVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const wordChild: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

function AnimatedHeading({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <motion.h1
      variants={wordVariants}
      initial="hidden"
      animate="visible"
      className="font-extrabold leading-tight tracking-tighter mb-10 flex flex-wrap"
      style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)' }}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden mr-3 sm:mr-4 pb-1">
          <motion.span variants={wordChild} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

type Particle = {
  x: number;
  y: number;
  r: number;
  speedY: number;
  drift: number;
  phase: number;
  baseOpacity: number;
};

function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const resizeRafRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let isMobile = window.innerWidth < 768;
    let dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
    let particles: Particle[] = [];
    let running = true;

    const getParticleCount = () => (isMobile ? 16 : 42);

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      isMobile = width < 768;
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      const count = getParticleCount();
      particles = Array.from({ length: count }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.4,
        speedY: Math.random() * 0.16 + 0.05,
        drift: Math.random() * 0.4 - 0.2,
        phase: Math.random() * Math.PI * 2,
        baseOpacity: Math.random() * 0.3 + 0.12,
      }));
    };

    const draw = (time: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        const twinkle = 0.5 + 0.5 * Math.sin(time * 0.0006 + p.phase);
        const opacity = p.baseOpacity * (0.6 + 0.4 * twinkle);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();

        p.y -= p.speedY;
        p.x += p.drift * 0.3;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    const start = () => {
      if (rafRef.current) return;
      running = true;
      rafRef.current = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    resize();
    initParticles();
    start();

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const handleResize = () => {
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        resize();
        initParticles();
      });
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
    };
  }, [reduceMotion]);

  const orbTransition = (duration: number, delay = 0) =>
    reduceMotion
      ? { duration: 0 }
      : { duration, repeat: Infinity, ease: 'easeInOut' as const, delay };

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ contain: 'layout paint', transform: 'translateZ(0)' }}
    >
      <motion.div
        className="absolute -top-40 -left-40 w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] rounded-full will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(32px)',
          mixBlendMode: 'screen',
        }}
        animate={
          reduceMotion
            ? {}
            : { x: [0, 60, -20, 0], y: [0, 40, 80, 0], scale: [1, 1.15, 0.95, 1] }
        }
        transition={orbTransition(22)}
      />
      <motion.div
        className="absolute bottom-[-160px] right-[-120px] w-[380px] h-[380px] sm:w-[600px] sm:h-[600px] rounded-full will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(38px)',
          mixBlendMode: 'screen',
        }}
        animate={
          reduceMotion
            ? {}
            : { x: [0, -50, 30, 0], y: [0, -60, -20, 0], scale: [1, 0.9, 1.1, 1] }
        }
        transition={orbTransition(26, 2)}
      />
      <motion.div
        className="hidden sm:block absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(40px)',
          mixBlendMode: 'screen',
        }}
        animate={reduceMotion ? {} : { x: [0, -40, 20, 0], y: [0, 30, -30, 0] }}
        transition={orbTransition(30, 4)}
      />

      {!reduceMotion && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  );
}

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 1400);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
              fastScrollEnd: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.reveal-card').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              once: true,
              fastScrollEnd: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-black text-white min-h-screen overflow-hidden relative"
    >
      <AmbientBackground />
      <Navbar />

      <section className="px-6 sm:px-10 lg:px-15 pt-28 sm:pt-32 lg:pt-40 pb-14 sm:pb-16 lg:pb-20 relative z-1">
        <div className="hidden sm:flex pointer-events-none absolute inset-0 items-center justify-center overflow-hidden select-none">
          <span
            className="font-black text-white/[0.03] tracking-tighter whitespace-nowrap"
            style={{ fontSize: 'clamp(8rem, 22vw, 20rem)' }}
          >
            CONTACT
          </span>
        </div>
        <div className="max-w-200 mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[0.7rem] text-neutral-500 tracking-widest mb-5 font-semibold"
          >
            CONTACT
          </motion.div>
          <AnimatedHeading text="Get In Touch" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="max-w-150 text-base sm:text-lg leading-relaxed opacity-70 font-light"
          >
            Have a question about the platform? Want to partner with us? Drop us a message and our team will respond within 24 hours.
          </motion.p>
        </div>
      </section>

      <section className="px-6 sm:px-10 lg:px-15 pb-14 sm:pb-16 lg:pb-20 relative z-1">
        <div className="max-w-200 mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="reveal-card group border border-white/10 rounded-lg p-6 sm:p-8 flex flex-col gap-4 bg-white/[0.02] hover:border-white/30 transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <Icon size={20} className="text-neutral-400 group-hover:text-white transition-colors duration-300" />
                <ArrowUpRight
                  size={16}
                  className="text-neutral-600 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>
              <div>
                <div className="text-[0.65rem] text-neutral-500 tracking-widest font-semibold mb-2">
                  {label}
                </div>
                <div className="text-base font-medium leading-snug">{value}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="px-6 sm:px-10 lg:px-15 pb-20 sm:pb-24 lg:pb-30 relative z-1">
        <div className="max-w-200 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-start">
          <div className="reveal-up">
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="py-16 sm:py-20 flex flex-col items-center text-center"
                >
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <motion.circle
                      cx="28"
                      cy="28"
                      r="26"
                      stroke="white"
                      strokeWidth="1.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                    <motion.path
                      d="M17 28.5L24.5 36L39 20"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.6, ease: 'easeInOut' }}
                    />
                  </svg>
                  <h2 className="text-2xl font-bold mt-6 mb-3">MESSAGE SENT</h2>
                  <p className="opacity-60 font-light">We&apos;ll be in touch within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field
                      label="NAME"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                    />
                    <Field
                      label="EMAIL"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                  </div>
                  <Field
                    label="SUBJECT"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                  />
                  <Field
                    label="MESSAGE"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us more..."
                    textarea
                  />
                  <motion.button
                    type="submit"
                    disabled={status === 'sending'}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-2 self-start bg-white text-black px-8 py-3.5 font-bold border-none rounded cursor-pointer text-sm tracking-wider disabled:opacity-60"
                  >
                    {status === 'sending' ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full inline-block"
                        />
                        SENDING...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        SEND MESSAGE
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="reveal-up relative rounded-lg overflow-hidden border border-white/10 h-72 sm:h-96 lg:h-full lg:min-h-125">
            <iframe
              title="Studio location"
              src="https://maps.google.com/maps?q=452+Bowery+Street+New+York+NY&z=15&output=embed"
              className="w-full h-full grayscale invert-[.92] contrast-125 opacity-90"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-lg" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  textarea = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-neutral-500 mb-2 font-medium tracking-wide">
        {label}
      </label>
      <div className="relative">
        {textarea ? (
          <textarea
            required
            name={name}
            value={value}
            onChange={onChange}
            rows={5}
            className="form-input peer resize-y w-full"
            placeholder={placeholder}
          />
        ) : (
          <input
            required
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="form-input peer w-full"
            placeholder={placeholder}
          />
        )}
        <span className="absolute left-0 -bottom-[1px] h-[1.5px] w-full bg-white scale-x-0 peer-focus:scale-x-100 origin-left transition-transform duration-300 pointer-events-none" />
      </div>
    </div>
  );
}