import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard, Card, Badge, NotificationItem } from '../../../components/ui';

/**
 * Home Page - Student Dashboard với API thực tế & UI cao cấp
 */
const Home = () => {
    const navigate = useNavigate();

    // 1. STATE QUẢN LÝ DỮ LIỆU
    const [data, setData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. GỌI API KHI TRANG LOAD
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    navigate('/login');
                    return;
                }
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
                    throw new Error("Không thể tải dữ liệu từ máy chủ. Vui lòng kiểm tra lại Backend.");
                }

                const dashboardResult = await dashboardRes.json();
                const notifResult = await notifRes.json();

                setData(dashboardResult);
                setNotifications(notifResult);
            } catch (err) {
                console.error("Lỗi:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [navigate]);

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-96 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
            <span className="text-gray-400 font-medium animate-pulse">Đang đồng bộ dữ liệu YouthHub...</span>
        </div>
    );

    if (error) return (
        <div className="p-8 bg-white border border-red-100 rounded-3xl text-center shadow-xl shadow-red-50 max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">error</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Lỗi kết nối Backend</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95"> Thử kết nối lại </button>
        </div>
    );

    if (!data) return null;

    return (
        <div className="space-y-8 animate-fade-in text-left">
            {/* Header Chào mừng */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Chào bạn quay trở lại! 👋</h1>
                    <p className="text-gray-500 mt-1">Hôm nay bạn có {data.tasks?.length || 0} nhiệm vụ cần hoàn thành.</p>
                </div>
                <Badge variant="primary" className="px-4 py-1.5 bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px]">
                    Học kỳ 2 • Năm học 2023-2024
                </Badge>
            </div>

            {/* --- HÀNG 1: THỐNG KÊ --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Tổng điểm rèn luyện"
                    value={data.stats.points.value}
                    subtitle={data.stats.points.change}
                    trend={data.stats.points.trend}
                    icon={<span className="material-symbols-outlined text-primary text-2xl">verified</span>}
                    variant="primary"
                />
                <StatCard
                    title="Sự kiện tham gia"
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- CỘT TRÁI: NHIỆM VỤ & BIỂU ĐỒ --- */}
                <div className="lg:col-span-2 space-y-8">
                    <Card
                        title="Nhiệm vụ hôm nay"
                        headerAction={<Badge variant="warning" size="sm" className="font-bold">CẦN XỬ LÝ</Badge>}
                    >
                        {!data.tasks || data.tasks.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                                <span className="material-symbols-outlined text-gray-200 text-5xl mb-2">assignment_turned_in</span>
                                <p className="text-gray-400 font-medium italic">Tuyệt vời! Bạn không còn nhiệm vụ nào trong hôm nay.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data.tasks.map((task) => (
                                    <div key={task.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-2xl transition-all group">
                                        <div className="flex items-start gap-4 mb-4 md:mb-0">
                                            <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-primary">event_available</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{task.title}</h4>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">schedule</span> {task.time}</span>
                                                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">location_on</span> {task.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => task.status === 'pending' ? navigate('/checkin') : null}
                                            disabled={task.status !== 'pending'}
                                            className={`w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-md active:scale-95 ${task.status === 'pending'
                                                    ? 'bg-primary text-white hover:bg-blue-700 shadow-blue-100'
                                                    : 'bg-green-500 text-white shadow-green-100'
                                                }`}
                                        >
                                            {task.status === 'pending' ? 'BẮT ĐẦU ĐIỂM DANH' : 'ĐÃ HOÀN THÀNH'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Progress Chart Section */}
                    <Card title="Tiến trình rèn luyện tháng này">
                        <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                            {/* Circular Progress */}
                            <div className="relative w-40 h-40 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="44" stroke="#f1f5f9" strokeWidth="10" fill="none" />
                                    <circle
                                        cx="50" cy="50" r="44"
                                        stroke="#0066B3" strokeWidth="10"
                                        fill="none"
                                        strokeDasharray={`${85 * 2.76} ${100 * 2.76}`}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-primary">85%</span>
                                    <span className="text-[10px] text-gray-400 font-bold tracking-widest">TARGET</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                    <h5 className="text-sm font-bold text-gray-900 mb-1">Mục tiêu danh hiệu: "Gương mặt tiêu biểu"</h5>
                                    <p className="text-xs text-blue-700 leading-relaxed">Bạn chỉ cần tham gia thêm <strong>2 hoạt động cấp khoa</strong> nữa để đủ điều kiện xét khen thưởng kỳ này.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Ngày tham gia</p>
                                        <p className="text-xl font-bold text-gray-900">24 <span className="text-sm font-medium">buổi</span></p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Điểm thưởng</p>
                                        <p className="text-xl font-bold text-primary">+15 <span className="text-sm font-medium">pts</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* --- CỘT PHẢI: THÔNG BÁO --- */}
                <div className="lg:col-span-1">
                    <Card
                        title="Thông báo mới"
                        headerAction={
                            <button onClick={() => navigate('/notifications')} className="text-xs font-bold text-primary hover:bg-blue-50 px-2 py-1 rounded transition-colors uppercase tracking-wider">
                                Xem tất cả
                            </button>
                        }
                        noPadding
                    >
                        <div className="divide-y divide-gray-50">
                            {!notifications || notifications.length === 0 ? (
                                <div className="p-10 text-center">
                                    <span className="material-symbols-outlined text-gray-200 text-4xl mb-2">notifications_none</span>
                                    <p className="text-gray-400 text-xs italic">Không có thông báo mới nào</p>
                                </div>
                            ) : (
                                notifications.slice(0, 5).map((notif) => (
                                    <NotificationItem
                                        key={notif.id}
                                        category={notif.type || notif.category || 'info'}
                                        title={notif.title}
                                        content={notif.content}
                                        time={notif.time || notif.created_at}
                                        isNew={!notif.read}
                                    />
                                ))
                            )}
                        </div>
                    </Card>

                    <div className="mt-6 p-6 bg-gradient-to-br from-primary/90 to-blue-800 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                        <h4 className="font-bold mb-2">Tải ứng dụng YouthHub</h4>
                        <p className="text-xs text-white/70 mb-4 leading-relaxed">Nhận thông báo điểm danh ngay trên điện thoại của bạn.</p>
                        <button className="bg-white text-primary text-[10px] font-black px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg">TẢI XUỐNG NGAY</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;