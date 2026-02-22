'use client';

import React from 'react';

interface FormTextareaProps {
    label: string;
    name: string;
    value: string | null | undefined;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    rows?: number;
    maxLength?: number;
}

export default function FormTextarea({
    label,
    name,
    value,
    onChange,
    placeholder,
    required = false,
    error,
    rows = 4,
    maxLength,
}: FormTextareaProps) {
    const currentLength = (value || '').length;

    return (
        <div style={{ marginBottom: '16px' }}>
            <label htmlFor={name} className="form-label">
                {label}
                {required && (
                    <span style={{ color: 'var(--status-error)', marginLeft: '4px' }}>*</span>
                )}
            </label>
            <textarea
                id={name}
                name={name}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                rows={rows}
                maxLength={maxLength}
                className={`form-input ${error ? 'error' : ''}`}
                style={{ resize: 'vertical', minHeight: '100px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {error && <div className="form-error">{error}</div>}
                {maxLength && (
                    <div
                        style={{
                            fontSize: '0.75rem',
                            color: currentLength > maxLength * 0.9 ? 'var(--status-error)' : 'var(--foreground-dimmed)',
                            marginLeft: 'auto',
                            marginTop: '4px',
                        }}
                    >
                        {currentLength}/{maxLength}
                    </div>
                )}
            </div>
        </div>
    );
}
