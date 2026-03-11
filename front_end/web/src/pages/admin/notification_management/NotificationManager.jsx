import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  FileText,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { notificationService } from "../../../services/notificationService";

const NotificationItem = ({ type, title, time, isUnread }) => {
  // Định nghĩa Icon và màu sắc dựa trên loại thông báo
  const config = {
    danger: {
      icon: <ShieldAlert size={16} />,
      bg: "bg-red-100",
      text: "text-red-600",
    },
    file: {
      icon: <FileText size={16} />,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    success: {
      icon: <CheckCircle size={16} />,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    ai: {
      icon: <MessageSquare size={16} />,
      bg: "bg-orange-100",
      text: "text-orange-600",
    },
  };

  const { icon, bg, text } = config[type];

  return (
    <div className="p-4 flex gap-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 transition-colors relative group">
      <div className={`p-2 rounded-lg shrink-0 ${bg} ${text}`}>{icon}</div>
      <div className="flex-1 pr-4">
        <p className="text-[13px] text-slate-700 leading-snug">
          <span className={`font-bold ${text}`}>
            {type === "danger" ? "Cảnh báo: " : ""}
          </span>
          {title}
        </p>
        <span className="text-[11px] text-slate-400 mt-1.5 block">{time}</span>
      </div>
      {isUnread && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
};

const NotificationDropdown = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const fetchNotifs = async () => {
       try {
         const data = await notificationService.getNotifications();
         // map to the structure we need if valid
         setNotifications(data || []);
       } catch (err) { console.error("Error fetching notifications", err); }
    };
    fetchNotifs();
  }, []);

  return (
    <>
      {/* Lớp phủ để bấm ra ngoài thì đóng hộp thoại */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      <div className="absolute right-0 top-12 w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
        {/* Header của hộp thoại */}
        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="font-bold text-slate-800 text-sm">Thông báo</h3>
          <button className="text-[11px] text-blue-600 font-semibold hover:underline">
            Đánh dấu tất cả đã đọc
          </button>
        </div>

        {/* Danh sách thông báo */}
        <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <NotificationItem
                key={notif.id || index}
                type={notif.type || "file"} // Assuming type matches our UI configs
                title={notif.message || notif.title}
                time={new Date(notif.created_at || Date.now()).toLocaleString()}
                isUnread={!notif.is_read}
              />
            ))
          ) : (
             <div className="p-8 text-center text-slate-400 text-sm">Chưa có thông báo nào</div>
          )}
        </div>

        {/* Footer của hộp thoại */}
        <div className="p-3 text-center border-t border-slate-50 bg-slate-50/30">
          <button className="text-xs text-slate-500 font-bold hover:text-blue-600 transition-colors uppercase tracking-wider">
            Xem tất cả thông báo
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
