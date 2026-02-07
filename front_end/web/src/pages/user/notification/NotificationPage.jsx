import React from 'react';
import { useState } from 'react';
import { Card, Button, Badge } from '../../../components/ui';

/**
 * NotificationPage - Trang thông báo
 */
const NotificationPage = () => {
    const [filter, setFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(4);

    const notifications = [
        {
            id: 1,
            title: 'Nhắc nhở đóng Đoàn phí năm học 2023-2024',
            content: 'Các bạn đoàn viên vui lòng hoàn thành đóng đoàn phí trước ngày 30/05/2024...',
            time: '2 giờ trước',
            type: 'urgent',
            read: false,
        },
        {
            id: 2,
            title: 'Kế hoạch tổ chức Mùa hè xanh 2024',
            content: 'Đoàn trường ĐH CNTT chính thức khởi động chiến dịch Mùa hè xanh 2024. Đăng ký ngay...',
            time: '1 ngày trước',
            type: 'info',
            read: true,
        },
        {
            id: 3,
            title: 'Kết quả rèn luyện Học kỳ 1',
            content: 'Điểm rèn luyện HK1 năm học 2023-2024 đã được cập nhật. Sinh viên vui lòng kiểm tra...',
            time: '3 ngày trước',
            type: 'success',
            read: true,
        },
        {
            id: 4,
            title: 'Thông báo về việc cập nhật hồ sơ đoàn viên',
            content: 'Hệ thống yêu cầu cập nhật thông tin CCCD/CMND mới nhất. Hạn chót 15/06...',
            time: '5 ngày trước',
            type: 'warning',
            read: true,
        },
        {
            id: 5,
            title: 'Lịch thi đấu giải bóng đá nam 2024',
            content: 'Cập nhật lịch thi đấu vòng bảng giải bóng đá truyền thống cấp trường...',
            time: '1 tuần trước',
            type: 'info',
            read: true,
        },
        {
            id: 6,
            title: 'Khen thưởng cuộc thi Ý tưởng sáng tạo',
            content: 'Chúc mừng chi đoàn 21CT111 đạt giải ba cuộc thi Ý tưởng sáng tạo không biên giới...',
            time: '2 tuần trước',
            type: 'success',
            read: true,
        }
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'urgent': return 'campaign'; // Loa mat
            case 'info': return 'info';
            case 'success': return 'check_circle';
            case 'warning': return 'warning';
            default: return 'notifications';
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'urgent': return 'text-red-500 bg-red-50';
            case 'info': return 'text-blue-500 bg-blue-50';
            case 'success': return 'text-green-500 bg-green-50';
            case 'warning': return 'text-orange-500 bg-orange-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    const filtered = (filter === 'all' ? notifications : notifications.filter(n => !n.read))
        .slice(0, visibleCount);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
                    <p className="text-gray-500 mt-1">Cập nhật tin tức và thông báo mới nhất từ Đoàn trường</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'all' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => {
                            setFilter('all');
                            setVisibleCount(4);
                        }}
                    >
                        Tất cả
                    </Button>
                    <Button
                        variant={filter === 'unread' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => {
                            setFilter('unread');
                            setVisibleCount(4);
                        }}
                    >
                        Chưa đọc
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {filtered.map((item) => (
                    <div
                        key={item.id}
                        className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${item.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100'
                            }`}
                    >
                        <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getColor(item.type)}`}>
                                <span className="material-symbols-outlined">{getIcon(item.type)}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-semibold ${item.read ? 'text-gray-900' : 'text-primary'}`}>
                                        {item.title}
                                    </h3>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">{item.content}</p>
                            </div>
                            {!item.read && (
                                <div className="flex flex-col justify-center">
                                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {visibleCount < notifications.length && (
                <div className="text-center pt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setVisibleCount(prev => prev + 4)}
                    >
                        Xem các thông báo cũ hơn
                    </Button>
                </div>
            )}
        </div>
    );
};

export default NotificationPage;
