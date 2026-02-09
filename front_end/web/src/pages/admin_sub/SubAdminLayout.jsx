import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom'; // 1. IMPORT useNavigate





const SubAdminLayout = () => {
  const navigate = useNavigate(); // 2. KHỞI TẠO hook điều hướng

  // --- HÀM XỬ LÝ ĐĂNG XUẤT ---
  const handleLogout = () => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?");
    if (isConfirm) {
      localStorage.removeItem("access_token");
      localStorage.clear();
      navigate("/login");
    }
  };

  // Style cho Link Desktop
  const navLinkDesktop = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${isActive
      ? "bg-secretary/10 text-secretary border border-secretary/20 font-bold"
      : "text-gray-500 hover:bg-bg-secretary-light dark:hover:bg-white/5 font-medium"
    }`;

  // Style cho Link Mobile (Bottom Bar)
  const navLinkMobile = ({ isActive }) =>
    `flex flex-col items-center gap-1 ${isActive ? "text-secretary" : "text-gray-400"
    }`;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-secretary-light dark:bg-bg-secretary-dark font-display text-[#181611] dark:text-white">

      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="w-64 bg-white dark:bg-[#2d2516] border-r border-[#e6e2db] dark:border-[#3d3321] hidden lg:flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-secretary rounded-lg flex items-center justify-center shadow-lg shadow-secretary/20">
            <span className="material-symbols-outlined text-white">hub</span>
          </div>
          <h1 className="font-black text-xl tracking-tight text-secretary uppercase">YouthHub</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavLink to="/admin_sub/dashboard" className={navLinkDesktop}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            <span className="text-sm">Tổng Quan</span>
          </NavLink>
          <NavLink to="/admin_sub/management" className={navLinkDesktop}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm">Quản lý</span>
          </NavLink>
          <NavLink to="/admin_sub/events" className={navLinkDesktop}>
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="text-sm">Sự kiện</span>
          </NavLink>
          <NavLink to="/admin_sub/notifications" className={navLinkDesktop}>
            <span className="material-symbols-outlined relative">
              notifications
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </span>
            <span className="text-sm">Thông báo</span>
          </NavLink>
        </nav>

        <div className="p-4 mt-auto border-t border-[#e6e2db] dark:border-[#3d3321] space-y-3">

          {/* --- NÚT XEM WEBSITE (Đã hoạt động) --- */}
          <button
            onClick={() => navigate("/trang-chu")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all group font-medium cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 transition-colors">
              <span className="material-symbols-outlined text-[18px]">public</span>
            </div>
            <span className="text-xs font-bold">Xem Website</span>
            <span className="material-symbols-outlined text-[16px] ml-auto opacity-0 group-hover:opacity-100 transition-opacity">arrow_outward</span>
          </button>

          <div className="flex items-center gap-3 p-2 bg-bg-secretary-light dark:bg-white/5 rounded-xl border border-transparent hover:border-secretary/20 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-cover bg-center bg-gray-200 border-2 border-white dark:border-[#2d2516]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0SRjxax1eUzkSd9jidQ1qC2PGJ_B5QnAryg9Q1c7-Nki46q1gPfKk7lFBJAprI-MFUfsxrjTDJVdKk9crHexNAHwCv6iTyKOrz1xQhNuk4P7v88aF4kgHrWE0LYM7v1snDUtFMihZQEFGxu3y45yEGr0NCYeg7DsbAmIIeDRVrvSxM23C4teko6p-gtBemksoalYd9dPC_FB7mr4GvZFogRcDSxU6ZC08W65-feHfbkgZFqeIRohN4gpKATV4yEegUi3zv4tywrpR')" }}></div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-xs font-bold truncate">Bí Thư Lớp</p>
              <p className="text-[10px] text-gray-500 truncate font-medium">23CT112 - CNTT</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-white/10 text-gray-400 hover:text-red-500 transition-colors" title="Đăng xuất">
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto relative pb-20 lg:pb-0 bg-[#f8f9fa] dark:bg-black/20">
        <Outlet />
      </main>

      {/* --- BOTTOM NAVIGATION (Mobile) --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#2d2516] border-t border-[#e6e2db] dark:border-[#3d3321] flex items-center justify-around py-3 px-4 z-50 pb-safe">
        <NavLink to="/admin_sub/dashboard" className={navLinkMobile}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="text-[10px] font-bold">Tổng Quan</span>
        </NavLink>
        <NavLink to="/admin_sub/management" className={navLinkMobile}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-medium">Quản lý</span>
        </NavLink>

        {/* Floating Add Button - Giờ cũng trỏ về trang chủ hoặc tạo sự kiện */}
        <div className="relative -top-8 group">
          <button
            onClick={() => navigate("/trang-chu")}
            className="w-14 h-14 bg-gradient-to-tr from-secretary to-orange-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-secretary/40 border-4 border-[#f8f7f5] dark:border-[#221c10] active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>

        <NavLink to="/admin_sub/notifications" className={navLinkMobile}>
          <span className="material-symbols-outlined">notifications</span>
          <span className="text-[10px] font-medium">Thông báo</span>
        </NavLink>
        <NavLink to="/admin_sub/events" className={navLinkMobile}>
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="text-[10px] font-medium">Sự kiện</span>
        </NavLink>
      </nav>

    </div>
  );
};

export default SubAdminLayout;