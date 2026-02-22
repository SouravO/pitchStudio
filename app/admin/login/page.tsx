'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, LogIn, Loader2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSupabase } from '@/lib/supabase';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast.error('Please enter both email and password');
            return;
        }

        setIsLoading(true);
        try {
            const sb = getSupabase();
            const { error } = await sb.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(error.message);
                return;
            }

            toast.success('Welcome back! Redirecting...');
            router.push('/admin');
            router.refresh();
        } catch {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--gradient-hero)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
        >
            <div
                className="glass-card animate-fade-in-up"
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: '48px 40px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Top gradient line */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--gradient-brand)',
                    }}
                />

                {/* Logo */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '32px',
                    }}
                >
                    <Rocket size={28} style={{ color: 'var(--brand-primary-light)' }} />
                    <span
                        className="gradient-text"
                        style={{ fontSize: '1.4rem', fontWeight: 700 }}
                    >
                        Pitch Studio
                    </span>
                </div>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(99, 102, 241, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}
                    >
                        <Shield size={28} style={{ color: 'var(--brand-primary-light)' }} />
                    </div>
                    <h1
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            marginBottom: '8px',
                        }}
                    >
                        Investor Portal
                    </h1>
                    <p
                        style={{
                            color: 'var(--foreground-muted)',
                            fontSize: '0.9rem',
                        }}
                    >
                        Sign in to access the admin dashboard
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="admin@pitchstudio.com"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary"
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn size={18} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
