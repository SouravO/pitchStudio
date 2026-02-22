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
                    size={32}
                    style={{
                        animation: 'spin 1s linear infinite',
                        color: 'var(--brand-primary)',
                    }}
                />
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Applications',
            value: analytics.total,
            icon: <Users size={22} />,
            color: 'var(--brand-primary-light)',
            bg: 'rgba(99, 102, 241, 0.1)',
        },
        {
            label: 'Selected',
            value: analytics.selected,
            icon: <Star size={22} />,
            color: 'var(--status-selected)',
            bg: 'rgba(16, 185, 129, 0.1)',
        },
        {
            label: 'Pending',
            value: analytics.pending,
            icon: <BarChart3 size={22} />,
            color: 'var(--status-pending)',
            bg: 'rgba(245, 158, 11, 0.1)',
        },
        {
            label: 'Selection Ratio',
            value: `${analytics.selectionRatio}%`,
            icon: <TrendingUp size={22} />,
            color: 'var(--brand-accent)',
            bg: 'rgba(167, 139, 250, 0.1)',
        },
    ];

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '32px' }}>
                <h1
                    style={{
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        marginBottom: '6px',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Dashboard
                </h1>
                <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>
                    Overview of all startup applications
                </p>
            </div>

            {/* Stats Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px',
                }}
            >
                {statCards.map((card, i) => (
                    <div
                        key={i}
                        className="glass-card-subtle"
                        style={{
                            padding: '24px',
                            animationDelay: `${i * 0.1}s`,
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
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: 'var(--foreground-dimmed)',
                                }}
                            >
                                {card.label}
                            </span>
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: 'var(--radius-md)',
                                    background: card.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: card.color,
                                }}
                            >
                                {card.icon}
                            </div>
                        </div>
                        <div
                            style={{
                                fontSize: '2rem',
                                fontWeight: 700,
                                color: card.color,
                            }}
                        >
                            {card.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Submissions */}
            <div
                className="glass-card-subtle"
                style={{ padding: '24px', overflow: 'hidden' }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                        Recent Submissions
                    </h2>
                    <Link
                        href="/admin/submissions"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.85rem',
                            color: 'var(--brand-primary-light)',
                            textDecoration: 'none',
                            fontWeight: 500,
                        }}
                    >
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {recentStartups.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: 'var(--foreground-dimmed)',
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
                                                    color: 'var(--foreground)',
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
