'use client';

import React from 'react';

interface FormSelectProps {
    label: string;
    name: string;
    value: string | null | undefined;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    error?: string;
}

export default function FormSelect({
    label,
    name,
    value,
    onChange,
    options,
    placeholder = 'Select an option',
    required = false,
    error,
}: FormSelectProps) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <label htmlFor={name} className="form-label">
                {label}
                {required && (
                    <span style={{ color: 'var(--status-error)', marginLeft: '4px' }}>*</span>
                )}
            </label>
            <select
                id={name}
                name={name}
                value={value ?? ''}
                onChange={onChange}
                required={required}
                className={`form-input ${error ? 'error' : ''}`}
                style={{ cursor: 'pointer' }}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <div className="form-error">{error}</div>}
        </div>
    );
}
