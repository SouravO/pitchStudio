'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Rocket, ArrowLeft, ArrowRight, Send, Loader2 } from 'lucide-react';
import StepIndicator from '@/components/forms/StepIndicator';
import FormInput from '@/components/ui/FormInput';
import FormTextarea from '@/components/ui/FormTextarea';
import FormSelect from '@/components/ui/FormSelect';
import { submitStartup } from '@/lib/actions';
import { StartupFormData } from '@/types/startup';

const initialFormData: StartupFormData = {
    // Basic Info
    startup_name: '',
    founder_names: '',
    designation: '',
    contact_number: '',
    email: '',
    city: '',
    country: '',
    website: '',
    instagram: '',
    linkedin: '',
    facebook: '',
    youtube: '',
    year_of_incorporation: null,
    legal_structure: '',
    // Founder Profile
    education: '',
    total_experience_years: null,
    industry_experience: '',
    previous_startup_experience: '',
    why_right_person: '',
    // Startup Concept
    five_word_description: '',
    elevator_pitch: '',
    problem_statement: '',
    target_customer: '',
    differentiation: '',
    market_size: '',
    current_stage: '',
    // Financials
    products_services: '',
    pricing: '',
    average_order_value: null,
    monthly_sales_volume: null,
    gross_margin: null,
    net_profit_margin: null,
    cost_of_production: null,
    marketing_cac: null,
    delivery_cost: null,
    contribution_margin: null,
    // Traction
    is_generating_revenue: null,
    revenue_year1: null,
    revenue_year2: null,
    revenue_year3: null,
    current_monthly_revenue: null,
    monthly_growth_rate: null,
    retention_rate: null,
    active_customers: null,
    partnerships: '',
    // Business Model
    revenue_model: '',
    acquisition_channels: '',
    cac: null,
    ltv: null,
    ltv_cac_ratio: null,
    // Fundraising
    raised_before: null,
    previous_funding: '',
    investment_seeking: null,
    equity_offered: null,
    pre_money_valuation: null,
    post_money_valuation: null,
    fund_utilization: '',
    runway_months: null,
    // Team
    core_team: '',
    planned_hires: '',
    advisory_board: '',
    // Vision
    revenue_projection_3y: '',
    vision_5y: '',
    exit_strategy: '',
    // Pitch Readiness
    pitch_deck_link: '',
    financial_projection_link: '',
    prepared_for_qa: null,
    why_shortlist: '',
};

