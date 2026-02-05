import React from 'react';

const GeneralSettings = () => {
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
                defaultValue="Đoàn Trường Đại Học Lạc Hồng"
              />
            </label>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Logo Đoàn Trường</span>
            <div className="flex flex-wrap items-center gap-6">
              <div className="size-24 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center relative group overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDnVvcB1LZu4YGGkUAYgiR2F5kv0X9Id7cL-7dO5yHEIiRUBuIgVbeppUbzcYwm9FCKP2PEPyK_i5Yg2acLFB2U0TfRwZaY4TfrkwOOh4-9IdtUuokkO6v_WG0BG5k4EBSudoB37I0cyKYRHfGZGKGiKKVjgQ5FVZUAoW9ynH1qBBpz9zv4pOffNX0mAMb632K7t7jOKR2ZDXmax6noS8pyxj_ufShD1T7PjwQpoZr0TOY4czNELgSPmu7LvgsL-eEZANSAblC05tOf")`}}
                ></div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined text-white">edit</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">Tải lên logo mới</button>
                  <button className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">Xóa</button>
                </div>
                <p className="text-[11px] text-slate-400">Định dạng JPG, PNG hoặc SVG. Kích thước tối đa 2MB.</p>
              </div>
            </div>
          </div>

          <div className="max-w-xs">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Niên Khóa Hiện Tại</span>
              <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-primary focus:ring-primary h-12 px-4 text-sm border outline-none">
                <option value="2023-2024">2023 - 2024</option>
                <option value="2024-2025">2024 - 2025</option>
                <option value="2025-2026" selected>2025 - 2026</option>
                <option value="2026-2027">2026 - 2027</option>
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
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
              <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-8 flex justify-end">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-4">
          <span className="text-xs text-slate-400 font-medium px-2 italic">Thay đổi chưa được lưu...</span>
          <button className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all border">
            Hủy bỏ
          </button>
          <button className="bg-accent text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">save</span>
            Lưu Thay Đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;