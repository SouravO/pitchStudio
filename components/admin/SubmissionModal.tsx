'use client';

import React from 'react';
import { Startup } from '@/types/startup';
import {
    X,
    Building2,
    User,
    Lightbulb,
    IndianRupee,
    TrendingUp,
    RefreshCw,
    Target,
    Users,
    Telescope,
    Rocket,
    ExternalLink,
    MapPin,
    Calendar,
    Globe,
    Linkedin,
    Instagram,
    Facebook,
    Youtube,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from 'lucide-react';

interface SubmissionModalProps {
    startup: Startup;
    isOpen: boolean;
    onClose: () => void;
    onToggleStatus: (id: string, currentStatus: string) => Promise<void>;
    isToggling: boolean;
}

export default function SubmissionModal({
    startup,
    isOpen,
    onClose,
    onToggleStatus,
    isToggling,
}: SubmissionModalProps) {
    if (!isOpen) return null;

    const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
        <div style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid #111', paddingBottom: '10px' }}>
                <Icon size={16} style={{ color: '#555' }} />
                <h3 style={{ fontSize: '0.7rem', fontWeight: 600, color: '#999', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{title}</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {children}
            </div>
        </div>
    );

    const DetailItem = ({ label, value, fullWidth = false }: { label: string, value: any, fullWidth?: boolean }) => {
        if (value === null || value === undefined || value === '') return null;

        return (
            <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
                <label style={{ display: 'block', fontSize: '0.65rem', color: '#444', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {label}
                </label>
                <div style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.6 }}>
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                </div>
            </div>
        );
    };

    const SocialLink = ({ icon: Icon, url, label }: { icon: any, url: string | null, label: string }) => {
        if (!url) return null;
        return (
            <a
                href={url.startsWith('http') ? url : `https://${url}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#999', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
            >
                <Icon size={14} />
                {label}
            </a>
        );
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#0a0a0a',
                    width: '100%',
                    maxWidth: '1000px',
                    maxHeight: '90vh',
                    borderRadius: '12px',
                    border: '1px solid #111',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#050505' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>{startup.startup_name}</h2>
                            <span className={`badge ${startup.status === 'Selected' ? 'badge-selected' : 'badge-pending'}`} style={{ fontSize: '0.65rem' }}>
                                {startup.status}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#555', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> {startup.founder_names}</div>
                            {startup.city && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {startup.city}, {startup.country}</div>}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {new Date(startup.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => onToggleStatus(startup.id, startup.status)}
                            disabled={isToggling}
                            style={{
                                padding: '9px 20px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                letterSpacing: '0.05em',
                                borderRadius: '8px',
                                cursor: isToggling ? 'wait' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s',
                                border: startup.status === 'Selected' ? '1px solid #222' : 'none',
                                background: startup.status === 'Selected' ? 'transparent' : '#fff',
                                color: startup.status === 'Selected' ? '#999' : '#000',
                            }}
                        >
                            {isToggling ? (
                                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                            ) : startup.status === 'Selected' ? (
                                <> <AlertCircle size={14} /> MARK PENDING </>
                            ) : (
                                <> <CheckCircle2 size={14} /> SELECT </>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', padding: '4px' }}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
                    <Section title="Basic Information" icon={Building2}>
                        <DetailItem label="Startup Name" value={startup.startup_name} />
                        <DetailItem label="Founder Name(s)" value={startup.founder_names} />
                        <DetailItem label="Email" value={startup.email} />
                        <DetailItem label="Contact" value={startup.contact_number} />
                        <DetailItem label="Designation" value={startup.designation} />
                        <DetailItem label="City" value={startup.city} />
                        <DetailItem label="Country" value={startup.country} />
                        <DetailItem label="Year of Incorporation" value={startup.year_of_incorporation} />
                        <DetailItem label="Legal Structure" value={startup.legal_structure} />
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '10px' }}>
                            <SocialLink icon={Globe} url={startup.website} label="Website" />
                            <SocialLink icon={Linkedin} url={startup.linkedin} label="LinkedIn" />
                            <SocialLink icon={Instagram} url={startup.instagram} label="Instagram" />
                            <SocialLink icon={Facebook} url={startup.facebook} label="Facebook" />
                            <SocialLink icon={Youtube} url={startup.youtube} label="YouTube" />
                        </div>
                    </Section>

                    <Section title="Founder Profile" icon={User}>
                        <DetailItem label="Education" value={startup.education} fullWidth />
                        <DetailItem label="Total Experience" value={startup.total_experience_years ? `${startup.total_experience_years} years` : null} />
                        <DetailItem label="Industry Experience" value={startup.industry_experience} fullWidth />
                        <DetailItem label="Previous Startups" value={startup.previous_startup_experience} fullWidth />
                        <DetailItem label="Why Right Person?" value={startup.why_right_person} fullWidth />
                    </Section>

                    <Section title="Startup Concept" icon={Lightbulb}>
                        <DetailItem label="Five Word Description" value={startup.five_word_description} fullWidth />
                        <DetailItem label="Elevator Pitch" value={startup.elevator_pitch} fullWidth />
                        <DetailItem label="Problem Statement" value={startup.problem_statement} fullWidth />
                        <DetailItem label="Target Customer" value={startup.target_customer} fullWidth />
                        <DetailItem label="Differentiation" value={startup.differentiation} fullWidth />
                        <DetailItem label="Market Size" value={startup.market_size} />
                        <DetailItem label="Current Stage" value={startup.current_stage} />
                    </Section>

                    <Section title="Product / Service Details" icon={IndianRupee}>
                        <DetailItem label="Products/Services" value={startup.products_services} fullWidth />
                        <DetailItem label="Pricing" value={startup.pricing} fullWidth />
                        <DetailItem label="Avg Order Value" value={startup.average_order_value} />
                        <DetailItem label="Monthly Sales Volume" value={startup.monthly_sales_volume} />
                        <DetailItem label="Gross Margin" value={startup.gross_margin ? `${startup.gross_margin}%` : null} />
                        <DetailItem label="Net Profit Margin" value={startup.net_profit_margin ? `${startup.net_profit_margin}%` : null} />
                        <DetailItem label="Cost of Production" value={startup.cost_of_production} />
                        <DetailItem label="Marketing CAC" value={startup.marketing_cac} />
                        <DetailItem label="Delivery Cost" value={startup.delivery_cost} />
                        <DetailItem label="Contribution Margin" value={startup.contribution_margin} />
                    </Section>

                    <Section title="Traction & Revenue" icon={TrendingUp}>
                        <DetailItem label="Generating Revenue?" value={startup.is_generating_revenue} />
                        <DetailItem label="Monthly Revenue" value={startup.current_monthly_revenue ? `₹${startup.current_monthly_revenue.toLocaleString()}` : null} />
                        <DetailItem label="Monthly Growth" value={startup.monthly_growth_rate ? `${startup.monthly_growth_rate}%` : null} />
                        <DetailItem label="Retention Rate" value={startup.retention_rate ? `${startup.retention_rate}%` : null} />
                        <DetailItem label="Active Customers" value={startup.active_customers} />
                        <DetailItem label="Revenue (Year 1)" value={startup.revenue_year1} />
                        <DetailItem label="Revenue (Year 2)" value={startup.revenue_year2} />
                        <DetailItem label="Revenue (Year 3)" value={startup.revenue_year3} />
                        <DetailItem label="Partnerships" value={startup.partnerships} fullWidth />
                    </Section>

                    <Section title="Business Model" icon={RefreshCw}>
                        <DetailItem label="Revenue Model" value={startup.revenue_model} fullWidth />
                        <DetailItem label="Acquisition Channels" value={startup.acquisition_channels} fullWidth />
                        <DetailItem label="CAC" value={startup.cac} />
                        <DetailItem label="LTV" value={startup.ltv} />
                        <DetailItem label="LTV/CAC Ratio" value={startup.ltv_cac_ratio} />
                    </Section>

                    <Section title="Investment & Fundraising" icon={Target}>
                        <DetailItem label="Raised Before?" value={startup.raised_before} />
                        <DetailItem label="Previous Funding" value={startup.previous_funding} fullWidth />
                        <DetailItem label="Investment Seeking" value={startup.investment_seeking ? `₹${startup.investment_seeking.toLocaleString()}` : null} />
                        <DetailItem label="Equity Offered" value={startup.equity_offered ? `${startup.equity_offered}%` : null} />
                        <DetailItem label="Pre-money Valuation" value={startup.pre_money_valuation} />
                        <DetailItem label="Post-money Valuation" value={startup.post_money_valuation} />
                        <DetailItem label="Runway (Months)" value={startup.runway_months} />
                        <DetailItem label="Fund Utilization" value={startup.fund_utilization} fullWidth />
                    </Section>

                    <Section title="Team" icon={Users}>
                        <DetailItem label="Core Team" value={startup.core_team} fullWidth />
                        <DetailItem label="Planned Hires" value={startup.planned_hires} fullWidth />
                        <DetailItem label="Advisory Board" value={startup.advisory_board} fullWidth />
                    </Section>

                    <Section title="Scalability & Vision" icon={Telescope}>
                        <DetailItem label="3 Year Revenue Projection" value={startup.revenue_projection_3y} fullWidth />
                        <DetailItem label="5 Year Vision" value={startup.vision_5y} fullWidth />
                        <DetailItem label="Exit Strategy" value={startup.exit_strategy} fullWidth />
                    </Section>

                    <Section title="Readiness for Pitch Studio" icon={Rocket}>
                        <DetailItem label="Prepared for Q&A?" value={startup.prepared_for_qa} />
                        <DetailItem label="Why should we shortlist you?" value={startup.why_shortlist} fullWidth />
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '10px' }}>
                            {startup.pitch_deck_link && (
                                <a
                                    href={startup.pitch_deck_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
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
                                        textDecoration: 'none',
                                    }}
                                >
                                    <ExternalLink size={12} /> View Pitch Deck
                                </a>
                            )}
                            {startup.financial_projection_link && (
                                <a
                                    href={startup.financial_projection_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
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
                                        textDecoration: 'none',
                                    }}
                                >
                                    <ExternalLink size={12} /> View Financial Projections
                                </a>
                            )}
                        </div>
                    </Section>
                </div>

                {/* Footer */}
                <div style={{ padding: '14px 32px', borderTop: '1px solid #111', background: '#050505', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#333', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                    <div>ID: {startup.id}</div>
                    <div>Applied: {new Date(startup.created_at).toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}
