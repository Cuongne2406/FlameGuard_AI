import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../../components/common/NotificationBell';
import { AuthContext } from '../../context/AuthContext';

const Header = ({ onToggleSidebar, onLogout }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const userName = user?.full_name || 'SubAdmin';

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 lg:py-4 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-2 lg:gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 truncate">
          Quản Lý Sub-Admin
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 lg:gap-4">
        <select className="hidden md:block h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none focus:ring-2 ring-blue-500/10">
          <option>Năm học 2025-2026</option>
        </select>

        <NotificationBell />

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-1 lg:gap-3 hover:bg-gray-100 rounded-full p-1 lg:p-2 transition-colors"
          >
            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm lg:text-base">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {userName}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-50 border border-slate-200">
              <div className="py-2">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/admin_sub/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">settings</span>
                  Cài đặt
                </button>
                <hr className="my-2 border-gray-200" />
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout?.();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">logout</span>
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;