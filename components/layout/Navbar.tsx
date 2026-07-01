'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/what-we-do', label: 'WHAT WE DO' },
  { href: '/contact', label: 'CONTACT' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-6 md:px-10 py-2 bg-transparent backdrop-blur-0">
        {/* Logo */}
        <Link href="/" className="flex items-center no-underline pr-4" onClick={() => setMenuOpen(false)}>
          <img src="/assets/logo.png" alt="Logo" width={70} height={70} className="md:w-[80px] md:h-[80px] object-contain" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-wider no-underline pb-1 text-neutral-500 font-medium border-b border-transparent hover:text-white transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="ml-3 text-xs tracking-wider border border-white px-5 py-2 rounded no-underline text-white font-semibold hover:bg-white hover:text-black transition-all duration-200"
          >
            INVESTOR AUTH
          </Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {/* Three bars that animate into an X */}
          <span
            className="block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center"
            style={{
              transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="block w-6 h-[1.5px] bg-white transition-all duration-300"
            style={{
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)',
            }}
          />
          <span
            className="block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center"
            style={{
              transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* Mobile dropdown overlay */}
      <div
        className="md:hidden fixed inset-0 z-[99] flex flex-col"
        style={{
          background: 'rgba(7, 7, 8, 0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          pointerEvents: menuOpen ? 'all' : 'none',
          opacity: menuOpen ? 1 : 0,
          transition: 'opacity 0.25s ease',
          // Push it below the navbar height (navbar is ~62px on mobile)
          top: 62,
        }}
      >
        {/* Nav links — stacked vertically, centered */}
        <div className="flex flex-col items-center justify-center flex-1 gap-8 pb-20">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="no-underline"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.3s ease ${0.06 * i}s, transform 0.3s ease ${0.06 * i}s`,
              }}
            >
              <span className="text-[1.6rem] font-bold tracking-widest text-neutral-500 transition-colors duration-200">
                {link.label}
              </span>
            </Link>
          ))}

          {/* Divider */}
          <div
            className="w-12 h-px bg-white/10"
            style={{
              opacity: menuOpen ? 1 : 0,
              transition: `opacity 0.3s ease 0.28s`,
            }}
          />

          {/* Investor auth CTA */}
          <Link
            href="/admin/login"
            onClick={() => setMenuOpen(false)}
            className="no-underline"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.3s ease 0.32s, transform 0.3s ease 0.32s`,
            }}
          >
            <span className="inline-block text-xs tracking-[0.2em] border border-white/40 px-7 py-3 rounded text-white font-semibold">
              INVESTOR AUTH
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
