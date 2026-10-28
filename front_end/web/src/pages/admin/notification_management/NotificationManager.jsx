import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  Check,
  ShieldAlert,
  FileText,
  Trophy,
  Info,
  Search,
  Filter,
  RefreshCw,
  Send,
  Trash2,
  Plus
} from "lucide-react";
import { notificationService } from "../../../services/notificationService";

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, UNREAD, WARNING, READ
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotif, setSelectedNotif] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi khi tải thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Lỗi cập nhật đã đọc:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    for (const id of unreadIds) {
      try {
        await notificationService.markAsRead(id);
      } catch (err) {
        console.error(err);
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "Vừa xong";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const getNotifIcon = (type, title = "") => {
    const t = (type || "").toLowerCase();
    const tit = (title || "").toLowerCase();
    if (t.includes("danger") || tit.includes("cảnh báo") || tit.includes("sự cố")) {
      return {
        icon: <ShieldAlert size={18} className="text-rose-600" />,
        bg: "bg-rose-50 border-rose-200"
      };
    }
    if (tit.includes("sinh viên 5 tốt") || tit.includes("khen thưởng") || tit.includes("sv5t")) {
      return {
        icon: <Trophy size={18} className="text-amber-600" />,
        bg: "bg-amber-50 border-amber-200"
      };
    }
    if (tit.includes("văn bản") || tit.includes("kinh phí") || tit.includes("tờ trình")) {
      return {
        icon: <FileText size={18} className="text-blue-600" />,
        bg: "bg-blue-50 border-blue-200"
      };
    }
    return {
      icon: <Info size={18} className="text-indigo-600" />,
      bg: "bg-indigo-50 border-indigo-200"
    };
  };

  const filteredNotifs = notifications.filter((n) => {
    // Tab filter
    if (activeTab === "UNREAD" && n.is_read) return false;
    if (activeTab === "READ" && !n.is_read) return false;
    if (activeTab === "WARNING") {
      const isWarn =
        (n.type || "").toLowerCase().includes("danger") ||
        (n.title || "").toLowerCase().includes("cảnh báo") ||
        (n.title || "").toLowerCase().includes("rủi ro");
      if (!isWarn) return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (n.title || "").toLowerCase().includes(q);
      const matchMsg = (n.message || "").toLowerCase().includes(q);
      if (!matchTitle && !matchMsg) return false;
    }
    return true;
  });

  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Trung tâm Quản lý Thông báo
            </h1>
            {unreadCount > 0 && (
              <span className="bg-rose-50 text-rose-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-rose-200">
                {unreadCount} chưa đọc
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi, phân loại và xử lý các thông báo, công văn và cảnh báo gửi đến Quản trị viên
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchNotifications}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-medium text-slate-600 shadow-xs transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg text-xs font-semibold text-blue-700 transition-colors"
            >
              <CheckCircle2 size={14} />
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar & Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { key: "ALL", label: `Tất cả (${totalCount})` },
            { key: "UNREAD", label: `Chưa đọc (${unreadCount})` },
            { key: "WARNING", label: "Cảnh báo & Sự cố" },
            { key: "READ", label: "Đã đọc" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-slate-900 text-white font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg outline-none transition-all"
          />
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-blue-600" />
            Đang tải dữ liệu thông báo...
          </div>
        ) : filteredNotifs.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={32} className="mx-auto text-slate-300 mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">Không có thông báo nào</h3>
            <p className="text-xs text-slate-400 mt-1">
              Bạn đã xử lý hết các thông báo hoặc không tìm thấy kết quả phù hợp với bộ lọc
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifs.map((noti) => {
              const iconCfg = getNotifIcon(noti.type, noti.title);
              return (
                <div
                  key={noti.id}
                  onClick={() => handleMarkAsRead(noti.id, noti.is_read)}
                  className={`p-4 transition-colors hover:bg-slate-50/80 cursor-pointer flex items-start gap-4 ${
                    !noti.is_read ? "bg-blue-50/25" : ""
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="pt-1 shrink-0">
                    <span
                      className={`block w-2.5 h-2.5 rounded-full ${
                        !noti.is_read ? "bg-blue-600 ring-4 ring-blue-100" : "bg-transparent"
                      }`}
                    />
                  </div>

                  {/* Icon Box */}
                  <div
                    className={`p-2.5 rounded-lg border shrink-0 ${iconCfg.bg}`}
                  >
                    {iconCfg.icon}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4
                        className={`text-xs font-semibold ${
                          !noti.is_read ? "text-slate-900 font-bold" : "text-slate-700"
                        }`}
                      >
                        {noti.title || "Thông báo hệ thống"}
                      </h4>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {formatDateTime(noti.created_at)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {noti.message}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {noti.type || "Hệ thống"}
                      </span>
                      {!noti.is_read && (
                        <span className="text-[10px] font-semibold text-blue-600">
                          Chưa đọc • Nhấp để đánh dấu đã xem
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManager;
