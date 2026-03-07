import React from "react";
import { Lock, Smartphone, Monitor, LogOut, ShieldCheck } from "lucide-react";

const TabSecurityLogin = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-right-4">
      {/* Đổi mật khẩu */}
      <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <Lock size={18} className="text-red-500" /> Thay đổi mật khẩu
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase">
                Mật khẩu mới
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              />
            </div>
          </div>
        </div>
        <button className="px-6 py-3 bg-slate-800 text-white rounded-2xl text-xs font-black hover:bg-black transition-all">
          Cập nhật mật khẩu mới
        </button>
      </div>

      {/* Thiết bị đang đăng nhập */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-500" /> Thiết bị
        </h3>
        <div className="space-y-4">
          <DeviceItem
            icon={<Monitor />}
            name="Windows PC • Chrome"
            location="Biên Hòa, VN"
            active
          />
          <DeviceItem
            icon={<Smartphone />}
            name="iPhone 15 Pro"
            location="Hồ Chí Minh, VN"
          />
          <button className="w-full py-3 text-[10px] font-black text-red-500 bg-red-50 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-all">
            <LogOut size={14} /> Đăng xuất tất cả thiết bị
          </button>
        </div>
      </div>
    </div>
  );
};

const DeviceItem = ({ icon, name, location, active }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-lg ${active ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200"}`}
      >
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div>
        <p className="text-xs font-black text-slate-700">{name}</p>
        <p className="text-[10px] font-bold text-slate-400">{location}</p>
      </div>
    </div>
    {active && (
      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
    )}
  </div>
);

export default TabSecurityLogin;
