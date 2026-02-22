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
    SlidersHorizontal,
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
    
    // Modal state
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
                
                // Update selected startup if modal is open
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

    // Reset to page 1 on filter change
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
            s.startup_name,
            s.founder_names,
            s.email,
            s.city || '',
            s.country || '',
            s.current_stage || '',
            s.status,
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
                        }}
                    >
                        {title}
                    </h1>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>
                        {totalCount} total {statusFilter ? statusFilter.toLowerCase() : ''} startup{totalCount !== 1 ? 's' : ''}
                    </p>
                </div>
                {showExport && startups.length > 0 && (
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
                        placeholder="Search by name, founder, city, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <SlidersHorizontal size={14} style={{ color: 'var(--foreground-dimmed)' }} />
                    <select
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                        className="form-input"
                        style={{ width: 'auto', fontSize: '0.85rem', padding: '10px 12px', cursor: 'pointer' }}
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
                        <option value="startup_name_desc">Name Z-A</option>
                        <option value="current_monthly_revenue_desc">Revenue (High)</option>
                        <option value="current_monthly_revenue_asc">Revenue (Low)</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card-subtle" style={{ overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                        <Loader2
                            size={28}
                            style={{ animation: 'spin 1s linear infinite', color: 'var(--brand-primary)' }}
                        />
                    </div>
                ) : startups.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '60px',
                            color: 'var(--foreground-dimmed)',
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
                                                    color: 'var(--foreground)',
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
                                                    border: 'none',
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
                            padding: '16px 20px',
                            borderTop: '1px solid var(--border-color)',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '0.85rem',
                                color: 'var(--foreground-dimmed)',
                            }}
                        >
                            Page {page} of {totalPages}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn-secondary btn-sm"
                                style={{
                                    padding: '6px 12px',
                                    opacity: page === 1 ? 0.3 : 1,
                                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="btn-secondary btn-sm"
                                style={{
                                    padding: '6px 12px',
                                    opacity: page === totalPages ? 0.3 : 1,
                                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                                }}
                            >
                                <ChevronRight size={16} />
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
