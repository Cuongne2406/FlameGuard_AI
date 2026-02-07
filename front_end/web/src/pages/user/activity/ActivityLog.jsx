import React from 'react';
import { useState } from 'react';
import { Card, StatCard, ActivityItem, Button, Badge, Toast } from '../../../components/ui';

/**
 * ActivityLog Page - Nhật ký hoạt động
 */
const ActivityLog = () => {
    // Mock stats
    const stats = {
        total: { value: '24', label: 'Tổng hoạt động', change: '+2 kỳ này', trend: 'up' },
        points: { value: '85', label: 'Tổng điểm tích lũy', change: '+15 trong tháng', trend: 'up' },
        rank: { value: 'Xuất sắc', label: 'Hạng rèn luyện', subtitle: 'Top 5% của Khoa' },
    };

    // Filters
    const [year, setYear] = useState('2023 - 2024');
    const [semester, setSemester] = useState('Học kỳ 1');
    const [visibleCount, setVisibleCount] = useState(3);
    const [isApplying, setIsApplying] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Mock activities
    const allActivities = [
        {
            id: 1,
            type: 'summer',
            title: 'Chiến dịch Mùa hè xanh 2024 - Mặt trận TP.HCM',
            date: '15 Tháng 07, 2024',
            points: 15,
            checkIn: '07:32 AM',
            checkOut: '17:15 PM',
            location: 'Quận Bình Thạnh, TP.HCM',
            year: '2023 - 2024',
            semester: 'Học kỳ hè'
        },
        {
            id: 2,
            type: 'seminar',
            title: 'Kỹ năng mềm: Tư duy thiết kế cho Kỹ sư tương lai',
            date: '02 Tháng 06, 2024',
            points: 5,
            checkIn: '13:55 PM',
            checkOut: '16:40 PM',
            location: 'Hội trường A, Cơ sở chính',
            year: '2023 - 2024',
            semester: 'Học kỳ 1'
        },
        {
            id: 3,
            type: 'blood',
            title: 'Hiến máu nhân đạo đợt 1',
            date: '20 Tháng 05, 2024',
            points: 10,
            location: 'Sảnh B - Trường ĐH Lạc Hồng',
            year: '2023 - 2024',
            semester: 'Học kỳ 1'
        },
        {
            id: 4,
            type: 'academic',
            title: 'Hội thảo: Ứng dụng AI trong lập trình Modern Web',
            date: '10 Tháng 05, 2024',
            points: 2,
            checkIn: '08:00 AM',
            checkOut: '11:00 AM',
            location: 'Phòng Lab 402',
            year: '2022 - 2023',
            semester: 'Học kỳ 2'
        },
        {
            id: 5,
            type: 'volunteer',
            title: 'Ngày hội Chủ nhật đỏ 2024',
            date: '25 Tháng 04, 2024',
            points: 5,
            location: 'Sân trường Cơ sở 1',
            year: '2023 - 2024',
            semester: 'Học kỳ 2'
        }
    ];

    const [filteredActivities, setFilteredActivities] = useState(allActivities);

    const handleApplyFilters = () => {
        setIsApplying(true);
        setTimeout(() => {
            const result = allActivities.filter(act =>
                act.year === year && act.semester === semester
            );
            setFilteredActivities(result);
            setIsApplying(false);
            setVisibleCount(3);
        }, 500);
    };

    const handleClearFilters = () => {
        setYear('2023 - 2024');
        setSemester('Học kỳ 1');
        setFilteredActivities(allActivities);
        setVisibleCount(3);
    };

    const handleExportPDF = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const visibleActivities = filteredActivities.slice(0, visibleCount);

    return (
        <div className="space-y-6 relative">
            {showToast && (
                <Toast
                    message="Xuất báo cáo PDF thành công!"
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}

            {/* Page Header */}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Năm học</label>
                        <div className="relative">
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option>2023 - 2024</option>
                                <option>2022 - 2023</option>
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <span className="material-symbols-outlined">expand_more</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Học kỳ</label>
                        <div className="relative">
                            <select
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option>Học kỳ 1</option>
                                <option>Học kỳ 2</option>
                                <option>Học kỳ hè</option>
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <span className="material-symbols-outlined">expand_more</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            variant="outline"
                            className="flex-1 md:flex-none"
                            onClick={handleClearFilters}
                            disabled={isApplying}
                        >
                            Xóa lọc
                        </Button>
                        <Button
                            variant="secondary"
                            className="flex-1 md:flex-none min-w-[100px]"
                            onClick={handleApplyFilters}
                            disabled={isApplying}
                        >
                            {isApplying ? 'Đang xử lý...' : 'Áp dụng'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Timeline Activities */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                {filteredActivities.length > 0 ? (
                    <div className="relative border-l-2 border-gray-100 pl-8 ml-4 space-y-8">
                        {visibleActivities.map((item, index) => (
                            <div key={item.id} className="relative">
                                {/* Dot on timeline */}
                                <span className="absolute -left-[41px] top-6 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm ring-1 ring-gray-100"></span>

                                <ActivityItem
                                    type={item.type}
                                    title={item.title}
                                    points={item.points}
                                    date={item.date}
                                    checkIn={item.checkIn}
                                    checkOut={item.checkOut}
                                    location={item.location}
                                    onViewProof={() => console.log('Xem minh chứng', item.id)}
                                />
                            </div>
                        ))}

                        {/* Show more button */}
                        {visibleCount < filteredActivities.length && (
                            <div className="relative pt-4">
                                <span className="absolute -left-[37px] top-8 w-2 h-2 rounded-full bg-gray-300"></span>
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    rightIcon={<span className="material-symbols-outlined">expand_more</span>}
                                    onClick={() => setVisibleCount(prev => prev + 3)}
                                >
                                    Xem thêm hoạt động cũ hơn
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-gray-300 text-3xl">event_busy</span>
                        </div>
                        <p className="text-gray-500 font-medium">Không tìm thấy hoạt động nào trong giai đoạn này.</p>
                        <p className="text-gray-400 text-sm mt-1">Vui lòng thử chọn Năm học hoặc Học kỳ khác.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLog;
