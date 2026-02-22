'use client';

import React from 'react';

interface FormInputProps {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'number' | 'url' | 'tel';
    value: string | number | null | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    min?: number;
    max?: number;
    step?: string;
}

export default function FormInput({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error,
    min,
    max,
    step,
}: FormInputProps) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <label htmlFor={name} className="form-label">
                {label}
                {required && (
                    <span style={{ color: 'var(--status-error)', marginLeft: '4px' }}>*</span>
                )}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min}
                max={max}
                step={step}
                className={`form-input ${error ? 'error' : ''}`}
            />
            {error && <div className="form-error">{error}</div>}
        </div>
    );
}