export default function FormPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<StartupFormData>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        let parsedValue: string | number | boolean | null = value;

        if (type === 'number') {
            parsedValue = value === '' ? null : Number(value);
        }

        setFormData((prev) => ({ ...prev, [name]: parsedValue }));

        // Clear error on change
        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const handleBooleanChange = (name: string, value: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateStep = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (currentStep === 1) {
            if (!formData.startup_name.trim()) newErrors.startup_name = 'Startup name is required';
            if (!formData.founder_names.trim()) newErrors.founder_names = 'Founder name(s) required';
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Invalid email format';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep((prev) => Math.min(prev + 1, 10));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        setIsSubmitting(true);
        try {
            const result = await submitStartup(formData);
            if (result.success) {
                toast.success('Your pitch has been submitted successfully! 🎉');
                router.push('/');
            } else {
                toast.error(result.error || 'Failed to submit. Please try again.');
            }
        } catch {
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 20px' }}>
                            <FormInput label="Startup Name" name="startup_name" value={formData.startup_name} onChange={handleChange} required error={errors.startup_name} placeholder="e.g. Acme Inc." />
                            <FormInput label="Founder Name(s)" name="founder_names" value={formData.founder_names} onChange={handleChange} required error={errors.founder_names} placeholder="e.g. John Doe, Jane Smith" />
                            <FormInput label="Designation" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. CEO & Co-founder" />
                            <FormInput label="Contact Number" name="contact_number" type="tel" value={formData.contact_number} onChange={handleChange} placeholder="+91 9876543210" />
                            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required error={errors.email} placeholder="founder@startup.com" />
                            <FormInput label="City" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Bangalore" />
                            <FormInput label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="e.g. India" />
                            <FormInput label="Website" name="website" type="url" value={formData.website} onChange={handleChange} placeholder="https://yourstartup.com" />
                        </div>
                        <div style={{ marginTop: '16px' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--foreground-dimmed)', marginBottom: '12px', fontWeight: 500 }}>Social Media Links</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 20px' }}>
                                <FormInput label="Instagram" name="instagram" type="url" value={formData.instagram} onChange={handleChange} placeholder="https://instagram.com/yourstartup" />
                                <FormInput label="LinkedIn" name="linkedin" type="url" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/company/yourstartup" />
                                <FormInput label="Facebook" name="facebook" type="url" value={formData.facebook} onChange={handleChange} placeholder="https://facebook.com/yourstartup" />
                                <FormInput label="YouTube" name="youtube" type="url" value={formData.youtube} onChange={handleChange} placeholder="https://youtube.com/@yourstartup" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 20px', marginTop: '16px' }}>
                            <FormInput label="Year of Incorporation" name="year_of_incorporation" type="number" value={formData.year_of_incorporation} onChange={handleChange} placeholder="e.g. 2023" min={1900} max={2030} />
                            <FormSelect label="Legal Structure" name="legal_structure" value={formData.legal_structure} onChange={handleChange} options={[
                                { value: 'Pvt Ltd', label: 'Private Limited' },
                                { value: 'LLP', label: 'LLP' },
                                { value: 'Partnership', label: 'Partnership' },
                                { value: 'Sole Proprietorship', label: 'Sole Proprietorship' },
                                { value: 'Other', label: 'Other' },
                            ]} />
                        </div>
                    </>
                );

            case 2:
                return (
                    <div style={{ display: 'grid', gap: '0 20px' }}>
                        <FormInput label="Highest Education" name="education" value={formData.education} onChange={handleChange} placeholder="e.g. MBA from IIM Ahmedabad" />
                        <FormInput label="Total Years of Experience" name="total_experience_years" type="number" value={formData.total_experience_years} onChange={handleChange} placeholder="e.g. 8" min={0} />
                        <FormTextarea label="Industry Experience" name="industry_experience" value={formData.industry_experience} onChange={handleChange} placeholder="Describe your relevant industry experience..." maxLength={500} />
                        <FormTextarea label="Previous Startup Experience" name="previous_startup_experience" value={formData.previous_startup_experience} onChange={handleChange} placeholder="Any previous ventures, exits, or startup roles..." maxLength={500} />
                        <FormTextarea label="Why are you the right person for this?" name="why_right_person" value={formData.why_right_person} onChange={handleChange} placeholder="What makes you uniquely positioned to build this startup?" maxLength={1000} />
                    </div>
                );

            case 3:
                return (
                    <div style={{ display: 'grid', gap: '0 20px' }}>
                        <FormInput label="Describe your startup in 5 words" name="five_word_description" value={formData.five_word_description} onChange={handleChange} placeholder="e.g. Making education accessible for all" />
                        <FormTextarea label="Elevator Pitch (30 seconds)" name="elevator_pitch" value={formData.elevator_pitch} onChange={handleChange} placeholder="Describe your startup as if you had 30 seconds in an elevator..." maxLength={500} />
                        <FormTextarea label="Problem Statement" name="problem_statement" value={formData.problem_statement} onChange={handleChange} placeholder="What problem are you solving? Who faces this problem?" maxLength={1000} />
                        <FormInput label="Target Customer" name="target_customer" value={formData.target_customer} onChange={handleChange} placeholder="e.g. Small businesses with 10-50 employees" />
                        <FormTextarea label="What differentiates you?" name="differentiation" value={formData.differentiation} onChange={handleChange} placeholder="What's your unique advantage or moat?" maxLength={500} />
                        <FormInput label="Market Size (TAM/SAM/SOM)" name="market_size" value={formData.market_size} onChange={handleChange} placeholder="e.g. $50B TAM, $5B SAM, $500M SOM" />
                        <FormSelect label="Current Stage" name="current_stage" value={formData.current_stage} onChange={handleChange} options={[
                            { value: 'Idea', label: 'Idea Stage' },
                            { value: 'MVP', label: 'MVP' },
                            { value: 'Early Traction', label: 'Early Traction' },
                            { value: 'Growth', label: 'Growth' },
                            { value: 'Scale', label: 'Scale' },
                        ]} />
                    </div>
                );

            case 4:
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 20px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <FormTextarea label="Products / Services Offered" name="products_services" value={formData.products_services} onChange={handleChange} placeholder="Describe your products or services..." maxLength={500} />
                        </div>
                        <FormInput label="Pricing Model" name="pricing" value={formData.pricing} onChange={handleChange} placeholder="e.g. ₹999/month SaaS subscription" />
                        <FormInput label="Average Order Value (₹)" name="average_order_value" type="number" value={formData.average_order_value} onChange={handleChange} placeholder="e.g. 2500" min={0} />
                        <FormInput label="Monthly Sales Volume" name="monthly_sales_volume" type="number" value={formData.monthly_sales_volume} onChange={handleChange} placeholder="e.g. 500" min={0} />
                        <FormInput label="Gross Margin (%)" name="gross_margin" type="number" value={formData.gross_margin} onChange={handleChange} placeholder="e.g. 65" min={0} max={100} />
                        <FormInput label="Net Profit Margin (%)" name="net_profit_margin" type="number" value={formData.net_profit_margin} onChange={handleChange} placeholder="e.g. 20" />
                        <FormInput label="Cost of Production (₹)" name="cost_of_production" type="number" value={formData.cost_of_production} onChange={handleChange} placeholder="e.g. 350" min={0} />
                        <FormInput label="Marketing / CAC (₹)" name="marketing_cac" type="number" value={formData.marketing_cac} onChange={handleChange} placeholder="e.g. 500" min={0} />
                        <FormInput label="Delivery Cost (₹)" name="delivery_cost" type="number" value={formData.delivery_cost} onChange={handleChange} placeholder="e.g. 150" min={0} />
                        <FormInput label="Contribution Margin (₹)" name="contribution_margin" type="number" value={formData.contribution_margin} onChange={handleChange} placeholder="e.g. 1000" />
                    </div>
                );

            case 5:
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 20px' }}>
                        <div style={{ gridColumn: '1 / -1', marginBottom: '16px' }}>
                            <label className="form-label">Are you currently generating revenue?</label>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                {[true, false].map((val) => (
                                    <button
                                        key={String(val)}
                                        type="button"
                                        onClick={() => handleBooleanChange('is_generating_revenue', val)}
                                        style={{
                                            padding: '10px 24px',
                                            borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${formData.is_generating_revenue === val ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                                            background: formData.is_generating_revenue === val ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                            color: formData.is_generating_revenue === val ? 'var(--brand-primary-light)' : 'var(--foreground-muted)',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {val ? 'Yes' : 'No'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <FormInput label="Revenue Year 1 (₹)" name="revenue_year1" type="number" value={formData.revenue_year1} onChange={handleChange} placeholder="e.g. 500000" min={0} />
                        <FormInput label="Revenue Year 2 (₹)" name="revenue_year2" type="number" value={formData.revenue_year2} onChange={handleChange} placeholder="e.g. 2000000" min={0} />
                        <FormInput label="Revenue Year 3 (₹)" name="revenue_year3" type="number" value={formData.revenue_year3} onChange={handleChange} placeholder="e.g. 8000000" min={0} />
                        <FormInput label="Current Monthly Revenue (₹)" name="current_monthly_revenue" type="number" value={formData.current_monthly_revenue} onChange={handleChange} placeholder="e.g. 150000" min={0} />
                        <FormInput label="Monthly Growth Rate (%)" name="monthly_growth_rate" type="number" value={formData.monthly_growth_rate} onChange={handleChange} placeholder="e.g. 15" />
                        <FormInput label="Retention Rate (%)" name="retention_rate" type="number" value={formData.retention_rate} onChange={handleChange} placeholder="e.g. 85" min={0} max={100} />
                        <FormInput label="Active Customers" name="active_customers" type="number" value={formData.active_customers} onChange={handleChange} placeholder="e.g. 1200" min={0} />
                        <div style={{ gridColumn: '1 / -1' }}>
                            <FormTextarea label="Key Partnerships" name="partnerships" value={formData.partnerships} onChange={handleChange} placeholder="List any notable partnerships or collaborations..." maxLength={500} />
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 20px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <FormSelect label="Revenue Model" name="revenue_model" value={formData.revenue_model} onChange={handleChange} options={[
                                { value: 'SaaS', label: 'SaaS (Subscription)' },
                                { value: 'Marketplace', label: 'Marketplace / Commission' },
                                { value: 'E-commerce', label: 'E-commerce / Direct Sales' },
                                { value: 'Freemium', label: 'Freemium' },
                                { value: 'Advertising', label: 'Advertising' },
                                { value: 'Licensing', label: 'Licensing' },
                                { value: 'Other', label: 'Other' },
                            ]} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <FormTextarea label="Customer Acquisition Channels" name="acquisition_channels" value={formData.acquisition_channels} onChange={handleChange} placeholder="How do you acquire customers? (e.g., organic SEO, paid ads, referrals, partnerships)" maxLength={500} />
                        </div>
                        <FormInput label="Customer Acquisition Cost (₹)" name="cac" type="number" value={formData.cac} onChange={handleChange} placeholder="e.g. 800" min={0} />
                        <FormInput label="Lifetime Value (₹)" name="ltv" type="number" value={formData.ltv} onChange={handleChange} placeholder="e.g. 15000" min={0} />
                        <FormInput label="LTV:CAC Ratio" name="ltv_cac_ratio" type="number" value={formData.ltv_cac_ratio} onChange={handleChange} placeholder="e.g. 3.5" min={0} step="0.1" />
                    </div>
                );

            case 7:
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 20px' }}>
                        <div style={{ gridColumn: '1 / -1', marginBottom: '16px' }}>
                            <label className="form-label">Have you raised funding before?</label>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                {[true, false].map((val) => (
                                    <button
                                        key={String(val)}
                                        type="button"
                                        onClick={() => handleBooleanChange('raised_before', val)}
                                        style={{
                                            padding: '10px 24px',
                                            borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${formData.raised_before === val ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                                            background: formData.raised_before === val ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                            color: formData.raised_before === val ? 'var(--brand-primary-light)' : 'var(--foreground-muted)',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {val ? 'Yes' : 'No'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {formData.raised_before && (
                            <div style={{ gridColumn: '1 / -1' }}>
                                <FormTextarea label="Previous Funding Details" name="previous_funding" value={formData.previous_funding} onChange={handleChange} placeholder="Describe previous rounds (amount, investors, stage)..." maxLength={500} />
                            </div>
                        )}
                        <FormInput label="Investment Seeking (₹)" name="investment_seeking" type="number" value={formData.investment_seeking} onChange={handleChange} placeholder="e.g. 5000000" min={0} />
                        <FormInput label="Equity Offered (%)" name="equity_offered" type="number" value={formData.equity_offered} onChange={handleChange} placeholder="e.g. 10" min={0} max={100} />
                        <FormInput label="Pre-Money Valuation (₹)" name="pre_money_valuation" type="number" value={formData.pre_money_valuation} onChange={handleChange} placeholder="e.g. 50000000" min={0} />
                        <FormInput label="Post-Money Valuation (₹)" name="post_money_valuation" type="number" value={formData.post_money_valuation} onChange={handleChange} placeholder="e.g. 55000000" min={0} />
                        <div style={{ gridColumn: '1 / -1' }}>
                            <FormTextarea label="Fund Utilization Plan" name="fund_utilization" value={formData.fund_utilization} onChange={handleChange} placeholder="How will the raised funds be used? (e.g., 40% product, 30% marketing, 20% hiring, 10% ops)" maxLength={500} />
                        </div>
                        <FormInput label="Runway (months)" name="runway_months" type="number" value={formData.runway_months} onChange={handleChange} placeholder="e.g. 18" min={0} />
                    </div>
                );

            case 8:
                return (
                    <div style={{ display: 'grid', gap: '0 20px' }}>
                        <FormTextarea label="Core Team Members" name="core_team" value={formData.core_team} onChange={handleChange} placeholder="List key team members with their roles and qualifications..." rows={5} maxLength={1000} />
                        <FormTextarea label="Planned Hires (next 12 months)" name="planned_hires" value={formData.planned_hires} onChange={handleChange} placeholder="What roles are you planning to fill?" maxLength={500} />
                        <FormTextarea label="Advisory Board / Mentors" name="advisory_board" value={formData.advisory_board} onChange={handleChange} placeholder="List any advisors or mentors and their expertise..." maxLength={500} />
                    </div>
                );

            case 9:
                return (
                    <div style={{ display: 'grid', gap: '0 20px' }}>
                        <FormTextarea label="Revenue Projection (3 Years)" name="revenue_projection_3y" value={formData.revenue_projection_3y} onChange={handleChange} placeholder="Outline your revenue targets for the next 3 years..." maxLength={500} />
                        <FormTextarea label="5-Year Vision" name="vision_5y" value={formData.vision_5y} onChange={handleChange} placeholder="Where do you see your company in 5 years?" maxLength={1000} />
                        <FormSelect label="Exit Strategy" name="exit_strategy" value={formData.exit_strategy} onChange={handleChange} options={[
                            { value: 'IPO', label: 'IPO' },
                            { value: 'Acquisition', label: 'Acquisition' },
                            { value: 'Merger', label: 'Merger' },
                            { value: 'Buyback', label: 'Buyback' },
                            { value: 'No exit planned', label: 'No exit planned' },
                        ]} />
                    </div>
                );

            case 10:
                return (
                    <div style={{ display: 'grid', gap: '0 20px' }}>
                        <FormInput label="Pitch Deck Link" name="pitch_deck_link" type="url" value={formData.pitch_deck_link} onChange={handleChange} placeholder="https://drive.google.com/..." />
                        <FormInput label="Financial Projections Link" name="financial_projection_link" type="url" value={formData.financial_projection_link} onChange={handleChange} placeholder="https://docs.google.com/..." />
                        <div style={{ marginBottom: '16px' }}>
                            <label className="form-label">Are you prepared for a Q&A session?</label>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                {[true, false].map((val) => (
                                    <button
                                        key={String(val)}
                                        type="button"
                                        onClick={() => handleBooleanChange('prepared_for_qa', val)}
                                        style={{
                                            padding: '10px 24px',
                                            borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${formData.prepared_for_qa === val ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                                            background: formData.prepared_for_qa === val ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                            color: formData.prepared_for_qa === val ? 'var(--brand-primary-light)' : 'var(--foreground-muted)',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {val ? 'Yes' : 'No'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <FormTextarea label="Why should we shortlist you?" name="why_shortlist" value={formData.why_shortlist} onChange={handleChange} placeholder="Tell us what makes your startup stand out..." rows={5} maxLength={1000} />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--gradient-hero)',
                position: 'relative',
            }}
        >
            {/* Navigation */}
            <nav
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 40px',
                    maxWidth: '900px',
                    margin: '0 auto',
                }}
            >
                <Link
                    href="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none',
                        color: 'var(--foreground)',
                    }}
                >
                    <Rocket size={24} style={{ color: 'var(--brand-primary-light)' }} />
                    <span
                        className="gradient-text"
                        style={{ fontSize: '1.2rem', fontWeight: 700 }}
                    >
                        Pitch Studio
                    </span>
                </Link>
            </nav>

            {/* Form Container */}
            <div
                style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    padding: '20px 40px 80px',
                }}
            >
                <div className="glass-card" style={{ padding: '40px' }}>
                    <StepIndicator currentStep={currentStep} />

                    {/* Form Fields */}
                    <div className="animate-fade-in" key={currentStep}>
                        {renderStep()}
                    </div>

                    {/* Navigation Buttons */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '40px',
                            paddingTop: '24px',
                            borderTop: '1px solid var(--border-color)',
                        }}
                    >
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className="btn-secondary btn-sm"
                            style={{
                                opacity: currentStep === 1 ? 0.3 : 1,
                                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            <ArrowLeft size={16} />
                            Previous
                        </button>

                        {currentStep < 10 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="btn-primary btn-sm"
                            >
                                Next
                                <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="btn-primary btn-sm"
                                style={{
                                    opacity: isSubmitting ? 0.7 : 1,
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Submit Pitch
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
