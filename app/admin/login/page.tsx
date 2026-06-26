'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2, Shield } from 'lucide-react';
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
            const { error } = await sb.auth.signInWithPassword({ email, password });

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
        <div className="min-h-screen bg-black flex items-center justify-center p-5 relative">
            <div className="fixed inset-0 opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #111 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="w-full max-w-100 relative z-1 animate-fade-in-up">
                <div className="flex items-center justify-center gap-2 mb-12">
                    <span className="text-sm font-bold tracking-widest text-white">
                        <img src="/assets/logo.png" alt="Logo" width={100} height={100} />
                    </span>
                </div>

                <div className="bg-neutral-950 border border-neutral-900 rounded-xl px-9 py-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-4">
                            <Shield size={24} className="text-white" />
                        </div>
                        <h1 className="text-sm font-semibold mb-1.5 tracking-wider uppercase">
                            INVESTOR PORTAL
                        </h1>
                        <p className="text-neutral-600 text-sm">
                            Sign in to access the admin dashboard
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-[0.7rem] font-medium text-neutral-600 mb-1.5 tracking-wide uppercase">
                                EMAIL
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3.5 py-3 bg-black border border-neutral-800 rounded-lg text-white text-sm outline-none transition-colors focus:border-neutral-600"
                                placeholder="admin@pitchstudio.com"
                                required
                            />
                        </div>

                        <div className="mb-7">
                            <label htmlFor="password" className="block text-[0.7rem] font-medium text-neutral-600 mb-1.5 tracking-wide uppercase">
                                PASSWORD
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3.5 py-3 bg-black border border-neutral-800 rounded-lg text-white text-sm outline-none transition-colors focus:border-neutral-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-white text-black border-none rounded-lg font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
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
