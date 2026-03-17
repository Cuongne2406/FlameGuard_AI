import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../services/apiClient';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Ref để xử lý click ra ngoài thì đóng menu
    const dropdownRef = useRef(null);

    // 1. Gọi API lấy thông báo
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            // Sử dụng apiClient để tự động xử lý token và URL
            const data = await apiClient("/notifications/me");
            
            if (data) {
                // Chỉ lấy 5 tin mới nhất để hiển thị trên popup
                setNotifications(Array.isArray(data) ? data.slice(0, 5) : []);
            }
        } catch (error) {
            console.error("Lỗi tải thông báo:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Chạy khi component được load
    useEffect(() => {
        fetchNotifications();

        // Tự động refresh mỗi 60 giây (Optional)
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // 3. Xử lý click ra ngoài để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Hàm format thời gian (Vd: 5 phút trước)
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // giây

        if (diff < 60) return "Vừa xong";
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        return `${Math.floor(diff / 86400)} ngày trước`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* --- CÁI CHUÔNG --- */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors outline-none"
            >
                <span className="material-symbols-outlined text-2xl">notifications</span>
                
                {/* Chấm đỏ báo hiệu có tin mới */}
                {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-[8px] text-white justify-center items-center">
                           {/* Có thể để số lượng ở đây nếu muốn */}
                        </span>
                    </span>
                )}
            </button>

            {/* --- MENU XỔ XUỐNG (DROPDOWN) --- */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 origin-top-right animate-fade-in-up">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 dark:text-white">Thông báo</h3>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                            {notifications.length} mới
                        </span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-4 text-center text-sm text-slate-500">Đang tải...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
                                <p className="text-sm">Không có thông báo mới</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-50 dark:divide-slate-700">
                                {notifications.map((notif) => (
                                    <li key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
                                        <div className="flex gap-3">
                                            {/* Icon theo loại tin */}
                                            <div className={`mt-1 size-8 rounded-full flex items-center justify-center shrink-0 ${
                                                notif.type === 'urgent' ? 'bg-red-100 text-red-600' : 
                                                notif.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                                <span className="material-symbols-outlined text-lg">
                                                    {notif.type === 'urgent' ? 'campaign' : 
                                                     notif.type === 'warning' ? 'warning' : 'info'}
                                                </span>
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                                                        {notif.title}
                                                    </h4>
                                                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                                                        {formatTime(notif.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                    {notif.content}
                                                </p>
                                                {/* Badge đối tượng nhận */}
                                                <div className="mt-2">
                                                     <span className="text-[10px] px-1.5 py-0.5 rounded border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-500">
                                                        {notif.target_audience === 'ALL' ? 'Toàn trường' : notif.target_audience}
                                                     </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 text-center">
                        <button className="text-xs font-medium text-primary hover:text-primary-hover hover:underline">
                            Xem tất cả thông báo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;