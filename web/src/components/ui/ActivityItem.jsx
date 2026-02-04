import Badge from './Badge';

/**
 * ActivityItem Component - Item hiển thị hoạt động đã tham gia
 * @param {string} type - 'volunteer' | 'academic' | 'seminar' | 'blood'
 * @param {string} title - Tên hoạt động
 * @param {number} points - Điểm nhận được
 * @param {string} date - Ngày hoạt động
 * @param {string} checkIn - Thời gian điểm danh vào
 * @param {string} checkOut - Thời gian điểm danh ra
 * @param {string} location - Địa điểm
 */
export default function ActivityItem({
    type = 'volunteer',
    title,
    points,
    date,
    checkIn,
    checkOut,
    location,
    onViewProof,
    className = '',
}) {
    const typeLabels = {
        volunteer: 'TÌNH NGUYỆN',
        academic: 'HỌC THUẬT',
        seminar: 'HỘI THẢO',
        blood: 'CỘNG ĐỒNG',
        summer: 'MÙA HÈ XANH',
        education: 'HỖ TRỢ GIÁO DỤC',
    };

    const typeVariants = {
        volunteer: 'volunteer',
        academic: 'academic',
        seminar: 'info',
        blood: 'danger',
        summer: 'success',
        education: 'primary',
    };

    return (
        <div
            className={`
        p-4 border border-gray-100 rounded-xl bg-white hover:shadow-md transition-shadow
        ${className}
      `}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Type badge and date */}
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant={typeVariants[type]} size="sm">
                            {typeLabels[type]}
                        </Badge>
                        <span className="text-xs text-gray-400">{date}</span>
                    </div>

                    {/* Title */}
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h4>

                    {/* Check in/out times */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {checkIn && (
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-base text-gray-400">schedule</span>
                                <span className="text-xs text-gray-400">GIỜ ĐIỂM DANH VÀO</span>
                                <span className="font-medium text-gray-700">{checkIn}</span>
                            </div>
                        )}
                        {checkOut && (
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-base text-gray-400">logout</span>
                                <span className="text-xs text-gray-400">GIỜ ĐIỂM DANH RA</span>
                                <span className="font-medium text-gray-700">{checkOut}</span>
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    {location && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                            <span className="material-symbols-outlined text-base">location_on</span>
                            {location}
                        </div>
                    )}
                </div>

                {/* Points */}
                <div className="text-right flex-shrink-0">
                    <span className="text-xl font-bold text-success">+{points}</span>
                    <p className="text-xs text-gray-400">ĐIỂM RÈN LUYỆN</p>
                    {onViewProof && (
                        <button
                            onClick={onViewProof}
                            className="mt-2 text-sm text-primary hover:underline flex items-center gap-1 ml-auto"
                        >
                            <span className="material-symbols-outlined text-base">visibility</span>
                            Xem minh chứng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
