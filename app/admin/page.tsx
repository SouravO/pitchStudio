'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAnalytics, getStartups } from '@/lib/actions';
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
    const [recentStartups, setRecentStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsData, startupsData] = await Promise.all([
                    getAnalytics(),
                    getStartups(1, 5),
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
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '50vh',
                }}
            >
                <Loader2
                    size={24}
                    style={{
                        animation: 'spin 1s linear infinite',
                        color: '#fff',
                    }}
                />
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
            <div style={{ marginBottom: '40px' }}>
                <h1
                    style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: '4px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: '#fff',
                    }}
                >
                    DASHBOARD
                </h1>
                <p style={{ color: '#333', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    Overview of all startup applications
                </p>
            </div>

            {/* Stats Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1px',
                    marginBottom: '48px',
                    background: '#111',
                    border: '1px solid #111',
                    borderRadius: '10px',
                    overflow: 'hidden',
                }}
            >
                {statCards.map((card, i) => (
                    <div
                        key={i}
                        style={{
                            padding: '28px 24px',
                            background: '#0a0a0a',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#444',
                                }}
                            >
                                {card.label}
                            </span>
                            <div style={{ color: '#333' }}>
                                {card.icon}
                            </div>
                        </div>
                        <div
                            style={{
                                fontSize: '2.2rem',
                                fontWeight: 700,
                                color: '#fff',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            {card.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Submissions */}
            <div
                style={{
                    background: '#0a0a0a',
                    border: '1px solid #111',
                    borderRadius: '10px',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px 24px',
                        borderBottom: '1px solid #111',
                    }}
                >
                    <h2 style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999' }}>
                        RECENT SUBMISSIONS
                    </h2>
                    <Link
                        href="/admin/submissions"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.7rem',
                            color: '#555',
                            textDecoration: 'none',
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            transition: 'color 0.2s',
                        }}
                    >
                        VIEW ALL <ArrowRight size={12} />
                    </Link>
                </div>

                {recentStartups.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '48px',
                            color: '#333',
                            fontSize: '0.85rem',
                        }}
                    >
                        No submissions yet
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
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
                                            <Link
                                                href={`/admin/submissions/${startup.id}`}
                                                style={{
                                                    textDecoration: 'none',
                                                    color: '#fff',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {startup.startup_name}
                                            </Link>
                                        </td>
                                        <td>{startup.founder_names}</td>
                                        <td>{startup.city || '—'}</td>
                                        <td>{startup.current_stage || '—'}</td>
                                        <td>
                                            <span
                                                className={`badge ${startup.status === 'Selected'
                                                    ? 'badge-selected'
                                                    : 'badge-pending'
                                                    }`}
                                            >
                                                {startup.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(startup.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
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
