import React, { useState, useEffect } from 'react';
import { Card, StatCard, ActivityItem, Button, Badge, Toast } from '../../../components/ui';

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

    // --- HÀM GỌI API ---
    const fetchActivities = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            // Gửi kèm year và semester lên URL để Backend lọc giúp
            const url = `http://127.0.0.1:8000/api/v1/activities/me?year=${encodeURIComponent(year)}&semester=${encodeURIComponent(semester)}`;
            
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setActivities(data.data); // List hoạt động
                
                // Cập nhật Stats
                setStats({
                    total: { value: data.stats.total, label: 'Tổng hoạt động', change: 'Mới cập nhật', trend: 'up' },
                    points: { value: data.stats.points, label: 'Tổng điểm tích lũy', change: 'Tích lũy', trend: 'up' },
                    rank: { value: data.stats.rank, label: 'Hạng rèn luyện', subtitle: 'Dựa trên điểm' }
                });
            }
        } catch (error) {
            console.error("Lỗi tải nhật ký:", error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API mỗi khi filter thay đổi (year hoặc semester)
    useEffect(() => {
        fetchActivities();
    }, [year, semester]);

    // Các hàm handle khác giữ nguyên...
    // ...

    return (
        <div className="space-y-6 relative">
            {/* Giữ nguyên phần Header và Stats Card */}
            
            {/* Filter Section - Giữ nguyên, chỉ cần state year/semester thay đổi là useEffect sẽ chạy lại */}

            {/* Timeline Activities */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                {loading ? (
                    <div className="text-center py-10">Đang tải dữ liệu...</div>
                ) : activities.length > 0 ? (
                    <div className="relative border-l-2 border-gray-100 pl-8 ml-4 space-y-8">
                        {activities.slice(0, visibleCount).map((item) => (
                            <div key={item.id} className="relative">
                                {/* Dot */}
                                <span className="absolute -left-[41px] top-6 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm ring-1 ring-gray-100"></span>

                                <ActivityItem
                                    type={item.type}
                                    title={item.title}
                                    points={item.points}
                                    date={new Date(item.date).toLocaleDateString('vi-VN')} // Format ngày
                                    checkIn={item.check_in}   // Khớp tên trường Backend
                                    checkOut={item.check_out} // Khớp tên trường Backend
                                    location={item.location}
                                    onViewProof={() => console.log('Xem minh chứng', item.id)}
                                />
                            </div>
                        ))}
                        
                        {/* Nút Xem thêm */}
                        {visibleCount < activities.length && (
                             <Button onClick={() => setVisibleCount(prev => prev + 5)}>Xem thêm</Button>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        Chưa có hoạt động nào trong kỳ này.
                    </div>
                )}
            </div>
        </div>
    );
};
export default ActivityLog;