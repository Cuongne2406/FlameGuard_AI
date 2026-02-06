import React from 'react';
/**
 * Button Component - Reusable button with variants
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - Make button full width
 * @param {ReactNode} leftIcon - Icon on left side
 * @param {ReactNode} rightIcon - Icon on right side
 */
export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled = false,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
        ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
        danger: 'bg-danger text-white hover:bg-red-600 focus:ring-red-500',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2.5 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2',
    };

    return (
        <button
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            disabled={disabled}
            {...props}
        >
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </button>
    );
}
