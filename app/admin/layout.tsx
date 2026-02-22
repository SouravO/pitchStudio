'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Rocket,
    LayoutDashboard,
    List,
    Star,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: '/admin/submissions', label: 'All Submissions', icon: <List size={18} /> },
    { href: '/admin/selected', label: 'Selected', icon: <Star size={18} /> },
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

    // Don't show sidebar on login page
    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 40,
                        display: 'none',
                    }}
                    className="mobile-overlay"
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    width: '260px',
                    background: 'var(--background-card)',
                    borderRight: '1px solid var(--border-color)',
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
                        padding: '24px 20px',
                        borderBottom: '1px solid var(--border-color)',
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
                            gap: '10px',
                            textDecoration: 'none',
                            color: 'var(--foreground)',
                        }}
                    >
                        <Rocket size={24} style={{ color: 'var(--brand-primary-light)' }} />
                        <span
                            className="gradient-text"
                            style={{ fontSize: '1.15rem', fontWeight: 700 }}
                        >
                            Pitch Studio
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--foreground-muted)',
                            cursor: 'pointer',
                            display: 'none',
                        }}
                        className="mobile-close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '16px 12px' }}>
                    <div
                        style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--foreground-dimmed)',
                            padding: '8px 12px',
                            marginBottom: '4px',
                        }}
                    >
                        Navigation
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
                                    borderRadius: 'var(--radius-md)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive
                                        ? 'var(--brand-primary-light)'
                                        : 'var(--foreground-muted)',
                                    background: isActive
                                        ? 'rgba(99, 102, 241, 0.1)'
                                        : 'transparent',
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
                        borderTop: '1px solid var(--border-color)',
                    }}
                >
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: 'var(--radius-md)',
                            width: '100%',
                            background: 'none',
                            border: 'none',
                            color: 'var(--foreground-muted)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{ flex: 1, marginLeft: '260px' }}>
                {/* Top bar for mobile */}
                <header
                    style={{
                        padding: '16px 24px',
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--background-card)',
                    }}
                >
                    <button
                        onClick={() => setSidebarOpen(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--foreground-muted)',
                            cursor: 'pointer',
                            display: 'none',
                        }}
                        className="mobile-menu"
                    >
                        <Menu size={22} />
                    </button>
                    <div style={{ fontSize: '0.85rem', color: 'var(--foreground-dimmed)' }}>
                        Admin Panel
                    </div>
                    <div
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--gradient-brand)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 600,
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
