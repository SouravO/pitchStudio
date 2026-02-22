'use client';

import React from 'react';
import { FORM_SECTIONS } from '@/types/startup';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps?: number;
}

export default function StepIndicator({ currentStep, totalSteps = 10 }: StepIndicatorProps) {
    return (
        <div style={{ marginBottom: '40px' }}>
            {/* Progress bar */}
            <div
                style={{
                    width: '100%',
                    height: '4px',
                    background: 'var(--border-color)',
                    borderRadius: '2px',
                    marginBottom: '20px',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        width: `${(currentStep / totalSteps) * 100}%`,
                        height: '100%',
                        background: 'var(--gradient-brand)',
                        borderRadius: '2px',
                        transition: 'width 0.4s ease',
                    }}
                />
            </div>

            {/* Step info */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '4px',
                        }}
                    >
                        <span style={{ fontSize: '1.4rem' }}>
                            {FORM_SECTIONS[currentStep - 1]?.icon}
                        </span>
                        <h2
                            style={{
                                fontSize: '1.3rem',
                                fontWeight: 700,
                                letterSpacing: '-0.01em',
                            }}
                        >
                            {FORM_SECTIONS[currentStep - 1]?.title}
                        </h2>
                    </div>
                    <p
                        style={{
                            fontSize: '0.9rem',
                            color: 'var(--foreground-muted)',
                        }}
                    >
                        {FORM_SECTIONS[currentStep - 1]?.subtitle}
                    </p>
                </div>

                <div
                    style={{
                        fontSize: '0.85rem',
                        color: 'var(--foreground-dimmed)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    {/* Completed steps indicator */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    width: i + 1 === currentStep ? '20px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    background:
                                        i + 1 < currentStep
                                            ? 'var(--status-selected)'
                                            : i + 1 === currentStep
                                                ? 'var(--brand-primary)'
                                                : 'var(--border-color)',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {i + 1 < currentStep && (
                                    <Check size={6} style={{ color: 'white' }} />
                                )}
                            </div>
                        ))}
                    </div>
                    <span>
                        {currentStep}/{totalSteps}
                    </span>
                </div>
            </div>
        </div>
    );
}
