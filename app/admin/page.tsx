'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAnalytics, getStartupsList } from '@/lib/actions';
import { Startup } from '@/types/startup';
import {
    BarChart3,
    TrendingUp,
    Users,
    Star,
    ArrowRight,
    Loader2,
} from 'lucide-react';

export default function AdminDashboardPage() {
    const [analytics, setAnalytics] = useState({
        total: 0,
        selected: 0,
        pending: 0,
        selectionRatio: 0,
    });
    const [recentStartups, setRecentStartups] = useState<Partial<Startup>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsData, startupsData] = await Promise.all([
                    getAnalytics(),
                    getStartupsList(1, 5),
                ]);
                setAnalytics(analyticsData);
                setRecentStartups(startupsData.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 size={24} className="animate-spin text-white" />
            </div>
        );
    }

    const statCards = [
        {
            label: 'TOTAL APPLICATIONS',
            value: analytics.total,
            icon: <Users size={18} />,
        },
        {
            label: 'SELECTED',
            value: analytics.selected,
            icon: <Star size={18} />,
        },
        {
            label: 'PENDING',
            value: analytics.pending,
            icon: <BarChart3 size={18} />,
        },
        {
            label: 'SELECTION RATIO',
            value: `${analytics.selectionRatio}%`,
            icon: <TrendingUp size={18} />,
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="mb-10">
                <h1 className="text-sm font-semibold mb-1 tracking-wider uppercase text-white">
                    DASHBOARD
                </h1>
                <p className="text-neutral-800 text-xs tracking-wide">
                    Overview of all startup applications
                </p>
            </div>

            <div className="grid gap-[1px] mb-12 bg-neutral-900 border border-neutral-900 rounded-xl overflow-hidden"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {statCards.map((card, i) => (
                    <div key={i} className="p-7 bg-neutral-950">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-neutral-700">
                                {card.label}
                            </span>
                            <div className="text-neutral-800">{card.icon}</div>
                        </div>
                        <div className="text-4xl font-bold text-white tracking-tight">
                            {card.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden">
                <div className="flex justify-between items-center px-6 py-5 border-b border-neutral-900">
                    <h2 className="text-xs font-semibold tracking-wider uppercase text-neutral-500">
                        RECENT SUBMISSIONS
                    </h2>
                    <Link href="/admin/submissions" className="flex items-center gap-1.5 text-[0.7rem] text-neutral-600 no-underline font-medium tracking-wide hover:text-neutral-400 transition-colors">
                        VIEW ALL <ArrowRight size={12} />
                    </Link>
                </div>

                {recentStartups.length === 0 ? (
                    <div className="text-center py-12 text-neutral-800 text-sm">
                        No submissions yet
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Startup</th>
                                    <th>Founder</th>
                                    <th>City</th>
                                    <th>Stage</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentStartups.map((startup) => (
                                    <tr key={startup.id}>
                                        <td>
                                            <Link href={`/admin/submissions/${startup.id}`} className="no-underline text-white font-medium">
                                                {startup.startup_name}
                                            </Link>
                                        </td>
                                        <td>{startup.founder_names}</td>
                                        <td>{startup.city || '—'}</td>
                                        <td>{startup.current_stage || '—'}</td>
                                        <td>
                                            <span className={`badge ${startup.status === 'Selected' ? 'badge-selected' : 'badge-pending'}`}>
                                                {startup.status}
                                            </span>
                                        </td>
                                        <td>
                                            {startup.created_at ? new Date(startup.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                            }) : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
