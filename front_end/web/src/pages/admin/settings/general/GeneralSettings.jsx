import React, { useState, useEffect, useRef } from 'react';

const GeneralSettings = () => {
  // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
  const [settings, setSettings] = useState({
    unit_name: '',
    logo_url: '', // Thêm trường này để hứng URL ảnh từ API
    current_academic_year: '2025 - 2026',
    is_2fa_enabled: false
  });
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  // Ref cho input file ẩn
  const fileInputRef = useRef(null);

  // --- 2. HÀM LẤY DỮ LIỆU TỪ SERVER ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/v1/system/", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            setSettings(data);
        }
      } catch (error) {
        console.error("Lỗi tải cấu hình:", error);
      }
    };
    fetchSettings();
  }, []);

  // Hàm xử lý khi nhập liệu text/select
  const handleChange = (field, value) => {
      setSettings(prev => ({ ...prev, [field]: value }));
      setIsChanged(true);
  };

  // --- 3. HÀM UPLOAD LOGO MỚI (Logic mới thêm) ---
  const handleUploadLogo = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate kích thước (2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert("❌ File quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/v1/system/logo", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }, // Để browser tự set Content-Type là multipart/form-data
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            // Cập nhật ngay logo mới để hiện preview
            setSettings(prev => ({ ...prev, logo_url: data.logo_url }));
            alert("✅ Đã cập nhật Logo mới thành công!");
            
            // Reload trang để Sidebar bên trái cập nhật theo
            window.location.reload(); 
        } else {
            alert("❌ Lỗi khi tải ảnh lên server!");
        }
    } catch (error) {
        console.error("Upload error:", error);
    }
  };

  // --- 4. HÀM XÓA LOGO (Logic mới thêm) ---
  const handleDeleteLogo = async () => {
    if (!settings.logo_url) return; // Không có logo thì không xóa
    if (!window.confirm("Bạn có chắc muốn xóa logo hiện tại để về mặc định không?")) return;

    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/v1/system/logo", {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            setSettings(prev => ({ ...prev, logo_url: null }));
            alert("🗑️ Đã xóa logo!");
            window.location.reload();
        }
    } catch (error) {
        console.error("Delete error:", error);
    }
  };

  // --- 5. HÀM LƯU THAY ĐỔI (Các thông tin text) ---
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
            alert("✅ Đã lưu cấu hình hệ thống thành công!");
            setIsChanged(false);
            window.location.reload(); 
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

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Page Heading */}
      <div className="flex flex-col gap-1 px-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Cấu hình chung</h2>
        <p className="text-slate-500 text-sm">Cập nhật thông tin nhận diện đơn vị và thiết lập niên khóa làm việc.</p>
      </div>

      {/* Thông tin đơn vị */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Thông tin đơn vị</h3>
        </div>
        <div className="p-6 space-y-8">
          <div className="max-w-xl">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên Đơn Vị</span>
              <input 
                className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-primary focus:ring-primary h-12 px-4 text-sm border outline-none" 
                type="text" 
                value={settings.unit_name}
                onChange={(e) => handleChange('unit_name', e.target.value)}
                placeholder="Nhập tên đơn vị..."
              />
            </label>
          </div>

          {/* --- PHẦN LOGO (ĐÃ ĐƯỢC NÂNG CẤP) --- */}
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Logo Đoàn Trường</span>
            <div className="flex flex-wrap items-center gap-6">
              
              {/* Vùng hiển thị ảnh */}
              <div className="size-24 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center relative group overflow-hidden">
                {settings.logo_url ? (
                    // Nếu có URL ảnh -> Hiển thị ảnh
                    <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                    // Nếu chưa có ảnh -> Hiển thị Icon mặc định
                    <span className="material-symbols-outlined text-4xl text-slate-300">image</span>
                )}
                
                {/* Overlay nút sửa khi hover */}
                <div 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-white">edit</span>
                </div>
              </div>

              {/* Các nút bấm */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  {/* Input File Ẩn (Quan trọng) */}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleUploadLogo}
                    className="hidden" 
                    accept="image/*"
                  />

                  <button 
                    onClick={() => fileInputRef.current.click()} // Kích hoạt input ẩn
                    className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Tải lên logo mới
                  </button>
                  
                  <button 
                    onClick={handleDeleteLogo} // Gọi hàm xóa
                    className="bg-white dark:bg-slate-800 text-red-600 border border-red-200 dark:border-red-900/30 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">Định dạng JPG, PNG hoặc SVG. Kích thước tối đa 2MB.</p>
              </div>
            </div>
          </div>
          {/* ------------------------------------- */}

          <div className="max-w-xs">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Niên Khóa Hiện Tại</span>
              <select 
                className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-primary focus:ring-primary h-12 px-4 text-sm border outline-none cursor-pointer"
                value={settings.current_academic_year}
                onChange={(e) => handleChange('current_academic_year', e.target.value)}
              >
                <option value="2023 - 2024">2023 - 2024</option>
                <option value="2024 - 2025">2024 - 2025</option>
                <option value="2025 - 2026">2025 - 2026</option>
                <option value="2026 - 2027">2026 - 2027</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Security Preview */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Bảo mật hệ thống</h3>
          <button className="text-primary text-xs font-bold hover:underline">Quản lý bảo mật nâng cao</button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Xác thực 2 lớp (2FA)</span>
              <p className="text-xs text-slate-500">Yêu cầu mã xác minh qua Email hoặc Google Authenticator cho tất cả tài khoản quản trị.</p>
            </div>
            
            <button 
                onClick={() => handleChange('is_2fa_enabled', !settings.is_2fa_enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.is_2fa_enabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.is_2fa_enabled ? 'translate-x-6' : 'translate-x-1'
              }`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-8 flex justify-end z-10">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-4">
          {isChanged && <span className="text-xs text-slate-500 font-medium px-2 italic animate-pulse">Thay đổi chưa được lưu...</span>}
          
          <button 
             onClick={() => window.location.reload()}
             className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all border"
          >
            Hủy bỏ
          </button>
          
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-[#FFAB00] text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
                <>Loading...</>
            ) : (
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

export default GeneralSettings;