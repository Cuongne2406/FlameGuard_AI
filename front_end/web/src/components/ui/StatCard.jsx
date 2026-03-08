import React from 'react';
/**
 * StatCard Component - Card hiển thị thống kê
 * @param {string} title - Tiêu đề (VD: Tổng điểm rèn luyện)
 * @param {string} value - Giá trị chính (VD: 85/100)
 * @param {string} subtitle - Phụ đề (VD: +5.2% so với tháng trước)
 * @param {ReactNode} icon - Icon bên phải
 * @param {string} trend - 'up' | 'down' | null
 * @param {string} variant - 'default' | 'primary' | 'success' | 'warning'
 */
export default function StatCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    variant = 'default',
    className = '',
}) {
    const variants = {
        default: 'bg-white',
        primary: 'bg-blue-50 border-blue-100',
        success: 'bg-green-50 border-green-100',
        warning: 'bg-yellow-50 border-yellow-100',
    };

    const trendColors = {
        up: 'text-success',
        down: 'text-danger',
    };

    const trendIcons = {
        up: '↑',
        down: '↓',
    };

    return (
        <div
            className={`
        rounded-xl p-5 border transition-all duration-200 hover:shadow-md
        ${variants[variant]}
        ${className}
      `}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {subtitle && (
                        <p className={`text-sm mt-1 ${trend ? trendColors[trend] : 'text-gray-500'}`}>
                            {trend && <span className="mr-1">{trendIcons[trend]}</span>}
                            {subtitle}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
