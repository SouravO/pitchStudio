'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  List,
  Star,
  LogOut,
  X,
  Command,
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

const navItems = [
  { href: '/admin', label: 'DASHBOARD', icon: <LayoutDashboard size={16} /> },
  { href: '/admin/submissions', label: 'SUBMISSIONS', icon: <List size={16} /> },
  { href: '/admin/selected', label: 'SELECTED', icon: <Star size={16} /> },
];

export default function AdminSidebar({ sidebarOpen, onClose }: { sidebarOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const sb = getSupabase();
    await sb.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside
      className={`w-55 bg-black border-r border-neutral-900 flex flex-col fixed top-0 bottom-0 z-50 transition-transform duration-300`}
      style={{ left: sidebarOpen ? 0 : undefined }}
    >
      <div className="px-5 py-7 border-b border-neutral-900 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 no-underline text-white">
          <Command size={18} className="text-white" />
          <span className="text-sm font-bold tracking-wider uppercase">
            <Image src="/assets/logo.png" alt="Logo" width={100} height={30} />
          </span>
        </Link>
        <button onClick={onClose} className="bg-none border-none text-neutral-600 cursor-pointer hidden mobile-close">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5">
        <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-neutral-800 px-3 pb-1 mb-2">
          NAVIGATION
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md no-underline text-xs tracking-wide mb-0.5 transition-all duration-200 ${
                isActive ? 'text-white bg-neutral-900 font-semibold' : 'text-neutral-600 bg-transparent font-normal'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-neutral-900">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-md w-full bg-none border-none text-neutral-600 cursor-pointer text-xs tracking-wide transition-all duration-200"
        >
          <LogOut size={16} />
          LOGOUT
        </button>
      </div>
    </aside>
  );
}
