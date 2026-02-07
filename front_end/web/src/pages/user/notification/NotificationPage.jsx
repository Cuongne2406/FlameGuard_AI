import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/ui';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]); // Luôn khởi tạo là mảng rỗng
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(5);

    // --- 1. HÀM LẤY DỮ LIỆU TỪ BACKEND ---
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch('http://127.0.0.1:8000/api/v1/notifications/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Lỗi kết nối API");

            const data = await response.json();
            
            // Chỉ cập nhật nếu data trả về là một mảng
            if (Array.isArray(data)) {
                setNotifications(data);
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

    // --- 2. CÁC HÀM HỖ TRỢ GIAO DIỆN ---
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
        if (isNaN(date.getTime())) return "Ngày không xác định"; // Tránh crash nếu ngày lỗi
        
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
    // Sử dụng 'read' hoặc 'is_read' tùy theo Backend trả về
    const filtered = (filter === 'all' ? notifications : notifications.filter(n => !n.read))
        .slice(0, visibleCount);

    if (loading) return <div className="p-10 text-center">Đang tải thông báo...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
                    <p className="text-gray-500 mt-1">Cập nhật tin tức và thông báo mới nhất</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'all' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => { setFilter('all'); setVisibleCount(5); }}
                    >
                        Tất cả
                    </Button>
                    <Button
                        variant={filter === 'unread' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => { setFilter('unread'); setVisibleCount(5); }}
                    >
                        Chưa đọc
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {filtered.length > 0 ? filtered.map((item) => (
                    <div
                        key={item.id}
                        className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                            item.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100'
                        }`}
                    >
                        <div className="flex gap-4">
                            {/* Dùng item.type thay vì category để đồng bộ */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getColor(item.type)}`}>
                                <span className="material-symbols-outlined">{getIcon(item.type)}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-semibold ${item.read ? 'text-gray-900' : 'text-primary'}`}>
                                        {item.title}
                                    </h3>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {formatTimeAgo(item.time)}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">{item.content}</p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
                        Không có thông báo nào.
                    </div>
                )}
            </div>

            {visibleCount < notifications.length && (
                <div className="text-center pt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setVisibleCount(prev => prev + 5)}
                    >
                        Xem các thông báo cũ hơn
                    </Button>
                </div>
            )}
        </div>
    );
};

export default NotificationPage;