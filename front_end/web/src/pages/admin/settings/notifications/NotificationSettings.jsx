import React, { useState, useEffect } from 'react';

const NotificationSettings = () => {
  // 1. STATE QUẢN LÝ DỮ LIỆU TỪ DB
  const [settings, setSettings] = useState({
    is_email_enabled: true,  // Giá trị mặc định
    is_mobile_enabled: true,
    is_zalo_enabled: false
  });
  
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  // 2. FETCH DỮ LIỆU TỪ API KHI VÀO TRANG
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/v1/system/", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            // Cập nhật state với dữ liệu thực từ DB
            setSettings(prev => ({...prev, ...data})); 
        }
      } catch (error) {
        console.error("Lỗi tải cấu hình:", error);
      }
    };
    fetchSettings();
  }, []);

  // Hàm xử lý bật/tắt kênh
  const toggleChannel = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setIsChanged(true);
  };

  // 3. LƯU CẤU HÌNH VỀ SERVER
  const handleSave = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/v1/system/", {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(settings) // Gửi toàn bộ settings (bao gồm cả các setting bảo mật/chung khác)
        });

        if (response.ok) {
            alert("✅ Đã cập nhật kênh thông báo thành công!");
            setIsChanged(false);
            window.location.reload(); // Reload để đảm bảo đồng bộ
        } else {
            alert("❌ Lỗi khi lưu cấu hình!");
        }
    } catch (error) {
        console.error(error);
        alert("Lỗi kết nối Server!");
    } finally {
        setLoading(false);
    }
  };

  // Dữ liệu mẫu cho Template (Chúng ta sẽ làm phần này ở bước sau)
  const templates = [
    { id: 1, title: "Chúc mừng Sinh nhật", desc: "Tự động gửi vào 8:00 sáng ngày sinh nhật của sinh viên." },
    { id: 2, title: "Nhắc nhở đóng phí", desc: "Gửi khi có các khoản Đoàn phí hoặc phí sự kiện chưa thanh toán." },
    { id: 3, title: "Xác nhận đăng ký sự kiện", desc: "Gửi ngay sau khi sinh viên đăng ký tham gia hoạt động thành công." }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      
      {/* Page Heading */}
      <div className="flex flex-col gap-1 px-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Cấu hình thông báo</h2>
        <p className="text-slate-500 text-sm">Quản lý các kênh gửi thông báo và nội dung mẫu cho sinh viên.</p>
      </div>

      {/* --- Section 1: Kênh thông báo (ĐÃ KẾT NỐI) --- */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Kênh thông báo</h3>
          <p className="text-xs text-slate-400 mt-0.5">Lựa chọn các phương thức gửi thông báo đến người dùng.</p>
        </div>
        <div className="p-6 space-y-6">
          <ChannelItem 
            icon="mail" 
            color="text-blue-600 bg-blue-50 dark:bg-blue-900/20"
            title="Gửi Email"
            desc="Sử dụng hệ thống SMTP của trường để gửi email."
            isActive={settings.is_email_enabled}
            onToggle={() => toggleChannel('is_email_enabled')}
          />
          <ChannelItem 
            icon="smartphone" 
            color="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
            title="Gửi App Mobile"
            desc="Gửi thông báo đẩy (push) trực tiếp đến LHU App."
            isActive={settings.is_mobile_enabled}
            onToggle={() => toggleChannel('is_mobile_enabled')}
          />
          <ChannelItem 
            icon="chat" 
            color="text-sky-600 bg-sky-50 dark:bg-sky-900/20"
            title="Gửi Zalo"
            desc="Tích hợp Zalo OA để gửi tin nhắn quan trọng."
            isActive={settings.is_zalo_enabled}
            onToggle={() => toggleChannel('is_zalo_enabled')}
          />
        </div>
      </div>

      {/* --- Section 2: Mẫu thông báo (Tạm thời là UI tĩnh) --- */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Mẫu thông báo</h3>
            <p className="text-xs text-slate-400 mt-0.5">Danh sách các mẫu tin nhắn hệ thống tự động.</p>
          </div>
          <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
            <span className="material-symbols-outlined text-sm font-bold">add</span> Thêm mẫu mới
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {templates.map(tpl => (
            <div key={tpl.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-slate-400">description</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{tpl.title}</p>
                  <p className="text-xs text-slate-500">{tpl.desc}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                <span className="material-symbols-outlined">edit</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- Section 3: Gửi thử nghiệm (Tạm thời là UI tĩnh) --- */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Gửi thử nghiệm</h3>
          <p className="text-xs text-slate-400 mt-0.5">Kiểm tra hiển thị thông báo bằng cách gửi mẫu đến địa chỉ đích.</p>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gửi thử nghiệm đến...</span>
                <input 
                  className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-primary focus:ring-primary h-11 px-4 text-sm outline-none border transition-all" 
                  placeholder="Nhập email hoặc mã sinh viên..." 
                  type="text"
                />
              </label>
            </div>
            <button className="bg-primary text-white h-11 px-6 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 whitespace-nowrap active:scale-95">
              <span className="material-symbols-outlined text-lg">send</span>
              Gửi thử
            </button>
          </div>
        </div>
      </div>

      {/* --- Sticky Bottom Action Bar --- */}
      <div className="sticky bottom-8 flex justify-end z-20">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-4">
          {isChanged && <span className="text-xs text-slate-400 font-medium px-2 italic animate-pulse">Thay đổi chưa được lưu...</span>}
          
          <button 
             onClick={() => window.location.reload()}
             className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all border dark:border-slate-700"
          >
            Hủy bỏ
          </button>
          
          <button 
             onClick={handleSave}
             disabled={loading}
             className="bg-accent text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            {loading ? "Đang lưu..." : (
                <>
                    <span className="material-symbols-outlined text-lg">save</span>
                    Lưu Thay Đổi
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---
const ChannelItem = ({ icon, color, title, desc, isActive, onToggle }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className={`size-10 rounded-lg flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</span>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
    <button 
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${isActive ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span 
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isActive ? 'translate-x-6' : 'translate-x-1'}`} 
      />
    </button>
  </div>
);

export default NotificationSettings;