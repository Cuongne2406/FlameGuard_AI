import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Bell,
  Info,
  ChevronRight,
  Check,
  Menu,
  Search,
  ChevronDown,
  LayoutDashboard,
  Users,
  Megaphone,
  Wallet,
  Trophy,
  FileText,
  Cpu,
  Settings,
  Calendar,
  X
} from "lucide-react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { notificationService } from "../services/notificationService";

const routeTitleMap = {
  "/admin/dashboard": { title: "Tổng quan Điều hành", section: "Điều hành" },
  "/admin/organizations": { title: "Tổ chức & Cán bộ", section: "Quản trị Nhân sự" },
  "/admin/organizations/units": { title: "Danh sách Đơn vị", section: "Quản trị Nhân sự" },
  "/admin/organizations/members": { title: "Hồ sơ Cán bộ", section: "Quản trị Nhân sự" },
  "/admin/organizations/chart": { title: "Sơ đồ Cơ cấu Tổ chức", section: "Quản trị Nhân sự" },
  "/admin/campaigns": { title: "Chiến dịch & Sự kiện", section: "Phong trào" },
  "/admin/campaigns/list": { title: "Danh sách Chiến dịch", section: "Phong trào" },
  "/admin/campaigns/timeline": { title: "Lịch trình & Tiến độ Gantt", section: "Phong trào" },
  "/admin/campaigns/calendar": { title: "Lịch Hoạt động", section: "Phong trào" },
  "/admin/finance": { title: "Tài chính & Hậu cần", section: "Kế hoạch & Tài chính" },
  "/admin/awards": { title: "Thi đua & Khen thưởng SV5T", section: "Công tác Thi đua" },
  "/admin/awards/leaderboard": { title: "Bảng vàng Thi đua SV5T", section: "Công tác Thi đua" },
  "/admin/documents": { title: "Văn bản Hành chính", section: "Hành chính & Số hóa" },
  "/admin/ai": { title: "Phân tích AI & Kiểm duyệt", section: "Trí tuệ Nhân tạo" },
  "/admin/settings": { title: "Cấu hình & Bảo mật", section: "Hệ thống" },
  "/admin/notifications": { title: "Trung tâm Thông báo", section: "Hệ thống" },
  "/admin/profile": { title: "Hồ sơ Quản trị viên", section: "Cá nhân" },
  "/admin/activity-log": { title: "Nhật ký Hệ thống", section: "Bảo mật & Kiểm toán" }
};

const quickNavItems = [
  { label: "Tổng quan Điều hành", path: "/admin/dashboard", category: "Điều hành" },
  { label: "Xét chọn Sinh viên 5 Tốt (SV5T)", path: "/admin/awards", category: "Khen thưởng" },
  { label: "Bảng vàng Thi đua SV5T", path: "/admin/awards?tab=leaderboard", category: "Khen thưởng" },
  { label: "Quản lý Đơn vị & Chi đoàn", path: "/admin/organizations?tab=units", category: "Tổ chức" },
  { label: "Hồ sơ Cán bộ Đoàn - Hội", path: "/admin/organizations?tab=members", category: "Tổ chức" },
  { label: "Sơ đồ Cơ cấu Tổ chức", path: "/admin/organizations?tab=chart", category: "Tổ chức" },
  { label: "Chiến dịch & Sự kiện", path: "/admin/campaigns", category: "Phong trào" },
  { label: "Lịch trình Gantt Timeline", path: "/admin/campaigns?view=timeline", category: "Phong trào" },
  { label: "Phê duyệt Cấp Kinh phí", path: "/admin/finance?tab=requests", category: "Tài chính" },
  { label: "Quản lý Kho Tài sản & Thiết bị", path: "/admin/finance?tab=assets", category: "Tài chính" },
  { label: "Văn bản & Quyết định Số hóa", path: "/admin/documents", category: "Hành chính" },
  { label: "Phân tích Cảm xúc AI (Sentiment)", path: "/admin/ai", category: "AI Intelligence" },
  { label: "Cấu hình Hệ thống & Vai trò", path: "/admin/settings", category: "Hệ thống" },
  { label: "Nhật ký Hoạt động (Audit Log)", path: "/admin/activity-log", category: "Bảo mật" },
  { label: "Trung tâm Thông báo", path: "/admin/notifications", category: "Hệ thống" },
];

const AdminLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  // Dynamic Page Info
  const currentPath = location.pathname;
  const pageMeta = routeTitleMap[currentPath] || {
    title: "Không gian Quản trị",
    section: "Quản trị hệ thống"
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi lấy thông báo:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Lỗi cập nhật thông báo:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const formatTime = (dateString) => {
    if (!dateString) return "Gần đây";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const filteredQuickNav = quickNavItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Enterprise Header */}
        <header className="relative z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 md:px-8">
          {/* Left: Dynamic Breadcrumbs & Title */}
          <div className="flex items-center gap-4 min-w-0 flex-1 mr-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 md:hidden text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div className="flex flex-col min-w-0">
              <nav className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Quản trị hệ thống</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-500 font-medium">{pageMeta.section}</span>
              </nav>
              <h1 className="text-base font-bold text-slate-900 truncate leading-tight mt-0.5">
                {pageMeta.title}
              </h1>
            </div>
          </div>

          {/* Right: Quick Search & Notification Bell & User Summary */}
          <div className="flex items-center gap-3.5 shrink-0 ml-auto">
            {/* Quick Navigation Search */}
            <div className="relative hidden sm:block" ref={searchRef}>
              <div className="flex items-center relative">
                <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm nhanh phân hệ (Ctrl + K)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-56 lg:w-64 pl-9 pr-3 py-1.5 text-xs bg-slate-100/70 hover:bg-slate-100 focus:bg-white text-slate-700 placeholder-slate-400 rounded-lg border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Quick Navigation Results Dropdown */}
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2.5 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                    <span>Điều hướng nhanh</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {filteredQuickNav.length} kết quả
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
                    {filteredQuickNav.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        Không tìm thấy phân hệ nào
                      </div>
                    ) : (
                      filteredQuickNav.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            navigate(item.path);
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-blue-50 flex items-center justify-between group transition-colors"
                        >
                          <span className="font-medium text-slate-700 group-hover:text-blue-600">
                            {item.label}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700 px-1.5 py-0.5 rounded font-medium">
                            {item.category}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div ref={notificationRef} className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg transition-colors relative border ${
                  showNotifications
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "text-slate-500 hover:bg-slate-100 border-transparent"
                }`}
                aria-label="Thông báo"
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm leading-none">
                        Thông báo gần đây
                      </h3>
                      {unreadCount > 0 && (
                        <span className="text-[11px] text-blue-600 font-medium">
                          {unreadCount} thông báo chưa đọc
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        navigate("/admin/notifications");
                        setShowNotifications(false);
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Quản lý tất cả
                    </button>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        Không có thông báo mới nào
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((noti) => (
                        <div
                          key={noti.id}
                          onClick={() => handleMarkAsRead(noti.id, noti.is_read)}
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group relative ${
                            !noti.is_read ? "bg-blue-50/20" : ""
                          }`}
                        >
                          {!noti.is_read && (
                            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-full"></div>
                          )}
                          <div className="flex gap-3 pl-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                              <Info size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
                                {noti.title || "Thông báo hệ thống"}
                              </p>
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                                {noti.message}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                {formatTime(noti.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => {
                      navigate("/admin/notifications");
                      setShowNotifications(false);
                    }}
                    className="w-full p-3 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 border-t border-slate-100"
                  >
                    Xem tất cả thông báo <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            {/* Mobile User Initials Avatar */}
            <div
              onClick={() => navigate("/admin/profile")}
              className="w-8 h-8 bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-lg flex md:hidden items-center justify-center text-white text-xs font-bold shadow-sm"
              title={user?.full_name || "Quản trị viên"}
            >
              {getInitials(user?.full_name)}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Body */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
