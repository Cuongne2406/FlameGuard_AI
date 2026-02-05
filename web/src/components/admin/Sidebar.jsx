import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  // Style cho menu: 
  const activeStyle = "flex items-center gap-3 px-4 py-3 rounded-lg bg-white/20 text-white font-medium shadow-sm transition-all duration-200";

  // Normal: Chữ trắng, không nền (hoặc nền trong suốt), hover vào mới hiện nền
  const normalStyle = "flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors duration-200";

  return (
    // bg-primary: Dùng màu xanh chủ đạo bạn đã cài trong tailwind.config.js
    <aside className="w-64 flex-shrink-0 bg-primary h-screen flex flex-col text-white shadow-xl overflow-hidden">

      {/* 1. HEADER (Logo) */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl">school</span>
          <span className="font-bold text-lg tracking-wide">LHU YouthHub</span>
        </div>
      </div>

      {/* 2. MENU LIST */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">

        {/* Mục 1: Tổng Quan */}
        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-sm">Tổng Quan</span>
        </NavLink>

        {/* Mục 2: Thông Báo */}
        <NavLink to="/admin/notifications" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
          <span className="material-symbols-outlined">notifications</span>
          <span className="text-sm">Thông Báo</span>
        </NavLink>

        {/* Mục 3: Danh sách chờ duyệt */}
        <NavLink to="/admin/approvals" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
          <span className="material-symbols-outlined">assignment</span>
          <span className="text-sm">Danh sách chờ duyệt</span>
          {/* số lượng thông báo đỏ */}
          <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">12</span>
        </NavLink>

        {/* Mục 4: Quản lý & Nhân sự */}
        <NavLink to="/admin/members" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
          <span className="material-symbols-outlined">manage_accounts</span>
          <span className="text-sm">Quản lý & Nhân sự</span>
        </NavLink>

        {/* Mục 5: Tài Chính & Hậu Cần */}
        <NavLink to="/admin/finance" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="text-sm">Tài Chính & Hậu Cần</span>
        </NavLink>

        {/* Mục 6: Quản lý sự kiện */}
        <NavLink to="/admin/events" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="text-sm">Quản lý sự kiện</span>
        </NavLink>


        {/* Mục 8: Thi đua & Danh hiệu */}
        <NavLink to="/admin/achievements" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
          <span className="material-symbols-outlined">equalizer</span> {/* Icon biểu đồ cột */}
          <span className="text-sm">Thi đua & Danh hiệu</span>
        </NavLink>

        {/* Mục 9: Phân tích & AI */}
        <NavLink to="/admin/ai-analysis" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
          <span className="material-symbols-outlined">psychology</span> {/* Icon đầu người/AI */}
          <span className="text-sm">Phân tích & AI</span>
        </NavLink>

      </nav>

      {/* 3. FOOTER (Cài đặt & User Info như ảnh) */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <NavLink to="/system-settings" className={normalStyle + " mb-4 px-0 hover:bg-transparent"}>
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm">Cài Đặt</span>
        </NavLink>

        {/* User Profile Card */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white/20">
            AD
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-white leading-tight">Admin LHU</span>
            <span className="text-[11px] text-blue-100 opacity-80">Quản trị viên</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;