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
        <div className="mb-10">
            <div className="w-full h-1 bg-neutral-900 rounded overflow-hidden mb-5">
                <div
                    className="h-full rounded transition-all duration-400"
                    style={{
                        width: `${(currentStep / totalSteps) * 100}%`,
                        background: 'linear-gradient(135deg, #ffffff, #cccccc)',
                    }}
                />
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <span className="text-2xl">{FORM_SECTIONS[currentStep - 1]?.icon}</span>
                        <h2 className="text-xl font-bold tracking-tight">
                            {FORM_SECTIONS[currentStep - 1]?.title}
                        </h2>
                    </div>
                    <p className="text-sm text-neutral-500">
                        {FORM_SECTIONS[currentStep - 1]?.subtitle}
                    </p>
                </div>

                <div className="text-sm text-neutral-600 flex items-center gap-2">
                    <div className="flex gap-1">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-center transition-all duration-300"
                                style={{
                                    width: i + 1 === currentStep ? '20px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    background:
                                        i + 1 < currentStep
                                            ? '#2dd4a0'
                                            : i + 1 === currentStep
                                                ? '#ffffff'
                                                : '#111111',
                                }}
                            >
                                {i + 1 < currentStep && <Check size={6} className="text-white" />}
                            </div>
                        ))}
                    </div>
                    <span>{currentStep}/{totalSteps}</span>
                </div>
            </div>
        </div>
    );
}
