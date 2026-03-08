import React from 'react';
import { useState } from 'react';

/**
 * Input Component - Text input with icon support
 * @param {string} type - 'text' | 'password' | 'email' | 'number'
 * @param {ReactNode} leftIcon - Icon on left side
 * @param {ReactNode} rightIcon - Icon on right side
 * @param {string} error - Error message
 */
export default function Input({
    type = 'text',
    label,
    placeholder,
    leftIcon,
    rightIcon,
    error,
    disabled = false,
    readOnly = false,
    className = '',
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {leftIcon}
                    </span>
                )}
                <input
                    type={inputType}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || isPassword ? 'pr-10' : ''}
            ${error
                            ? 'border-danger focus:ring-danger focus:border-danger'
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${readOnly ? 'bg-gray-50' : ''}
            focus:outline-none focus:ring-2 focus:ring-offset-0
            placeholder:text-gray-400
          `}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <span className="material-symbols-outlined text-xl">
                            {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                    </button>
                )}
                {rightIcon && !isPassword && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {rightIcon}
                    </span>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-danger">{error}</p>
            )}
        </div>
    );
}
