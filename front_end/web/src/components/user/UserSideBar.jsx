import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Popover, Transition } from "@headlessui/react";
import {
  Home,
  UserCircle,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

const UserSidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  // Thêm props từ UserLayout truyền xuống
  const menuItems = [
    {
      icon: <Home size={22} />,
      label: "Trang chủ",
      path: "dashboard",
      end: true,
    },
    {
      icon: <UserCircle size={22} />,
      label: "Hồ sơ năng lực",
      path: "/user/profile",
    },
    {
      icon: <Calendar size={22} />,
      label: "Hoạt động & Sự kiện",
      path: "/user/event",
    },
    {
      icon: <CreditCard size={22} />,
      label: "Ví Đoàn viên",
      path: "/user/wallet",
    },
    {
      icon: <FileText size={22} />,
      label: "Văn bản & Thủ tục",
      path: "/user/documents",
    },
  ];

  return (
    <>
      {/* Overlay cho Mobile (Chỉ hiện khi màn hình nhỏ) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-[60]
          flex flex-col h-screen w-72 bg-white border-r border-slate-100 shrink-0 shadow-sm
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Brand Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <h1 className="text-xl font-bold truncate">
              <span className="text-blue-600">DYUS</span>
              <span className="text-orange-500 ml-1 text-lg">Portal</span>
            </h1>
          </div>
          {/* Nút X đóng menu chỉ hiện trên mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
              `}
            >
              <div className="flex items-center gap-4">
                <span className="transition-transform duration-200 group-hover:scale-110 shrink-0">
                  {item.icon}
                </span>
                <span className="text-[14.5px] whitespace-nowrap">
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          <div className="my-4 border-t border-slate-50 mx-4"></div>

          <NavLink
            to="/user/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all
              ${isActive ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-500 hover:bg-slate-50"}
            `}
          >
            <Settings size={22} className="shrink-0" />
            <span className="text-[14.5px]">Cài đặt</span>
          </NavLink>
        </nav>

        {/* --- PHẦN POPOVER PROFILE (GIỮ NGUYÊN LOGIC CỦA BẠN) --- */}
        <div className="p-4 border-t border-slate-50 bg-white">
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className={`
                    w-full flex items-center gap-3 p-2 rounded-2xl transition-all outline-none
                    ${open ? "bg-slate-100 shadow-inner" : "hover:bg-slate-50"}
                  `}
                >
                  <div className="relative shrink-0">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.student_id || 'Felix'}`}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover bg-blue-100"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-sm font-bold text-slate-800 truncate">
                      {user?.full_name || 'Sinh viên'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {"Sinh viên"}
                    </span>
                  </div>
                </Popover.Button>

                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1 scale-95"
                  enterTo="opacity-100 translate-y-0 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0 scale-100"
                  leaveTo="opacity-0 translate-y-1 scale-95"
                >
                  <Popover.Panel className="absolute bottom-full left-0 mb-4 w-[280px] z-[70]">
                    <div className="bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden w-64">
                      {/* Header Popover */}
                      <div className="p-4 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.student_id || 'Felix'}`}
                          className="w-12 h-12 rounded-full border border-white shadow-sm"
                          alt="avatar"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-[13px] font-black text-slate-800 truncate">
                              {user?.full_name || 'Sinh viên'}
                            </h4>
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500 shrink-0"
                            />
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            MSSV: {user?.student_id || ''}
                          </p>
                        </div>
                      </div>

                      {/* Popover Menu Items */}
                      <div className="p-2 space-y-1">
                        {/* Cài đặt tài khoản */}
                        {/* <button className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                          <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600">
                            <Settings size={16} />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-700">
                              Cài đặt tài khoản
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">
                              Bảo mật & Chữ ký
                            </p>
                          </div>
                        </button> */}

                        {/* Chế độ tối */}
                        <div className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                              <Moon size={16} />
                            </div>
                            <p className="text-[11px] font-black text-slate-700">
                              Chế độ tối
                            </p>
                          </div>
                          {/* Toggle Switch */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        {/* Phản hồi & Góp ý */}
                        <button className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                          <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600">
                            <MessageSquare size={16} />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-700">
                              Phản hồi & Góp ý
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">
                              Báo lỗi cho DYUS
                            </p>
                          </div>
                        </button>

                        {/* Logout */}
                        <div className="p-1 mt-1 bg-slate-50/50 rounded-xl">
                          <button 
                            onClick={() => {
                              logout();
                              navigate('/login');
                            }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-50 text-red-500 transition-all group"
                          >
                            <LogOut size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Đăng xuất
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Mũi tên nhỏ */}
                    <div className="absolute -bottom-1 left-8 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45"></div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
