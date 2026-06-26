import React from 'react';
import Link from 'next/link';

const footerLinks = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/what-we-do', label: 'WHAT WE DO' },
  { href: '/contact', label: 'CONTACT' },
  { href: '/forms', label: 'APPLY' },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-900 px-15 pt-20 pb-10 relative z-1">
      <div className="max-w-300 mx-auto flex justify-between flex-wrap gap-10">
        <div>
          <img src="/assets/logo.png" alt="Logo" width={80} height={80} />
          <p className="mt-3 text-sm opacity-50 max-w-75 font-light">
            Engineering the bridge between raw ideas and institutional capital.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-500 no-underline hover:text-white transition-colors font-medium tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-15 pt-5 border-t border-neutral-900 text-center">
        <div className="text-xs opacity-30 mb-2 tracking-widest">END OF TRANSMISSION</div>
        <div className="text-sm font-semibold opacity-50">&copy; 2026 PITCH_STUDIO | ALL RIGHTS RESERVED</div>
      </div>
    </footer>
  );
}
