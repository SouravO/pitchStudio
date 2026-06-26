'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStartupById, updateStartupStatus } from '@/lib/actions';
import { Startup } from '@/types/startup';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    Star,
    Clock,
    Loader2,
    ExternalLink,
    Mail,
    Phone,
    MapPin,
} from 'lucide-react';

export default function StartupDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [startup, setStartup] = useState<Startup | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchStartup = async () => {
            if (!params.id) return;
            try {
                const result = await getStartupById(params.id as string);
                setStartup(result.data);
            } catch (err) {
                console.error('Failed to fetch startup:', err);
                toast.error('Failed to load startup details');
            } finally {
                setLoading(false);
            }
        };
        fetchStartup();
    }, [params.id]);

    const handleStatusToggle = async () => {
        if (!startup) return;
        const newStatus = startup.status === 'Selected' ? 'Pending' : 'Selected';
        setUpdating(true);
        try {
            const result = await updateStartupStatus(startup.id, newStatus);
            if (result.success) {
                setStartup((prev) => (prev ? { ...prev, status: newStatus } : null));
                toast.success(
                    newStatus === 'Selected'
                        ? 'Startup marked as Selected! ⭐'
                        : 'Startup moved back to Pending'
                );
            } else {
                toast.error(result.error || 'Failed to update status');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 size={24} className="animate-spin text-white" />
            </div>
        );
    }

    if (!startup) {
        return (
            <div className="text-center py-15">
                <h2 className="mb-3">Startup Not Found</h2>
                <button onClick={() => router.back()} className="btn-secondary btn-sm">
                    Go Back
                </button>
            </div>
        );
    }

    const InfoRow = ({
        label,
        value,
        isLink,
    }: {
        label: string;
        value: string | number | boolean | null | undefined;
        isLink?: boolean;
    }) => {
        if (value === null || value === undefined || value === '') return null;

        let displayValue: React.ReactNode;
        if (typeof value === 'boolean') {
            displayValue = value ? 'Yes' : 'No';
        } else if (isLink && typeof value === 'string') {
            displayValue = (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-neutral-500 no-underline inline-flex items-center gap-1 hover:text-neutral-300 transition-colors">
                    {value.length > 40 ? value.slice(0, 40) + '...' : value}
                    <ExternalLink size={12} />
                </a>
            );
        } else {
            displayValue = String(value);
        }

        return (
            <div className="flex gap-3 py-2.5 border-b border-neutral-900">
                <span className="text-sm text-neutral-600 min-w-45 flex-shrink-0">{label}</span>
                <span className="text-sm text-neutral-300 break-words">{displayValue}</span>
            </div>
        );
    };

    const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
        <div className="p-6 mb-3 bg-neutral-950 border border-neutral-900 rounded-xl">
            <h3 className="text-[0.7rem] font-semibold mb-4 flex items-center gap-2 tracking-wider uppercase text-neutral-500">
                <span>{icon}</span>
                {title}
            </h3>
            {children}
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                <div>
                    <button onClick={() => router.back()} className="bg-none border-none text-neutral-600 cursor-pointer flex items-center gap-1.5 text-sm mb-3 p-0 hover:text-neutral-400 transition-colors">
                        <ArrowLeft size={16} />
                        Back to submissions
                    </button>
                    <h1 className="text-2xl font-bold tracking-tight mb-2 text-white">
                        {startup.startup_name}
                    </h1>
                    <div className="flex gap-4 items-center flex-wrap text-sm text-neutral-600">
                        {startup.city && (
                            <span className="flex items-center gap-1"><MapPin size={14} /> {startup.city}{startup.country ? `, ${startup.country}` : ''}</span>
                        )}
                        {startup.email && (
                            <span className="flex items-center gap-1"><Mail size={14} /> {startup.email}</span>
                        )}
                        {startup.contact_number && (
                            <span className="flex items-center gap-1"><Phone size={14} /> {startup.contact_number}</span>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 items-center">
                    <span className={`badge ${startup.status === 'Selected' ? 'badge-selected' : 'badge-pending'} text-sm px-4 py-1.5`}>
                        {startup.status === 'Selected' ? <Star size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                        {startup.status}
                    </span>
                    <button onClick={handleStatusToggle} disabled={updating} className={startup.status === 'Selected' ? 'btn-secondary btn-sm' : 'btn-primary btn-sm'}>
                        {updating ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : startup.status === 'Selected' ? (
                            'Move to Pending'
                        ) : (
                            <><Star size={14} /> Select</>
                        )}
                    </button>
                </div>
            </div>

            <Section title="Basic Information" icon="🏢">
                <InfoRow label="Startup Name" value={startup.startup_name} />
                <InfoRow label="Founder Name(s)" value={startup.founder_names} />
                <InfoRow label="Designation" value={startup.designation} />
                <InfoRow label="Year of Incorporation" value={startup.year_of_incorporation} />
                <InfoRow label="Legal Structure" value={startup.legal_structure} />
                <InfoRow label="Website" value={startup.website} isLink />
                <InfoRow label="Instagram" value={startup.instagram} isLink />
                <InfoRow label="LinkedIn" value={startup.linkedin} isLink />
                <InfoRow label="Facebook" value={startup.facebook} isLink />
                <InfoRow label="YouTube" value={startup.youtube} isLink />
            </Section>

            <Section title="Founder Profile" icon="👤">
                <InfoRow label="Educational Background" value={startup.education} />
                <InfoRow label="Total Years of Experience" value={startup.total_experience_years ? `${startup.total_experience_years} years` : null} />
                <InfoRow label="Industry Experience" value={startup.industry_experience} />
                <InfoRow label="Previous Startup Experience" value={startup.previous_startup_experience} />
                <InfoRow label="Why Are You the Right Person?" value={startup.why_right_person} />
            </Section>

            <Section title="Startup Concept" icon="💡">
                <InfoRow label="Describe in 5 Words" value={startup.five_word_description} />
                <InfoRow label="Elevator Pitch" value={startup.elevator_pitch} />
                <InfoRow label="Problem Statement" value={startup.problem_statement} />
                <InfoRow label="Target Customer" value={startup.target_customer} />
                <InfoRow label="Differentiation" value={startup.differentiation} />
                <InfoRow label="Market Size" value={startup.market_size} />
                <InfoRow label="Current Stage" value={startup.current_stage} />
            </Section>

            <Section title="Product / Service Details" icon="💰">
                <InfoRow label="Products / Services" value={startup.products_services} />
                <InfoRow label="Pricing" value={startup.pricing} />
                <InfoRow label="Avg Order Value" value={startup.average_order_value ? `₹${startup.average_order_value.toLocaleString()}` : null} />
                <InfoRow label="Monthly Sales Volume" value={startup.monthly_sales_volume} />
                <InfoRow label="Gross Margin" value={startup.gross_margin ? `${startup.gross_margin}%` : null} />
                <InfoRow label="Net Profit Margin" value={startup.net_profit_margin ? `${startup.net_profit_margin}%` : null} />
                <InfoRow label="Cost of Production" value={startup.cost_of_production ? `₹${startup.cost_of_production.toLocaleString()}` : null} />
                <InfoRow label="Marketing CAC" value={startup.marketing_cac ? `₹${startup.marketing_cac.toLocaleString()}` : null} />
                <InfoRow label="Delivery Cost" value={startup.delivery_cost ? `₹${startup.delivery_cost.toLocaleString()}` : null} />
                <InfoRow label="Contribution Margin" value={startup.contribution_margin ? `₹${startup.contribution_margin.toLocaleString()}` : null} />
            </Section>

            <Section title="Traction & Revenue" icon="📈">
                <InfoRow label="Generating Revenue?" value={startup.is_generating_revenue} />
                <InfoRow label="Revenue Year 1" value={startup.revenue_year1 ? `₹${startup.revenue_year1.toLocaleString()}` : null} />
                <InfoRow label="Revenue Year 2" value={startup.revenue_year2 ? `₹${startup.revenue_year2.toLocaleString()}` : null} />
                <InfoRow label="Revenue Year 3" value={startup.revenue_year3 ? `₹${startup.revenue_year3.toLocaleString()}` : null} />
                <InfoRow label="Current Monthly Revenue" value={startup.current_monthly_revenue ? `₹${startup.current_monthly_revenue.toLocaleString()}/mo` : null} />
                <InfoRow label="Monthly Growth Rate" value={startup.monthly_growth_rate ? `${startup.monthly_growth_rate}%` : null} />
                <InfoRow label="Retention Rate" value={startup.retention_rate ? `${startup.retention_rate}%` : null} />
                <InfoRow label="Active Customers" value={startup.active_customers} />
                <InfoRow label="Key Partnerships" value={startup.partnerships} />
            </Section>

            <Section title="Business Model" icon="🔄">
                <InfoRow label="Revenue Model" value={startup.revenue_model} />
                <InfoRow label="Acquisition Channels" value={startup.acquisition_channels} />
                <InfoRow label="CAC" value={startup.cac ? `₹${startup.cac.toLocaleString()}` : null} />
                <InfoRow label="LTV" value={startup.ltv ? `₹${startup.ltv.toLocaleString()}` : null} />
                <InfoRow label="LTV / CAC Ratio" value={startup.ltv_cac_ratio ? `${startup.ltv_cac_ratio}x` : null} />
            </Section>

            <Section title="Investment & Fundraising" icon="🎯">
                <InfoRow label="Raised Funds Before?" value={startup.raised_before} />
                <InfoRow label="Previous Funding" value={startup.previous_funding} />
                <InfoRow label="Investment Seeking" value={startup.investment_seeking ? `₹${startup.investment_seeking.toLocaleString()}` : null} />
                <InfoRow label="Equity Offered" value={startup.equity_offered ? `${startup.equity_offered}%` : null} />
                <InfoRow label="Pre-Money Valuation" value={startup.pre_money_valuation ? `₹${startup.pre_money_valuation.toLocaleString()}` : null} />
                <InfoRow label="Post-Money Valuation" value={startup.post_money_valuation ? `₹${startup.post_money_valuation.toLocaleString()}` : null} />
                <InfoRow label="Fund Utilization" value={startup.fund_utilization} />
                <InfoRow label="Runway" value={startup.runway_months ? `${startup.runway_months} months` : null} />
            </Section>

            <Section title="Team" icon="👥">
                <InfoRow label="Core Team" value={startup.core_team} />
                <InfoRow label="Planned Hires" value={startup.planned_hires} />
                <InfoRow label="Advisory Board" value={startup.advisory_board} />
            </Section>

            <Section title="Scalability & Vision" icon="🔭">
                <InfoRow label="3-Year Revenue Projection" value={startup.revenue_projection_3y} />
                <InfoRow label="5-Year Vision" value={startup.vision_5y} />
                <InfoRow label="Exit Strategy" value={startup.exit_strategy} />
            </Section>

            <Section title="Readiness for Pitch Studio" icon="🚀">
                <InfoRow label="Pitch Deck" value={startup.pitch_deck_link} isLink />
                <InfoRow label="Financial Projections" value={startup.financial_projection_link} isLink />
                <InfoRow label="Prepared for Q&A" value={startup.prepared_for_qa} />
                <InfoRow label="Why Shortlist?" value={startup.why_shortlist} />
            </Section>

            <div className="text-center py-6 text-neutral-800 text-xs tracking-wide">
                Application submitted on{' '}
                {new Date(startup.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
            </div>
        </div>
    );
}
