'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/what-we-do', label: 'WHAT WE DO' },
  { href: '/contact', label: 'CONTACT' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-100 flex items-center justify-between px-10 py-5 backdrop-blur bg-black/50">
      <Link href="/" className="flex items-center no-underline">
        <img src="/assets/logo.png" alt="Logo" width={80} height={80} />
      </Link>

      <div className="flex items-center gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs tracking-wider no-underline pb-1 transition-all duration-200 ${
                isActive ? 'text-white font-bold border-b border-white' : 'text-neutral-500 font-medium border-b border-transparent'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <Link href="/admin/login" className="ml-3 text-xs tracking-wider border border-white px-5 py-2 rounded no-underline text-white font-semibold">
          INVESTOR AUTH
        </Link>
      </div>
    </nav>
  );
}
