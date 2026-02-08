import React, { useState, useEffect } from 'react';
import { Card, StatCard, ActivityItem, Button, Badge, Toast } from '../../../components/ui';

/**
 * ActivityLog Page - Nhật ký hoạt động (Đã tích hợp API & UI Fallback)
 */
const ActivityLog = () => {
    const [activities, setActivities] = useState([]);
    const [stats, setStats] = useState({
        total: { value: 0, label: 'Tổng hoạt động' },
        points: { value: 0, label: 'Tổng điểm tích lũy' },
        rank: { value: '---', label: 'Hạng rèn luyện' }
    });

    // Filters
    const [year, setYear] = useState('2023 - 2024');
    const [semester, setSemester] = useState('Học kỳ 1');
    const [loading, setLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(5);
    const [error, setError] = useState(null);
    const [showExportToast, setShowExportToast] = useState(false);

    // --- HÀM GỌI API ---
    const fetchActivities = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("access_token");
            const url = `http://127.0.0.1:8000/api/v1/activities/me?year=${encodeURIComponent(year)}&semester=${encodeURIComponent(semester)}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setActivities(data.data || []);

                // Cập nhật Stats
                setStats({
                    total: { value: data.stats?.total || 0, label: 'Tổng hoạt động', change: 'Mới cập nhật', trend: 'up' },
                    points: { value: data.stats?.points || 0, label: 'Tổng điểm tích lũy', change: 'Tích lũy', trend: 'up' },
                    rank: { value: data.stats?.rank || '---', label: 'Hạng rèn luyện', subtitle: 'Dựa trên điểm' }
                });
            } else {
                setError("Không thể kết nối đến máy chủ hoặc cơ sở dữ liệu chưa sẵn sàng.");
            }
        } catch (err) {
            console.error("Lỗi tải nhật ký:", err);
            setError("Lỗi kết nối máy chủ. Vui lòng kiểm tra Backend.");
        } finally {
            setLoading(false);
        }
    };

    // Gọi API mỗi khi filter thay đổi
    useEffect(() => {
        fetchActivities();
    }, [year, semester]);

    const handleClearFilters = () => {
        setYear('2023 - 2024');
        setSemester('Học kỳ 1');
        setVisibleCount(5);
    };

    const handleExportPDF = () => {
        setShowExportToast(true);
        setTimeout(() => setShowExportToast(false), 3000);
    };

    return (
        <div className="space-y-6 relative">
            {/* Notification Toast */}
            {showExportToast && (
                <Toast
                    message="Đang khởi tạo tệp PDF thành công! Tải xuống sẽ bắt đầu trong giây lát."
                    onClose={() => setShowExportToast(false)}
                />
            )}

            {/* Error Message for BE Devs */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-shake">
                    <span className="material-symbols-outlined text-red-500">error</span>
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nhật Ký Hoạt Động Chi Tiết</h1>
                    <p className="text-gray-500 mt-1">Theo dõi quá trình tham gia và tích lũy điểm rèn luyện của bạn.</p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={<span className="material-symbols-outlined">picture_as_pdf</span>}
                    onClick={handleExportPDF}
                >
                    Xuất báo cáo PDF
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Tổng hoạt động"
                    value={stats.total.value}
                    subtitle={stats.total.change}
                    trend={stats.total.trend}
                    icon={<span className="material-symbols-outlined text-blue-600 text-2xl">event_note</span>}
                    variant="primary"
                />
                <StatCard
                    title="Tổng điểm tích lũy"
                    value={stats.points.value}
                    subtitle={stats.points.change}
                    trend={stats.points.trend}
                    icon={<span className="material-symbols-outlined text-yellow-600 text-2xl">star</span>}
                    variant="warning"
                />
                <StatCard
                    title="Hạng rèn luyện"
                    value={stats.rank.value}
                    subtitle={stats.rank.subtitle}
                    icon={<span className="material-symbols-outlined text-primary text-2xl">emoji_events</span>}
                />
            </div>

            {/* Filter Section */}
            <Card title="Bộ lọc hoạt động" icon="filter_list">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">Năm học</label>
                        <select
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <option>2023 - 2024</option>
                            <option>2022 - 2023</option>
                        </select>
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">Học kỳ</label>
                        <select
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        >
                            <option>Học kỳ 1</option>
                            <option>Học kỳ 2</option>
                            <option>Học kỳ hè</option>
                        </select>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none" onClick={handleClearFilters}>
                            Xóa lọc
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Timeline Activities */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                {loading ? (
                    <div className="text-center py-10">Đang tải dữ liệu...</div>
                ) : activities.length > 0 ? (
                    <div className="relative border-l-2 border-gray-100 pl-8 ml-4 space-y-8">
                        {activities.slice(0, visibleCount).map((item) => (
                            <div key={item.id} className="relative text-left">
                                <span className="absolute -left-[41px] top-6 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm ring-1 ring-gray-100"></span>
                                <ActivityItem
                                    type={item.type}
                                    title={item.title}
                                    points={item.points}
                                    date={new Date(item.date).toLocaleDateString('vi-VN')}
                                    checkIn={item.check_in}
                                    checkOut={item.check_out}
                                    location={item.location}
                                    onViewProof={() => console.log('Xem minh chứng', item.id)}
                                />
                            </div>
                        ))}

                        {visibleCount < activities.length && (
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => setVisibleCount(prev => prev + 5)}
                                rightIcon={<span className="material-symbols-outlined">expand_more</span>}
                            >
                                Xem thêm hoạt động
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <span className="material-symbols-outlined text-5xl text-gray-200 mb-2">event_busy</span>
                        <p className="font-medium">Chưa có hoạt động nào trong kỳ này.</p>
                        <p className="text-sm text-gray-400 mt-1">Giao diện sẽ hiển thị dữ liệu thật khi Backend hoàn thiện Database.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLog;