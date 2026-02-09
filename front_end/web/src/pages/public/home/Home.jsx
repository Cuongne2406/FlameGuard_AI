import React, { useState, useEffect } from "react";
import { QrCode, CreditCard, BookOpen, X, MapPin, Calendar, Clock, Star, Users } from "lucide-react";

// ==========================================
// 1. COMPONENT: POPUP CHI TIẾT SỰ KIỆN (MODAL)
// ==========================================
const EventDetailModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop mờ */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-[#1e1c16] w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header Image */}
        <div className="relative h-64 w-full shrink-0">
          <img 
            src={event.image_url || "https://images.unsplash.com/photo-1523240715630-34160408b495?auto=format&fit=crop&q=80"} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-6 left-8 right-8">
            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg">
              {event.status === 'UPCOMING' ? 'Sắp diễn ra' : 'Đang diễn ra'}
            </span>
            <h2 className="text-3xl font-black text-white mt-3 leading-tight shadow-sm">{event.title}</h2>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Cột trái: Thông tin chi tiết */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Mô tả sự kiện</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                  {event.description || "Chưa có mô tả chi tiết cho sự kiện này."}
                </p>
              </div>

              {/* Grid thông tin phụ */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={16} className="text-blue-600" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Quy mô</span>
                  </div>
                  <p className="text-lg font-black text-blue-700 dark:text-blue-400">{event.max_participants} người</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-800/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={16} className="text-orange-600" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Điểm rèn luyện</span>
                  </div>
                  <p className="text-lg font-black text-orange-700 dark:text-orange-400">+{event.points} điểm</p>
                </div>
              </div>
            </div>

            {/* Cột phải: Thời gian & Địa điểm */}
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-3xl space-y-4 border border-gray-100 dark:border-gray-700">
                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Calendar size={16} />
                    <span className="text-[10px] font-bold uppercase">Ngày bắt đầu</span>
                  </div>
                  <p className="font-bold text-gray-800 dark:text-white">
                    {new Date(event.start_time).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Clock size={16} />
                    <span className="text-[10px] font-bold uppercase">Giờ tổ chức</span>
                  </div>
                  <p className="font-bold text-gray-800 dark:text-white">
                    {new Date(event.start_time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <MapPin size={16} />
                    <span className="text-[10px] font-bold uppercase">Địa điểm</span>
                  </div>
                  <p className="font-bold text-blue-600">
                    {event.location}
                  </p>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 uppercase text-xs tracking-wider">
                Đăng ký tham gia ngay
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Component QuickAction (Giữ nguyên)
const QuickAction = ({ icon: Icon, title, desc, color }) => (
  <div className={`${color} p-6 rounded-[2rem] border border-transparent hover:border-blue-200 hover:shadow-xl transition-all group cursor-pointer`}>
    <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
      <Icon className="text-blue-600" size={24} />
    </div>
    <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

// 3. Component EventItem (Cập nhật để nhận onClick)
const EventItem = ({ day, month, title, category, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center gap-4 mb-6 last:mb-0 group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors -mx-2"
  >
    <div className="bg-blue-50 w-14 h-14 rounded-2xl flex flex-col items-center justify-center border border-blue-100 group-hover:bg-blue-600 transition-colors shrink-0">
      <span className="text-lg font-black text-blue-600 group-hover:text-white leading-none">{day}</span>
      <span className="text-[10px] font-bold text-blue-400 group-hover:text-blue-100 uppercase">Th{month}</span>
    </div>
    <div className="flex-1 min-w-0">
      <span className="text-[10px] font-black text-blue-600/50 uppercase tracking-widest block truncate">{category}</span>
      <h4 className="text-sm font-bold text-gray-700 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{title}</h4>
    </div>
  </div>
);

// ==========================================
// 4. MAIN COMPONENT: PUBLIC HOME
// ==========================================
const PublicHome = () => {
  // State quản lý dữ liệu
  const [spotlightEvent, setSpotlightEvent] = useState(null); // Sự kiện nổi bật (Banner) - Sắp tới gần nhất
  const [upcomingEvents, setUpcomingEvents] = useState([]);   // Danh sách sự kiện sắp tới
  const [pastEvents, setPastEvents] = useState([]);           // Sự kiện đã qua (Tin tức)
  const [selectedEvent, setSelectedEvent] = useState(null);   // Sự kiện đang xem chi tiết (Modal)
  const [loading, setLoading] = useState(true);

  // Gọi API lấy dữ liệu sự kiện
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch('http://127.0.0.1:8000/api/v1/events/', {
           headers: { 'Authorization': `Bearer ${token}` } 
        });

        if (res.ok) {
          const data = await res.json();
          const now = new Date();

          // Phân loại sự kiện
          const upcoming = [];
          const past = [];

          data.forEach(ev => {
              const eventDate = new Date(ev.start_time); // Hoặc end_time tùy logic bạn muốn
              if (eventDate >= now) {
                  upcoming.push(ev);
              } else {
                  past.push(ev);
              }
          });

          // Sắp xếp: 
          // - Sắp tới: Ngày gần nhất lên đầu
          upcoming.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
          // - Đã qua: Mới nhất (gần hiện tại nhất) lên đầu
          past.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

          setUpcomingEvents(upcoming);
          setPastEvents(past);

          // Lấy sự kiện sắp tới gần nhất làm Banner
          if (upcoming.length > 0) {
            setSpotlightEvent(upcoming[0]);
          } else if (past.length > 0) {
             // Nếu không có sự kiện sắp tới, lấy sự kiện mới nhất đã qua làm banner (tùy chọn)
             setSpotlightEvent(past[0]);
          }

        }
      } catch (err) {
        console.error("Lỗi tải sự kiện:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* --- 1. HERO BANNER (SPOTLIGHT) --- */}
        {loading ? (
            <div className="h-[450px] bg-gray-200 rounded-[32px] animate-pulse mb-12"></div>
        ) : spotlightEvent ? (
            <section className="relative rounded-[32px] overflow-hidden bg-slate-900 h-[450px] mb-12 shadow-2xl group">
              <img
                src={spotlightEvent.image_url || "https://images.unsplash.com/photo-1523240715630-34160408b495?auto=format&fit=crop&q=80"}
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              
              <div className="absolute bottom-12 left-8 md:left-12 max-w-3xl text-white pr-4">
                <div className="flex items-center gap-3 mb-4">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest shadow-lg ${new Date(spotlightEvent.start_time) >= new Date() ? 'bg-blue-600' : 'bg-gray-600'}`}>
                      {new Date(spotlightEvent.start_time) >= new Date() ? 'Sắp diễn ra' : 'Đã kết thúc'}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold bg-white/10 backdrop-blur px-3 py-1 rounded-md border border-white/10">
                        <Calendar size={12} />
                        {new Date(spotlightEvent.start_time).toLocaleDateString('vi-VN')}
                    </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold mt-2 leading-tight drop-shadow-lg line-clamp-2">
                  {spotlightEvent.title}
                </h1>
                
                <p className="mt-4 text-gray-200 text-sm md:text-base leading-relaxed line-clamp-2 max-w-2xl">
                  {spotlightEvent.description || "Hãy tham gia cùng chúng tôi trong sự kiện đặc biệt này..."}
                </p>
                
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setSelectedEvent(spotlightEvent)}
                    className="bg-white text-blue-900 px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-white/10 flex items-center gap-2"
                  >
                    Xem chi tiết <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </section>
        ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400 italic">Chưa có sự kiện nào.</div>
        )}

        {/* --- 2. LỐI TẮT NHANH --- */}
        <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-6 uppercase text-xs tracking-wider">
          <span className="text-blue-600">⚡</span> Lối tắt nhanh cho Đoàn viên
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <QuickAction icon={CreditCard} title="Thẻ điện tử" desc="Xem thông tin định danh Đoàn viên số của bạn ngay tại đây." color="bg-cyan-50" />
          <QuickAction icon={BookOpen} title="Nhật ký Đoàn viên" desc="Theo dõi quá trình rèn luyện cá nhân và các hoạt động." color="bg-indigo-50" />
        </div>

        {/* --- 3. CONTENT GRID: TIN TỨC & LỊCH --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Cột trái: TIN TỨC HOẠT ĐỘNG (Sự kiện đã qua) */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Tin tức hoạt động</h2>
              <span className="text-gray-400 text-xs font-bold uppercase">Các sự kiện đã diễn ra</span>
            </div>
            
            {/* Render danh sách sự kiện ĐÃ QUA */}
            {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pastEvents.map((ev) => (
                    <div 
                        key={ev.id} 
                        onClick={() => setSelectedEvent(ev)}
                        className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full"
                    >
                    <div className="h-44 overflow-hidden bg-gray-200 relative shrink-0">
                        <img 
                            src={ev.image_url || "https://images.unsplash.com/photo-1523240715630-34160408b495?auto=format&fit=crop&q=80"} 
                            alt={ev.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-duration-500" 
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-gray-600">
                            {new Date(ev.start_time).toLocaleDateString('vi-VN')}
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <span className="text-[10px] text-gray-400 font-black uppercase">Đã kết thúc</span>
                        <h3 className="font-bold text-gray-800 mt-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                            {ev.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-auto">
                            {ev.description || "Xem chi tiết nội dung sự kiện..."}
                        </p>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                    Chưa có tin tức hoạt động nào gần đây.
                </div>
            )}
          </div>

          {/* Cột phải: LỊCH SỰ KIỆN SẮP TỚI */}
          <aside>
            <h2 className="text-xl font-bold text-gray-800 mb-8 tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Lịch sự kiện sắp tới
            </h2>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              
              {upcomingEvents.length > 0 ? (
                  // Bỏ qua sự kiện đầu tiên vì đã hiện ở Banner Spotlight (nếu muốn)
                  // Ở đây tôi hiển thị từ sự kiện thứ 2 trở đi để tránh lặp lại, hoặc hiển thị hết tùy bạn
                  upcomingEvents.slice(spotlightEvent && upcomingEvents[0]?.id === spotlightEvent.id ? 1 : 0).map(ev => {
                      const date = new Date(ev.start_time);
                      return (
                        <EventItem
                            key={ev.id}
                            day={date.getDate()}
                            month={date.getMonth() + 1}
                            title={ev.title}
                            category="Sắp diễn ra"
                            onClick={() => setSelectedEvent(ev)}
                        />
                      )
                  })
              ) : (
                  <div className="text-center py-10 text-gray-400 text-sm">Hiện không có lịch sự kiện sắp tới.</div>
              )}

              {upcomingEvents.length > 5 && (
                  <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 hover:text-blue-600 transition-all">
                    XEM TẤT CẢ LỊCH
                  </button>
              )}
            </div>
          </aside>
        </div>

      </main>

      {/* MODAL SYSTEM */}
      {selectedEvent && (
        <EventDetailModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
        />
      )}

    </div>
  );
};

export default PublicHome;