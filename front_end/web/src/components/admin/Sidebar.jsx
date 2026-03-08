import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Wallet,
  Trophy,
  FileText,
  Cpu,
  Settings,
  LogOut,
  User,
  ChevronRight,
  X,
  Lock,
  Calendar,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [showProfileCard, setShowProfileCard] = useState(false);

  // 1. Tạo một Ref để tham chiếu đến vùng footer/menu
  const profileRef = useRef(null);

  // 2. Logic xử lý Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Nếu nhấn ra ngoài vùng profileRef, đóng hộp thoại
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileCard(false);
      }
    };

    // Gán sự kiện cho toàn bộ document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Dọn dẹp sự kiện khi component bị gỡ bỏ
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: <Users size={20} />,
      label: "Tổ chức & Nhân sự",
      path: "/admin/organization",
    },
    {
      icon: <Megaphone size={20} />,
      label: "Chiến dịch & Sự kiện",
      path: "/admin/campaigns",
    },
    {
      icon: <Wallet size={20} />,
      label: "Tài chính & Hậu cần",
      path: "/admin/finance",
    },
    {
      icon: <Trophy size={20} />,
      label: "Thi đua & Khen thưởng",
      path: "/admin/awards",
    },
    {
      icon: <FileText size={20} />,
      label: "Văn bản số",
      path: "/admin/documents",
    },
  ];

  return (
    <>
      {/* Overlay cho Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50] md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`
        fixed md:relative inset-y-0 left-0 z-[60]
        flex flex-col h-screen w-72 bg-white border-r border-slate-100 shrink-0 shadow-sm
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-6 p-2 md:hidden text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Brand Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
            <span className="text-white font-bold text-xl uppercase">D</span>
          </div>
          <div>
            <h1 className="text-blue-600 font-black text-lg leading-tight uppercase tracking-tight">
              DYUS <span className="text-red-500">Master</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
              Enterprise v2.1
            </p>
          </div>
        </div>

        {/* Menu chính */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-2">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Danh mục chính
          </p>

          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all group
                ${isActive ? "bg-blue-50 text-blue-600 font-bold shadow-sm" : "text-slate-500 hover:bg-slate-50"}
              `}
            >
              <span className="group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="text-[14.5px] whitespace-nowrap">
                {item.label}
              </span>
            </NavLink>
          ))}

          <div className="my-6 border-t border-slate-50 mx-4"></div>

          {/* AI Section */}
          <NavLink
            to="/admin/ai"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 rounded-xl transition-all group
              ${isActive ? "bg-indigo-50 text-indigo-700 font-bold" : "text-indigo-600 hover:bg-indigo-50"}
            `}
          >
            <div className="flex items-center gap-4">
              <Cpu size={20} className="animate-pulse" />
              <span className="text-[14.5px]">DYUS Intelligence</span>
            </div>
            <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
              AI
            </span>
          </NavLink>

          <NavLink
            to="/admin/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl mt-2 transition-all group
              ${isActive ? "bg-indigo-50 text-indigo-600 font-bold" : "text-slate-500 hover:bg-slate-50"}
            `}
            // className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl mt-2 transition-all group "
          >
            <Settings size={20} />
            <span className="text-[14.5px]">Cấu hình hệ thống</span>
          </NavLink>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-50 relative" ref={profileRef}>
          {showProfileCard && (
            <div className="absolute bottom-full left-4 right-4 mb-3 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Header của Profile Card */}
              <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Trạng thái
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>{" "}
                  Online
                </span>
              </div>

              {/* Danh sách Action */}
              <div className="p-2 text-left">
                <NavLink
                  to="/admin/profile"
                  onClick={() => {
                    setShowProfileCard(false);
                    setIsOpen(false); // Đóng sidebar trên mobile
                  }}
                  className={({ isActive }) => `
                   w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium group transition-all
                   ${isActive ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600 hover:bg-slate-50"}
                   `}
                >
                  <User
                    size={16}
                    className="text-slate-400 group-hover:text-blue-600"
                  />
                  Thông tin tài khoản
                </NavLink>

                <NavLink
                  to="/admin/activity-log"
                  onClick={() => {
                    setShowProfileCard(false);
                    setIsOpen(false); // Đóng sidebar trên mobile
                  }}
                  className={({ isActive }) => `
                   w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium group transition-all
                   ${isActive ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600 hover:bg-slate-50"}
                   `}
                >
                  <Calendar
                    size={16}
                    className="text-slate-400 group-hover:text-blue-600"
                  />
                  Nhật ký hoạt động
                </NavLink>

                <div className="my-1 border-t border-slate-50"></div>

                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold group transition-all">
                  <LogOut
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}

          {/* Trigger Button */}
          <button
            onClick={() => setShowProfileCard(!showProfileCard)}
            className={`w-full flex items-center gap-3 p-2 rounded-xl border transition-all shadow-sm ${
              showProfileCard
                ? "bg-blue-50 border-blue-100"
                : "bg-white border-slate-100 hover:border-blue-200 shadow-slate-200/50"
            }`}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-md shadow-blue-100">
              LH
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-[13px] font-black text-slate-800 truncate leading-none mb-1">
                Lê Trọng Phúc Hậu
              </span>
              <span className="text-[9px] text-emerald-500 font-black uppercase flex items-center gap-1 leading-none">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Online
              </span>
            </div>
            <div
              className={`ml-auto transition-transform duration-200 ${showProfileCard ? "rotate-90 text-blue-600" : "text-slate-300"}`}
            >
              <ChevronRight size={16} strokeWidth={3} />
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
