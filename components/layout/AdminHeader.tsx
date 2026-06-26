'use client';

import React from 'react';
import { Menu } from 'lucide-react';

export default function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="px-7 py-3.5 border-b border-neutral-900 flex items-center justify-between bg-black">
      <button onClick={onMenuClick} className="bg-none border-none text-neutral-600 cursor-pointer hidden mobile-menu">
        <Menu size={20} />
      </button>
      <div className="text-[0.7rem] text-neutral-800 tracking-wider uppercase">ADMIN PANEL</div>
      <div className="w-7 h-7 rounded-full border border-neutral-800 flex items-center justify-center text-[0.7rem] font-semibold text-white">
        A
      </div>
    </header>
  );
}
