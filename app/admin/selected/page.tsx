'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getStartups } from '@/lib/actions';
import { Startup } from '@/types/startup';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Download,
    SlidersHorizontal,
    Star,
} from 'lucide-react';

export default function SelectedPage() {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const pageSize = 10;

    const fetchStartups = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getStartups(page, pageSize, {
                search: search || undefined,
                status: 'Selected',
                sortBy,
                sortOrder,
            });
            setStartups(result.data);
            setTotalCount(result.count);
        } catch (err) {
            console.error('Failed to fetch startups:', err);
        } finally {
            setLoading(false);
        }
    }, [page, search, sortBy, sortOrder]);

    useEffect(() => {
        fetchStartups();
    }, [fetchStartups]);

    useEffect(() => {
        setPage(1);
    }, [search, sortBy, sortOrder]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const handleExportCSV = () => {
        if (startups.length === 0) return;

        const headers = [
            'Startup Name', 'Founder', 'Email', 'City', 'Country',
            'Stage', 'Status', 'Revenue', 'Date',
        ];
        const rows = startups.map((s) => [
            s.startup_name, s.founder_names, s.email, s.city || '', s.country || '',
            s.current_stage || '', s.status,
            s.current_monthly_revenue?.toString() || '',
            new Date(s.created_at).toLocaleDateString(),
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `selected_startups_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="animate-fade-in">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '12px',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: '1.8rem',
                            fontWeight: 700,
                            marginBottom: '4px',
                            letterSpacing: '-0.02em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <Star size={24} style={{ color: 'var(--status-selected)' }} />
                        Selected Startups
                    </h1>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>
                        {totalCount} selected startup{totalCount !== 1 ? 's' : ''}
                    </p>
                </div>
                {startups.length > 0 && (
                    <button onClick={handleExportCSV} className="btn-secondary btn-sm">
                        <Download size={14} />
                        Export CSV
                    </button>
                )}
            </div>

            {/* Filters */}
            <div
                className="glass-card-subtle"
                style={{
                    padding: '16px 20px',
                    marginBottom: '20px',
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                }}
            >
                <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                    <Search
                        size={16}
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--foreground-dimmed)',
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search selected startups..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <SlidersHorizontal size={14} style={{ color: 'var(--foreground-dimmed)' }} />
                    <select
                        value={`${sortBy}_${sortOrder}`}
                        onChange={(e) => {
                            const [by, order] = e.target.value.split('_');
                            setSortBy(by);
                            setSortOrder(order as 'asc' | 'desc');
                        }}
                        className="form-input"
                        style={{ width: 'auto', fontSize: '0.85rem', padding: '10px 12px', cursor: 'pointer' }}
                    >
                        <option value="created_at_desc">Newest First</option>
                        <option value="created_at_asc">Oldest First</option>
                        <option value="startup_name_asc">Name A-Z</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card-subtle" style={{ overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                        <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand-primary)' }} />
                    </div>
                ) : startups.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--foreground-dimmed)' }}>
                        {search ? 'No matches found' : 'No startups have been selected yet'}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Startup</th>
                                    <th>Founder</th>
                                    <th>Email</th>
                                    <th>City</th>
                                    <th>Stage</th>
                                    <th>Revenue</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {startups.map((startup) => (
                                    <tr key={startup.id}>
                                        <td>
                                            <Link
                                                href={`/admin/submissions/${startup.id}`}
                                                style={{ textDecoration: 'none', color: 'var(--foreground)', fontWeight: 500 }}
                                            >
                                                {startup.startup_name}
                                            </Link>
                                        </td>
                                        <td>{startup.founder_names}</td>
                                        <td style={{ fontSize: '0.85rem' }}>{startup.email}</td>
                                        <td>{startup.city || '—'}</td>
                                        <td>{startup.current_stage || '—'}</td>
                                        <td>
                                            {startup.current_monthly_revenue
                                                ? `₹${startup.current_monthly_revenue.toLocaleString()}`
                                                : '—'}
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
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

                {totalPages > 1 && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px 20px',
                            borderTop: '1px solid var(--border-color)',
                        }}
                    >
                        <span style={{ fontSize: '0.85rem', color: 'var(--foreground-dimmed)' }}>
                            Page {page} of {totalPages}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn-secondary btn-sm"
                                style={{ padding: '6px 12px', opacity: page === 1 ? 0.3 : 1 }}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="btn-secondary btn-sm"
                                style={{ padding: '6px 12px', opacity: page === totalPages ? 0.3 : 1 }}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
