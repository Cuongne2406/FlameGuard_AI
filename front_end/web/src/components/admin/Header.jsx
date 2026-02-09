import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NotificationBell from '../common/NotificationBell'; 

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?");
    if (isConfirm) {
        localStorage.removeItem("access_token");
        localStorage.clear();
        navigate("/login");
    }
  };

  return (
    <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 shadow-sm z-10 flex-shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Bảng Điều Khiển</h2>
      </div>
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <input
            className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all focus:w-72"
            placeholder="Tìm kiếm đoàn viên..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-3">
          
          <NotificationBell />

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Chế độ tối/sáng"
          >
            {isDarkMode ? (
              <span className="material-symbols-outlined">light_mode</span>
            ) : (
              <span className="material-symbols-outlined">dark_mode</span>
            )}
          </button>

          {/* --- VÁCH NGĂN --- */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

          {/* --- NÚT XEM TRANG CHỦ PUBLIC --- */}
          {/* Đã sửa đường dẫn thành /trang-chu để không bị redirect vòng lặp */}
          <button
            onClick={() => navigate("/trang-chu")} 
            className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all flex items-center gap-1 group"
            title="Xem trang chủ Website"
          >
            <span className="material-symbols-outlined text-[22px]">public</span>
            <span className="text-xs font-bold hidden lg:block pr-1">Xem Website</span>
          </button>

          {/* --- NÚT ĐĂNG XUẤT --- */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all"
            title="Đăng xuất"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            <span className="text-sm font-bold hidden md:block">Thoát</span>
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;