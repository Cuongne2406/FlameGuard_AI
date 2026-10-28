import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, 
  Search, 
  Bell, 
  Calendar, 
  ChevronDown, 
  Info, 
  ChevronRight, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { notificationService } from "../../services/notificationService";

const subAdminRouteMeta = {
  "/admin_sub/dashboard": { title: "Tổng quan Điều hành Cấp Khoa", section: "Điều hành" },
  "/admin_sub/classes": { title: "Quản lý Chi đoàn & Đoàn viên", section: "Tổ chức Cơ sở" },
  "/admin_sub/clubs": { title: "CLB & Đội nhóm Trực thuộc", section: "Đội nhóm Sinh viên" },
  "/admin_sub/events": { title: "Sự kiện & Điểm danh Cấp Khoa", section: "Phong trào Khoa" },
  "/admin_sub/events/create": { title: "Thiết lập Sự kiện Mới", section: "Phong trào Khoa" },
  "/admin_sub/approvals": { title: "Trung tâm Xét duyệt Cấp Khoa", section: "Hành chính & Phê duyệt" },
  "/admin_sub/finance": { title: "Tài chính, Kinh phí & Đoàn phí", section: "Kế hoạch & Ngân sách" },
  "/admin_sub/awards": { title: "Thi đua & Khen thưởng SV5T", section: "Công tác Thi đua" },
  "/admin_sub/ai-analysis": { title: "Phân tích & Lắng nghe AI", section: "AI Intelligence" },
  "/admin_sub/settings": { title: "Cài đặt & Ban Thường vụ Khoa", section: "Quản trị Khoa" },
  "/admin_sub/notifications": { title: "Trung tâm Thông báo Khoa", section: "Hệ thống" },
};

const quickSearchItems = [
  { label: "Tổng quan Điều hành", path: "/admin_sub/dashboard", group: "Điều hành" },
  { label: "Quản lý Chi đoàn & Đoàn viên", path: "/admin_sub/classes", group: "Tổ chức" },
  { label: "Câu lạc bộ & Đội nhóm", path: "/admin_sub/clubs", group: "Tổ chức" },
  { label: "Sự kiện Khoa & Điểm danh", path: "/admin_sub/events", group: "Phong trào" },
  { label: "Tạo Sự kiện Mới", path: "/admin_sub/events/create", group: "Phong trào" },
  { label: "Trung tâm Xét duyệt Văn bản & Đề xuất", path: "/admin_sub/approvals", group: "Phê duyệt" },
  { label: "Sổ Quỹ, Xin Cấp Kinh phí & Đoàn phí", path: "/admin_sub/finance", group: "Tài chính" },
  { label: "Thi đua & Xét chọn SV5T Khoa", path: "/admin_sub/awards", group: "Khen thưởng" },
  { label: "Phân tích AI & Lắng nghe Ý kiến", path: "/admin_sub/ai-analysis", group: "AI" },
  { label: "Cài đặt & Nhân sự Ban Thường vụ", path: "/admin_sub/settings", group: "Hệ thống" },
  { label: "Xem toàn bộ Thông báo", path: "/admin_sub/notifications", group: "Hệ thống" },
];

const Header = ({ onToggleSidebar, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState("HK2 - 2025-2026");

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Dynamic route metadata lookup
  const getPageMeta = () => {
    const path = location.pathname;
    if (subAdminRouteMeta[path]) return subAdminRouteMeta[path];
    if (path.includes("/events/") && path.includes("/checkin")) {
      return { title: "Điểm danh Sinh viên Trực tiếp", section: "Sự kiện Khoa" };
    }
    if (path.includes("/events/") && path.includes("/approvals")) {
      return { title: "Xét duyệt Đăng ký Tham gia", section: "Sự kiện Khoa" };
    }
    if (path.includes("/events/") && path.includes("/live")) {
      return { title: "Giám sát & Báo cáo Sự kiện Realtime", section: "Sự kiện Khoa" };
    }
    if (path.includes("/events/") && path.includes("/feedback")) {
      return { title: "Phân tích Phản hồi & Cảm xúc Sinh viên", section: "Sự kiện Khoa" };
    }
    if (path.includes("/events/") && path.includes("/summary")) {
      return { title: "Tổng kết Sự kiện & Khen thưởng", section: "Sự kiện Khoa" };
    }
    return { title: "Quản trị Phân hệ Cấp Khoa", section: "Quản trị Khoa" };
  };

  const pageMeta = getPageMeta();

  // Load notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getMyNotifications();
        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(data.filter((n) => !n.is_read).length);
        }
      } catch (err) {
        console.error("Failed to load notifications in SubAdmin Header", err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "FK";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const filteredNavItems = searchQuery.trim()
    ? quickSearchItems.filter((i) =>
        i.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.group.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="relative z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-7">
      {/* Left: Responsive Toggle & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-4">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 md:hidden text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col min-w-0">
          <nav className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="truncate">{user?.managed_org_name || "Đoàn - Hội Cấp Khoa"}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-medium">{pageMeta.section}</span>
          </nav>
          <h1 className="text-sm md:text-base font-bold text-slate-900 truncate leading-tight mt-0.5">
            {pageMeta.title}
          </h1>
        </div>
      </div>

      {/* Right: Quick Search, Term selector, Notifications, Profile */}
      <div className="flex items-center gap-3 shrink-0 ml-auto">
        {/* Quick Search Dropdown */}
        <div className="relative hidden sm:block" ref={searchRef}>
          <div className="flex items-center relative">
            <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm nhanh phân hệ Khoa..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-52 lg:w-60 pl-8 pr-3 py-1.5 text-xs bg-slate-100/70 hover:bg-slate-100 focus:bg-white text-slate-700 placeholder-slate-400 rounded-lg border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {isSearchOpen && filteredNavItems.length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 max-h-64 overflow-y-auto">
              {filteredNavItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(item.path);
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-lg flex items-center justify-between text-slate-700 hover:text-blue-600 transition-colors"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.group}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Academic Term Dropdown */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100/80 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
          <Calendar size={14} className="text-blue-600" />
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="HK2 - 2025-2026">HK2 (2025 - 2026)</option>
            <option value="HK1 - 2025-2026">HK1 (2025 - 2026)</option>
            <option value="HK2 - 2024-2025">HK2 (2024 - 2025)</option>
          </select>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Thông báo"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-800">Thông báo Khoa</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    navigate("/admin_sub/notifications");
                    setShowNotifications(false);
                  }}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Xem tất cả
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Chưa có thông báo nào
                  </div>
                ) : (
                  notifications.slice(0, 5).map((noti) => (
                    <div
                      key={noti.id}
                      className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer text-left ${
                        !noti.is_read ? "bg-blue-50/30" : ""
                      }`}
                      onClick={() => {
                        notificationService.markAsRead(noti.id);
                        setNotifications((prev) =>
                          prev.map((n) => (n.id === noti.id ? { ...n, is_read: true } : n))
                        );
                        setUnreadCount((c) => Math.max(0, c - 1));
                      }}
                    >
                      <div className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Info size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {noti.title || "Thông báo hệ thống"}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            {noti.message || noti.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  navigate("/admin_sub/notifications");
                  setShowNotifications(false);
                }}
                className="w-full p-2.5 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 border-t border-slate-100"
              >
                Xem toàn bộ thông báo <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200"></div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {getInitials(user?.full_name)}
            </div>
            <div className="hidden md:flex flex-col items-start text-left leading-none">
              <span className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">
                {user?.full_name || "Bí thư Khoa"}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-[130px] mt-0.5">
                {user?.managed_org_name || "Khoa CNTT"}
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.full_name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || "subadmin@flameguard.edu.vn"}</p>
              </div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/admin_sub/settings");
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Settings size={14} />
                <span>Cài đặt & Nhân sự</span>
              </button>

              <div className="my-1 border-t border-slate-100"></div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout?.();
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors"
              >
                <LogOut size={14} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;