import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Bell, Check, ChevronRight, Info, Menu } from "lucide-react";
import UserSidebar from "../components/user/UserSideBar";
import GlobalChatbot from "../components/common/GlobalChatbot";
import { notificationService } from "../services/notificationService";

const UserLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;

    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
      );
    } catch (error) {
      console.error("Lỗi cập nhật thông báo:", error);
    }
  };

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  const formatTime = (dateString) => {
    if (!dateString) return "Gần đây";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="app-shell flex h-screen overflow-hidden">
      <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
          <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 py-4 md:px-8">
            <div className="flex items-start gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-sm md:hidden"
              >
                <Menu size={24} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div
                ref={notificationRef}
                className={`relative ${showNotifications ? "z-[120]" : "z-20"}`}
              >
                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-sm transition-all ${
                    showNotifications ? "ring-2 ring-indigo-100" : "hover:bg-slate-50"
                  }`}
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
                  )}
                </button>

                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-[110]"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="app-card absolute right-0 top-full z-[130] mt-3 w-80 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between border-b border-slate-100 bg-white p-4">
                        <h3 className="text-sm font-bold text-slate-800">
                          Thông báo gần đây
                        </h3>
                        <button className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700">
                          <Check size={12} />
                          Đọc tất cả
                        </button>
                      </div>

                      <div className="max-h-[350px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm text-slate-500">
                            Không có thông báo mới
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() =>
                                handleMarkAsRead(notification.id, notification.is_read)
                              }
                              className={`group relative cursor-pointer border-b border-slate-100 p-4 transition-colors hover:bg-indigo-50/40 ${
                                !notification.is_read ? "bg-slate-50/70" : ""
                              }`}
                            >
                              {!notification.is_read && (
                                <div className="absolute left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-indigo-600" />
                              )}
                              <div className="flex gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                  <Info size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-[12px] font-bold text-slate-700 group-hover:text-indigo-600">
                                    {notification.title}
                                  </p>
                                  <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">
                                    {notification.message}
                                  </p>
                                  <p className="mt-1 text-[9px] text-slate-400">
                                    {formatTime(notification.created_at)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <button className="flex w-full items-center justify-center gap-2 border-t border-slate-100 p-3.5 text-xs font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-indigo-600">
                        Xem tất cả
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </>
              )}
            </div>

              <div className="hidden h-8 w-px bg-slate-200 md:block" />

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white md:hidden">
                LH
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="mx-auto max-w-7xl p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      <GlobalChatbot />
    </div>
  );
};

export default UserLayout;
