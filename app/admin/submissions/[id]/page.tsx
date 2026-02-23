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
    Building2,
    Globe,
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

    if (!startup) {
        return (
            <div style={{ textAlign: 'center', padding: '60px' }}>
                <h2 style={{ marginBottom: '12px' }}>Startup Not Found</h2>
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
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: 'var(--brand-primary-light)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    {value.length > 40 ? value.slice(0, 40) + '...' : value}
                    <ExternalLink size={12} />
                </a>
            );
        } else {
            displayValue = String(value);
        }

        return (
            <div
                style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border-color)',
                }}
            >
                <span
                    style={{
                        fontSize: '0.85rem',
                        color: 'var(--foreground-dimmed)',
                        minWidth: '180px',
                        flexShrink: 0,
                    }}
                >
                    {label}
                </span>
                <span
                    style={{
                        fontSize: '0.9rem',
                        color: 'var(--foreground-muted)',
                        wordBreak: 'break-word',
                    }}
                >
                    {displayValue}
                </span>
            </div>
        );
    };

    const Section = ({
        title,
        icon,
        children,
    }: {
        title: string;
        icon: string;
        children: React.ReactNode;
    }) => (
        <div
            className="glass-card-subtle"
            style={{ padding: '24px', marginBottom: '16px' }}
        >
            <h3
                style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                <span>{icon}</span>
                {title}
            </h3>
            {children}
        </div>
    );

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}
            >
                <div>
                    <button
                        onClick={() => router.back()}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--foreground-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.85rem',
                            marginBottom: '12px',
                            padding: 0,
                        }}
                    >
                        <ArrowLeft size={16} />
                        Back to submissions
                    </button>
                    <h1
                        style={{
                            fontSize: '1.8rem',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            marginBottom: '8px',
                        }}
                    >
                        {startup.startup_name}
                    </h1>
                    <div
                        style={{
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            fontSize: '0.9rem',
                            color: 'var(--foreground-muted)',
                        }}
                    >
                        {startup.city && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={14} /> {startup.city}{startup.country ? `, ${startup.country}` : ''}
                            </span>
                        )}
                        {startup.email && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Mail size={14} /> {startup.email}
                            </span>
                        )}
                        {startup.contact_number && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Phone size={14} /> {startup.contact_number}
                            </span>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span
                        className={`badge ${startup.status === 'Selected' ? 'badge-selected' : 'badge-pending'
                            }`}
                        style={{ fontSize: '0.85rem', padding: '6px 16px' }}
                    >
                        {startup.status === 'Selected' ? (
                            <Star size={12} style={{ marginRight: '4px' }} />
                        ) : (
                            <Clock size={12} style={{ marginRight: '4px' }} />
                        )}
                        {startup.status}
                    </span>
                    <button
                        onClick={handleStatusToggle}
                        disabled={updating}
                        className={
                            startup.status === 'Selected' ? 'btn-secondary btn-sm' : 'btn-primary btn-sm'
                        }
                    >
                        {updating ? (
                            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : startup.status === 'Selected' ? (
                            'Move to Pending'
                        ) : (
                            <>
                                <Star size={14} /> Select
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Section: Basic Info */}
            <Section title="Basic Information" icon="🏢">
                <InfoRow label="Startup Name" value={startup.startup_name} />
                <InfoRow label="Founder Name(s)" value={startup.founder_names} />
                <InfoRow label="Designation (CEO / Co-founder / etc.)" value={startup.designation} />
                <InfoRow label="Year of Incorporation" value={startup.year_of_incorporation} />
                <InfoRow label="Legal Structure" value={startup.legal_structure} />
                <InfoRow label="Website (if any)" value={startup.website} isLink />
                <InfoRow label="Instagram" value={startup.instagram} isLink />
                <InfoRow label="LinkedIn" value={startup.linkedin} isLink />
                <InfoRow label="Facebook" value={startup.facebook} isLink />
                <InfoRow label="YouTube" value={startup.youtube} isLink />
            </Section>

            {/* Section: Founder Profile */}
            <Section title="Founder Profile" icon="👤">
                <InfoRow label="Founder's Educational Background" value={startup.education} />
                <InfoRow label="Total Years of Experience" value={startup.total_experience_years ? `${startup.total_experience_years} years` : null} />
                <InfoRow label="Industry Experience (Relevant to Startup)" value={startup.industry_experience} />
                <InfoRow label="Previous Startup Experience (if any)" value={startup.previous_startup_experience} />
                <InfoRow label="Why Are You the Right Person to Solve This Problem?" value={startup.why_right_person} />
            </Section>

            {/* Section: Startup Concept */}
            <Section title="Startup Concept" icon="💡">
                <InfoRow label="Describe Your Startup in 5 Words" value={startup.five_word_description} />
                <InfoRow label="One-line Elevator Pitch" value={startup.elevator_pitch} />
                <InfoRow label="What Problem Are You Solving?" value={startup.problem_statement} />
                <InfoRow label="Who Is Your Target Customer?" value={startup.target_customer} />
                <InfoRow label="What Is Your Unique Differentiation?" value={startup.differentiation} />
                <InfoRow label="Market Size (TAM / SAM / SOM)" value={startup.market_size} />
                <InfoRow label="Current Stage" value={startup.current_stage} />
            </Section>

            {/* Section: Financials */}
            <Section title="Product / Service Details" icon="💰">
                <InfoRow label="Products / Services" value={startup.products_services} />
                <InfoRow label="Pricing of Each Product / Service" value={startup.pricing} />
                <InfoRow label="Average Order Value (AOV)" value={startup.average_order_value ? `₹${startup.average_order_value.toLocaleString()}` : null} />
                <InfoRow label="Monthly Sales Volume (Units)" value={startup.monthly_sales_volume} />
                <InfoRow label="Gross Margin %" value={startup.gross_margin ? `${startup.gross_margin}%` : null} />
                <InfoRow label="Net Profit Margin %" value={startup.net_profit_margin ? `${startup.net_profit_margin}%` : null} />
                <InfoRow label="Cost of Production" value={startup.cost_of_production ? `₹${startup.cost_of_production.toLocaleString()}` : null} />
                <InfoRow label="Marketing Cost per Acquisition" value={startup.marketing_cac ? `₹${startup.marketing_cac.toLocaleString()}` : null} />
                <InfoRow label="Delivery / Service Cost" value={startup.delivery_cost ? `₹${startup.delivery_cost.toLocaleString()}` : null} />
                <InfoRow label="Contribution Margin per Unit" value={startup.contribution_margin ? `₹${startup.contribution_margin.toLocaleString()}` : null} />
            </Section>

            {/* Section: Traction */}
            <Section title="Traction & Revenue" icon="📈">
                <InfoRow label="Are You Generating Revenue?" value={startup.is_generating_revenue} />
                <InfoRow label="Revenue Year 1" value={startup.revenue_year1 ? `₹${startup.revenue_year1.toLocaleString()}` : null} />
                <InfoRow label="Revenue Year 2" value={startup.revenue_year2 ? `₹${startup.revenue_year2.toLocaleString()}` : null} />
                <InfoRow label="Revenue Year 3" value={startup.revenue_year3 ? `₹${startup.revenue_year3.toLocaleString()}` : null} />
                <InfoRow label="Current Monthly Revenue" value={startup.current_monthly_revenue ? `₹${startup.current_monthly_revenue.toLocaleString()}/mo` : null} />
                <InfoRow label="Monthly Growth Rate" value={startup.monthly_growth_rate ? `${startup.monthly_growth_rate}%` : null} />
                <InfoRow label="Customer Retention Rate" value={startup.retention_rate ? `${startup.retention_rate}%` : null} />
                <InfoRow label="Number of Active Customers" value={startup.active_customers} />
                <InfoRow label="Key Partnerships" value={startup.partnerships} />
            </Section>

            {/* Section: Business Model */}
            <Section title="Business Model" icon="🔄">
                <InfoRow label="Revenue Model" value={startup.revenue_model} />
                <InfoRow label="Customer Acquisition Channels" value={startup.acquisition_channels} />
                <InfoRow label="Customer Acquisition Cost (CAC)" value={startup.cac ? `₹${startup.cac.toLocaleString()}` : null} />
                <InfoRow label="Lifetime Value (LTV)" value={startup.ltv ? `₹${startup.ltv.toLocaleString()}` : null} />
                <InfoRow label="LTV / CAC Ratio" value={startup.ltv_cac_ratio ? `${startup.ltv_cac_ratio}x` : null} />
            </Section>

            {/* Section: Fundraising */}
            <Section title="Investment & Fundraising" icon="🎯">
                <InfoRow label="Have You Raised Funds Before?" value={startup.raised_before} />
                <InfoRow label="If Yes, How Much and From Whom?" value={startup.previous_funding} />
                <InfoRow label="How Much Investment Are You Seeking?" value={startup.investment_seeking ? `₹${startup.investment_seeking.toLocaleString()}` : null} />
                <InfoRow label="Equity Offered (Dilution %)" value={startup.equity_offered ? `${startup.equity_offered}%` : null} />
                <InfoRow label="Pre-Money Valuation" value={startup.pre_money_valuation ? `₹${startup.pre_money_valuation.toLocaleString()}` : null} />
                <InfoRow label="Post-Money Valuation" value={startup.post_money_valuation ? `₹${startup.post_money_valuation.toLocaleString()}` : null} />
                <InfoRow label="Fund Utilization Plan (Breakdown %)" value={startup.fund_utilization} />
                <InfoRow label="Runway After Investment" value={startup.runway_months ? `${startup.runway_months} months` : null} />
            </Section>

            {/* Section: Team */}
            <Section title="Team" icon="👥">
                <InfoRow label="Core Team Members & Roles" value={startup.core_team} />
                <InfoRow label="Key Hires Planned" value={startup.planned_hires} />
                <InfoRow label="Advisory Board (if any)" value={startup.advisory_board} />
            </Section>

            {/* Section: Vision */}
            <Section title="Scalability & Vision" icon="🔭">
                <InfoRow label="3-Year Revenue Projection" value={startup.revenue_projection_3y} />
                <InfoRow label="5-Year Vision" value={startup.vision_5y} />
                <InfoRow label="Exit Strategy" value={startup.exit_strategy} />
            </Section>

            {/* Section: Pitch Readiness */}
            <Section title="Readiness for Pitch Studio" icon="🚀">
                <InfoRow label="Pitch Deck (Upload Link)" value={startup.pitch_deck_link} isLink />
                <InfoRow label="Financial Projections in Excel" value={startup.financial_projection_link} isLink />
                <InfoRow label="Prepared for Investor Q&A" value={startup.prepared_for_qa} />
                <InfoRow label="Why Should We Shortlist You?" value={startup.why_shortlist} />
            </Section>

            {/* Meta info */}
            <div
                style={{
                    textAlign: 'center',
                    padding: '24px',
                    color: 'var(--foreground-dimmed)',
                    fontSize: '0.8rem',
                }}
            >
                Application submitted on{' '}
                {new Date(startup.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </div>
        </div>
    );
}
