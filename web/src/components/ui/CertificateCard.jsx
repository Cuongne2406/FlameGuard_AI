import React from 'react';
import Badge from './Badge';
import Button from './Button';

/**
 * CertificateCard Component - Card hiển thị chứng nhận
 * @param {string} type - 'volunteer' | 'academic' | 'award'
 * @param {string} title - Tên chứng nhận
 * @param {string} issuer - Đơn vị cấp
 * @param {string} date - Ngày cấp
 * @param {string} image - Ảnh chứng nhận
 * @param {string} code - Mã chứng nhận
 * @param {string} year - Năm học
 */
export default function CertificateCard({
    type = 'volunteer',
    title,
    issuer,
    date,
    image,
    code,
    year,
    verified = false,
    onDownload,
    onViewDetail,
    className = '',
}) {
    const typeLabels = {
        volunteer: 'TÌNH NGUYỆN',
        academic: 'HỌC THUẬT',
        award: 'KHEN THƯỞNG',
        summer: 'MÙA HÈ XANH',
        education: 'HỖ TRỢ GIÁO DỤC',
        blood: 'CỘNG ĐỒNG',
    };

    const typeVariants = {
        volunteer: 'volunteer',
        academic: 'academic',
        award: 'award',
        summer: 'success',
        education: 'primary',
        blood: 'danger',
    };

    return (
        <div
            className={`
        bg-white rounded-xl overflow-hidden border border-gray-100 
        hover:shadow-lg transition-all duration-300 group
        ${className}
      `}
        >
            {/* Image */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="material-symbols-outlined text-5xl">description</span>
                    </div>
                )}
                {/* Type badge on image */}
                <div className="absolute top-3 left-3">
                    <Badge variant={typeVariants[type]} size="sm">
                        {typeLabels[type]}
                    </Badge>
                </div>
                {/* Code badge */}
                {code && (
                    <div className="absolute top-3 right-3">
                        <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                            {code}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[48px]">
                    {title}
                </h4>

                {/* Issuer */}
                {issuer && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                        <span className="material-symbols-outlined text-base">business</span>
                        {issuer}
                    </div>
                )}

                {/* Date */}
                {date && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                        <span className="material-symbols-outlined text-base">calendar_today</span>
                        Cấp ngày: {date}
                    </div>
                )}

                {/* Year */}
                {year && (
                    <div className="text-sm text-gray-500 mb-3">
                        Năm học: {year}
                    </div>
                )}

                {/* Verified badge */}
                {verified && (
                    <div className="flex items-center gap-1 text-sm text-success mb-3">
                        <span className="material-symbols-outlined text-base">verified</span>
                        Chính thức
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onDownload}
                        leftIcon={<span className="material-symbols-outlined text-base">download</span>}
                        className="flex-1"
                    >
                        Tải xuống
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onViewDetail}
                        leftIcon={<span className="material-symbols-outlined text-base">visibility</span>}
                    >
                        Chi tiết
                    </Button>
                </div>
            </div>
        </div>
    );
}
