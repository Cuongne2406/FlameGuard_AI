import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard, Card, Badge, NotificationItem } from '../../../components/ui';

/**
 * Home Page - Trang chủ đoàn viên
 */
const Home = () => {
    const navigate = useNavigate();
    // Mock data
    const stats = {
        points: { value: '85/100', change: '+5.2% so với tháng trước', trend: 'up' },
        events: { value: '12', change: '+ 2 sự kiện mới trong tuần', trend: 'up' },
        rank: { value: '05/45', change: 'Tăng 1 bậc', trend: 'up' },
    };

    const tasks = [
        { id: 1, title: 'Hội nghị học tập Nghị quyết Đại hội Đoàn', time: '08:00', location: 'Hội trường A', status: 'pending', requireAttendance: true },
        { id: 2, title: 'Sinh hoạt Chi đoàn tháng 5', time: '15:30', location: 'Online (MS Teams)', status: 'not_started' },
    ];

    const notifications = [
        { id: 1, category: 'khoa', title: 'Thông báo nộp sổ Đoàn năm học 2023-2024', content: 'Vui lòng hoàn tất và nộp sổ Đoàn cho Bí thư Chi đoàn trước ngày 30/05...', time: '10 phút trước', isNew: true },
        { id: 2, category: 'system', title: 'Xác nhận điểm rèn luyện hoạt động Mùa hè xanh', content: 'Bạn vừa được cộng +10 điểm rèn luyện cho hoạt động Mùa hè xanh 2024.', time: '2 giờ trước', isNew: true },
        { id: 3, category: 'chidoan', title: 'Nhắc nhở đóng Đoàn phí Quý II', content: 'Đoàn viên cần thực hiện đóng phí đúng hạn cho thủ quỹ chi đoàn.', time: 'Hôm qua' },
        { id: 4, category: 'truong', title: 'Cuộc thi sáng tạo Video "Tự hào Đoàn ta"', content: 'Cơ hội nhận giải thưởng lên đến 5,000,000đ và giấy khen...', time: '2 ngày trước' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Tổng điểm rèn luyện"
                    value={stats.points.value}
                    subtitle={stats.points.change}
                    trend={stats.points.trend}
                    icon={<span className="material-symbols-outlined text-primary text-2xl">verified</span>}
                    variant="primary"
                />
                <StatCard
                    title="Số sự kiện đã tham gia"
                    value={stats.events.value}
                    subtitle={stats.events.change}
                    trend={stats.events.trend}
                    icon={<span className="material-symbols-outlined text-green-600 text-2xl">event</span>}
                    variant="success"
                />
                <StatCard
                    title="Xếp hạng Chi đoàn"
                    value={stats.rank.value}
                    subtitle={stats.rank.change}
                    trend={stats.rank.trend}
                    icon={<span className="material-symbols-outlined text-yellow-600 text-2xl">emoji_events</span>}
                    variant="warning"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Tasks & Progress */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Today's Tasks */}
                    <Card
                        title="Nhiệm vụ hôm nay"
                        headerAction={
                            <Badge variant="warning" size="sm">CẦN XỬ LÝ</Badge>
                        }
                    >
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-primary">
                                                {task.status === 'pending' ? 'event_available' : 'event'}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                    {task.time}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                                    {task.location}
                                                </span>
                                            </div>
                                            {task.requireAttendance && (
                                                <span className="text-xs text-primary mt-1 inline-block">
                                                    Yêu cầu điểm danh
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => task.status === 'pending' ? navigate('/checkin') : null}
                                        className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${task.status === 'pending' ? 'bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20' : 'bg-gray-300 cursor-not-allowed'}`}
                                    >
                                        {task.status === 'pending' ? 'Điểm danh' : 'Chưa mở'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Progress Chart */}
                    <Card title="Tiến trình khen thưởng">
                        <div className="flex items-center gap-6">
                            {/* Circular Progress */}
                            <div className="relative w-32 h-32 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="#e5e7eb"
                                        strokeWidth="10"
                                        fill="none"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="#0066B3"
                                        strokeWidth="10"
                                        fill="none"
                                        strokeDasharray={`${85 * 2.51} ${100 * 2.51}`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-primary">85%</span>
                                    <span className="text-xs text-gray-500">HOÀN THÀNH</span>
                                </div>
                            </div>

                            {/* Progress Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="success">Đoàn viên Xuất sắc</Badge>
                                    <span className="text-sm text-gray-500">85/100đ</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Bạn chỉ cần thêm <strong className="text-primary">15 điểm</strong> nữa để đạt danh hiệu{' '}
                                    <strong>Đoàn viên Xuất sắc</strong> cấp Khoa. Hãy tham gia thêm các hoạt động tình nguyện sắp tới!
                                </p>
                                <a href="/activity" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                                    Xem chi tiết tiêu chí
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column - Notifications */}
                <div className="lg:col-span-1">
                    <Card
                        title="Thông báo mới"
                        headerAction={
                            <a href="/notifications" className="text-sm text-primary hover:underline">
                                Xem tất cả
                            </a>
                        }
                        noPadding
                    >
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notif) => (
                                <NotificationItem
                                    key={notif.id}
                                    category={notif.category}
                                    title={notif.title}
                                    content={notif.content}
                                    time={notif.time}
                                    isNew={notif.isNew}
                                />
                            ))}
                        </div>
                        <div className="p-3 text-center border-t border-gray-100">
                            <p className="text-sm text-gray-400">
                                Bạn đã cập nhật tất cả thông báo quan trọng.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Home;
