/**
 * Toggle Component - Switch on/off
 * @param {boolean} checked - Toggle state
 * @param {function} onChange - Change handler
 * @param {string} size - 'sm' | 'md'
 */
export default function Toggle({
    checked = false,
    onChange,
    label,
    description,
    disabled = false,
    size = 'md',
    className = '',
    ...props
}) {
    const sizes = {
        sm: {
            track: 'w-8 h-4',
            thumb: 'w-3 h-3',
            translate: 'translate-x-4',
        },
        md: {
            track: 'w-11 h-6',
            thumb: 'w-5 h-5',
            translate: 'translate-x-5',
        },
    };

    return (
        <label
            className={`flex items-start gap-3 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
        >
            <div className="relative flex-shrink-0 mt-0.5">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className="sr-only"
                    {...props}
                />
                <div
                    className={`
            ${sizes[size].track}
            rounded-full transition-colors duration-200
            ${checked ? 'bg-primary' : 'bg-gray-300'}
          `}
                />
                <div
                    className={`
            ${sizes[size].thumb}
            absolute top-0.5 left-0.5 bg-white rounded-full shadow-sm
            transition-transform duration-200
            ${checked ? sizes[size].translate : 'translate-x-0'}
          `}
                />
            </div>
            {(label || description) && (
                <div className="flex-1">
                    {label && <p className="text-sm font-medium text-gray-900">{label}</p>}
                    {description && <p className="text-sm text-gray-500">{description}</p>}
                </div>
            )}
        </label>
    );
}
