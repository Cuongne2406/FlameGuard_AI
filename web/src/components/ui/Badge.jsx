/**
 * Badge Component - Tag/Label for status and categories
 * @param {string} variant - 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'
 * @param {string} size - 'sm' | 'md'
 */
export default function Badge({
    children,
    variant = 'primary',
    size = 'md',
    dot = false,
    className = '',
    ...props
}) {
    const variants = {
        primary: 'bg-blue-100 text-primary',
        success: 'bg-green-100 text-success',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-danger',
        info: 'bg-cyan-100 text-cyan-700',
        gray: 'bg-gray-100 text-gray-600',
        volunteer: 'bg-green-100 text-green-700',
        academic: 'bg-blue-100 text-blue-700',
        award: 'bg-yellow-100 text-yellow-700',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
    };

    const dotColors = {
        primary: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-yellow-500',
        danger: 'bg-danger',
        info: 'bg-cyan-500',
        gray: 'bg-gray-500',
        volunteer: 'bg-green-500',
        academic: 'bg-blue-500',
        award: 'bg-yellow-500',
    };

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            {...props}
        >
            {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
            {children}
        </span>
    );
}
