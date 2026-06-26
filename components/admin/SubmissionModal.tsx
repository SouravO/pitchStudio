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
    startup, isOpen, onClose, onToggleStatus, isToggling,
}: SubmissionModalProps) {
    if (!isOpen) return null;

    const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
        <div className="mb-9">
            <div className="flex items-center gap-2.5 mb-4.5 border-b border-neutral-900 pb-2.5">
                <Icon size={16} className="text-neutral-600" />
                <h3 className="text-[0.7rem] font-semibold text-neutral-500 tracking-wider uppercase">{title}</h3>
            </div>
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {children}
            </div>
        </div>
    );

    const DetailItem = ({ label, value, fullWidth = false }: { label: string, value: any, fullWidth?: boolean }) => {
        if (value === null || value === undefined || value === '') return null;
        return (
            <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
                <label className="block text-[0.65rem] text-neutral-700 mb-1 uppercase tracking-wide">{label}</label>
                <div className="text-sm text-white leading-relaxed">
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                </div>
            </div>
        );
    };

    const SocialLink = ({ icon: Icon, url, label }: { icon: any, url: string | null, label: string }) => {
        if (!url) return null;
        return (
            <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-neutral-500 no-underline text-sm hover:text-neutral-300 transition-colors">
                <Icon size={14} /> {label}
            </a>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur z-1000 flex items-center justify-center p-5"
            onClick={onClose}>
            <div className="bg-neutral-950 w-full max-w-250 max-h-[90vh] rounded-xl border border-neutral-900 flex flex-col overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}>
                <div className="px-8 py-6 border-b border-neutral-900 flex justify-between items-start bg-neutral-900/50">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold tracking-tight text-white">{startup.startup_name}</h2>
                            <span className={`badge ${startup.status === 'Selected' ? 'badge-selected' : 'badge-pending'} text-[0.65rem]`}>
                                {startup.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-neutral-600 text-sm">
                            <div className="flex items-center gap-1.5"><User size={14} /> {startup.founder_names}</div>
                            {startup.city && <div className="flex items-center gap-1.5"><MapPin size={14} /> {startup.city}, {startup.country}</div>}
                            <div className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(startup.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => onToggleStatus(startup.id, startup.status)} disabled={isToggling}
                            className={`px-5 py-2 text-xs font-semibold tracking-wide rounded-lg flex items-center gap-1.5 transition-all duration-200 ${isToggling ? 'cursor-wait' : 'cursor-pointer'} ${startup.status === 'Selected'
                                ? 'bg-transparent border border-neutral-800 text-neutral-500'
                                : 'bg-white text-black border-none'
                                }`}>
                            {isToggling ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : startup.status === 'Selected' ? (
                                <><AlertCircle size={14} /> MARK PENDING</>
                            ) : (
                                <><CheckCircle2 size={14} /> SELECT</>
                            )}
                        </button>
                        <button onClick={onClose} className="bg-none border-none text-neutral-800 cursor-pointer p-1">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-8 overflow-y-auto flex-1">
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
                        <div className="col-span-full flex flex-wrap gap-5 mt-2.5">
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
                        <div className="col-span-full flex flex-wrap gap-4 mt-2.5">
                            {startup.pitch_deck_link && (
                                <a href={startup.pitch_deck_link} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-4 py-2 bg-transparent border border-neutral-800 rounded-md text-neutral-500 text-xs no-underline hover:text-neutral-300 transition-colors">
                                    <ExternalLink size={12} /> View Pitch Deck
                                </a>
                            )}
                            {startup.financial_projection_link && (
                                <a href={startup.financial_projection_link} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-4 py-2 bg-transparent border border-neutral-800 rounded-md text-neutral-500 text-xs no-underline hover:text-neutral-300 transition-colors">
                                    <ExternalLink size={12} /> View Financial Projections
                                </a>
                            )}
                        </div>
                    </Section>
                </div>

                <div className="px-8 py-3.5 border-t border-neutral-900 bg-neutral-900/50 flex justify-between items-center text-neutral-800 text-[0.7rem] tracking-wide">
                    <div>ID: {startup.id}</div>
                    <div>Applied: {new Date(startup.created_at).toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}
