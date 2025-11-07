// ============================================
// Spinner.js - Loading Spinner Component
// ============================================
import React from 'react';

/**
 * A simple, reusable loading spinner component.
 * Uses Tailwind CSS for animation with Digitancy colors.
 */
const Spinner = ({ size = '8', color = 'teal' }) => {
    const sizeClasses = `h-${size} w-${size}`;
    const colorClasses = color === 'teal'
        ? 'border-[#008C9E]'
        : color === 'white'
            ? 'border-white'
            : 'border-gray-600';

    return (
        <div
            className={`animate-spin rounded-full ${sizeClasses} border-t-2 border-b-2 ${colorClasses}`}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;