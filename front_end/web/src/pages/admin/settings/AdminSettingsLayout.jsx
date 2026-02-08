import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';

const AdminSettingsLayout = () => {
  // Style cho các link menu bên trái
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive
      ? "bg-primary/10 text-primary font-semibold shadow-sm"
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">

      {/* 1. HEADER RIÊNG BIỆT (Vì đã tách khỏi AdminLayout) */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Nút Quay lại Dashboard cực kỳ quan trọng */}
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group">
            <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm font-bold">Quay lại Dashboard</span>
          </Link>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">settings_suggest</span>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Cài đặt hệ thống</h1>
          </div>
        </div>

        {/* Thông tin Admin nhỏ bên góc */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-primary">person</span>
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Quản trị viên</span>
        </div>
      </header>

      {/* 2. NỘI DUNG CHÍNH (Giữ cấu trúc 2 cột nhưng tràn màn hình) */}
      <div className="flex-1 flex justify-center py-8 px-4 sm:px-10 lg:px-20 overflow-y-auto">
        <div className="flex flex-col lg:flex-row w-full max-w-[1200px] gap-8">

          {/* SideNavBar (Danh mục cài đặt) */}
          <aside className="w-full lg:w-64 flex flex-col gap-4 shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="mb-6 px-3">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Danh mục</p>
              </div>

              <nav className="flex flex-col gap-1">
                {/* ĐÃ FIX: Chuyển đường dẫn sang /system-settings */}
                <NavLink to="/system-settings/general" className={navLinkClass}>
                  <span className="material-symbols-outlined text-xl">settings</span>
                  <p className="text-sm">Chung</p>
                </NavLink>
                <NavLink to="/system-settings/security" className={navLinkClass}>
                  <span className="material-symbols-outlined text-xl">shield_lock</span>
                  <p className="text-sm">Bảo Mật</p>
                </NavLink>
                <NavLink to="/system-settings/notifications" className={navLinkClass}>
                  <span className="material-symbols-outlined text-xl">notifications_active</span>
                  <p className="text-sm">Thông Báo</p>
                </NavLink>
                <NavLink to="/system-settings/integrations" className={navLinkClass}>
                  <span className="material-symbols-outlined text-xl">extension</span>
                  <p className="text-sm">Tích Hợp</p>
                </NavLink>
              </nav>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 px-3">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-4">Hỗ trợ</p>
                <NavLink
                  to="/system-settings/help"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-xl">help</span>
                  <span className="text-sm font-medium">Trung tâm hỗ trợ</span>
                </NavLink>
              </div>
            </div>
          </aside>

          {/* Nơi hiển thị nội dung các trang con */}
          <div className="flex-1 pb-20">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsLayout;