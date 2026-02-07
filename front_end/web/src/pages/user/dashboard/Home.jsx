import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard, Card, Badge, NotificationItem } from '../../../components/ui';

const Home = () => {
    const navigate = useNavigate();
    
    // 1. STATE QUẢN LÝ DỮ LIỆU
    const [data, setData] = useState(null);          // Dữ liệu stats và tasks
    const [notifications, setNotifications] = useState([]); // <--- Dữ liệu thông báo
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. GỌI API KHI TRANG LOAD
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                // Gọi song song cả 2 API để tối ưu tốc độ
                const [dashboardRes, notifRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/api/v1/dashboard/student/overview', { headers }),
                    fetch('http://127.0.0.1:8000/api/v1/notifications/me', { headers })
                ]);

                if (!dashboardRes.ok || !notifRes.ok) {
                    throw new Error("Không thể tải dữ liệu từ máy chủ");
                }

                const dashboardResult = await dashboardRes.json();
                const notifResult = await notifRes.json();

                setData(dashboardResult);
                setNotifications(notifResult); // Lưu thông báo vào state
            } catch (err) {
                console.error("Lỗi:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-500">Đang đồng bộ dữ liệu...</span>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
            ⚠️ Lỗi kết nối: {error}. Vui lòng thử lại sau.
        </div>
    );

    if (!data) return null;

    return (
        <div className="space-y-6">
            {/* --- HÀNG 1: THỐNG KÊ (Giữ nguyên) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Tổng điểm rèn luyện"
                    value={data.stats.points.value}
                    subtitle={data.stats.points.change}
                    trend={data.stats.points.trend}
                    icon={<span className="material-symbols-outlined text-primary text-2xl">verified</span>}
                    variant="primary"
                />
                <StatCard
                    title="Số sự kiện đã tham gia"
                    value={data.stats.events.value}
                    subtitle={data.stats.events.change}
                    trend={data.stats.events.trend}
                    icon={<span className="material-symbols-outlined text-green-600 text-2xl">event</span>}
                    variant="success"
                />
                <StatCard
                    title="Xếp hạng Chi đoàn"
                    value={data.stats.rank.value}
                    subtitle={data.stats.rank.change}
                    trend={data.stats.rank.trend}
                    icon={<span className="material-symbols-outlined text-yellow-600 text-2xl">emoji_events</span>}
                    variant="warning"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- CỘT TRÁI: NHIỆM VỤ (Giữ nguyên) --- */}
                <div className="lg:col-span-2 space-y-6">
                    <Card
                        title="Nhiệm vụ hôm nay"
                        headerAction={<Badge variant="warning" size="sm">CẦN XỬ LÝ</Badge>}
                    >
                        {data.tasks.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">Hôm nay không có hoạt động nào.</p>
                        ) : (
                            <div className="space-y-3">
                                {data.tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary">event_available</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{task.title}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                    <span>{task.time}</span>
                                                    <span>{task.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => task.status === 'pending' ? navigate('/checkin') : null}
                                            disabled={task.status !== 'pending'}
                                            className={`px-4 py-2 text-white rounded-lg text-sm font-medium ${task.status === 'pending' ? 'bg-primary' : 'bg-green-500'}`}
                                        >
                                            {task.status === 'pending' ? 'Điểm danh' : 'Đã tham gia'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* --- CỘT PHẢI: THÔNG BÁO (ĐÃ CẬP NHẬT) --- */}
                <div className="lg:col-span-1">
                    <Card 
                        title="Thông báo mới" 
                        headerAction={
                            <button onClick={() => navigate('/notifications')} className="text-sm text-primary hover:underline">
                                Xem tất cả
                            </button>
                        }
                        noPadding
                    >
                        <div className="divide-y divide-gray-100">
                            {notifications.length === 0 ? (
                                <p className="p-6 text-center text-gray-500 text-sm">Không có thông báo mới.</p>
                            ) : (
                                notifications.map((notif) => (
                                    <NotificationItem
                                        key={notif.id}
                                        category={notif.category} // info, warning, system...
                                        title={notif.title}
                                        content={notif.content}
                                        time={notif.time}
                                        isNew={notif.isNew}
                                    />
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Home;