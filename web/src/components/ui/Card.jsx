/**
 * Card Component - Container with shadow and optional header
 * @param {string} variant - 'default' | 'bordered' | 'elevated'
 * @param {boolean} noPadding - Remove default padding
 */
export default function Card({
    children,
    title,
    subtitle,
    headerAction,
    variant = 'default',
    noPadding = false,
    className = '',
    ...props
}) {
    const variants = {
        default: 'bg-white shadow-sm',
        bordered: 'bg-white border border-gray-200',
        elevated: 'bg-white shadow-lg',
    };

    return (
        <div
            className={`
        rounded-xl overflow-hidden
        ${variants[variant]}
        ${className}
      `}
            {...props}
        >
            {(title || headerAction) && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                        {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
                        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className={noPadding ? '' : 'p-5'}>
                {children}
            </div>
        </div>
    );
}
