'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getStartupsList, getAllSelectedStartups } from '@/lib/actions';
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
    const [startups, setStartups] = useState<Partial<Startup>[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [exporting, setExporting] = useState(false);
    const pageSize = 10;

    const fetchStartups = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getStartupsList(page, pageSize, {
                search: debouncedSearch || undefined,
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
    }, [page, debouncedSearch, sortBy, sortOrder]);

    useEffect(() => {
        fetchStartups();
    }, [fetchStartups]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, sortBy, sortOrder]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const handleExportCSV = async () => {
        setExporting(true);
        try {
            const { data: allStartups } = await getAllSelectedStartups();
            if (!allStartups || allStartups.length === 0) return;

            const headers = [
                'Startup Name', 'Founder', 'Designation', 'Contact Number', 'Email',
                'City', 'Country', 'Website', 'Instagram', 'LinkedIn', 'Facebook', 'Youtube',
                'Year of Incorporation', 'Legal Structure',
                'Education', 'Total Experience Years', 'Industry Experience', 'Previous Startup Experience', 'Why Right Person',
                'Five Word Description', 'Elevator Pitch', 'Problem Statement', 'Target Customer', 'Differentiation',
                'Market Size', 'Current Stage',
                'Products Services', 'Pricing', 'Average Order Value', 'Monthly Sales Volume', 'Gross Margin',
                'Net Profit Margin', 'Cost of Production', 'Marketing CAC', 'Delivery Cost', 'Contribution Margin',
                'Is Generating Revenue', 'Revenue Year 1', 'Revenue Year 2', 'Revenue Year 3',
                'Current Monthly Revenue', 'Monthly Growth Rate', 'Retention Rate', 'Active Customers', 'Partnerships',
                'Revenue Model', 'Acquisition Channels', 'CAC', 'LTV', 'LTV CAC Ratio',
                'Raised Before', 'Previous Funding', 'Investment Seeking', 'Equity Offered',
                'Pre Money Valuation', 'Post Money Valuation', 'Fund Utilization', 'Runway Months',
                'Core Team', 'Planned Hires', 'Advisory Board',
                'Revenue Projection 3Y', 'Vision 5Y', 'Exit Strategy',
                'Pitch Deck Link', 'Financial Projection Link', 'Prepared for QA', 'Why Shortlist',
                'Status', 'Created At',
            ];

            const rows = allStartups.map((s) => [
                s.startup_name || '', s.founder_names || '', s.designation || '', s.contact_number || '', s.email || '',
                s.city || '', s.country || '', s.website || '', s.instagram || '', s.linkedin || '', s.facebook || '', s.youtube || '',
                s.year_of_incorporation?.toString() || '', s.legal_structure || '',
                s.education || '', s.total_experience_years?.toString() || '', s.industry_experience || '', s.previous_startup_experience || '', s.why_right_person || '',
                s.five_word_description || '', s.elevator_pitch || '', s.problem_statement || '', s.target_customer || '', s.differentiation || '',
                s.market_size || '', s.current_stage || '',
                s.products_services || '', s.pricing || '', s.average_order_value?.toString() || '', s.monthly_sales_volume?.toString() || '', s.gross_margin?.toString() || '',
                s.net_profit_margin?.toString() || '', s.cost_of_production?.toString() || '', s.marketing_cac?.toString() || '', s.delivery_cost?.toString() || '', s.contribution_margin?.toString() || '',
                s.is_generating_revenue?.toString() || '', s.revenue_year1?.toString() || '', s.revenue_year2?.toString() || '', s.revenue_year3?.toString() || '',
                s.current_monthly_revenue?.toString() || '', s.monthly_growth_rate?.toString() || '', s.retention_rate?.toString() || '', s.active_customers?.toString() || '', s.partnerships || '',
                s.revenue_model || '', s.acquisition_channels || '', s.cac?.toString() || '', s.ltv?.toString() || '', s.ltv_cac_ratio?.toString() || '',
                s.raised_before?.toString() || '', s.previous_funding || '', s.investment_seeking?.toString() || '', s.equity_offered?.toString() || '',
                s.pre_money_valuation?.toString() || '', s.post_money_valuation?.toString() || '', s.fund_utilization || '', s.runway_months?.toString() || '',
                s.core_team || '', s.planned_hires || '', s.advisory_board || '',
                s.revenue_projection_3y || '', s.vision_5y || '', s.exit_strategy || '',
                s.pitch_deck_link || '', s.financial_projection_link || '', s.prepared_for_qa?.toString() || '', s.why_shortlist || '',
                s.status || '', s.created_at ? new Date(s.created_at).toLocaleDateString() : '',
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
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-7 flex-wrap gap-3">
                <div>
                    <h1 className="text-sm font-semibold mb-1 tracking-wider uppercase text-white flex items-center gap-2">
                        <Star size={14} className="text-emerald-400" />
                        SELECTED STARTUPS
                    </h1>
                    <p className="text-neutral-800 text-[0.7rem] tracking-wide">
                        {totalCount} selected startup{totalCount !== 1 ? 's' : ''}
                    </p>
                </div>
                {startups.length > 0 && (
                    <button
                        onClick={handleExportCSV}
                        disabled={exporting}
                        className="flex items-center gap-1.5 px-4 py-2 bg-transparent border border-neutral-800 rounded-md text-neutral-500 text-xs tracking-wide disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:text-neutral-300 transition-colors"
                    >
                        {exporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                        {exporting ? 'EXPORTING...' : 'EXPORT CSV'}
                    </button>
                )}
            </div>

            <div className="p-3.5 mb-5 flex gap-2.5 flex-wrap items-center bg-neutral-950 border border-neutral-900 rounded-xl">
                <div className="flex-1 min-w-50 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-800" />
                    <input
                        type="text"
                        placeholder="Search selected startups..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3.5 py-2.5 pl-9 bg-black border border-neutral-800 rounded-lg text-white text-sm outline-none"
                    />
                </div>
                <div className="flex gap-2 items-center">
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
                        {search ? 'No matches found' : 'No startups have been selected yet'}
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
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {startups.map((startup) => (
                                    <tr key={startup.id}>
                                        <td>
                                            <Link href={`/admin/submissions/${startup.id}`} className="no-underline text-white font-medium">
                                                {startup.startup_name}
                                            </Link>
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
        </div>
    );
}
