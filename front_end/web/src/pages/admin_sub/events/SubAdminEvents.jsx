import React, { useState, useEffect } from 'react';
import CreateEvent from '../../../components/common/CreateEvent'; 

const SubAdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [spotlightEvent, setSpotlightEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lấy danh sách sự kiện
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const res = await fetch('http://127.0.0.1:8000/api/v1/events/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        const sortedData = data.sort((a, b) => new Date(b.created_at || b.start_time) - new Date(a.created_at || a.start_time));
        
        if (sortedData.length > 0) {
          setSpotlightEvent(sortedData[0]);
          setEvents(sortedData.slice(1));
        } else {
          setEvents([]);
          setSpotlightEvent(null);
        }
      }
    } catch (err) {
      console.error("Lỗi tải sự kiện:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pb-20 bg-[#fcfcfb] dark:bg-background-dark min-h-full">
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#e6e2db] dark:border-[#3d3321] px-8 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#181611] dark:text-white uppercase">Quản Lý Sự Kiện & Phong Trào</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Theo dõi hoạt động chi đoàn</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-secretary hover:bg-secretary/90 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-secretary/20 font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Tạo sự kiện mới
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {loading ? (
            <div className="p-20 text-center text-gray-400 italic animate-pulse">Đang đồng bộ dữ liệu...</div>
        ) : (
            <>
                {spotlightEvent && (
                  <section>
                    <div className="bg-white dark:bg-[#2d2516] rounded-2xl border border-secretary/20 shadow-xl overflow-hidden relative group">
                      <div className="absolute top-0 right-0 p-6 z-10">
                        <span className="px-3 py-1 bg-secretary text-white text-[10px] font-black rounded-full uppercase tracking-wider shadow-md">Mới nhất</span>
                      </div>
                      <div className="p-8 md:flex items-start gap-8">
                        <div 
                          className="w-full md:w-64 h-48 rounded-xl bg-cover bg-center border border-gray-100 flex-shrink-0 mb-6 md:mb-0 shadow-sm" 
                          style={{backgroundImage: `url('${spotlightEvent.image_url || "https://via.placeholder.com/400x300"}')`}}
                        ></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-secretary text-xl">event</span>
                            <span className="text-sm font-bold text-gray-500">
                                {new Date(spotlightEvent.start_time).toLocaleDateString('vi-VN')} — {spotlightEvent.location}
                            </span>
                          </div>
                          <h3 className="text-3xl font-black text-[#181611] dark:text-white mb-4 leading-tight">{spotlightEvent.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{spotlightEvent.description}</p>
                          <div className="flex gap-3">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all">
                                Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                <section>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-7 bg-secretary rounded-full"></span>
                    Danh sách hoạt động
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white/50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-300 dark:border-[#3d3321] p-5 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white dark:hover:bg-white/10 hover:border-secretary transition-all min-h-[280px]"
                    >
                      <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-secretary/10 transition-colors">
                        <span className="material-symbols-outlined text-gray-400 text-3xl group-hover:text-secretary">add</span>
                      </div>
                      <p className="text-base font-bold text-gray-500 group-hover:text-secretary transition-colors">Thêm sự kiện mới</p>
                    </div>

                    {events.map((ev) => (
                      <EventCard key={ev.id} data={ev} />
                    ))}
                  </div>
                </section>
            </>
        )}
      </div>

      {/* GỌI COMPONENT CREATE EVENT THAY CHO MODAL CŨ */}
      <CreateEvent 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchEvents} 
      />
    </div>
  );
};

const EventCard = ({ data }) => (
    <div className="bg-white dark:bg-[#2d2516] rounded-2xl border border-[#e6e2db] dark:border-[#3d3321] p-5 hover:shadow-lg transition-all flex flex-col h-full group">
        <div className="w-full h-40 rounded-xl bg-gray-100 dark:bg-white/5 mb-4 overflow-hidden relative">
            <img src={data.image_url || 'https://via.placeholder.com/400x200'} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold uppercase shadow-sm">
                {data.status}
            </div>
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white line-clamp-2">{data.title}</h4>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3 text-sm">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {data.location}
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold bg-gray-50 dark:bg-white/5 p-2 rounded-lg">
                <span className="text-blue-600">{new Date(data.start_time).toLocaleDateString('vi-VN')}</span>
                <span className="text-orange-600">+{data.points} điểm</span>
            </div>
        </div>
        <button className="w-full mt-4 bg-gray-100 dark:bg-white/10 hover:bg-secretary hover:text-white text-gray-600 dark:text-gray-300 py-2.5 rounded-xl text-xs font-bold transition-all">
            QUẢN LÝ
        </button>
    </div>
);

export default SubAdminEvents;