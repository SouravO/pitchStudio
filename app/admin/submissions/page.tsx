'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getStartups, updateStartupStatus } from '@/lib/actions';
import { Startup } from '@/types/startup';
import toast from 'react-hot-toast';
import SubmissionModal from '@/components/admin/SubmissionModal';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Download,
} from 'lucide-react';

interface SubmissionsPageProps {
    statusFilter?: string;
    title?: string;
    showExport?: boolean;
}

export default function SubmissionsPage({
    statusFilter,
    title = 'All Submissions',
    showExport = false,
}: SubmissionsPageProps) {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [stage, setStage] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const pageSize = 10;

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Selected' ? 'Pending' : 'Selected';
        setTogglingId(id);
        try {
            const result = await updateStartupStatus(id, newStatus);
            if (result.success) {
                toast.success(`Marked as ${newStatus}`);
                fetchStartups();
                if (selectedStartup && selectedStartup.id === id) {
                    setSelectedStartup({ ...selectedStartup, status: newStatus });
                }
            } else {
                toast.error(result.error || 'Failed to update status');
            }
        } catch {
            toast.error('An unexpected error occurred');
        } finally {
            setTogglingId(null);
        }
    };

    const handleRowClick = (startup: Startup) => {
        setSelectedStartup(startup);
        setIsModalOpen(true);
    };

    const fetchStartups = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getStartups(page, pageSize, {
                search: search || undefined,
                status: statusFilter || undefined,
                stage: stage || undefined,
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
    }, [page, search, statusFilter, stage, sortBy, sortOrder]);

    useEffect(() => {
        fetchStartups();
    }, [fetchStartups]);

    useEffect(() => {
        setPage(1);
    }, [search, stage, sortBy, sortOrder]);

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
        a.download = `startups_${statusFilter || 'all'}_${new Date().toISOString().slice(0, 10)}.csv`;
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
                        }}
                    >
                        {title}
                    </h1>
                    <p style={{ color: '#333', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                        {totalCount} total {statusFilter ? statusFilter.toLowerCase() : ''} startup{totalCount !== 1 ? 's' : ''}
                    </p>
                </div>
                {showExport && startups.length > 0 && (
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
                        placeholder="Search by name, founder, city, email..."
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
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
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
                        <option value="">All Stages</option>
                        <option value="Idea">Idea</option>
                        <option value="MVP">MVP</option>
                        <option value="Early Traction">Early Traction</option>
                        <option value="Growth">Growth</option>
                        <option value="Scale">Scale</option>
                    </select>

                    <select
                        value={`${sortBy}_${sortOrder}`}
                        onChange={(e) => {
                            const val = e.target.value;
                            const lastUnderscore = val.lastIndexOf('_');
                            setSortBy(val.slice(0, lastUnderscore));
                            setSortOrder(val.slice(lastUnderscore + 1) as 'asc' | 'desc');
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
                        <option value="startup_name_desc">Name Z-A</option>
                        <option value="current_monthly_revenue_desc">Revenue (High)</option>
                        <option value="current_monthly_revenue_asc">Revenue (Low)</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div style={{ background: '#0a0a0a', border: '1px solid #111', borderRadius: '10px', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                        <Loader2
                            size={24}
                            style={{ animation: 'spin 1s linear infinite', color: '#fff' }}
                        />
                    </div>
                ) : startups.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '60px',
                            color: '#333',
                            fontSize: '0.85rem',
                        }}
                    >
                        {search ? 'No startups match your search' : 'No submissions yet'}
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
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {startups.map((startup) => (
                                    <tr
                                        key={startup.id}
                                        onClick={() => handleRowClick(startup)}
                                    >
                                        <td>
                                            <span
                                                style={{
                                                    color: '#fff',
                                                    fontWeight: 500,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {startup.startup_name}
                                            </span>
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
                                        <td>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleStatus(startup.id, startup.status);
                                                }}
                                                disabled={togglingId === startup.id}
                                                className={`badge ${startup.status === 'Selected'
                                                    ? 'badge-selected'
                                                    : 'badge-pending'
                                                    }`}
                                                style={{
                                                    cursor: togglingId === startup.id ? 'wait' : 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    opacity: togglingId === startup.id ? 0.6 : 1,
                                                }}
                                                title={`Click to mark as ${startup.status === 'Selected' ? 'Pending' : 'Selected'}`}
                                            >
                                                {togglingId === startup.id ? (
                                                    <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                                                ) : (
                                                    startup.status
                                                )}
                                            </button>
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

                {/* Pagination */}
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

            {/* Submission Detail Modal */}
            {selectedStartup && (
                <SubmissionModal
                    startup={selectedStartup}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onToggleStatus={handleToggleStatus}
                    isToggling={togglingId === selectedStartup.id}
                />
            )}
        </div>
    );
}
