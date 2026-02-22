export interface Startup {
    id: string;

    // Basic Info
    startup_name: string;
    founder_names: string;
    designation: string | null;
    contact_number: string | null;
    email: string;
    city: string | null;
    country: string | null;
    website: string | null;
    instagram: string | null;
    linkedin: string | null;
    facebook: string | null;
    youtube: string | null;
    year_of_incorporation: number | null;
    legal_structure: string | null;

    // Founder Profile
    education: string | null;
    total_experience_years: number | null;
    industry_experience: string | null;
    previous_startup_experience: string | null;
    why_right_person: string | null;

    // Startup Concept
    five_word_description: string | null;
    elevator_pitch: string | null;
    problem_statement: string | null;
    target_customer: string | null;
    differentiation: string | null;
    market_size: string | null;
    current_stage: string | null;

    // Financials
    products_services: string | null;
    pricing: string | null;
    average_order_value: number | null;
    monthly_sales_volume: number | null;
    gross_margin: number | null;
    net_profit_margin: number | null;
    cost_of_production: number | null;
    marketing_cac: number | null;
    delivery_cost: number | null;
    contribution_margin: number | null;

    // Traction
    is_generating_revenue: boolean | null;
    revenue_year1: number | null;
    revenue_year2: number | null;
    revenue_year3: number | null;
    current_monthly_revenue: number | null;
    monthly_growth_rate: number | null;
    retention_rate: number | null;
    active_customers: number | null;
    partnerships: string | null;

    // Business Model
    revenue_model: string | null;
    acquisition_channels: string | null;
    cac: number | null;
    ltv: number | null;
    ltv_cac_ratio: number | null;

    // Fundraising
    raised_before: boolean | null;
    previous_funding: string | null;
    investment_seeking: number | null;
    equity_offered: number | null;
    pre_money_valuation: number | null;
    post_money_valuation: number | null;
    fund_utilization: string | null;
    runway_months: number | null;

    // Team
    core_team: string | null;
    planned_hires: string | null;
    advisory_board: string | null;

    // Vision
    revenue_projection_3y: string | null;
    vision_5y: string | null;
    exit_strategy: string | null;

    // Pitch Readiness
    pitch_deck_link: string | null;
    financial_projection_link: string | null;
    prepared_for_qa: boolean | null;
    why_shortlist: string | null;

    // Admin
    status: 'Pending' | 'Selected';
    created_at: string;
}

// Form data type (without auto-generated fields)
export type StartupFormData = Omit<Startup, 'id' | 'status' | 'created_at'>;

// Form section definitions for the multi-step form
export interface FormSection {
    id: number;
    title: string;
    subtitle: string;
    icon: string;
}

export const FORM_SECTIONS: FormSection[] = [
    { id: 1, title: 'Basic Information', subtitle: 'Tell us about your startup', icon: '🏢' },
    { id: 2, title: 'Founder Profile', subtitle: 'Your background & expertise', icon: '👤' },
    { id: 3, title: 'Startup Concept', subtitle: 'What makes you unique', icon: '💡' },
    { id: 4, title: 'Financials', subtitle: 'Your numbers & unit economics', icon: '💰' },
    { id: 5, title: 'Traction', subtitle: 'Revenue & growth metrics', icon: '📈' },
    { id: 6, title: 'Business Model', subtitle: 'How you make money', icon: '🔄' },
    { id: 7, title: 'Fundraising', subtitle: 'Investment details', icon: '🎯' },
    { id: 8, title: 'Team', subtitle: 'Your people & culture', icon: '👥' },
    { id: 9, title: 'Vision', subtitle: 'Where you\'re going', icon: '🔭' },
    { id: 10, title: 'Pitch Readiness', subtitle: 'Final details', icon: '🚀' },
];
