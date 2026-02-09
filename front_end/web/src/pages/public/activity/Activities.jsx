import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import để chuyển trang
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";

// ==========================================
// 1. COMPONENT CON: THẺ HOẠT ĐỘNG (ActivityCard)
// ==========================================
const ActivityCard = ({ event, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group cursor-pointer flex flex-col h-full"
  >
    <div className="h-48 bg-slate-200 relative overflow-hidden">
      <img
        src={event.image_url || `https://picsum.photos/seed/${event.id}/500/300`}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        alt={event.title}
      />
      <div className="absolute top-3 right-3 flex gap-2">
        <span className="px-3 py-1 rounded-full text-[10px] font-bold text-white bg-green-500 shadow-lg uppercase">
          Sắp diễn ra
        </span>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold text-white bg-blue-600 shadow-lg uppercase">
          +{event.points} Điểm
        </span>
      </div>
    </div>

    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-bold text-gray-800 leading-tight mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {event.title}
      </h3>
      
      <div className="space-y-2 text-xs text-gray-500 mb-6">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-blue-500" /> 
          {new Date(event.start_time).toLocaleDateString('vi-VN')}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-red-500" /> 
          {event.location}
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} className="text-green-500" /> 
          {event.max_participants} đoàn viên dự kiến
        </div>
      </div>

      <button className="w-full mt-auto py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
        Xem chi tiết & Đăng ký
      </button>
    </div>
  </div>
);

// ==========================================
// 2. COMPONENT CHÍNH: TRANG HOẠT ĐỘNG (Activities)
// ==========================================
const Activities = () => {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch('http://127.0.0.1:8000/api/v1/events/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          const now = new Date();

          // 1. Lọc sự kiện SẮP TỚI (start_time >= hiện tại)
          const filtered = data.filter(ev => new Date(ev.start_time) >= now);

          // 2. Sắp xếp theo thứ tự thời gian gần nhất lên đầu
          filtered.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

          setUpcomingEvents(filtered);
        }
      } catch (err) {
        console.error("Lỗi khi tải hoạt động:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  return (
    <div className="bg-[#fcfcfb] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12 border-l-8 border-blue-600 pl-6">
          <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            Hoạt động sắp tới
          </h1>
          <p className="text-gray-500 font-medium">
            Khám phá và đăng ký tham gia các phong trào, sự kiện dành cho Đoàn viên sinh viên.
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-400 font-bold animate-pulse">Đang cập nhật danh sách hoạt động...</p>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {upcomingEvents.map((event) => (
              <ActivityCard
                key={event.id}
                event={event}
                onClick={() => navigate(`/tin-tuc/${event.id}`)} // Chuyển sang trang chi tiết
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-16 text-center border border-dashed border-gray-200">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Calendar size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-400">Hiện tại chưa có hoạt động mới</h3>
            <p className="text-gray-400 text-sm mt-2">Vui lòng quay lại sau bạn nhé!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;