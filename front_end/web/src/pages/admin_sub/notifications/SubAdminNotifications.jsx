import React, { useState, useEffect } from 'react';
import Toast from '../../../components/ui/Toast';
import { aiService } from '../../../services/aiService';
import { notificationService } from '../../../services/notificationService';

const SubAdminNotifications = () => {
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('All');
  const [data, setData] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [aiRes, notifRes] = await Promise.all([
          aiService.getSubAdminAnalysis(),
          notificationService.getNotifications()
        ]);
        setData(aiRes);
        setNotifications(notifRes || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleNewNotification = (event) => {
      const newNotif = event.detail;
      setNotifications((prev) => [newNotif, ...prev]);
    };

    window.addEventListener("newNotification", handleNewNotification);
    return () => {
      window.removeEventListener("newNotification", handleNewNotification);
    };
  }, []);

  // For demonstration, use autoModeration items from Admin Analysis as feedbacks
  // if not available, default to empty array
  const feedbacks = data?.autoModeration || [];

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
      {/* Header */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            <span>Hệ thống</span>
            <span>/</span>
            <span className="text-blue-600 underline">Lắng nghe ý kiến</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trung tâm Phản hồi & Lắng nghe Ý kiến</h1>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm shrink-0">
          {['All', 'Critical', 'Positive'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`h-10 px-6 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
              {f === 'All' ? 'Tất cả' : f === 'Critical' ? 'Cần xử lý' : 'Tích cực'}
            </button>
          ))}
        </div>
      </header>

      {/* AI Sentiment Analysis Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Chỉ số Hài lòng</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-5xl font-bold text-slate-900 tracking-tighter">4.8</span>
            <span className="text-sm font-bold text-slate-300">/ 5.0</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-50 overflow-hidden shadow-inner ring-4 ring-slate-50/50">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '96%' }} />
          </div>
          <p className="text-[10px] font-bold text-emerald-600 mt-6 flex items-center gap-2 uppercase tracking-widest italic">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            +3.2% so với quý trước
          </p>
        </article>

        <article className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 text-center text-nowrap">Phân bố cảm xúc (AI)</p>
          <div className="space-y-5">
            {[
              { label: 'Tích cực', val: 85, color: 'emerald' },
              { label: 'Trung lập', val: 10, color: 'blue' },
              { label: 'Tiêu cực', val: 5, color: 'rose' },
            ].map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400"><span>{s.label}</span><span>{s.val}%</span></div>
                <div className="h-1.5 rounded-full bg-slate-50 overflow-hidden"><div className={`h-full bg-${s.color}-500 rounded-full transition-all duration-1000`} style={{ width: `${s.val}%` }} /></div>
              </div>
            ))}
          </div>
        </article>

        <article className="bg-[#1e293b] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border-2 border-slate-800">
          <div className="absolute top-0 right-0 h-full w-32 bg-white/5 rounded-l-full translate-x-12 group-hover:translate-x-0 transition-transform duration-700"></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="material-symbols-outlined">psychology</span>
              AI Strategic Insight
            </h3>
            <p className="text-xs font-medium text-slate-300 leading-relaxed italic">
              "Sinh viên đặc biệt đánh giá cao các workshop có yếu tố AI thực chiến. Tuy nhiên, hạ tầng Wifi hội trường cần được tối ưu để đảm bảo flow check-in mượt mà."
            </p>
            <button className="w-full h-12 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">Tải báo cáo chiến lược</button>
          </div>
        </article>
      </section>

      {/* Feedbacks List */}
      <section className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="px-10 py-6 border-b border-slate-50 bg-slate-50/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest italic">Dòng thời gian phản hồi</h3>
          <div className="flex items-center gap-4">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</span>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {notifications.length > 0 ? notifications.map((n, i) => {
            const isRead = n.is_read;
            
            return (
            <div key={n.id || i} className={`p-8 hover:bg-slate-50/50 transition-all flex flex-col md:flex-row gap-8 group ${!isRead ? 'bg-blue-50/20' : ''}`}>
              <div className={`h-16 w-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${!isRead ? 'text-blue-600' : 'text-slate-400'}`}>
                <span className="material-symbols-outlined text-3xl">{!isRead ? 'notifications_active' : 'notifications'}</span>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{n.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Hệ thống • {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!isRead && (
                    <span className="px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                      Mới
                    </span>
                  )}
                </div>
                <div className="p-6 rounded-[2rem] border bg-white border-slate-100 shadow-sm">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">{n.message}</p>
                </div>
                {!isRead && (
                  <button 
                    onClick={async () => {
                      await notificationService.markAsRead(n.id);
                      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, is_read: true } : item));
                    }}
                    className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
            </div>
          )}) : (
             <div className="p-20 text-center text-slate-400">
               <span className="material-symbols-outlined text-5xl block mb-4">mail_outline</span>
               <p className="font-bold uppercase tracking-widest text-xs">Không có thông báo mới</p>
             </div>
          )}
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubAdminNotifications;
