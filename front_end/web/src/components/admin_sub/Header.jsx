import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onToggleSidebar, onLogout }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const userName = localStorage.getItem('userName') || 'Admin';

  return (
    <header className="bg-white dark:bg-[#2d2516] border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Quản Lý Sub-Admin
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* School Year Dropdown */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-300">Năm học:</span>
          <select className="bg-transparent font-medium text-gray-900 dark:text-white outline-none cursor-pointer">
            <option>2025-2026</option>
            <option>2024-2025</option>
            <option>2023-2024</option>
          </select>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-900 dark:text-white">
              {userName}
            </span>
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
              expand_more
            </span>
          </button>

          {/* Profile Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#3d3321] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <button
                onClick={() => {
                  navigate('/admin_sub/settings');
                  setIsProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-lg">settings</span>
                <span>Cài Đặt</span>
              </button>
              <button
                onClick={() => {
                  navigate('/admin_sub/profile');
                  setIsProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-lg">person</span>
                <span>Hồ Sơ</span>
              </button>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                <span>Đăng Xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
