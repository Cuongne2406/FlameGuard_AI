import React, { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Clock, Gift, Info, Megaphone, AlertCircle } from "lucide-react";
import { notificationService } from "../../../services/notificationService";

const categoryTabs = ["Tất cả", "Sự kiện", "Hệ thống", "Điểm"];

const getCategory = (type) => {
  switch (type) {
    case "EVENT":
      return "Sự kiện";
    case "SCORE":
      return "Điểm";
    default:
      return "Hệ thống";
  }
};

const getIcon = (type) => {
  switch (type) {
    case "EVENT":
      return <Bell size={18} className="text-indigo-600" />;
    case "SCORE":
      return <Gift size={18} className="text-emerald-500" />;
    case "NEWS":
      return <Megaphone size={18} className="text-amber-500" />;
    case "URGENT":
      return <AlertCircle size={18} className="text-rose-500" />;
    default:
      return <Info size={18} className="text-slate-500" />;
  }
};

const getIconBg = (type) => {
  switch (type) {
    case "EVENT":
      return "bg-indigo-50";
    case "SCORE":
      return "bg-emerald-50";
    case "NEWS":
      return "bg-amber-50";
    case "URGENT":
      return "bg-rose-50";
    default:
      return "bg-slate-100";
  }
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi tải thông báo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  const filteredNotifications = useMemo(() => {
    if (activeCategory === "Tất cả") return notifications;
    return notifications.filter((item) => getCategory(item.type) === activeCategory);
  }, [activeCategory, notifications]);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error);
    }
  };

  const handleMarkRead = async (item) => {
    if (item.is_read) return;

    try {
      await notificationService.markAsRead(item.id);
      setNotifications((prev) =>
        prev.map((entry) => (entry.id === item.id ? { ...entry, is_read: true } : entry))
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };

  return (
    <div className="space-y-6">
      <section className="app-card overflow-hidden">
        <div className="app-hero relative px-5 pb-8 pt-6 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%)]" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                Thông báo
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/82">
                Ưu tiên hiển thị thông báo chưa đọc và nhóm theo mục rõ ràng hơn giống app user.
              </p>
              <div className="mt-6 flex items-end gap-3 text-white">
                <span className="text-5xl font-black">{unreadCount}</span>
                <span className="pb-2 text-sm font-semibold text-white/82">
                  thông báo chưa đọc
                </span>
              </div>
            </div>

            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 rounded-full bg-white/18 px-5 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/24"
            >
              <CheckCheck size={16} />
              Đọc hết
            </button>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="mb-6 flex flex-wrap gap-3">
            {categoryTabs.map((tab) => {
              const count =
                tab === "Tất cả"
                  ? notifications.length
                  : notifications.filter((item) => getCategory(item.type) === tab).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={tab === activeCategory ? "app-chip app-chip-active" : "app-chip"}
                >
                  {tab}
                  {count ? ` (${count})` : ""}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="app-card-muted h-28 animate-pulse" />
              ))}
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMarkRead(item)}
                  className={`app-card flex w-full items-center gap-4 p-5 text-left transition-all hover:-translate-y-0.5 ${
                    item.is_read ? "" : "ring-1 ring-indigo-100"
                  }`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] ${getIconBg(item.type)}`}>
                    {getIcon(item.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className={`truncate text-base ${item.is_read ? "font-bold text-slate-800" : "font-black text-slate-900"}`}>
                        {item.title}
                      </p>
                      {!item.is_read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {item.message}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="app-chip">{getCategory(item.type)}</span>
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Clock size={12} />
                        {formatTime(item.created_at)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-slate-100 bg-white px-6 py-20 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                <Bell size={40} className="text-slate-400" />
              </div>
              <h3 className="mt-8 text-3xl font-black text-slate-900">Hộp thư trống</h3>
              <p className="mt-3 max-w-md text-base leading-7 text-slate-400">
                Bạn không có thông báo nào trong nhóm này.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserNotifications;
