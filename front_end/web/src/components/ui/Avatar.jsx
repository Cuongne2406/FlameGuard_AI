import React from 'react';
/**
 * Avatar Component - User avatar with status indicator
 * @param {string} src - Image source
 * @param {string} alt - Alt text
 * @param {string} size - 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} status - 'online' | 'offline' | 'away' | null
 */
export default function Avatar({
    src,
    alt = 'Avatar',
    name,
    size = 'md',
    status,
    className = '',
    ...props
}) {
    const sizes = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-14 h-14 text-lg',
        xl: 'w-20 h-20 text-xl',
    };

    const statusSizes = {
        xs: 'w-1.5 h-1.5',
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
        xl: 'w-4 h-4',
    };

    const statusColors = {
        online: 'bg-success',
        offline: 'bg-gray-400',
        away: 'bg-yellow-500',
    };

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`relative inline-block ${className}`} {...props}>
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`}
                />
            ) : (
                <div
                    className={`${sizes[size]} rounded-full bg-primary flex items-center justify-center text-white font-medium ring-2 ring-white`}
                >
                    {getInitials(name)}
                </div>
            )}
            {status && (
                <span
                    className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full ring-2 ring-white`}
                />
            )}
        </div>
    );
}
