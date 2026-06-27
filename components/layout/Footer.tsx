'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/what-we-do', label: 'What we do' },
  { href: '/contact', label: 'Contact' },
  { href: '/forms', label: 'Apply' },
];

const resourceLinks = [
  { href: '/about', label: 'Our process' },
  { href: '/what-we-do', label: 'Services' },
  { href: '/contact', label: 'Get in touch' },
  { href: '/admin/login', label: 'Investor portal' },
];

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 9.5H5.67V18h2.67V9.5zM7 5.62a1.54 1.54 0 1 0 0 3.08 1.54 1.54 0 0 0 0-3.08zM18 18v-4.7c0-2.52-1.34-3.7-3.13-3.7-1.44 0-2.09.8-2.45 1.35V9.5h-2.66c.04.84 0 8.5 0 8.5h2.66v-4.74c0-.26.02-.52.1-.7.21-.52.7-1.07 1.5-1.07 1.07 0 1.5.81 1.5 2v4.51H18z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M18.9 2H22l-7.2 8.2L23 22h-6.6l-5.2-6.8L5 22H2l7.7-8.8L1 2h6.7l4.7 6.2L18.9 2zm-2.3 18h1.8L7.5 4H5.6l11 16z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.93.68 1.88v2.78c0 .27.18.58.69.48A10 10 0 0 0 12 2z" fill="currentColor"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <footer className="relative z-[1] isolate w-full shrink-0 overflow-hidden border-t border-neutral-900 bg-black">
      {/* Ambient top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(124,92,255,0.5) 50%, transparent 100%)',
        }}
      />

      <div className="max-w-300 mx-auto px-6 md:px-15 pt-20 pb-10">
        {/* ── Top: brand + newsletter ── */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 pb-14 border-b border-neutral-900">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center no-underline">
              <img src="/assets/logo.png" alt="Logo" width={72} height={72} />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-neutral-500 font-light">
              Engineering the bridge between raw ideas and institutional capital.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full max-w-sm">
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
              Stay in the loop
            </p>
            <p className="text-sm text-neutral-500 font-light mb-4">
              Occasional updates on what we&apos;re building. No noise, unsubscribe anytime.
            </p>
            {submitted ? (
              <div className="text-sm text-white border border-neutral-800 rounded-lg px-4 py-3">
                You&apos;re on the list. Thanks for subscribing.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 bg-transparent border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold tracking-wide hover:bg-neutral-200 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Middle: link columns ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 py-14 border-b border-neutral-900">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
              Navigate
            </p>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-neutral-500 no-underline hover:text-white transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
              Resources
            </p>
            <div className="flex flex-col gap-3">
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-neutral-500 no-underline hover:text-white transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
              Contact
            </p>
            <div className="flex flex-col gap-3 text-sm text-neutral-500 font-medium">
              <a href="mailto:hello@pitchstudio.com" className="hover:text-white transition-colors no-underline">
                hello@pitchstudio.com
              </a>
              <a href="tel:+10000000000" className="hover:text-white transition-colors no-underline">
                +1 (000) 000-0000
              </a>
              <span className="text-neutral-600">San Francisco, CA</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
              Status
            </p>
            <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              All systems operational
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="text-[10px] tracking-[0.25em] uppercase text-neutral-600">
              End of transmission
            </div>
            <div className="text-sm font-semibold text-neutral-400">
              &copy; 2026 PITCH_STUDIO. All rights reserved.
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-600 font-medium">
            <Link href="/privacy" className="no-underline hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="no-underline hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
