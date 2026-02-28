'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    List,
    Star,
    LogOut,
    Menu,
    X,
    Command,
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

const navItems = [
    { href: '/admin', label: 'DASHBOARD', icon: <LayoutDashboard size={16} /> },
    { href: '/admin/submissions', label: 'SUBMISSIONS', icon: <List size={16} /> },
    { href: '/admin/selected', label: 'SELECTED', icon: <Star size={16} /> },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoginPage, setIsLoginPage] = useState(false);

    useEffect(() => {
        setIsLoginPage(pathname === '/admin/login');
    }, [pathname]);

    const handleLogout = async () => {
        const sb = getSupabase();
        await sb.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
            {/* Mobile overlay */}
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

            {/* Sidebar */}
            <aside
                style={{
                    width: '220px',
                    background: '#000',
                    borderRight: '1px solid #111',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    top: 0,
                    left: sidebarOpen ? 0 : undefined,
                    bottom: 0,
                    zIndex: 50,
                    transition: 'transform 0.3s ease',
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        padding: '28px 20px',
                        borderBottom: '1px solid #111',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Link
                        href="/admin"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            textDecoration: 'none',
                            color: '#fff',
                        }}
                    >
                        <Command size={18} style={{ color: '#fff' }} />
                        <span
                            style={{
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                            }}
                        >
                            <Image src="/assets/logo.png" alt="Logo" width={100} height={30} />
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#555',
                            cursor: 'pointer',
                            display: 'none',
                        }}
                        className="mobile-close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '20px 12px' }}>
                    <div
                        style={{
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            color: '#333',
                            padding: '4px 12px',
                            marginBottom: '8px',
                        }}
                    >
                        NAVIGATION
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 12px',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    fontSize: '0.75rem',
                                    fontWeight: isActive ? 600 : 400,
                                    letterSpacing: '0.08em',
                                    color: isActive ? '#fff' : '#555',
                                    background: isActive ? '#111' : 'transparent',
                                    marginBottom: '2px',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div
                    style={{
                        padding: '16px 12px',
                        borderTop: '1px solid #111',
                    }}
                >
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            width: '100%',
                            background: 'none',
                            border: 'none',
                            color: '#555',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            letterSpacing: '0.08em',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <LogOut size={16} />
                        LOGOUT
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{ flex: 1, marginLeft: '220px' }}>
                {/* Top bar */}
                <header
                    style={{
                        padding: '14px 28px',
                        borderBottom: '1px solid #111',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#000',
                    }}
                >
                    <button
                        onClick={() => setSidebarOpen(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#555',
                            cursor: 'pointer',
                            display: 'none',
                        }}
                        className="mobile-menu"
                    >
                        <Menu size={20} />
                    </button>
                    <div style={{ fontSize: '0.7rem', color: '#333', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        ADMIN PANEL
                    </div>
                    <div
                        style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: '1px solid #222',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: '#fff',
                        }}
                    >
                        A
                    </div>
                </header>

                {/* Page content */}
                <main style={{ padding: '32px 28px' }}>{children}</main>
            </div>
        </div>
    );
}
