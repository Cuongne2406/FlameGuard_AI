import React, { useState, useEffect } from 'react';

const SecuritySettings = () => {
  // 1. STATE QUẢN LÝ DỮ LIỆU
  const [settings, setSettings] = useState({
    is_2fa_enabled: false,
    is_geo_block_enabled: false,
    min_password_length: 8,
    password_expiry_days: 90
  });

  // State riêng cho Nhật ký truy cập (Dữ liệu thật)
  const [accessLogs, setAccessLogs] = useState([]); 
  
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  // 2. TẢI DỮ LIỆU KHI VÀO TRANG (Cấu hình + Logs)
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // Hàm lấy Cấu hình chung
    const fetchSettings = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/system/", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            setSettings(prev => ({...prev, ...data})); 
        }
      } catch (error) {
        console.error("Lỗi tải cấu hình:", error);
      }
    };

    // Hàm lấy Nhật ký truy cập (Mới thêm)
    const fetchLogs = async () => {
        try {
            // Lấy 5 dòng log mới nhất
            const response = await fetch("http://127.0.0.1:8000/api/v1/system/logs?limit=5", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAccessLogs(data);
            }
        } catch (error) {
            console.error("Lỗi tải logs:", error);
        }
    };

    fetchSettings();
    fetchLogs();
  }, []);

  // Hàm xử lý thay đổi toggle/slider
  const handleChange = (field, value) => {
      setSettings(prev => ({ ...prev, [field]: value }));
      setIsChanged(true);
  };

  // 3. LƯU CẤU HÌNH
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
            body: JSON.stringify(settings)
        });

        if (response.ok) {
            alert("✅ Đã cập nhật chính sách bảo mật!");
            setIsChanged(false);
            window.location.reload(); // Reload để đảm bảo đồng bộ
        } else {
            alert("❌ Lỗi khi lưu!");
        }
    } catch (error) {
        console.error(error);
        alert("Lỗi kết nối Server!");
    } finally {
        setLoading(false);
    }
  };

  // --- HÀM HELPER: Tính thời gian "Cách đây bao lâu" ---
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000); // Đổi ra giây
    
    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };

  // Hàm hiển thị Role ngắn gọn
  const getRoleBadge = (role) => {
      if (role === 'SUPER_ADMIN') return 'AD';
      if (role === 'ADMIN') return 'QL';
      if (role === 'STUDENT') return 'SV';
      return '?';
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Cài đặt bảo mật</h2>
        <p className="text-slate-500 text-sm">Nâng cao tính bảo mật cho hệ thống và quản lý truy cập người dùng.</p>
      </div>

      {/* --- Section 1: Kiểm soát truy cập --- */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">verified_user</span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Kiểm soát truy cập</h3>
        </div>
        <div className="p-6 space-y-6">
          <ToggleItem 
            title="Xác thực 2 lớp (2FA)" 
            desc="Yêu cầu mã xác minh OTP khi đăng nhập vào tài khoản quản trị."
            checked={settings.is_2fa_enabled}
            onChange={() => handleChange('is_2fa_enabled', !settings.is_2fa_enabled)}
          />
          <ToggleItem 
            title="Chặn đăng nhập từ nước ngoài" 
            desc="Chỉ cho phép các địa chỉ IP từ Việt Nam truy cập vào hệ thống quản lý."
            checked={settings.is_geo_block_enabled}
            onChange={() => handleChange('is_geo_block_enabled', !settings.is_geo_block_enabled)}
          />
        </div>
      </section>

      {/* --- Section 2: Chính sách mật khẩu --- */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">password</span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Chính sách mật khẩu</h3>
        </div>
        <div className="p-6 space-y-10">
          <RangeItem 
            label="Độ dài mật khẩu tối thiểu"
            value={settings.min_password_length}
            unit="ký tự"
            min={6} max={20}
            onChange={(e) => handleChange('min_password_length', Number(e.target.value))}
            labels={["6 ký tự", "20 ký tự"]}
          />
          <RangeItem 
            label="Thời gian hết hạn mật khẩu"
            value={settings.password_expiry_days}
            unit="ngày"
            min={30} max={365} step={5}
            onChange={(e) => handleChange('password_expiry_days', Number(e.target.value))}
            labels={["30 ngày", "365 ngày (1 năm)"]}
          />
        </div>
      </section>

      {/* --- Section 3: Nhật ký truy cập (DỮ LIỆU THẬT TỪ DB) --- */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history_edu</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Nhật ký truy cập gần đây</h3>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-primary text-xs font-bold hover:underline flex items-center gap-1 transition-all hover:gap-2"
          >
            Làm mới <span className="material-symbols-outlined text-xs">refresh</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <Th>Địa chỉ IP</Th>
                <Th>Người dùng</Th>
                <Th>Thời gian</Th>
                <Th>Trạng thái</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Trường hợp chưa có log nào */}
              {accessLogs.length === 0 && (
                  <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-sm text-slate-400 italic">
                          Chưa có dữ liệu nhật ký nào. Hãy thử đăng xuất và đăng nhập lại.
                      </td>
                  </tr>
              )}

              {/* Render Logs thật */}
              {accessLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  {/* Cột IP (backend trả về field là ip_address) */}
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-mono">
                    {log.ip_address} 
                  </td>
                  
                  {/* Cột User */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${log.status === 'SUCCESS' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                        {getRoleBadge(log.role)}
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{log.email}</span>
                    </div>
                  </td>
                  
                  {/* Cột Thời gian (Dùng hàm formatTimeAgo) */}
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {formatTimeAgo(log.created_at)}
                  </td>
                  
                  {/* Cột Trạng thái */}
                  <td className="px-6 py-4">
                    <StatusBadge status={log.status === 'SUCCESS' ? 'success' : 'failed'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Sticky Action Bar --- */}
      <div className="sticky bottom-6 flex justify-end z-10">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 px-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-2xl flex items-center gap-6">
          {isChanged && <span className="hidden sm:inline text-xs text-slate-400 font-medium italic animate-pulse">Thay đổi chưa được lưu...</span>}
          <div className="flex items-center gap-3">
            <button 
                onClick={() => window.location.reload()}
                className="bg-transparent text-slate-600 dark:text-slate-400 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Hủy bỏ
            </button>
            <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-[#FFAB00] text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70"
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

    </div>
  );
};

// --- Sub-components ---
const ToggleItem = ({ title, desc, checked, onChange }) => (
  <div className="flex items-center justify-between group">
    <div className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</span>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={!!checked} onChange={onChange} />
      <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${checked ? 'peer-checked:bg-primary' : ''}`}></div>
    </label>
  </div>
);

const RangeItem = ({ label, value, unit, min, max, step = 1, onChange, labels }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</label>
      <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">{value} {unit}</span>
    </div>
    <input 
      type="range" 
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary dark:bg-slate-700"
      min={min} max={max} step={step} 
      value={value} onChange={onChange} 
    />
    <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
      <span>{labels[0]}</span>
      <span>{labels[1]}</span>
    </div>
  </div>
);

const Th = ({ children }) => (
  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
    {children}
  </th>
);

const StatusBadge = ({ status }) => {
  const isSuccess = status === 'success';
  const colorClass = isSuccess 
    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  const dotColor = isSuccess ? "bg-green-500" : "bg-red-500";
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {isSuccess ? "Thành công" : "Thất bại"}
    </span>
  );
};

export default SecuritySettings;