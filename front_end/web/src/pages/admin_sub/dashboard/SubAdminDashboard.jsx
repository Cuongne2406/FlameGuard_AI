import React, { useState } from 'react';
import Toast from '../../../components/ui/Toast';

const SubAdminDashboard = () => {
  const [toast, setToast] = useState(null);

  const stats = [
    { label: 'Tổng Chi Đoàn', val: '20 Lớp', sub: '100% đã có BCH', icon: 'groups', color: 'blue' },
    { label: 'Tổng Sinh viên', val: '1,500', sub: 'Active App: 99%', icon: 'school', color: 'blue' },
    { label: 'Quỹ Khoa hiện tại', val: '50.000.000', unit: 'VNĐ', sub: 'Thu đủ 95% Đoàn phí', icon: 'account_balance_wallet', color: 'emerald' },
    { label: 'Chi tiêu năm', val: 'Đạt 85%', sub: 'Tiến độ tốt', icon: 'trending_up', color: 'orange' },
  ];

  const activities = [
    { id: '23CT112', name: 'Chi đoàn 23CT112', year: 'Khóa 2023 - CNTT', leader: 'Nguyễn Văn A', fee: '100% (Đã nộp đủ)', status: 'Excellent', statusColor: 'emerald' },
    { id: '23CT113', name: 'Chi đoàn 23CT113', year: 'Khóa 2023 - CNTT', leader: 'Trần Thị B', fee: 'Missing: Báo cáo tháng 10', status: 'Warning', statusColor: 'orange', alert: 'Gửi nhắc nhở ngay' },
  ];

  const handleAction = (msg) => {
    setToast({ message: msg, type: 'success' });
  };

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-3xl">school</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Ban Chấp Hành Đoàn - Hội Khoa CNTT</h1>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Dashboard Điều Hành & Giám Sát</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none focus:ring-2 ring-blue-500/10">
            <option>Năm học 2025-2026</option>
          </select>
          <select className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none focus:ring-2 ring-blue-500/10">
            <option>Học kỳ 1</option>
          </select>
          <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center relative cursor-pointer">
            <span className="material-symbols-outlined text-slate-400">notifications</span>
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white"></span>
          </div>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-44 relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
              <div className={`h-10 w-10 rounded-xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center shrink-0`}>
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900 tracking-tighter">{s.val}</span>
                {s.unit && <span className="text-xs font-bold text-slate-400">{s.unit}</span>}
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-${s.color === 'orange' ? 'emerald' : s.color}-50 text-${s.color === 'orange' ? 'emerald' : s.color}-600 text-[10px] font-bold`}>
                {s.color !== 'orange' && <span className="material-symbols-outlined text-sm">check_circle</span>}
                {s.color === 'orange' && <span className="material-symbols-outlined text-sm">trending_up</span>}
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monitoring Section */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-600">analytics</span>
            Theo dõi Hoạt động các Chi Đoàn (Live)
          </h3>
          <div className="flex items-center gap-3">
            <button className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-500 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">tune</span> Bộ lọc
            </button>
            <button onClick={() => handleAction('Đã chuẩn bị báo cáo Export!')} className="h-10 px-5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-100">
              <span className="material-symbols-outlined text-xl">download</span> Xuất báo cáo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activities.map((a) => (
            <div key={a.id} className={`p-8 rounded-[2rem] border transition-all relative group ${a.status === 'Warning' ? 'border-orange-200 ring-2 ring-orange-500/10' : 'border-slate-100 hover:bg-slate-50'}`}>
              {a.status === 'Warning' && <div className="absolute left-0 top-0 h-full w-1.5 bg-orange-500 rounded-l-[2rem]"></div>}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-5">
                  <div className={`h-14 w-14 rounded-2xl ${a.status === 'Excellent' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'} flex items-center justify-center text-xl font-bold`}>
                    {a.id.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{a.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{a.year}</p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${a.status === 'Excellent' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse"></span>
                  {a.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Bí thư</p>
                  <p className="text-sm font-bold text-slate-700 mt-2">{a.leader}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Đoàn phí</p>
                  <p className={`text-sm font-bold mt-2 ${a.status === 'Excellent' ? 'text-emerald-500' : 'text-slate-400'}`}>{a.fee}</p>
                </div>
              </div>

              {a.alert && (
                <div className="mt-6 p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                  <div className="flex items-center gap-3 text-rose-600 mb-2">
                    <span className="material-symbols-outlined text-lg">error</span>
                    <p className="text-xs font-bold uppercase tracking-widest">Missing: Báo cáo tháng 10</p>
                  </div>
                  <button className="text-[11px] font-bold text-blue-600 underline ml-8 decoration-2 underline-offset-4">{a.alert}</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Events */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-600">event_note</span>
            Tiến độ Sự kiện Chuyên môn & Phong trào
          </h3>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-sm font-bold text-slate-700">Hội thảo AI & Big Data</p>
                <p className="text-xs font-bold text-blue-600">60%</p>
              </div>
              <div className="h-2 rounded-full bg-slate-50"><div className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }}></div></div>
              <p className="text-[10px] font-medium text-slate-400 leading-none">Đang trong giai đoạn chuẩn bị diễn giả</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-50 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">Giải bóng đá Khoa CNTT</p>
                <p className="text-[10px] text-slate-400 font-medium">Khởi tranh: 15/11/2025</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">Upcoming</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-50 flex items-center justify-between opacity-60">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">Tiếp sức mùa thi 2025</p>
                <p className="text-[10px] text-slate-400 font-medium">Đã hoàn thành xuất sắc</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">Completed</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Approvals */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 text-nowrap">
              <span className="material-symbols-outlined text-orange-500">bolt</span>
              Cần Duyệt Gấp <span className="h-6 w-6 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">3</span>
            </h3>
            <button className="text-xs font-bold text-blue-600 underline underline-offset-4 decoration-2">Xem tất cả</button>
          </div>

          <div className="space-y-4">
            {[
              { icon: 'payments', color: 'rose', title: 'Lớp 22CT111 xin rút quỹ', sub: 'Số tiền: 2.000.000 VNĐ' },
              { icon: 'domain', color: 'indigo', title: 'CLB Robot xin mượn phòng Lab', sub: 'Địa điểm: Phòng C.302' },
              { icon: 'description', color: 'blue', title: 'Danh sách Đoàn viên ưu tú', sub: 'DS_DoanVien.pdf', isFile: true },
            ].map((app, i) => (
              <div key={i} className="p-6 rounded-3xl border border-slate-50 bg-slate-50/30 flex items-center justify-between hover:bg-white hover:shadow-xl hover:border-slate-100 transition-all group">
                <div className="flex items-center gap-5">
                  <div className={`h-12 w-12 rounded-2xl bg-${app.color}-50 text-${app.color}-600 flex items-center justify-center shrink-0 overflow-hidden`}>
                    <span className="material-symbols-outlined text-2xl leading-none">{app.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{app.title}</p>
                    {app.isFile ? (
                      <div className="flex items-center gap-1.5 text-blue-600 text-[11px] font-bold underline mt-1 cursor-pointer">
                        <span className="material-symbols-outlined text-sm">attachment</span> {app.sub}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{app.sub}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleAction('Đã phê duyệt thành công!')} className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center border border-emerald-100">
                    <span className="material-symbols-outlined">check</span>
                  </button>
                  <button className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center border border-rose-100">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubAdminDashboard;
