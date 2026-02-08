import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SubAdminDashboard = () => {
  const navigate = useNavigate();

  // --- 1. STATE DỮ LIỆU ---
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 2. STATE QUẢN LÝ MODAL (POPUP) ---
  // null = đóng, 'event' = Tạo sự kiện, 'notif' = Tạo thông báo, 'qr' = Quét QR
  const [activeModal, setActiveModal] = useState(null);

  // --- 3. GỌI API LẤY THỐNG KÊ DASHBOARD ---
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch('http://127.0.0.1:8000/api/v1/sub-dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Lỗi kết nối server");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse italic text-gray-400">Đang đồng bộ dữ liệu...</div>;
  if (!data) return <div className="p-20 text-center text-red-500">Lỗi: {error}</div>;

  // SVG Math
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const attendancePercent = data.attendance?.rate || 0;
  const offset = circumference - (attendancePercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-bg-secretary-light dark:bg-[#181611] pb-10">

      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#181611]/80 backdrop-blur-xl border-b border-[#e6e2db] dark:border-[#3d3321] px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#181611] dark:text-white uppercase">
              {data.greeting} 👋
            </h2>

            {/* LOGIC HIỂN THỊ MỚI */}
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
              {data.current_date} — {data.event_count > 0
                ? `Hôm nay có ${data.event_count} sự kiện`
                : "Hôm nay không có sự kiện"}
            </p>

          </div>
          <button className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 hover:text-secretary transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">

        {/* STATS CARDS (Attendance & Funds) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Chuyên cần */}
          <div className="bg-white dark:bg-[#2d2516] p-6 rounded-[2rem] border border-[#e6e2db] dark:border-[#3d3321] shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tỷ lệ đi học</h3>
              <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mt-2">{attendancePercent}%</p>
              <p className="text-[11px] text-gray-400 mt-2 font-bold italic">{data.attendance?.evaluation}</p>
            </div>
            <div className="relative w-28 h-28">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r={radius} stroke="currentColor" strokeWidth="10" className="text-blue-50 dark:text-blue-900/20" fill="transparent" />
                <circle cx="56" cy="56" r={radius} stroke="currentColor" strokeWidth="10" className="text-blue-600" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Quỹ Chi Đoàn */}
          <div className="bg-white dark:bg-[#2d2516] p-6 rounded-[2rem] border border-[#e6e2db] dark:border-[#3d3321] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quỹ Chi Đoàn</h3>
              <span className="material-symbols-outlined text-green-500">payments</span>
            </div>
            <p className="text-4xl font-black text-gray-900 dark:text-white">{data.funds?.total_amount?.toLocaleString()}đ</p>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                <span>Tiến độ thu</span>
                <span className="text-green-600">{data.funds?.collected_count}/{data.funds?.total_members} bạn</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${(data.funds?.collected_count / data.funds?.total_members) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS - Trigger Modal */}
        <section>
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Phím tắt nhanh</h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <QuickActionBtn icon="qr_code_scanner" label="Quét mã QR" color="blue" onClick={() => setActiveModal('qr')} />
            <QuickActionBtn icon="calendar_add_on" label="Tạo Sự Kiện" color="purple" onClick={() => setActiveModal('event')} />
            <QuickActionBtn icon="campaign" label="Thông Báo" color="orange" onClick={() => setActiveModal('notif')} />
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
              Hoạt động mới nhất
            </h3>
          </div>
          <div className="bg-white dark:bg-[#2d2516] rounded-xl border border-[#e6e2db] dark:border-[#3d3321] divide-y dark:divide-[#3d3321] shadow-sm">
            {/* DỮ LIỆU ĐỘNG: Map danh sách hoạt động từ API */}
            {data.recent_activities?.length > 0 ? (
              data.recent_activities.map((act, index) => (
                <ActivityItem
                  key={index}
                  name={act.user_name}
                  time={act.time_ago}
                  action={act.description}
                  avatar={act.avatar_url || "https://i.pravatar.cc/150"}
                />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 italic">Chưa có hoạt động nào gần đây.</div>
            )}
          </div>
        </section>

      </div>

      {/* --- MODAL SYSTEM --- */}
      {activeModal && (
        <DashboardModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={activeModal === 'event' ? 'Tạo Sự Kiện Mới' : activeModal === 'notif' ? 'Gửi Thông Báo Chi Đoàn' : 'Quét Mã Check-in'}
        >
          {activeModal === 'event' && <EventForm onSuccess={() => { setActiveModal(null); fetchDashboardData(); }} />}
          {activeModal === 'notif' && <NotifForm onSuccess={() => { setActiveModal(null); fetchDashboardData(); }} />}
          {activeModal === 'qr' && <div className="text-center py-10">Hệ thống quét QR Camera đang được tích hợp...</div>}
        </DashboardModal>
      )}

    </div>
  );
};

// ==========================================
// 1. MODAL WRAPPER (HIỆU ỨNG MƯỢT)
// ==========================================
const DashboardModal = ({ isOpen, onClose, title, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
    <div className="relative bg-white dark:bg-[#1e1c16] w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 border border-gray-100 dark:border-[#3d3321]">
      <div className="px-8 py-6 border-b border-gray-100 dark:border-[#3d3321] flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
        <h3 className="text-xl font-black text-[#181611] dark:text-white uppercase tracking-tight">{title}</h3>
        <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/20 flex items-center justify-center transition-all"><span className="material-symbols-outlined">close</span></button>
      </div>
      <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">{children}</div>
    </div>
  </div>
);

// ==========================================
// 2. FORM TẠO SỰ KIỆN (CÓ ẢNH)
// ==========================================
const EventForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '', location: '', start_time: '', description: '', max_participants: 50, image_url: ''
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      // TẠM THỜI: Link ảnh mẫu (Bạn sẽ cần API upload file thực tế để lấy URL thật)
      setFormData({ ...formData, image_url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch('http://127.0.0.1:8000/api/v1/events/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) onSuccess();
    } catch (err) { alert("Lỗi khi tạo sự kiện"); }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Upload Ảnh */}
      <div className="relative h-48 w-full bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center overflow-hidden hover:border-secretary/50 transition-all group">
        {preview ? (
          <>
            <img src={preview} className="h-full w-full object-cover" />
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white text-xs font-bold">THAY ĐỔI ẢNH</label>
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-gray-300">add_a_photo</span>
            <span className="text-[11px] font-black text-gray-400 mt-2">ĐÍNH KÈM ẢNH BÌA SỰ KIỆN</span>
          </label>
        )}
        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Tên hoạt động" required onChange={e => setFormData({ ...formData, title: e.target.value })} />
        <Input label="Địa điểm" required onChange={e => setFormData({ ...formData, location: e.target.value })} />
      </div>
      <Input label="Thời gian bắt đầu" type="datetime-local" required onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
      <textarea placeholder="Mô tả nội dung sự kiện..." rows="4" className="w-full px-5 py-4 rounded-3xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 ring-secretary/20 outline-none text-sm" onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>

      <button disabled={loading} className="w-full bg-secretary text-white py-4 rounded-2xl font-black shadow-xl shadow-orange-100 active:scale-95 transition-all uppercase tracking-widest">
        {loading ? "ĐANG ĐĂNG..." : "ĐĂNG SỰ KIỆN LÊN HỆ THỐNG"}
      </button>
    </form>
  );
};

// ==========================================
// 3. FORM TẠO THÔNG BÁO
// ==========================================
const NotifForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ title: '', content: '', type: 'info' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch('http://127.0.0.1:8000/api/v1/notifications/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) onSuccess();
    } catch (err) { console.error(err); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input label="Tiêu đề thông báo" required onChange={e => setFormData({ ...formData, title: e.target.value })} />
      <div className="flex gap-4">
        {['info', 'urgent', 'success'].map(t => (
          <label key={t} className={`flex-1 text-center py-2 rounded-xl border cursor-pointer font-bold text-[10px] uppercase transition-all ${formData.type === t ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-400 border-gray-100'}`}>
            <input type="radio" name="type" className="hidden" onChange={() => setFormData({ ...formData, type: t })} /> {t}
          </label>
        ))}
      </div>
      <textarea placeholder="Nội dung thông báo gửi đến toàn lớp..." rows="5" className="w-full px-5 py-4 rounded-3xl border border-gray-200 bg-transparent focus:ring-2 ring-secretary/20 outline-none text-sm" onChange={e => setFormData({ ...formData, content: e.target.value })}></textarea>
      <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-2xl active:scale-95 transition-all uppercase tracking-widest italic">GỬI THÔNG BÁO NGAY</button>
    </form>
  );
};

// Helper UI Components
const QuickActionBtn = ({ icon, label, color, onClick }) => {
  const themes = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 icon-bg:bg-blue-500",
    purple: "bg-purple-50 text-purple-600 border-purple-100 icon-bg:bg-purple-500",
    orange: "bg-orange-50 text-orange-600 border-orange-100 icon-bg:bg-orange-500"
  };
  return (
    <button onClick={onClick} className={`flex items-center gap-4 px-6 py-5 bg-white dark:bg-[#2d2516] border rounded-[1.5rem] shadow-sm hover:shadow-lg transition-all active:scale-95 min-w-[200px] shrink-0 ${themes[color].split(' icon-bg:')[0]}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${themes[color].split('icon-bg:')[1]}`}><span className="material-symbols-outlined">{icon}</span></div>
      <span className="text-sm font-black text-gray-700 dark:text-gray-200">{label}</span>
    </button>
  );
};

const ActivityItem = ({ name, time, action, avatar }) => (
  <div className="p-5 flex items-center gap-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-default">
    <img src={avatar || "https://i.pravatar.cc/150"} className="w-12 h-12 rounded-full border-2 border-white shadow-md shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{name}</h4>
        <span className="text-[10px] text-gray-500 font-bold bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-md shrink-0">{time}</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{action}</p>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="w-full">
    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1 tracking-widest">{label}</label>
    <input {...props} className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-transparent focus:bg-white dark:focus:bg-white/5 focus:ring-2 ring-secretary/20 outline-none transition-all text-sm" />
  </div>
);

export default SubAdminDashboard;