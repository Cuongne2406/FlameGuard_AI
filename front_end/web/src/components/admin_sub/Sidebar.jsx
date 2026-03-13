import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  // Dyamic branding based on route
  const isAIAnalysis = location.pathname.includes('ai-analysis');
  const branding = isAIAnalysis ? 'Intelligence' : 'Manager';

  const menuItems = [
    { path: '/admin_sub/dashboard', label: 'Tổng quan Khoa', icon: 'dashboard' },
    { path: '/admin_sub/ai-analysis', label: 'Phân tích AI (Intelligence)', icon: 'psychology' },
    { path: '/admin_sub/classes', label: 'Quản lý Chi Đoàn', icon: 'groups' },
    { path: '/admin_sub/events', label: 'Sự kiện Khoa', icon: 'calendar_today' },
    { path: '/admin_sub/approvals', label: 'Xét duyệt & Văn bản', icon: 'assignment_turned_in' },
    { path: '/admin_sub/finance', label: 'Tài chính Khoa', icon: 'account_balance_wallet' },
    { path: '/admin_sub/awards', label: 'Thi đua & Khen thưởng', icon: 'military_tech' },
    { path: '/admin_sub/clubs', label: 'CLB & Đội nhóm', icon: 'diversity_3' },
    { path: '/admin_sub/settings', label: 'Cài đặt', icon: 'settings' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Logo Section */}
      <div className="p-8 pb-12 flex items-center gap-3">
        <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100 text-white font-black text-xl italic uppercase">
          F
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black italic tracking-tighter text-blue-600 leading-none">DYUS</span>
          <span className={`text-sm font-bold tracking-tight leading-none mt-1 ${isAIAnalysis ? 'text-indigo-600' : 'text-slate-500'}`}>
            {branding}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive
                ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-500/5'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-slate-50 mt-auto">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer group">
          <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs ring-2 ring-white shadow-sm transition-transform group-hover:scale-105">
            LP
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 leading-none italic uppercase">Lê Trọng Phúc Hậu</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Bí Thư Khoa</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
