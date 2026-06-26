'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);

  useEffect(() => {
    setIsLoginPage(pathname === '/admin/login');
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 40,
          }}
        />
      )}

      <AdminSidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, marginLeft: '220px' }}>
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main style={{ padding: '32px 28px' }}>{children}</main>
      </div>
    </div>
  );
}
