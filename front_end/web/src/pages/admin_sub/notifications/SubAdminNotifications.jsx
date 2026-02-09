import React, { useState, useEffect } from 'react';

/**
 * TRANG QUẢN LÝ THÔNG BÁO - SUB ADMIN
 * Chức năng: Xem lịch sử, Thống kê, Tạo thông báo mới (Modal + API).
 */
const SubAdminNotifications = () => {
  // --- 1. STATE QUẢN LÝ ---
  const [notifications, setNotifications] = useState([]);
  // Stats tạm thời tính toán từ danh sách hoặc hardcode nếu chưa có API riêng
  const [stats, setStats] = useState({ sent: 0, readRate: 98, feedback: 5 }); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('ALL'); // ALL, SENT, SCHEDULED

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    target_audience: 'ALL',
    status: 'SENT'
  });

  // --- 2. GỌI API LẤY DỮ LIỆU ---
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      
      // Gọi API lấy danh sách thông báo
      // Lưu ý: Endpoint này cần trả về danh sách thông báo do user tạo hoặc của lớp
      const res = await fetch('http://127.0.0.1:8000/api/v1/notifications/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        // Sắp xếp mới nhất lên đầu
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setNotifications(sorted);
        
        // Cập nhật thống kê dựa trên dữ liệu thật
        setStats(prev => ({
            ...prev,
            sent: sorted.length
        }));
      }
    } catch (err) {
      console.error("Lỗi tải thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // --- 3. XỬ LÝ FORM ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch('http://127.0.0.1:8000/api/v1/notifications/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Gửi thông báo thành công!");
        setIsModalOpen(false);
        fetchNotifications(); // Reload list
        setFormData({ title: '', content: '', type: 'info', target_audience: 'ALL', status: 'SENT' });
      } else {
        alert("Lỗi khi gửi thông báo.");
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
    }
  };

  // --- 4. GIAO DIỆN ---
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg-secretary-light/80 dark:bg-bg-secretary-dark/80 backdrop-blur-md border-b border-[#e6e2db] dark:border-[#3d3321] px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#181611] dark:text-white">Kênh Thông Báo Chi Đoàn</h2>
            <div className="flex items-center gap-1 group cursor-pointer">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Chi đoàn: 23CT112 - Khoa CNTT</p>
              <span className="material-symbols-outlined text-sm text-gray-500">expand_more</span>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all transform active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            <span className="text-sm font-bold">Tạo thông báo mới</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        
        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon="send" label="Tin đã gửi" value={stats.sent} color="blue" />
          <StatCard icon="mark_email_read" label="Tỷ lệ đọc" value={`${stats.readRate}%`} color="green" />
          <StatCard icon="chat_bubble" label="Phản hồi" value={stats.feedback} color="orange" />
        </section>

        {/* Message History */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-[#181611] dark:text-white">
              <span className="w-1.5 h-6 bg-secretary rounded-full"></span>
              Lịch sử thông báo {/* Đã sửa text theo yêu cầu */}
            </h3>
            <div className="flex gap-2">
              {['ALL', 'SENT', 'SCHEDULED'].map(f => (
                  <FilterBtn key={f} label={f === 'ALL' ? 'Tất cả' : f === 'SENT' ? 'Đã gửi' : 'Lên lịch'} active={filter === f} onClick={() => setFilter(f)} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
                <div className="text-center py-10 text-gray-400 italic">Đang tải lịch sử...</div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-10 text-gray-400">Chưa có thông báo nào được gửi.</div>
            ) : (
                notifications
                    .filter(n => filter === 'ALL' || n.status === filter)
                    .map((notif) => (
                        <MessageItem 
                            key={notif.id}
                            title={notif.title}
                            content={notif.content}
                            // Format thời gian hiển thị đẹp hơn
                            sub={`${new Date(notif.created_at).toLocaleDateString('vi-VN', {hour: '2-digit', minute:'2-digit', day: '2-digit', month: '2-digit', year: 'numeric'})} • ${notif.type.toUpperCase()}`}
                            status={notif.status.toLowerCase()}
                            type={notif.type}
                        />
                    ))
            )}
          </div>
        </section>

      </div>

      {/* --- POP-UP MODAL (Tạo Thông Báo) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-[#1e1c16] w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100 dark:border-[#3d3321]">
            
            <div className="px-8 py-5 border-b border-gray-100 dark:border-[#3d3321] flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
              <h3 className="text-lg font-black uppercase text-[#181611] dark:text-white">Soạn tin nhắn mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-all"><span className="material-symbols-outlined text-gray-500">close</span></button>
            </div>

            <form onSubmit={handleCreateNotification} className="p-8 space-y-5">
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tiêu đề</label>
                <input name="title" required onChange={handleInputChange} className="form-input mt-1" placeholder="VD: Thông báo nghỉ học..." />
              </div>
              
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Loại tin</label>
                <div className="flex gap-2 mt-1">
                    {['info', 'urgent', 'warning', 'success'].map(type => (
                        <button 
                            type="button" 
                            key={type}
                            onClick={() => setFormData({...formData, type})}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase border transition-all ${formData.type === type ? 'bg-gray-800 text-white border-gray-800' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Nội dung</label>
                <textarea name="content" required rows="5" onChange={handleInputChange} className="form-input mt-1" placeholder="Nhập nội dung chi tiết..."></textarea>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
                GỬI THÔNG BÁO NGAY
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

// --- Sub Components ---

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  };
  return (
    <div className="bg-white dark:bg-[#2d2516] p-5 rounded-xl border border-[#e6e2db] dark:border-[#3d3321] shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colors[color]}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-black text-[#181611] dark:text-white">{value}</p>
      </div>
    </div>
  );
};

const FilterBtn = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`px-3 py-1 rounded-lg text-sm transition-colors ${active ? "text-secretary font-bold bg-secretary/10" : "text-gray-500 hover:text-secretary font-medium hover:bg-gray-100"}`}>
    {label}
  </button>
);

const MessageItem = ({ title, content, sub, status, type }) => {
    // Style icon theo loại tin
    const typeIcons = { urgent: 'campaign', info: 'info', warning: 'warning', success: 'check_circle' };
    const typeColors = { urgent: 'text-red-500 bg-red-50', info: 'text-blue-500 bg-blue-50', warning: 'text-orange-500 bg-orange-50', success: 'text-green-500 bg-green-50' };

    return (
      <div className={`bg-white dark:bg-[#2d2516] p-5 rounded-xl border border-[#e6e2db] dark:border-[#3d3321] shadow-sm hover:shadow-md transition-all group cursor-pointer ${type === 'urgent' ? 'border-l-4 border-l-red-500' : ''}`}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 mb-1">
                <span className={`material-symbols-outlined text-[18px] p-1 rounded-md ${typeColors[type] || typeColors.info}`}>
                    {typeIcons[type] || 'article'}
                </span>
                <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{title}</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 pl-8">{content}</p>
            <p className="text-xs text-gray-400 pl-8 pt-1">{sub}</p>
          </div>
          
          <div className="flex items-center gap-3 pl-8 md:pl-0">
            {status === 'scheduled' ? (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span> Lên lịch
              </span>
            ) : (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">done_all</span> Đã gửi
              </span>
            )}
          </div>
        </div>
      </div>
    );
};

export default SubAdminNotifications;