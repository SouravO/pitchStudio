'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    MeshTransmissionMaterial, PerspectiveCamera, Environment, Float,
    MeshDistortMaterial, ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';
import { Plus, Command, Hash, ChevronLeft, Loader2, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { submitStartup } from '@/lib/actions';

// --- VISUAL ENGINE (The Monolith) ---
function VoidMonolith({ step, mouse }: { step: number; mouse: React.RefObject<number[]> }) {
    const meshRef = useRef<any>(null);
    const coreRef = useRef<any>(null);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = t * (0.05 + (step * 0.01));
            meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.current[0] * 0.5, 0.05);
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.current[1] * 0.5, 0.05);
        }
        if (coreRef.current) {
            coreRef.current.distort = 0.2 + (step * 0.03);
            coreRef.current.speed = 1 + (step * 0.1);
        }
    });
    return (
        <group>
            <mesh ref={coreRef}><sphereGeometry args={[0.8, 64, 64]} /><MeshDistortMaterial color="#000" speed={2} distort={0.4} metalness={1} roughness={0.01} /></mesh>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={meshRef}><octahedronGeometry args={[1.6, 0]} /><MeshTransmissionMaterial backside samples={8} thickness={2} chromaticAberration={0.02} color="#fff" transmission={1} /></mesh>
            </Float>
            <ContactShadows position={[0, -3, 0]} opacity={0.6} scale={10} blur={2} />
        </group>
    );
}

