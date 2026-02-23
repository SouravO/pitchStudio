'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command, LogIn, Loader2, Shield } from 'lucide-react';
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
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative',
            }}
        >
            {/* Subtle grid background */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundImage: 'radial-gradient(circle at 1px 1px, #111 1px, transparent 0)',
                backgroundSize: '40px 40px',
                opacity: 0.4,
            }} />

            <div
                className="animate-fade-in-up"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '48px',
                    }}
                >
                    {/* <Command size={20} style={{ color: '#fff' }} /> */}
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', color: '#fff' }}>
                       <img src="/assets/logo.png" alt="Logo" width={100} height={100} />
                    </span>
                </div>

                {/* Card */}
                <div
                    style={{
                        background: '#0a0a0a',
                        border: '1px solid #111',
                        borderRadius: '12px',
                        padding: '40px 36px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Top accent line */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, #333, transparent)',
                        }}
                    />

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '10px',
                                background: '#111',
                                border: '1px solid #222',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                            }}
                        >
                            <Shield size={24} style={{ color: '#fff' }} />
                        </div>
                        <h1
                            style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                marginBottom: '6px',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                            }}
                        >
                            INVESTOR PORTAL
                        </h1>
                        <p
                            style={{
                                color: '#555',
                                fontSize: '0.8rem',
                            }}
                        >
                            Sign in to access the admin dashboard
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '16px' }}>
                            <label
                                htmlFor="email"
                                style={{
                                    display: 'block',
                                    fontSize: '0.7rem',
                                    fontWeight: 500,
                                    color: '#555',
                                    marginBottom: '6px',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                EMAIL
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    background: '#000',
                                    border: '1px solid #222',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                placeholder="admin@pitchstudio.com"
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label
                                htmlFor="password"
                                style={{
                                    display: 'block',
                                    fontSize: '0.7rem',
                                    fontWeight: 500,
                                    color: '#555',
                                    marginBottom: '6px',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                PASSWORD
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    background: '#000',
                                    border: '1px solid #222',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#fff',
                                color: '#000',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                letterSpacing: '0.08em',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                    SIGNING IN...
                                </>
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    SIGN IN
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
