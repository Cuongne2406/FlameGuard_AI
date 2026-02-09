import React, { useState, useEffect } from 'react';

/**
 * TRANG QUẢN LÝ SỰ KIỆN - SUB ADMIN
 * Tính năng: Xem danh sách, Tạo mới (Popup Form), Tự động cập nhật.
 */
const SubAdminEvents = () => {
  // --- 1. STATE QUẢN LÝ ---
  const [events, setEvents] = useState([]);
  const [spotlightEvent, setSpotlightEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State Form Data (Khớp 100% với model Event trong Backend)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    max_participants: 100,
    points: 10,       // Mặc định 10 điểm
    status: 'UPCOMING',
    image_url: ''     // Đường dẫn ảnh
  });

  // --- 2. HÀM GỌI API (GET & POST) ---
  
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
        // Sắp xếp: Mới nhất lên đầu
        const sortedData = data.sort((a, b) => new Date(b.created_at || b.start_time) - new Date(a.created_at || a.start_time));
        
        if (sortedData.length > 0) {
          setSpotlightEvent(sortedData[0]); // Sự kiện mới nhất làm Spotlight
          setEvents(sortedData.slice(1));   // Các sự kiện còn lại vào danh sách
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

  // Gọi API khi trang vừa load
  useEffect(() => {
    fetchEvents();
  }, []);

  // Xử lý thay đổi trong Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gửi Form lên Server (POST)
  const handleCreateEvent = async (e) => {
    e.preventDefault(); // Chặn reload trang
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch('http://127.0.0.1:8000/api/v1/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("🎉 Tạo sự kiện thành công!");
        setIsModalOpen(false); // Đóng Modal
        fetchEvents(); // Load lại dữ liệu mới nhất
        // Reset form về mặc định
        setFormData({
            title: '', description: '', location: '', start_time: '', end_time: '', 
            max_participants: 100, points: 10, status: 'UPCOMING', image_url: ''
        });
      } else {
        const errData = await res.json();
        alert(`Lỗi: ${errData.detail || "Không thể tạo sự kiện"}`);
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      alert("Lỗi kết nối đến Server!");
    }
  };

  // --- 3. GIAO DIỆN ---
  return (
    <div className="animate-in fade-in duration-500 pb-20 bg-[#fcfcfb] dark:bg-background-dark min-h-full">
      
      {/* Header */}
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
                {/* 1. Spotlight Event (Sự kiện nổi bật nhất) */}
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

                {/* 2. Danh sách sự kiện khác */}
                <section>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-7 bg-secretary rounded-full"></span>
                    Danh sách hoạt động
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Thẻ Tạo nhanh */}
                    <div 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white/50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-300 dark:border-[#3d3321] p-5 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white dark:hover:bg-white/10 hover:border-secretary transition-all min-h-[280px]"
                    >
                      <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-secretary/10 transition-colors">
                        <span className="material-symbols-outlined text-gray-400 text-3xl group-hover:text-secretary">add</span>
                      </div>
                      <p className="text-base font-bold text-gray-500 group-hover:text-secretary transition-colors">Thêm sự kiện mới</p>
                    </div>

                    {/* Mapping Events */}
                    {events.map((ev) => (
                      <EventCard key={ev.id} data={ev} />
                    ))}
                  </div>
                </section>
            </>
        )}
      </div>

      {/* --- POP-UP MODAL FORM (Tạo Sự Kiện) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white dark:bg-[#1e1c16] w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100 dark:border-[#3d3321]">
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-gray-100 dark:border-[#3d3321] flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
              <h3 className="text-xl font-black uppercase text-[#181611] dark:text-white">Thiết lập sự kiện mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-gray-500">close</span>
              </button>
            </div>

            {/* Modal Body: FORM */}
            <form onSubmit={handleCreateEvent} className="p-8 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                
                {/* 1. Ảnh bìa (Image URL) */}
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Ảnh bìa sự kiện</label>
                    <div className="relative h-40 w-full bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center overflow-hidden group">
                        {formData.image_url ? (
                            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center">
                                <span className="material-symbols-outlined text-4xl text-gray-300">image</span>
                                <p className="text-[10px] font-bold text-gray-400 mt-1">Dán link ảnh vào ô bên dưới</p>
                            </div>
                        )}
                    </div>
                    <input 
                        type="text" 
                        name="image_url" 
                        placeholder="https://example.com/anh-su-kien.jpg" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 ring-secretary/20"
                        onChange={handleInputChange}
                    />
                </div>

                {/* 2. Thông tin chính */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên hoạt động <span className="text-red-500">*</span></label>
                        <input name="title" required className="form-input" placeholder="VD: Mùa hè xanh 2026" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa điểm <span className="text-red-500">*</span></label>
                        <input name="location" required className="form-input" placeholder="VD: Hội trường A" onChange={handleInputChange} />
                    </div>
                </div>

                {/* 3. Thời gian */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Bắt đầu <span className="text-red-500">*</span></label>
                        <input name="start_time" type="datetime-local" required className="form-input" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Kết thúc</label>
                        <input name="end_time" type="datetime-local" className="form-input" onChange={handleInputChange} />
                    </div>
                </div>

                {/* 4. Chỉ số & Điểm */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Số lượng tối đa</label>
                        <input name="max_participants" type="number" defaultValue="100" className="form-input" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Điểm rèn luyện</label>
                        <input name="points" type="number" defaultValue="10" className="form-input" onChange={handleInputChange} />
                    </div>
                </div>

                {/* 5. Mô tả */}
                <div className="space-y-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Mô tả chi tiết</label>
                    <textarea name="description" rows="4" className="form-input" placeholder="Nội dung, mục đích, yêu cầu..." onChange={handleInputChange}></textarea>
                </div>

                {/* Footer Button */}
                <button type="submit" className="w-full bg-gradient-to-r from-secretary to-orange-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-orange-200 active:scale-95 transition-all uppercase tracking-widest mt-4">
                    Đăng sự kiện lên hệ thống
                </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// --- SUB COMPONENT: THẺ SỰ KIỆN ---
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
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
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