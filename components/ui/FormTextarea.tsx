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
    label, name, value, onChange, placeholder,
    required = false, error, rows = 4, maxLength,
}: FormTextareaProps) {
    const currentLength = (value || '').length;

    return (
        <div className="mb-4">
            <label htmlFor={name} className="form-label">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
                id={name} name={name}
                value={value ?? ''} onChange={onChange}
                placeholder={placeholder} required={required}
                rows={rows} maxLength={maxLength}
                className={`form-input resize-y min-h-25 ${error ? 'error' : ''}`}
            />
            <div className="flex justify-between items-center">
                {error && <div className="form-error">{error}</div>}
                {maxLength && (
                    <div className={`text-xs ml-auto mt-1 ${currentLength > maxLength * 0.9 ? 'text-red-500' : 'text-neutral-600'}`}>
                        {currentLength}/{maxLength}
                    </div>
                )}
            </div>
        </div>
    );
}