export default function StartupVoidForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const mouse = useRef([0, 0]);

    const [formData, setFormData] = useState({
        startup_name: '', founder_names: '', designation: '', contact_number: '', email: '', city: '', country: '', website: '',
        instagram: '', linkedin: '', facebook: '', youtube: '', year_of_incorporation: null, legal_structure: '',
        education: '', total_experience_years: null, industry_experience: '', previous_startup_experience: '', why_right_person: '',
        five_word_description: '', elevator_pitch: '', problem_statement: '', target_customer: '', differentiation: '', market_size: '', current_stage: '',
        products_services: '', pricing: '', average_order_value: null, monthly_sales_volume: null, gross_margin: null, net_profit_margin: null, cost_of_production: null, marketing_cac: null, delivery_cost: null, contribution_margin: null,
        is_generating_revenue: null, revenue_year1: null, revenue_year2: null, revenue_year3: null, current_monthly_revenue: null, monthly_growth_rate: null, retention_rate: null, active_customers: null, partnerships: '',
        revenue_model: '', acquisition_channels: '', cac: null, ltv: null, ltv_cac_ratio: null,
        raised_before: null, previous_funding: '', investment_seeking: null, equity_offered: null, pre_money_valuation: null, post_money_valuation: null, fund_utilization: '', runway_months: null,
        core_team: '', planned_hires: '', advisory_board: '',
        revenue_projection_3y: '', vision_5y: '', exit_strategy: '',
        pitch_deck_link: '', financial_projection_link: '', prepared_for_qa: null, why_shortlist: '',
    });

    const countWords = (text: string) => text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let parsedValue = type === 'number' ? (value === '' ? null : Number(value)) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleWordLimitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, maxWords: number) => {
        const { name, value } = e.target;
        const words = value.trim().split(/\s+/);
        if (value.trim() !== '' && words.length > maxWords) return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBool = (name: string, val: boolean) => setFormData(prev => ({ ...prev, [name]: val }));

    const [fundBreakdown, setFundBreakdown] = useState({
        marketing: '', product_development: '', hiring: '', operations: '', technology: '', others: '',
    });

    const handleFundChange = (category: string, value: string) => {
        const newBreakdown = { ...fundBreakdown, [category]: value };
        setFundBreakdown(newBreakdown);
        const formatted = Object.entries(newBreakdown)
            .filter(([, v]) => v !== '')
            .map(([k, v]) => {
                const label = k.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                return `${label}: ${v}%`;
            })
            .join(', ');
        setFormData(prev => ({ ...prev, fund_utilization: formatted }));
    };

    const handleSetStep = () => {
        // Validate required fields for Step 1
        if (step === 1) {
            const missingFields = [];
            if (!formData.startup_name) missingFields.push('Startup Name');
            if (!formData.founder_names) missingFields.push('Founder Name(s)');
            if (!formData.email) missingFields.push('Email');

            if (missingFields.length > 0) {
                toast.error(`Please fill in: ${missingFields.join(', ')}`);
                return;
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error('Please enter a valid email address.');
                return;
            }
        }
        setStep(s => s + 1);
    };

    
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await submitStartup(formData);
            if (result.success) {
                toast.success('Your pitch has been submitted to the Void. 🎉');
                router.push('/');
            } else {
                toast.error(result.error || 'Submission failed.');
            }
        } catch (e) {
            toast.error('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="noir-root" onMouseMove={(e) => (mouse.current = [(e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1])}>
            <div className="film-grain" />
            <main className="noir-layout">
                <section className="form-column">
                    {/* <header className="noir-header">
                        <div className="noir-tag"><Command size={14} /><span>VOID_SESSION_2026</span></div>
                        <div className="id-code"><Hash size={12} /><span>PHASE_0{step}_STABLE</span></div>
                    </header> */}

                    <div className="form-scroll-wrapper">
                        <AnimatePresence mode="wait">
                            <motion.div key={step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5 }} className="step-content">

                                {step === 1 && (
                                    <div className="input-group">
                                        <h1 className="noir-title">BASIC<br />INFO_</h1>
                                        <input name="startup_name" placeholder="STARTUP NAME *" value={formData.startup_name} onChange={handleChange} required />
                                        <input name="founder_names" placeholder="FOUNDER NAME(S) *" value={formData.founder_names} onChange={handleChange} required />
                                        <input name="designation" placeholder="DESIGNATION (CEO / CO-FOUNDER / ETC.)" value={formData.designation} onChange={handleChange} />
                                        <div className="grid-2">
                                            <input name="email" type="email" placeholder="EMAIL ID *" value={formData.email} onChange={handleChange} required />
                                            <input name="contact_number" placeholder="CONTACT NUMBER" value={formData.contact_number} onChange={handleChange} />
                                        </div>
                                        <div className="grid-2">
                                            <input name="city" placeholder="CITY" value={formData.city} onChange={handleChange} />
                                            <input name="country" placeholder="COUNTRY" value={formData.country} onChange={handleChange} />
                                        </div>
                                        <input name="website" placeholder="WEBSITE (IF ANY)" value={formData.website} onChange={handleChange} />
                                        <div className="grid-2">
                                            <input name="instagram" placeholder="INSTAGRAM" value={formData.instagram} onChange={handleChange} />
                                            <input name="linkedin" placeholder="LINKEDIN" value={formData.linkedin} onChange={handleChange} />
                                        </div>
                                        <div className="grid-2">
                                            <input name="facebook" placeholder="FACEBOOK" value={formData.facebook} onChange={handleChange} />
                                            <input name="youtube" placeholder="YOUTUBE" value={formData.youtube} onChange={handleChange} />
                                        </div>
                                        <div className="grid-2">
                                            <input name="year_of_incorporation" type="number" placeholder="YEAR OF INCORPORATION" value={formData.year_of_incorporation || ''} onChange={handleChange} />
                                            <select name="legal_structure" value={formData.legal_structure} onChange={handleChange} className="noir-select">
                                                <option value="">LEGAL STRUCTURE</option>
                                                <option value="Pvt Ltd">PRIVATE LIMITED</option>
                                                <option value="LLP">LLP</option>
                                                <option value="Partnership">PARTNERSHIP</option>
                                                <option value="Sole Proprietorship">SOLE PROPRIETORSHIP</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="input-group">
                                        <h1 className="noir-title">FOUNDER<br />PROFILE_</h1>
                                        <input name="education" placeholder="FOUNDER’S EDUCATIONAL BACKGROUND" value={formData.education} onChange={handleChange} required />
                                        <input name="total_experience_years" type="number" placeholder="TOTAL YEARS OF EXPERIENCE" value={formData.total_experience_years || ''} onChange={handleChange} />
                                        <textarea name="industry_experience" placeholder="INDUSTRY EXPERIENCE (RELEVANT TO STARTUP)" value={formData.industry_experience} onChange={handleChange} />
                                        <textarea name="previous_startup_experience" placeholder="PREVIOUS STARTUP EXPERIENCE (IF ANY)" value={formData.previous_startup_experience} onChange={handleChange} />
                                        <textarea name="why_right_person" placeholder="WHY ARE YOU THE RIGHT PERSON TO SOLVE THIS PROBLEM? (MAX 150 WORDS)" value={formData.why_right_person} onChange={(e) => handleWordLimitChange(e, 150)} />
                                        <div style={{ fontSize: '0.65rem', color: countWords(formData.why_right_person) >= 150 ? '#ff4444' : '#444', textAlign: 'right', marginTop: '-5px' }}>{countWords(formData.why_right_person)} / 150 words</div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="input-group">
                                        <h1 className="noir-title">STARTUP<br />CONCEPT_</h1>
                                        <input name="five_word_description" placeholder="DESCRIBE YOUR STARTUP IN 5 WORDS ONLY" value={formData.five_word_description} onChange={(e) => handleWordLimitChange(e, 5)} />
                                        <div style={{ fontSize: '0.65rem', color: countWords(formData.five_word_description) >= 5 ? '#ff4444' : '#444', textAlign: 'right', marginTop: '-5px' }}>{countWords(formData.five_word_description)} / 5 words</div>
                                        <textarea name="elevator_pitch" placeholder="ONE-LINE ELEVATOR PITCH (MAX 20 WORDS)" value={formData.elevator_pitch} onChange={(e) => handleWordLimitChange(e, 20)} />
                                        <div style={{ fontSize: '0.65rem', color: countWords(formData.elevator_pitch) >= 20 ? '#ff4444' : '#444', textAlign: 'right', marginTop: '-5px' }}>{countWords(formData.elevator_pitch)} / 20 words</div>
                                        <textarea name="problem_statement" placeholder="WHAT PROBLEM ARE YOU SOLVING?" value={formData.problem_statement} onChange={handleChange} />
                                        <input name="target_customer" placeholder="WHO IS YOUR TARGET CUSTOMER?" value={formData.target_customer} onChange={handleChange} />
                                        <textarea name="differentiation" placeholder="WHAT IS YOUR UNIQUE DIFFERENTIATION?" value={formData.differentiation} onChange={handleChange} />
                                        <input name="market_size" placeholder="MARKET SIZE (TAM / SAM / SOM IF KNOWN)" value={formData.market_size} onChange={handleChange} />
                                        <select name="current_stage" value={formData.current_stage} onChange={handleChange} className="noir-select">
                                            <option value="">CURRENT STAGE</option>
                                            <option value="Idea">IDEA</option>
                                            <option value="Prototype">PROTOTYPE</option>
                                            <option value="MVP">MVP</option>
                                            <option value="Revenue Generating">REVENUE GENERATING</option>
                                            <option value="Scaling">SCALING</option>
                                        </select>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="input-group">
                                        <h1 className="noir-title">PRODUCT /<br />SERVICE_</h1>
                                        <textarea name="products_services" placeholder="LIST YOUR PRODUCTS / SERVICES" value={formData.products_services} onChange={handleChange} />
                                        <div className="grid-2">
                                            <input name="pricing" placeholder="PRICING OF EACH PRODUCT / SERVICE" value={formData.pricing} onChange={handleChange} />
                                            <input name="average_order_value" type="number" placeholder="AVERAGE ORDER VALUE (AOV)" value={formData.average_order_value || ''} onChange={handleChange} />
                                        </div>
                                        <div className="grid-2">
                                            <input name="monthly_sales_volume" type="number" placeholder="MONTHLY SALES VOLUME (UNITS)" value={formData.monthly_sales_volume || ''} onChange={handleChange} />
                                            <input name="gross_margin" type="number" placeholder="GROSS MARGIN %" value={formData.gross_margin || ''} onChange={handleChange} />
                                        </div>
                                        <div className="grid-2">
                                            <input name="net_profit_margin" type="number" placeholder="NET PROFIT MARGIN %" value={formData.net_profit_margin || ''} onChange={handleChange} />
                                            <input name="cost_of_production" type="number" placeholder="COST OF PRODUCTION" value={formData.cost_of_production || ''} onChange={handleChange} />
                                        </div>
                                        <div className="grid-2">
                                            <input name="marketing_cac" type="number" placeholder="MARKETING COST PER ACQUISITION" value={formData.marketing_cac || ''} onChange={handleChange} />
                                            <input name="delivery_cost" type="number" placeholder="DELIVERY / SERVICE COST" value={formData.delivery_cost || ''} onChange={handleChange} />
                                        </div>
                                        <input name="contribution_margin" type="number" placeholder="CONTRIBUTION MARGIN PER UNIT" value={formData.contribution_margin || ''} onChange={handleChange} />
                                    </div>
                                )}

                                {step === 5 && (
                                    <div className="input-group">
                                        <h1 className="noir-title">TRACTION &<br />REVENUE_</h1>
                                        <div className="bool-toggle">
                                            <span>ARE YOU GENERATING REVENUE?</span>
                                            <button className={formData.is_generating_revenue === true ? 'active' : ''} onClick={() => handleBool('is_generating_revenue', true)}>YES</button>
                                            <button className={formData.is_generating_revenue === false ? 'active' : ''} onClick={() => handleBool('is_generating_revenue', false)}>NO</button>
                                        </div>
                                        <div className="grid-2">
                                            <input name="revenue_year1" type="number" placeholder="REVENUE YEAR 1" value={formData.revenue_year1 || ''} onChange={handleChange} />
                                            <input name="revenue_year2" type="number" placeholder="REVENUE YEAR 2" value={formData.revenue_year2 || ''} onChange={handleChange} />
                                        </div>
                                        <input name="revenue_year3" type="number" placeholder="REVENUE YEAR 3" value={formData.revenue_year3 || ''} onChange={handleChange} />
                                        <div className="grid-2">
                                            <input name="current_monthly_revenue" type="number" placeholder="CURRENT MONTHLY REVENUE" value={formData.current_monthly_revenue || ''} onChange={handleChange} />
                                            <input name="monthly_growth_rate" type="number" placeholder="MONTHLY GROWTH RATE %" value={formData.monthly_growth_rate || ''} onChange={handleChange} />
                                        </div>
                                        <div className="grid-2">
                                            <input name="retention_rate" type="number" placeholder="CUSTOMER RETENTION RATE %" value={formData.retention_rate || ''} onChange={handleChange} />
                                            <input name="active_customers" type="number" placeholder="NUMBER OF ACTIVE CUSTOMERS" value={formData.active_customers || ''} onChange={handleChange} />
                                        </div>
                                        <textarea name="partnerships" placeholder="ANY KEY PARTNERSHIPS?" value={formData.partnerships} onChange={handleChange} />
                                    </div>
                                )}

                                {step === 6 && (
                                    <div className="input-group">
                                        <h1 className="noir-title">BUSINESS<br />MODEL_</h1>
                                        <select name="revenue_model" value={formData.revenue_model} onChange={handleChange} className="noir-select">
                                            <option value="">REVENUE MODEL</option>
                                            <option value="One-time Sales">ONE-TIME SALES</option>
                                            <option value="Subscription">SUBSCRIPTION</option>
                                            <option value="Commission">COMMISSION</option>
                                            <option value="Marketplace">MARKETPLACE</option>
                                            <option value="SaaS">SaaS</option>
                                            <option value="Hybrid">HYBRID</option>
                                        </select>
                                        <textarea name="acquisition_channels" placeholder="CUSTOMER ACQUISITION CHANNELS" value={formData.acquisition_channels} onChange={handleChange} />
                                        <div className="grid-2">
                                            <input name="cac" type="number" placeholder="CUSTOMER ACQUISITION COST (CAC)" value={formData.cac || ''} onChange={handleChange} />
                                            <input name="ltv" type="number" placeholder="LIFETIME VALUE (LTV)" value={formData.ltv || ''} onChange={handleChange} />
                                        </div>
                                        <input name="ltv_cac_ratio" type="number" step="0.1" placeholder="LTV / CAC RATIO" value={formData.ltv_cac_ratio || ''} onChange={handleChange} />
                                    </div>
                                )}

                                {step === 7 && (
                                    <div className="input-group">
                                        <h1 className="noir-title">INVESTMENT &<br />FUNDRAISING_</h1>
                                        <div className="bool-toggle">
                                            <span>HAVE YOU RAISED FUNDS BEFORE?</span>
                                            <button className={formData.raised_before === true ? 'active' : ''} onClick={() => handleBool('raised_before', true)}>YES</button>
                                            <button className={formData.raised_before === false ? 'active' : ''} onClick={() => handleBool('raised_before', false)}>NO</button>
                                        </div>
                                        {formData.raised_before && <textarea name="previous_funding" placeholder="IF YES, HOW MUCH AND FROM WHOM?" value={formData.previous_funding} onChange={handleChange} />}
                                        <div className="grid-2">
                                            <input name="investment_seeking" type="number" placeholder="HOW MUCH INVESTMENT ARE YOU SEEKING?" value={formData.investment_seeking || ''} onChange={handleChange} />
                                            <input name="equity_offered" type="number" placeholder="EQUITY OFFERED (DILUTION %)" value={formData.equity_offered || ''} onChange={handleChange} />
                                        </div>
                                        <div className="grid-2">
                                            <input name="pre_money_valuation" type="number" placeholder="PRE-MONEY VALUATION" value={formData.pre_money_valuation || ''} onChange={handleChange} />
                                            <input name="post_money_valuation" type="number" placeholder="POST-MONEY VALUATION" value={formData.post_money_valuation || ''} onChange={handleChange} />
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#444', letterSpacing: '1px', marginTop: '15px', marginBottom: '10px' }}>FUND UTILIZATION PLAN (BREAKDOWN %)</div>
                                        <div className="grid-2">
                                            <input type="number" placeholder="MARKETING %" value={fundBreakdown.marketing} onChange={(e) => handleFundChange('marketing', e.target.value)} />
                                            <input type="number" placeholder="PRODUCT DEVELOPMENT %" value={fundBreakdown.product_development} onChange={(e) => handleFundChange('product_development', e.target.value)} />
                                        </div>
                                        <div className="grid-2">
                                            <input type="number" placeholder="HIRING %" value={fundBreakdown.hiring} onChange={(e) => handleFundChange('hiring', e.target.value)} />
                                            <input type="number" placeholder="OPERATIONS %" value={fundBreakdown.operations} onChange={(e) => handleFundChange('operations', e.target.value)} />
                                        </div>
                                        <div className="grid-2">
                                            <input type="number" placeholder="TECHNOLOGY %" value={fundBreakdown.technology} onChange={(e) => handleFundChange('technology', e.target.value)} />
                                            <input type="number" placeholder="OTHERS %" value={fundBreakdown.others} onChange={(e) => handleFundChange('others', e.target.value)} />
                                        </div>
                                        <input name="runway_months" type="number" placeholder="RUNWAY AFTER INVESTMENT (IN MONTHS)" value={formData.runway_months || ''} onChange={handleChange} />
                                    </div>
                                )}

                                {step === 8 && (
                                    <div className="input-group">
                                        <h1 className="noir-title">TEAM_</h1>
                                        <textarea name="core_team" placeholder="CORE TEAM MEMBERS & ROLES" value={formData.core_team} onChange={handleChange} />
                                        <textarea name="planned_hires" placeholder="KEY HIRES PLANNED" value={formData.planned_hires} onChange={handleChange} />
                                        <textarea name="advisory_board" placeholder="ADVISORY BOARD (IF ANY)" value={formData.advisory_board} onChange={handleChange} />
                                    </div>
                                )}

                                {step === 9 && (
                                    <div className="input-group">
                                        <h1 className="noir-title">SCALABILITY<br />& VISION_</h1>
                                        <textarea name="revenue_projection_3y" placeholder="3-YEAR REVENUE PROJECTION" value={formData.revenue_projection_3y} onChange={handleChange} />
                                        <textarea name="vision_5y" placeholder="5-YEAR VISION" value={formData.vision_5y} onChange={handleChange} />
                                        <select name="exit_strategy" value={formData.exit_strategy} onChange={handleChange} className="noir-select">
                                            <option value="">EXIT STRATEGY</option>
                                            <option value="Acquisition">ACQUISITION</option>
                                            <option value="IPO">IPO</option>
                                            <option value="Strategic Buyout">STRATEGIC BUYOUT</option>
                                            <option value="Not Decided">NOT DECIDED</option>
                                        </select>
                                    </div>
                                )}

                                {step === 10 && (
                                    <div className="input-group">
                                        <h1 className="noir-title">READINESS FOR<br />PITCH STUDIO_</h1>
                                        <input name="pitch_deck_link" placeholder="DO YOU HAVE A PITCH DECK? (UPLOAD LINK)" value={formData.pitch_deck_link} onChange={handleChange} />
                                        <input name="financial_projection_link" placeholder="DO YOU HAVE FINANCIAL PROJECTIONS IN EXCEL? (LINK)" value={formData.financial_projection_link} onChange={handleChange} />
                                        <div className="bool-toggle">
                                            <span>ARE YOU PREPARED FOR INVESTOR Q&A?</span>
                                            <button className={formData.prepared_for_qa === true ? 'active' : ''} onClick={() => handleBool('prepared_for_qa', true)}>YES</button>
                                            <button className={formData.prepared_for_qa === false ? 'active' : ''} onClick={() => handleBool('prepared_for_qa', false)}>NO</button>
                                        </div>
                                        <textarea name="why_shortlist" placeholder="WHY SHOULD WE SHORTLIST YOU? (MAX 150 WORDS)" value={formData.why_shortlist} onChange={(e) => handleWordLimitChange(e, 150)} />
                                        <div style={{ fontSize: '0.65rem', color: countWords(formData.why_shortlist) >= 150 ? '#ff4444' : '#444', textAlign: 'right', marginTop: '-5px' }}>{countWords(formData.why_shortlist)} / 150 words</div>
                                    </div>
                                )}
                                <footer className="noir-footer pb-10">
                                    <button className="btn-secondary" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}><ChevronLeft size={20} /></button>
                                    <button className="btn-primary" onClick={() => (step === 10 ? handleSubmit() : handleSetStep())}>
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <span>{step === 10 ? "EXECUTE_VOID" : "PROCEED"}</span>}
                                        {!isSubmitting && (step === 10 ? <Send size={18} /> : <Plus size={18} />)}
                                    </button>
                                </footer>
                            </motion.div>
                        </AnimatePresence>
                    </div>


                </section>

                <section className="visual-column">
                    <div className="canvas-holder">
                        <Canvas dpr={[1, 2]}><PerspectiveCamera makeDefault position={[0, 0, 6]} /><Environment preset="night" /><VoidMonolith step={step} mouse={mouse} /></Canvas>
                    </div>
                </section>
            </main>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@900&family=Inter:wght@400;700&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #000; color: #fff; font-family: 'Inter', sans-serif; overflow: hidden; }
                .noir-root { width: 100vw; height: 100vh; position: relative; background: #000; }
                .film-grain { position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.05; background: url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Stop_Sign_Ind_5.png'); }
                .noir-layout { display: flex; height: 100%; position: relative; z-index: 10; }
                .form-column { flex: 1; padding: 40px 60px; display: flex; flex-direction: column; background: #000; border-right: 1px solid #111; }
                .form-scroll-wrapper { flex: 1; overflow-y: auto; display: flex; align-items: flex-start; padding: 20px 15px 20px 0; }
                .form-scroll-wrapper::-webkit-scrollbar { width: 2px; }
                .form-scroll-wrapper::-webkit-scrollbar-thumb { background: #222; }
                .noir-header { display: flex; justify-content: space-between; align-items: center; font-size: 0.6rem; letter-spacing: 2px; color: #444; margin-bottom: 30px; }
                .noir-title { font-family: 'Unbounded'; font-size: 4vw; line-height: 0.8; letter-spacing: -3px; color: #fff; margin-bottom: 40px; text-transform: uppercase; }
                input, textarea, .noir-select { width: 100%; background: transparent; border: none; border-bottom: 1px solid #111; padding: 15px 0; font-size: 0.9rem; color: #fff; font-family: inherit; outline: none; transition: 0.3s; margin-bottom: 10px; }
                textarea { height: 100px; resize: none; border: 1px solid #111; padding: 10px; margin-top: 10px; }
                input:focus, textarea:focus { border-color: #fff; }
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .bool-toggle { display: flex; align-items: center; gap: 15px; margin: 20px 0; font-size: 0.7rem; color: #444; }
                .bool-toggle button { background: transparent; border: 1px solid #111; color: #444; padding: 10px 20px; cursor: pointer; font-family: 'Unbounded'; font-size: 0.6rem; transition: 0.3s; }
                .bool-toggle button.active { background: #fff; color: #000; border-color: #fff; }
                .noir-footer { display: flex; gap: 10px; padding-top: 20px; }
                .btn-primary { flex: 4; height: 70px; background: #fff; color: #000; border: none; font-family: 'Unbounded'; font-weight: 900; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 15px; cursor: pointer; transition: 0.3s; }
                .btn-primary:hover { background: #ccc; }
                .btn-secondary { flex: 1; height: 70px; background: transparent; border: 1px solid #111; color: #444; cursor: pointer; }
                .visual-column { flex: 1.2; position: relative; background: #000; }
                .canvas-holder { position: absolute; inset: 0; filter: contrast(1.1); }
                .noir-select option { background: #000; color: #fff; }
                @media (max-width: 768px) {
                    .visual-column { display: none; }
                    .form-column { padding: 30px 20px 100px 20px; }
                    .noir-title { font-size: 6vw; }
                    .noir-footer { padding-bottom: 20px; }
                }
            `}</style>
        </div>
    );
}