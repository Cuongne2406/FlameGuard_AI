import React from "react";
import { Mail, Phone, MapPin, ShieldCheck, Edit3, Save } from "lucide-react";

const TabAccountInfo = () => {
  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Khối Thông tin cá nhân */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h4 className="text-sm font-black text-slate-800 mb-6">
          Thông tin cá nhân
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email công vụ */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase ml-1">
              Email công vụ
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                // readOnly
                defaultValue="ltphau@lhu.edu.vn"
                className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-500 outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <ShieldCheck size={14} className="text-slate-300" />
              </div>
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase ml-1">
              Số điện thoại
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                <Phone size={18} />
              </div>
              <input
                defaultValue="09xxxxxxx"
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors">
                <Edit3 size={16} />
              </button>
            </div>
          </div>

          {/* Đơn vị công tác */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase ml-1">
              Đơn vị công tác
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                <MapPin size={18} />
              </div>
              <input
                defaultValue="Ban Chấp Hành Đoàn Trường"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Khối Bảo mật (2FA) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h4 className="text-sm font-black text-slate-800 mb-6">Bảo mật</h4>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-emerald-50/40 border border-emerald-100 rounded-[28px] gap-4">
          <div className="flex items-start gap-5">
            <div className="p-4 bg-white rounded-2xl shadow-sm text-emerald-500 ring-1 ring-emerald-50">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-[15px] font-black text-slate-800">
                Bảo mật 2 Lớp (2FA)
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-wider">
                  Đang hoạt động
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-2">
                Tài khoản của bạn đang được bảo vệ bởi lớp xác thực thứ hai qua
                Google Authenticator.
              </p>
            </div>
          </div>
          <button className="whitespace-nowrap px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-black rounded-xl hover:bg-slate-50 hover:shadow-md transition-all">
            Cấu hình lại
          </button>
        </div>
      </div>

      {/* 3. Khối Phiên đăng nhập (Như trong mẫu ảnh bạn gửi) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-black text-slate-800">
            Phiên đăng nhập gần đây
          </h4>
          <button className="text-[11px] font-black text-red-500 hover:text-red-600 transition-colors">
            Đăng xuất tất cả thiết bị khác
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-50">
            <div className="p-3 bg-white rounded-xl shadow-xs text-slate-400 border border-slate-100">
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-black text-slate-800">Windows PC</p>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded-full border border-blue-100 uppercase">
                  Phiên hiện tại
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                Chrome • TP. Hồ Chí Minh, VN • Đang hoạt động
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* --- PHẦN BỔ SUNG: 2 NÚT BẤM DƯỚI CÙNG --- */}
      <div className="flex justify-end items-center gap-4 pt-4">
        <button className="px-8 py-2.5 rounded-xl text-[13px] font-black text-slate-500 hover:bg-slate-100 transition-all active:scale-95 border border-transparent">
          Hủy bỏ
        </button>

        <button className="px-8 py-2.5 bg-[#0056D2] text-white rounded-xl text-[13px] font-black shadow-lg shadow-blue-100 flex items-center gap-2 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95">
          <Save size={18} />
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default TabAccountInfo;
