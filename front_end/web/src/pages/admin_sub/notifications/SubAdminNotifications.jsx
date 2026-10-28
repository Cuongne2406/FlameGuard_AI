import React, { useState, useEffect } from 'react';
import { 
  Bell, BellRing, CheckCheck, Clock, RefreshCw, 
  Search, ShieldAlert, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import Toast from '../../../components/ui/Toast';
import { notificationService } from '../../../services/notificationService';

const SubAdminNotifications = () => {
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD' | 'READ'
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      setNotifications(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setToast({ message: 'Lỗi nạp thông báo: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setToast({ message: 'Đã đánh dấu là đã đọc', type: 'success' });
    } catch (err) {
      setToast({ message: 'Lỗi cập nhật: ' + err.message, type: 'error' });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setToast({ message: 'Đã đánh dấu tất cả thông báo là đã đọc', type: 'success' });
    } catch (err) {
      setToast({ message: 'Lỗi cập nhật: ' + err.message, type: 'error' });
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.is_read;
    if (filter === 'READ') return n.is_read;
    return true;
  }).filter(n => 
    (n.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.message || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell size={22} className="text-blue-600" />
            Trung tâm Thông báo & Tin nhắn Điều hành
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi thông báo từ Đoàn Trường, hệ thống kiểm duyệt và các nhắc nhở công tác cấp Khoa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-sm transition-all"
            >
              <CheckCheck size={14} className="text-blue-600" />
              Đánh dấu tất cả đã đọc
            </button>
          )}
          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold text-white shadow-sm transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {[
              { id: 'ALL', label: `Tất cả (${notifications.length})` },
              { id: 'UNREAD', label: `Chưa đọc (${unreadCount})` },
              { id: 'READ', label: 'Đã đọc' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm nội dung thông báo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Bell size={40} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold">Không có thông báo nào</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isUnread = !notif.is_read;
              return (
                <div 
                  key={notif.id}
                  className={`p-4 sm:p-5 flex items-start gap-4 transition-colors hover:bg-slate-50/70 ${
                    isUnread ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    isUnread ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isUnread ? <BellRing size={18} /> : <Bell size={18} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock size={12} />
                        {notif.created_at ? new Date(notif.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : 'Vừa xong'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {notif.message}
                    </p>

                    {isUnread && (
                      <div className="mt-2.5">
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                        >
                          <CheckCheck size={13} /> Đánh dấu đã đọc
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubAdminNotifications;
