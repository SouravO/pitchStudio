'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getStartupsList, getStartupById, updateStartupStatus } from '@/lib/actions';
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
    const [startups, setStartups] = useState<Partial<Startup>[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [stage, setStage] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

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

    const handleRowClick = async (startup: Partial<Startup>) => {
        setModalLoading(true);
        setIsModalOpen(true);
        try {
            const result = await getStartupById(startup.id as string);
            if (result.data) {
                setSelectedStartup(result.data);
            }
        } catch {
            // fallback: show partial data
        } finally {
            setModalLoading(false);
        }
    };

    const fetchStartups = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getStartupsList(page, pageSize, {
                search: debouncedSearch || undefined,
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
    }, [page, debouncedSearch, statusFilter, stage, sortBy, sortOrder]);

    useEffect(() => {
        fetchStartups();
    }, [fetchStartups]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, stage, sortBy, sortOrder]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const handleExportCSV = () => {
        if (startups.length === 0) return;
        const headers = [
            'Startup Name', 'Founder', 'Email', 'City', 'Country',
            'Stage', 'Status', 'Revenue', 'Date',
        ];
        const rows = startups.map((s) => [
            s.startup_name || '', s.founder_names || '', s.email || '', s.city || '', s.country || '',
            s.current_stage || '', s.status || '',
            s.current_monthly_revenue?.toString() || '',
            s.created_at ? new Date(s.created_at).toLocaleDateString() : '',
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
            <div className="flex justify-between items-center mb-7 flex-wrap gap-3">
                <div>
                    <h1 className="text-sm font-semibold mb-1 tracking-wider uppercase text-white">
                        {title}
                    </h1>
                    <p className="text-neutral-800 text-[0.7rem] tracking-wide">
                        {totalCount} total {statusFilter ? statusFilter.toLowerCase() : ''} startup{totalCount !== 1 ? 's' : ''}
                    </p>
                </div>
                {showExport && startups.length > 0 && (
                    <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-4 py-2 bg-transparent border border-neutral-800 rounded-md text-neutral-500 text-xs cursor-pointer tracking-wide hover:text-neutral-300 transition-colors">
                        <Download size={12} />
                        EXPORT CSV
                    </button>
                )}
            </div>

            <div className="p-3.5 mb-5 flex gap-2.5 flex-wrap items-center bg-neutral-950 border border-neutral-900 rounded-xl">
                <div className="flex-1 min-w-50 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-800" />
                    <input
                        type="text"
                        placeholder="Search by name, founder, city, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3.5 py-2.5 pl-9 bg-black border border-neutral-800 rounded-lg text-white text-sm outline-none"
                    />
                </div>

                <div className="flex gap-2 items-center">
                    <select
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                        className="px-3 py-2.5 bg-black border border-neutral-800 rounded-lg text-neutral-500 text-sm cursor-pointer outline-none"
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
                        className="px-3 py-2.5 bg-black border border-neutral-800 rounded-lg text-neutral-500 text-sm cursor-pointer outline-none"
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

            <div className="bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-15">
                        <Loader2 size={24} className="animate-spin text-white" />
                    </div>
                ) : startups.length === 0 ? (
                    <div className="text-center py-15 text-neutral-800 text-sm">
                        {search ? 'No startups match your search' : 'No submissions yet'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
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
                                    <tr key={startup.id} onClick={() => handleRowClick(startup)}>
                                        <td>
                                            <span className="text-white font-medium cursor-pointer">
                                                {startup.startup_name}
                                            </span>
                                        </td>
                                        <td>{startup.founder_names}</td>
                                        <td className="text-sm">{startup.email}</td>
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
                                                    handleToggleStatus(startup.id as string, startup.status as string);
                                                }}
                                                disabled={togglingId === startup.id}
                                                className={`badge ${startup.status === 'Selected' ? 'badge-selected' : 'badge-pending'} cursor-pointer transition-all duration-200`}
                                                style={{ opacity: togglingId === startup.id ? 0.6 : 1 }}
                                                title={`Click to mark as ${startup.status === 'Selected' ? 'Pending' : 'Selected'}`}
                                            >
                                                {togglingId === startup.id ? (
                                                    <Loader2 size={12} className="animate-spin" />
                                                ) : (
                                                    startup.status
                                                )}
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap">
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

                {totalPages > 1 && (
                    <div className="flex justify-between items-center px-5 py-3.5 border-t border-neutral-900">
                        <span className="text-xs text-neutral-800">
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-2.5 py-1.5 bg-transparent border border-neutral-800 rounded-md text-white text-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-2.5 py-1.5 bg-transparent border border-neutral-800 rounded-md text-white text-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

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
