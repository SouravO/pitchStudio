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
                    marginBottom: '28px',
                    flexWrap: 'wrap',
                    gap: '12px',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            marginBottom: '4px',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <Star size={14} style={{ color: '#2dd4a0' }} />
                        SELECTED STARTUPS
                    </h1>
                    <p style={{ color: '#333', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                        {totalCount} selected startup{totalCount !== 1 ? 's' : ''}
                    </p>
                </div>
                {startups.length > 0 && (
                    <button
                        onClick={handleExportCSV}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            background: 'transparent',
                            border: '1px solid #222',
                            borderRadius: '6px',
                            color: '#999',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            letterSpacing: '0.05em',
                        }}
                    >
                        <Download size={12} />
                        EXPORT CSV
                    </button>
                )}
            </div>

            {/* Filters */}
            <div
                style={{
                    padding: '14px 18px',
                    marginBottom: '20px',
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    background: '#0a0a0a',
                    border: '1px solid #111',
                    borderRadius: '10px',
                }}
            >
                <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                    <Search
                        size={14}
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#333',
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search selected startups..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 14px 10px 34px',
                            background: '#000',
                            border: '1px solid #222',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '0.8rem',
                            outline: 'none',
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                        value={`${sortBy}_${sortOrder}`}
                        onChange={(e) => {
                            const [by, order] = e.target.value.split('_');
                            setSortBy(by);
                            setSortOrder(order as 'asc' | 'desc');
                        }}
                        style={{
                            padding: '10px 12px',
                            background: '#000',
                            border: '1px solid #222',
                            borderRadius: '8px',
                            color: '#999',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        <option value="created_at_desc">Newest First</option>
                        <option value="created_at_asc">Oldest First</option>
                        <option value="startup_name_asc">Name A-Z</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div style={{ background: '#0a0a0a', border: '1px solid #111', borderRadius: '10px', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#fff' }} />
                    </div>
                ) : startups.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#333', fontSize: '0.85rem' }}>
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
                                                style={{ textDecoration: 'none', color: '#fff', fontWeight: 500 }}
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
                            padding: '14px 20px',
                            borderTop: '1px solid #111',
                        }}
                    >
                        <span style={{ fontSize: '0.75rem', color: '#333' }}>
                            Page {page} of {totalPages}
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                style={{
                                    padding: '6px 10px',
                                    background: 'transparent',
                                    border: '1px solid #222',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                                    opacity: page === 1 ? 0.3 : 1,
                                }}
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                style={{
                                    padding: '6px 10px',
                                    background: 'transparent',
                                    border: '1px solid #222',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                                    opacity: page === totalPages ? 0.3 : 1,
                                }}
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
