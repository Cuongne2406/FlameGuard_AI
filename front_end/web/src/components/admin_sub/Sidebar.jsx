import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Calendar,
  CheckSquare,
  Wallet,
  Trophy,
  Cpu,
  Settings,
  Shield,
  X,
  LogOut,
  ChevronRight,
  User as UserIcon,
  Flame
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // 9 Menu Items according to Enterprise Specs
  const menuItems = [
    {
      icon: <LayoutDashboard size={18} />,
      label: "Tổng quan Điều hành",
      path: "/admin_sub/dashboard",
    },
    {
      icon: <Users size={18} />,
      label: "Quản lý Chi đoàn",
      path: "/admin_sub/classes",
    },
    {
      icon: <Sparkles size={18} />,
      label: "CLB & Đội nhóm",
      path: "/admin_sub/clubs",
    },
    {
      icon: <Calendar size={18} />,
      label: "Sự kiện & Điểm danh",
      path: "/admin_sub/events",
    },
    {
      icon: <CheckSquare size={18} />,
      label: "Trung tâm Xét duyệt",
      path: "/admin_sub/approvals",
    },
    {
      icon: <Wallet size={18} />,
      label: "Tài chính & Đoàn phí",
      path: "/admin_sub/finance",
    },
    {
      icon: <Trophy size={18} />,
      label: "Thi đua SV5T Khoa",
      path: "/admin_sub/awards",
    },
    {
      icon: <Cpu size={18} />,
      label: "Phân tích & Lắng nghe AI",
      path: "/admin_sub/ai-analysis",
      badge: "AI",
    },
    {
      icon: <Settings size={18} />,
      label: "Cài đặt & Nhân sự Khoa",
      path: "/admin_sub/settings",
    },
  ];

  const getInitials = (name) => {
    if (!name) return "FK";
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

  const facultyTitle = user?.managed_org_name || "Đoàn - Hội Khoa CNTT";

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
            <Flame size={20} strokeWidth={2.4} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase leading-none">
              FlameGuard Faculty
            </h1>
            <p className="text-[11px] font-medium text-slate-500 truncate mt-1.5" title={facultyTitle}>
              {facultyTitle}
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Phân hệ Quản trị Khoa
          </div>

          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin_sub/dashboard" && location.pathname.startsWith(`${item.path}/`)) ||
              (item.path === "/admin_sub/events" && location.pathname.startsWith("/admin_sub/events"));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen?.(false)}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
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
                  <span className="rounded bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 text-[9px] font-bold uppercase text-indigo-600">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Dynamic Footer Profile */}
        <div className="relative border-t border-slate-100 p-3" ref={profileRef}>
          {showProfileCard && (
            <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-slate-200 bg-white p-3 shadow-lg z-50">
              <div className="mb-2 pb-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.full_name || "Quản trị viên"}</p>
                <p className="text-[11px] text-slate-500 truncate">{facultyTitle}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {user?.role === "FACULTY_ADMIN" ? "Bí thư / Cán bộ Đoàn Khoa" : user?.role || "Quản trị Khoa"}
                </span>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setShowProfileCard(false);
                    navigate("/admin_sub/settings");
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <UserIcon size={14} />
                  <span>Cài đặt & Nhân sự Khoa</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileCard(false);
                    logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={14} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}

          <div
            onClick={() => setShowProfileCard(!showProfileCard)}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200/60"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
              {getInitials(user?.full_name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate leading-none">
                {user?.full_name || "Bí thư Khoa"}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-1 leading-none">
                {facultyTitle}
              </p>
            </div>
            <ChevronRight size={14} className="text-slate-400 shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
