import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/ui';

/**
 * Notification Page - Trang thông báo tích hợp API & UI mượt mà
 */
const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(5);

    // --- 1. HÀM LẤY DỮ LIỆU TỪ BACKEND ---
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch('http://127.0.0.1:8000/api/v1/notifications/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setNotifications(data);
                }
            }
        } catch (error) {
            console.error("Lỗi tải thông báo:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // --- 2. HÀM HỖ TRỢ GIAO DIỆN ---
    const getIcon = (type) => {
        switch (type) {
            case 'urgent': return 'campaign';
            case 'success': return 'check_circle';
            case 'warning': return 'warning';
            default: return 'notifications';
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'urgent': return 'text-red-500 bg-red-50';
            case 'success': return 'text-green-500 bg-green-50';
            case 'warning': return 'text-orange-500 bg-orange-50';
            default: return 'text-blue-500 bg-blue-50';
        }
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return "Vừa xong";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Vừa xong";

        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        if (seconds < 60) return "Vừa xong";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} phút trước`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} giờ trước`;
        return date.toLocaleDateString('vi-VN');
    };

    // --- 3. LOGIC LỌC DỮ LIỆU ---
    const filtered = (filter === 'all' ? notifications : notifications.filter(n => !n.read))
        .slice(0, visibleCount);

    if (loading) return <div className="p-20 text-center text-gray-400">Đang tải thông báo...</div>;

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
                    <p className="text-gray-500 mt-1">Cập nhật tin tức và thông báo mới nhất từ Đoàn khoa</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        variant={filter === 'all' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => { setFilter('all'); setVisibleCount(5); }}
                        className="flex-1 md:flex-none"
                    >
                        Tất cả
                    </Button>
                    <Button
                        variant={filter === 'unread' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => { setFilter('unread'); setVisibleCount(5); }}
                        className="flex-1 md:flex-none"
                    >
                        Chưa đọc ({notifications.filter(n => !n.read).length})
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {filtered.length > 0 ? filtered.map((item) => (
                    <div
                        key={item.id}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 ${item.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100 ring-1 ring-blue-100'
                            }`}
                    >
                        <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${getColor(item.type)}`}>
                                <span className="material-symbols-outlined">{getIcon(item.type)}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold ${item.read ? 'text-gray-900' : 'text-primary'}`}>
                                        {item.title}
                                    </h3>
                                    <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-full uppercase">
                                        {formatTimeAgo(item.time || item.created_at)}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{item.content}</p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <span className="material-symbols-outlined text-gray-300 text-5xl mb-2">notifications_off</span>
                        <p className="text-gray-400 font-medium">Hiện tại không có thông báo nào dành cho bạn</p>
                    </div>
                )}
            </div>

            {visibleCount < (filter === 'all' ? notifications.length : notifications.filter(n => !n.read).length) && (
                <div className="text-center pt-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setVisibleCount(prev => prev + 5)}
                    >
                        Xem thêm thông báo cũ hơn
                    </Button>
                </div>
            )}
        </div>
    );
};

export default NotificationPage;