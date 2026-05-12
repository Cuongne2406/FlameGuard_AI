import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Building2,
  Calendar,
  CalendarDays,
  ChevronRight,
  Cpu,
  FileText,
  GitBranch,
  LayoutDashboard,
  List,
  LogOut,
  Megaphone,
  Settings,
  Trophy,
  User,
  UserRound,
  Users,
  Wallet,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/admin/dashboard",
      children: null,
    },
    {
      icon: <Users size={20} />,
      label: "Tổ chức & Nhân sự",
      path: "/admin/organizations",
      children: [
        {
          label: "Sơ đồ cây",
          path: "/admin/organizations/org-chart",
          icon: <GitBranch size={16} />,
        },
        {
          label: "Danh sách đơn vị",
          path: "/admin/organizations/units",
          icon: <Building2 size={16} />,
        },
        {
          label: "Hồ sơ cán bộ",
          path: "/admin/organizations/members",
          icon: <UserRound size={16} />,
        },
      ],
    },
    {
      icon: <Megaphone size={20} />,
      label: "Chiến dịch & Sự kiện",
      path: "/admin/campaigns",
      children: [
        {
          label: "Danh sách chiến dịch",
          path: "/admin/campaigns/list",
          icon: <List size={16} />,
        },
        {
          label: "Timeline",
          path: "/admin/campaigns/timeline",
          icon: <GitBranch size={16} />,
        },
        {
          label: "Lịch sự kiện",
          path: "/admin/campaigns/calendar",
          icon: <CalendarDays size={16} />,
        },
      ],
    },
    {
      icon: <Wallet size={20} />,
      label: "Tài chính & Hậu cần",
      path: "/admin/finance",
      children: null,
    },
    {
      icon: <Trophy size={20} />,
      label: "Thi đua & Khen thưởng",
      path: "/admin/awards",
      children: null,
    },
    {
      icon: <FileText size={20} />,
      label: "Văn bản số",
      path: "/admin/documents",
      children: null,
    },
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
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

  useEffect(() => {
    menuItems.forEach((item) => {
      if (!item.children) return;

      const isChildActive = item.children.some((child) =>
        location.pathname.startsWith(child.path),
      );

      if (isChildActive) {
        setOpenMenus((prev) => ({
          ...prev,
          [item.label]: true,
        }));
      }
    });
  }, [location.pathname]);

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[50] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-[60] flex h-screen w-72 shrink-0 flex-col border-r border-slate-100 bg-white shadow-sm transition-transform duration-300 ease-in-out md:relative
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-6 p-2 text-slate-400 transition-colors hover:text-slate-600 md:hidden"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-100">
            <span className="text-xl font-bold uppercase text-white">D</span>
          </div>
          <div>
            <h1 className="text-lg font-black uppercase leading-tight tracking-tight text-blue-600">
              DYUS <span className="text-red-500">Master</span>
            </h1>
            <p className="text-[10px] font-bold uppercase leading-none tracking-widest text-slate-400">
              Enterprise v2.1
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 pt-2">
          <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Danh mục chính
          </p>

          {menuItems.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isChildActive = item.children?.some((child) =>
              location.pathname.startsWith(child.path),
            );
            const isParentActive =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`) ||
              isChildActive;

            return (
              <div key={item.path} className="space-y-1">
                <div className="flex items-center gap-2">
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      if (hasChildren) {
                        toggleMenu(item.label);
                      }
                      setIsOpen(false);
                    }}
                    className={() =>
                      `group flex min-w-0 flex-1 items-center gap-4 rounded-xl px-4 py-3 text-left transition-all ${
                        isParentActive
                          ? "bg-blue-50 font-bold text-blue-600 shadow-sm"
                          : "text-slate-500 hover:bg-slate-50"
                      }`
                    }
                  >
                    <span className="transition-transform group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="whitespace-nowrap text-[14.5px]">
                      {item.label}
                    </span>
                  </NavLink>

                  {hasChildren && (
                    <button
                      type="button"
                      aria-label={`Toggle ${item.label}`}
                      onClick={() => toggleMenu(item.label)}
                      className={`rounded-xl p-3 transition-all hover:bg-slate-50 ${
                        isParentActive ? "text-blue-600" : "text-slate-400"
                      }`}
                    >
                      <ChevronRight
                        size={18}
                        className={`transition-transform duration-200 ${
                          openMenus[item.label] ? "rotate-90" : "rotate-0"
                        }`}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && (
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      openMenus[item.label]
                        ? "max-h-64 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-100 pl-4">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                              isActive
                                ? "bg-blue-50 font-semibold text-blue-600"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            }`
                          }
                        >
                          <span>{child.icon}</span>
                          <span>{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="mx-4 my-6 border-t border-slate-50"></div>

          <NavLink
            to="/admin/ai"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `group flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                isActive
                  ? "bg-indigo-50 font-bold text-indigo-700"
                  : "text-indigo-600 hover:bg-indigo-50"
              }`
            }
          >
            <div className="flex items-center gap-4">
              <Cpu size={20} className="animate-pulse" />
              <span className="text-[14.5px]">DYUS Intelligence</span>
            </div>
            <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-indigo-700">
              AI
            </span>
          </NavLink>

          <NavLink
            to="/admin/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `group mt-2 flex items-center gap-4 rounded-xl px-4 py-3 transition-all ${
                isActive
                  ? "bg-indigo-50 font-bold text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`
            }
          >
            <Settings size={20} />
            <span className="text-[14.5px]">Cấu hình hệ thống</span>
          </NavLink>
        </nav>

        <div className="relative border-t border-slate-50 p-4" ref={profileRef}>
          {showProfileCard && (
            <div className="animate-in fade-in slide-in-from-bottom-2 absolute bottom-full left-4 right-4 z-50 mb-3 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl duration-200">
              <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 p-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Trạng thái
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  Online
                </span>
              </div>

              <div className="p-2 text-left">
                <NavLink
                  to="/admin/profile"
                  onClick={() => {
                    setShowProfileCard(false);
                    setIsOpen(false);
                  }}
                  className={({ isActive }) =>
                    `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 font-bold text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
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
                    setIsOpen(false);
                  }}
                  className={({ isActive }) =>
                    `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 font-bold text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  <Calendar
                    size={16}
                    className="text-slate-400 group-hover:text-blue-600"
                  />
                  Nhật ký hoạt động
                </NavLink>

                <div className="my-1 border-t border-slate-50"></div>

                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 transition-all hover:bg-red-50"
                >
                  <LogOut
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowProfileCard(!showProfileCard)}
            className={`w-full rounded-xl border p-2 shadow-sm transition-all ${
              showProfileCard
                ? "border-blue-100 bg-blue-50"
                : "border-slate-100 bg-white shadow-slate-200/50 hover:border-blue-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-black text-white shadow-md shadow-blue-100">
                {getInitials(user?.full_name)}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <span className="mb-1 block truncate text-[13px] font-black leading-none text-slate-800">
                  {user?.full_name || "Admin Khoa"}
                </span>
                <span className="flex items-center gap-1 text-[9px] font-black uppercase leading-none text-emerald-500">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                  Online
                </span>
              </div>
              <div
                className={`ml-auto transition-transform duration-200 ${
                  showProfileCard ? "rotate-90 text-blue-600" : "text-slate-300"
                }`}
              >
                <ChevronRight size={16} strokeWidth={3} />
              </div>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
