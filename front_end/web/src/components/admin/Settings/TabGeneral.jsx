import React from "react";
import {
  Upload,
  Mail,
  MessageSquare,
  Bell,
  Globe,
  Calendar,
  Palette,
} from "lucide-react";
import { SectionCard } from "../ui/SectionCard"; // Component khung đã tạo ở bước trước
import { Toggle } from "../ui/Toggle";

const TabGeneral = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* CỘT TRÁI (2/3) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Thông tin nhận diện */}
        <SectionCard
          title="Thông tin nhận diện (Branding & Identity)"
          icon={<Globe size={16} className="text-blue-600" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Upload Logo */}
            <div className="col-span-1 space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                School Logo
              </label>
              <div className="aspect-square border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-500 cursor-pointer transition-all group">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white shadow-sm transition-all">
                  <Upload size={24} />
                </div>
                <span className="text-[11px] font-black uppercase">Upload</span>
              </div>
            </div>

            {/* Input fields */}
            <div className="col-span-3 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Tên hệ thống (System Name)
                </label>
                <input
                  type="text"
                  defaultValue="Digital Youth Union System"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Khẩu hiệu (Motto/Slogan)
                </label>
                <input
                  type="text"
                  defaultValue="Empowering Student Success"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Quản lý Niên khóa */}
        <SectionCard
          title="Quản lý Niên khóa (Academic Calendar)"
          icon={<Calendar size={16} className="text-blue-600" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Năm học hiện tại (Current Year)
              </label>
              <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white outline-none appearance-none cursor-pointer">
                <option>2025-2026</option>
                <option>2024-2025</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Học kỳ hiện tại
              </label>
              <div className="flex items-center gap-6 p-1 bg-slate-50 rounded-2xl border border-slate-100 h-[54px] px-4">
                {[
                  { id: 1, label: "Học kỳ 1" },
                  { id: 2, label: "Học kỳ 2" },
                  { id: "summer", label: "Hè" },
                ].map((term) => (
                  <label
                    key={term.id}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="semester"
                      defaultChecked={term.id === 1}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs font-black text-slate-600 group-hover:text-blue-600 transition-colors">
                      {term.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 pt-2">
              <div className="flex justify-between items-center p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                <div className="space-y-1">
                  <p className="text-xs font-black text-blue-900">
                    Auto-Transition
                  </p>
                  <p className="text-[10px] text-blue-600/70 font-bold">
                    Tự động chuyển học kỳ theo lịch trình hệ thống
                  </p>
                </div>
                <Toggle checked={false} />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* CỘT PHẢI (1/3) */}
      <div className="space-y-6">
        {/* Cấu hình Kênh thông báo */}
        <SectionCard
          title="Cấu hình Kênh thông báo"
          icon={<Bell size={16} className="text-blue-600" />}
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Email SMTP Configuration
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Zalo OA Integration
              </label>
              <div className="relative">
                <MessageSquare
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="ID Zalo OA Secret Key"
                  className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-0.5">
                <p className="text-xs font-black text-slate-700">
                  Push Notifications
                </p>
                <p className="text-[10px] text-slate-400 font-bold">
                  Gửi thông báo đẩy qua ứng dụng mobile
                </p>
              </div>
              <Toggle checked={true} />
            </div>
          </div>
        </SectionCard>

        {/* Giao diện */}
        <SectionCard
          title="Giao diện (System Theme)"
          icon={<Palette size={16} className="text-blue-600" />}
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono font-black text-slate-400">
                  #0056D2
                </span>
                <div className="w-10 h-10 bg-[#0056D2] rounded-xl shadow-lg shadow-blue-200 ring-2 ring-white"></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <p className="text-xs font-black text-slate-700">
                  Dark Mode Support
                </p>
                <p className="text-[10px] text-slate-400 font-bold">
                  Cho phép người dùng chuyển chế độ tối
                </p>
              </div>
              <Toggle checked={true} />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default TabGeneral;
