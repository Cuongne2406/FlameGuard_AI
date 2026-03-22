import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UserSidebar from "../components/user/UserSideBar";
import { Bell, Info, ChevronRight, Check, Menu } from "lucide-react";
import GlobalChatbot from "../components/common/GlobalChatbot";
import { notificationService } from "../services/notificationService";

const UserLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

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

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const formatTime = (dateString) => {
    if (!dateString) return "Gần đây";
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    // 1. flex h-screen: Cố định chiều cao toàn màn hình, không cho cuộn cả trang
    <div className="flex h-screen bg-slate-50 dark:bg-background-dark overflow-hidden transition-colors duration-300">
      {/* 2. SIDEBAR: Bên trái, sẽ đẩy nội dung sang phải nhờ md:sticky trong UserSidebar */}
      <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 3. KHỐI NỘI DUNG CHÍNH: Bên phải */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER: Giảm z-index xuống z-20 để không đè lên Popover của Sidebar (z-50+) */}
        <header className="h-16 bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shrink-0 z-20 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 md:hidden text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            {/* Có thể thêm tiêu đề trang ở đây nếu muốn */}
            <h2 className="hidden md:block text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider transition-colors">
              Hệ thống Đoàn viên
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Thông báo */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl transition-all relative ${
                  showNotifications
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-slate-400 hover:bg-slate-50 dark:text-slate-500 dark:hover:bg-slate-800"
                }`}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-surface-dark rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white">
                      <h3 className="font-bold text-slate-800 text-sm">
                        Thông báo gần đây
                      </h3>
                      <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Check size={12} /> Đọc tất cả
                      </button>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                          Không có thông báo mới
                        </div>
                      ) : (
                        notifications.map((noti) => (
                          <div
                            key={noti.id}
                            onClick={() => handleMarkAsRead(noti.id, noti.is_read)}
                            className={`p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors cursor-pointer group relative ${!noti.is_read ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}
                          >
                            {!noti.is_read && (
                              <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-full"></div>
                            )}
                            <div className="flex gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                <Info size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                  {noti.title}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                                  {noti.message}
                                </p>
                                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">
                                  {formatTime(noti.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <button className="w-full p-3.5 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 border-t border-slate-50">
                      Xem tất cả <ChevronRight size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="h-8 w-px bg-slate-100 mx-2"></div>

            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm md:hidden">
              LH
            </div>
          </div>
        </header>

        {/* 4. MAIN AREA: Tách biệt việc cuộn nội dung */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-background-dark scroll-smooth transition-colors duration-300">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      {/* 5. Gắn AI Chatbot vào gốc của UserLayout để nó trôi nổi trên mọi sub-routes */}
      <GlobalChatbot />
    </div>
  );
};

export default UserLayout;
