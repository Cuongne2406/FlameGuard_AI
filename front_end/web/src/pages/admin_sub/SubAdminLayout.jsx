import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const SubAdminLayout = () => {
  // Style cho Link Desktop
  const navLinkDesktop = ({ isActive }) => 
    `flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
      isActive 
        ? "bg-secretary/10 text-secretary border border-secretary/20 font-bold" 
        : "text-gray-500 hover:bg-bg-secretary-light dark:hover:bg-white/5 font-medium"
    }`;

  // Style cho Link Mobile (Bottom Bar)
  const navLinkMobile = ({ isActive }) => 
    `flex flex-col items-center gap-1 ${
      isActive ? "text-secretary" : "text-gray-400"
    }`;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-secretary-light dark:bg-bg-secretary-dark font-display text-[#181611] dark:text-white">
      
      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="w-64 bg-white dark:bg-[#2d2516] border-r border-[#e6e2db] dark:border-[#3d3321] hidden lg:flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-secretary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white">hub</span>
          </div>
          <h1 className="font-black text-xl tracking-tight text-secretary">YouthHub</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavLink to="/admin-sub/dashboard" className={navLinkDesktop}>
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
            <span className="text-sm">Tổng Quan</span>
          </NavLink>
          <NavLink to="/admin-sub/management" className={navLinkDesktop}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm">Quản lý</span>
          </NavLink>
          <NavLink to="/admin-sub/events" className={navLinkDesktop}>
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="text-sm">Sự kiện</span>
          </NavLink>
          <NavLink to="/admin-sub/notifications" className={navLinkDesktop}>
            <span className="material-symbols-outlined relative">
              notifications
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </span>
            <span className="text-sm">Thông báo</span>
          </NavLink>
        </nav>

        <div className="p-4 mt-auto border-t border-[#e6e2db] dark:border-[#3d3321]">
          <div className="flex items-center gap-3 p-2 bg-bg-secretary-light dark:bg-white/5 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-cover bg-center bg-gray-200" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0SRjxax1eUzkSd9jidQ1qC2PGJ_B5QnAryg9Q1c7-Nki46q1gPfKk7lFBJAprI-MFUfsxrjTDJVdKk9crHexNAHwCv6iTyKOrz1xQhNuk4P7v88aF4kgHrWE0LYM7v1snDUtFMihZQEFGxu3y45yEGr0NCYeg7DsbAmIIeDRVrvSxM23C4teko6p-gtBemksoalYd9dPC_FB7mr4GvZFogRcDSxU6ZC08W65-feHfbkgZFqeIRohN4gpKATV4yEegUi3zv4tywrpR')"}}></div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-xs font-bold truncate">Bí Thư Lớp</p>
              <p className="text-[10px] text-gray-500 truncate">23CT112 - CNTT</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto relative pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* --- BOTTOM NAVIGATION (Mobile) --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#2d2516] border-t border-[#e6e2db] dark:border-[#3d3321] flex items-center justify-around py-2 px-4 z-50">
        <NavLink to="/admin-sub/dashboard" className={navLinkMobile}>
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
          <span className="text-[10px] font-bold">Tổng Quan</span>
        </NavLink>
        <NavLink to="/admin-sub/management" className={navLinkMobile}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-medium">Quản lý</span>
        </NavLink>
        
        {/* Floating Add Button */}
        <div className="relative -top-6">
          <button className="w-14 h-14 bg-secretary text-white rounded-full flex items-center justify-center shadow-xl shadow-secretary/40 border-4 border-bg-secretary-light dark:border-bg-secretary-dark">
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>

        <NavLink to="/admin-sub/notifications" className={navLinkMobile}>
          <span className="material-symbols-outlined">notifications</span>
          <span className="text-[10px] font-medium">Báo động</span>
        </NavLink>
        <NavLink to="/admin-sub/profile" className={navLinkMobile}>
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-medium">Cá nhân</span>
        </NavLink>
      </nav>

    </div>
  );
};

export default SubAdminLayout;