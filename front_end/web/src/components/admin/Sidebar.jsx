import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Wallet,
  Trophy,
  FileText,
  Cpu,
  Settings,
  Bell,
  Calendar,
  User,
  LogOut,
  ChevronRight,
  Shield,
  X
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // 8 Flat Primary Navigation Items
  const menuItems = [
    {
      icon: <LayoutDashboard size={19} />,
      label: "Tổng quan Điều hành",
      path: "/admin/dashboard",
    },
    {
      icon: <Users size={19} />,
      label: "Tổ chức & Cán bộ",
      path: "/admin/organizations",
    },
    {
      icon: <Megaphone size={19} />,
      label: "Chiến dịch & Sự kiện",
      path: "/admin/campaigns",
    },
    {
      icon: <Wallet size={19} />,
      label: "Tài chính & Hậu cần",
      path: "/admin/finance",
    },
    {
      icon: <Trophy size={19} />,
      label: "Thi đua & Khen thưởng (SV5T)",
      path: "/admin/awards",
    },
    {
      icon: <FileText size={19} />,
      label: "Văn bản Hành chính",
      path: "/admin/documents",
    },
    {
      icon: <Cpu size={19} />,
      label: "Phân tích AI & Kiểm duyệt",
      path: "/admin/ai",
      badge: "AI",
    },
    {
      icon: <Settings size={19} />,
      label: "Cấu hình & Bảo mật",
      path: "/admin/settings",
    },
  ];

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileCard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-screen w-72 shrink-0 flex-col border-r border-slate-200/80 bg-white transition-transform duration-200 ease-in-out md:relative
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg md:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        {/* Enterprise Brand Header */}
        <div className="flex items-center gap-3.5 px-6 py-5 border-b border-slate-100">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
            <Shield size={20} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase leading-none">
              FlameGuard Admin
            </h1>
            <p className="text-[11px] font-medium text-slate-400 truncate mt-1.5">
              Quản trị Đoàn - Hội LHU
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Không gian làm việc
          </div>

          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin/dashboard" && location.pathname.startsWith(`${item.path}/`)) ||
              (item.path === "/admin/organizations" && location.pathname.startsWith("/admin/organizations"));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`transition-colors shrink-0 ${
                      isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="rounded bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-indigo-600">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile & Actions Footer */}
        <div className="relative border-t border-slate-100 p-3" ref={profileRef}>
          {/* User Profile Dropup Card */}
          {showProfileCard && (
            <div className="animate-in fade-in slide-in-from-bottom-2 absolute bottom-full left-3 right-3 z-50 mb-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-3 py-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tài khoản Quản trị
                </span>
                <span className="flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Đang hoạt động
                </span>
              </div>

              <div className="p-1 text-left space-y-0.5">
                <NavLink
                  to="/admin/profile"
                  onClick={() => {
                    setShowProfileCard(false);
                    setIsOpen(false);
                  }}
                  className={({ isActive }) =>
                    `group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <User size={15} className="text-slate-400 group-hover:text-blue-600" />
                  <span>Thông tin tài khoản</span>
                </NavLink>

                <NavLink
                  to="/admin/activity-log"
                  onClick={() => {
                    setShowProfileCard(false);
                    setIsOpen(false);
                  }}
                  className={({ isActive }) =>
                    `group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Calendar size={15} className="text-slate-400 group-hover:text-blue-600" />
                  <span>Nhật ký hệ thống</span>
                </NavLink>

                <NavLink
                  to="/admin/notifications"
                  onClick={() => {
                    setShowProfileCard(false);
                    setIsOpen(false);
                  }}
                  className={({ isActive }) =>
                    `group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Bell size={15} className="text-slate-400 group-hover:text-blue-600" />
                  <span>Trung tâm thông báo</span>
                </NavLink>

                <div className="my-1 border-t border-slate-100"></div>

                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={15} className="transition-transform group-hover:translate-x-0.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}

          {/* Profile Trigger Button */}
          <button
            onClick={() => setShowProfileCard(!showProfileCard)}
            className={`w-full rounded-lg border p-2 text-left transition-all ${
              showProfileCard
                ? "border-blue-300 bg-blue-50/50"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white shadow-xs">
                {getInitials(user?.full_name)}
              </div>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-slate-800 leading-tight">
                  {user?.full_name || "Quản trị viên"}
                </span>
                <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                  {user?.roles?.[0]?.name || "UNIVERSITY_ADMIN"}
                </span>
              </div>
              <ChevronRight
                size={14}
                className={`text-slate-400 transition-transform duration-150 ${
                  showProfileCard ? "rotate-90 text-blue-600" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
