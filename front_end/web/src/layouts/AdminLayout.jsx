import React, { useEffect, useRef, useState } from "react";
import { Bell, Info, ChevronRight, Check, Menu } from "lucide-react"; // Thêm Menu icon
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import { notificationService } from "../services/notificationService";

const AdminLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State quản lý Sidebar mobile
  const navigate = useNavigate();

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
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const apiBase = import.meta.env.VITE_API_URL || 'http://192.168.1.102:8000/api/v1';
    const wsBase = apiBase.replace(/^http/, 'ws');
    const wsUrl = `${wsBase}/notifications/ws?token=${token}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Admin Notification WebSocket connected!");
    };

    ws.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data);
        console.log("Received new WebSocket notification:", newNotification);
        setNotifications((prev) => [newNotification, ...prev]);
        window.dispatchEvent(new CustomEvent("newNotification", { detail: newNotification }));

        if (Notification.permission === "granted") {
          new Notification(newNotification.title, {
            body: newNotification.message,
          });
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message:", e);
      }
    };

    ws.onclose = () => {
      console.log("Admin Notification WebSocket disconnected!");
    };

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      ws.close();
    };
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
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Sidebar: Truyền State đóng mở vào */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="relative z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 md:px-8">
          <div className="flex items-center gap-4">
            {/* Nút Menu Hamburger - Chỉ hiện trên Mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 md:hidden text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex-1"></div>
          </div>

          <div className="flex items-center gap-4">
            {/* Khu vực Thông báo */}
            <div
              ref={notificationRef}
              className={`relative ${showNotifications ? "z-[120]" : "z-20"}`}
            >
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl transition-all relative ${
                  showNotifications
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-[110]"
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div className="absolute right-0 top-full z-[130] mt-3 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in slide-in-from-top-2 duration-200">
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
                        <div className="p-6 text-center text-slate-500 text-sm">
                          Không có thông báo mới
                        </div>
                      ) : (
                        notifications.map((noti) => (
                          <div
                            key={noti.id}
                            onClick={() => handleMarkAsRead(noti.id, noti.is_read)}
                            className={`p-4 border-b border-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer group relative ${!noti.is_read ? 'bg-slate-50/50' : ''}`}
                          >
                            {!noti.is_read && (
                              <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-full"></div>
                            )}
                            <div className="flex gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Info size={18} />
                              </div>
                              <div className="flex-1">
                                <p className="text-[12px] font-bold text-slate-700 group-hover:text-blue-600">
                                  {noti.title}
                                </p>
                                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                                  {noti.message}
                                </p>
                                <p className="text-[9px] text-slate-400 mt-1">
                                  {formatTime(noti.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <button
                      className="w-full p-3.5 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 border-t border-slate-50"
                    >
                      Xem tất cả <ChevronRight size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="h-8 w-px bg-slate-100 mx-2"></div>
            {/* User Avatar tóm tắt (Optionally) */}
            <div className="w-9 h-9 bg-blue-600 rounded-lg md:hidden flex items-center justify-center text-white text-xs font-bold">
              LH
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
