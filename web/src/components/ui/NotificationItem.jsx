/**
 * NotificationItem Component - Item thông báo
 * @param {string} category - 'khoa' | 'system' | 'chidoan' | 'truong'
 * @param {string} title - Tiêu đề thông báo
 * @param {string} content - Nội dung
 * @param {string} time - Thời gian
 */
export default function NotificationItem({
    category = 'system',
    title,
    content,
    time,
    isNew = false,
    onClick,
    className = '',
}) {
    const categoryLabels = {
        khoa: 'CẤP KHOA',
        system: 'HỆ THỐNG',
        chidoan: 'CHI ĐOÀN',
        truong: 'CẤP TRƯỜNG',
    };

    const categoryColors = {
        khoa: 'text-blue-600 bg-blue-50',
        system: 'text-purple-600 bg-purple-50',
        chidoan: 'text-green-600 bg-green-50',
        truong: 'text-orange-600 bg-orange-50',
    };

    return (
        <div
            onClick={onClick}
            className={`
        p-3 rounded-lg cursor-pointer transition-colors
        ${isNew ? 'bg-blue-50/50' : 'hover:bg-gray-50'}
        ${className}
      `}
        >
            <div className="flex items-start gap-3">
                {/* New indicator */}
                {isNew && (
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                    {/* Category and time */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColors[category]}`}>
                            {categoryLabels[category]}
                        </span>
                        <span className="text-xs text-gray-400">{time}</span>
                    </div>

                    {/* Title */}
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{title}</h4>

                    {/* Content */}
                    {content && (
                        <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{content}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
