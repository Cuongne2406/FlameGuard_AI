import React, { useState, useEffect } from 'react';
import { systemService } from '../../../services/systemService';
import Toast from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import NotificationBell from '../../../components/common/NotificationBell';

const SubAdminDashboard = () => {
  const [toast, setToast] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await systemService.getSystemDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching sub admin dashboard', err);
      }
    };
    fetchData();
  }, []);

  // Dữ liệu giả lập (sau này fetch API)
  const [pendingApprovals, setPendingApprovals] = useState([]);

  // Export Excel
  const exportReport = () => {
    const worksheetData = [
      ['STT', 'Yêu cầu', 'Chi tiết', 'Trạng thái'],
      ...pendingApprovals.map((item, idx) => [idx + 1, item.title, item.sub, 'Chờ duyệt']),
    ];
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách chờ duyệt');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'BaoCao_CanDuyetGap.xlsx');
    setToast({ message: 'Đã xuất và tải file Excel!', type: 'success' });
  };

  const handleApprove = (id) => {
    setPendingApprovals((prev) => prev.filter((item) => item.id !== id));
    setToast({ message: '✅ Đã duyệt yêu cầu!', type: 'success' });
  };

  const handleReject = (id) => {
    setPendingApprovals((prev) => prev.filter((item) => item.id !== id));
    setToast({ message: '❌ Đã hủy yêu cầu!', type: 'error' });
  };

  // Stats cards - lấy từ systemService nếu có
  const stats = [
    { label: 'Tổng Chi Đoàn', val: dashboardData?.stats?.totalMembers?.split(',')[0] || '0', sub: '100% đã có BCH', icon: 'groups', color: 'blue', unit: 'Lớp' },
    { label: 'Tổng Sinh viên', val: dashboardData?.stats?.totalMembers?.replace(',','') || '0', sub: 'Active App: 99%', icon: 'school', color: 'blue' },
    { label: 'Quỹ Khoa hiện tại', val: dashboardData?.stats?.totalBudgetStr?.split(' ')[0] || '0', unit: 'Triệu VNĐ', sub: 'Thu đủ 95% Đoàn phí', icon: 'account_balance_wallet', color: 'emerald' },
    { label: 'Chi tiêu năm', val: `Đạt ${100 - (dashboardData?.stats?.budgetLeftPercent || 100)}%`, sub: 'Tiến độ tốt', icon: 'trending_up', color: 'orange' },
  ];

  // Activities cho Monitoring
  const activities = [];

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen space-y-6 md:space-y-8 font-sans">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-3xl">school</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Ban Chấp Hành Đoàn - Hội Khoa CNTT</h1>
            <p className="text-xs md:text-sm font-medium text-slate-400 mt-0.5">Dashboard Điều Hành & Giám Sát</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs md:text-sm font-bold text-slate-600 outline-none focus:ring-2 ring-blue-500/10">
            <option>Năm học 2025-2026</option>
          </select>
          <select className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs md:text-sm font-bold text-slate-600 outline-none focus:ring-2 ring-blue-500/10">
            <option>Học kỳ 1</option>
          </select>

          {/* Chuông thông báo thật - chỉ load khi bấm */}
          <NotificationBell />
        </div>
      </header>

      {/* Stats Row - size chữ cân đối */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`bg-white border border-slate-100 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm flex flex-col justify-between h-44 md:h-52 relative overflow-hidden group hover:shadow-md transition-all`}
          >
            <div className="flex justify-between items-start">
              <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
              <div className={`h-10 md:h-12 w-10 md:w-12 rounded-xl md:rounded-2xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center shrink-0`}>
                <span className="material-symbols-outlined text-2xl md:text-3xl">{s.icon}</span>
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-baseline gap-1 md:gap-2">
                <span className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{s.val}</span>
                {s.unit && <span className="text-lg md:text-xl font-bold text-slate-500">{s.unit}</span>}
              </div>
              <div className={`inline-flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-${s.color}-50 text-${s.color}-700 text-xs md:text-sm font-semibold`}>
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monitoring Section */}
      <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-600 text-xl md:text-2xl">analytics</span>
            Theo dõi Hoạt động các Chi Đoàn (Live)
          </h3>
          <button
            onClick={exportReport}
            className="h-10 md:h-11 px-5 md:px-6 rounded-xl bg-blue-600 text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
          >
            <span className="material-symbols-outlined text-lg md:text-xl">download</span>
            Xuất báo cáo
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activities.map((a) => (
            <div
              key={a.id}
              className={`p-6 md:p-8 rounded-2xl md:rounded-[2rem] border transition-all relative group ${a.status === 'Warning' ? 'border-orange-200 ring-1 ring-orange-500/10' : 'border-slate-100 hover:bg-slate-50'}`}
            >
              {a.status === 'Warning' && <div className="absolute left-0 top-0 h-full w-1 md:w-1.5 bg-orange-500 rounded-l-2xl md:rounded-l-[2rem]"></div>}
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className={`h-12 md:h-14 w-12 md:w-14 rounded-xl md:rounded-2xl ${a.status === 'Excellent' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'} flex items-center justify-center text-lg md:text-xl font-bold`}>
                    {a.id.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-base md:text-lg font-bold text-slate-900">{a.name}</h4>
                    <p className="text-xs md:text-sm text-slate-400 font-medium">{a.year}</p>
                  </div>
                </div>
                <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 md:gap-2 ${a.status === 'Excellent' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse"></span>
                  {a.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6 pt-4 md:pt-6 border-t border-slate-50">
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Bí thư</p>
                  <p className="text-sm md:text-base font-bold text-slate-700 mt-1 md:mt-2">{a.leader}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Đoàn phí</p>
                  <p className={`text-sm md:text-base font-bold mt-1 md:mt-2 ${a.status === 'Excellent' ? 'text-emerald-500' : 'text-slate-400'}`}>{a.fee}</p>
                </div>
              </div>

              {a.alert && (
                <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                  <div className="flex items-center gap-2 md:gap-3 text-rose-600 mb-1 md:mb-2">
                    <span className="material-symbols-outlined text-base md:text-lg">error</span>
                    <p className="text-xs md:text-sm font-bold uppercase tracking-widest">Missing: Báo cáo tháng 10</p>
                  </div>
                  <button className="text-[10px] md:text-xs font-bold text-blue-600 underline ml-6 md:ml-8 decoration-2 underline-offset-4">Gửi nhắc nhở ngay</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid - responsive tốt hơn */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left: Tiến độ Sự kiện */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-6 md:space-y-8">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-600 text-xl md:text-2xl">event_note</span>
            Tiến độ Sự kiện Chuyên môn & Phong trào
          </h3>
          <div className="space-y-6 md:space-y-8">
            {dashboardData?.timelines?.length > 0 ? dashboardData.timelines.map((event, idx) => (
               <div key={idx} className={`p-4 md:p-5 rounded-xl md:rounded-2xl border ${event.status === 'Hoàn thành' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900 opacity-70' : 'bg-blue-50/50 border-blue-100 text-blue-900'} flex items-center justify-between`}>
                 <div className="space-y-1">
                   <p className="text-sm md:text-base font-bold">{event.label}</p>
                   <p className="text-xs md:text-sm font-medium opacity-80">{event.date}</p>
                 </div>
                 <span className={`px-3 py-1 rounded-lg text-xs md:text-sm font-bold uppercase tracking-widest ${event.status === 'Hoàn thành' ? 'bg-emerald-100/50 text-emerald-700' : 'bg-blue-100/50 text-blue-700'}`}>
                   {event.status || 'Upcoming'}
                 </span>
               </div>
            )) : (
              <p className="text-slate-400 text-sm">Chưa có sự kiện nào trong hệ thống</p>
            )}
          </div>
        </div>

        {/* Right: Cần duyệt gấp */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-3">
              <span className="material-symbols-outlined text-orange-500 text-xl md:text-2xl">bolt</span>
              Cần Duyệt Gấp
              <span className={`h-6 md:h-7 w-6 md:w-7 rounded-full text-white text-xs md:text-sm flex items-center justify-center font-bold ${pendingApprovals.length === 0 ? 'bg-gray-400' : 'bg-rose-500'}`}>
                {pendingApprovals.length}
              </span>
            </h3>
            {pendingApprovals.length > 0 && (
              <button
                onClick={() => setShowApprovalModal(true)}
                className="text-sm font-bold text-blue-600 underline underline-offset-4 decoration-2 hover:text-blue-800"
              >
                Xem tất cả
              </button>
            )}
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <span className="material-symbols-outlined text-6xl md:text-7xl text-slate-300 block mb-4">task_alt</span>
              <p className="text-base md:text-lg font-medium text-slate-500 italic">Hiện không có yêu cầu nào cần duyệt gấp 🎉</p>
              <p className="text-xs md:text-sm text-slate-400 mt-2">Bạn đã xử lý hết công việc xuất sắc!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((app) => (
                <div
                  key={app.id}
                  className="p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-50 bg-slate-50/30 flex items-center justify-between hover:bg-white hover:shadow-md hover:border-slate-100 transition-all group"
                >
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className={`h-10 md:h-12 w-10 md:w-12 rounded-xl md:rounded-2xl bg-${app.color}-50 text-${app.color}-600 flex items-center justify-center shrink-0 overflow-hidden`}>
                      <span className="material-symbols-outlined text-xl md:text-2xl leading-none">{app.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-bold text-slate-900">{app.title}</p>
                      {app.isFile ? (
                        <div className="flex items-center gap-1.5 text-blue-600 text-xs md:text-sm font-bold underline mt-1 cursor-pointer">
                          <span className="material-symbols-outlined text-sm md:text-base">attachment</span> {app.sub}
                        </div>
                      ) : (
                        <p className="text-xs md:text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">{app.sub}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal duyệt */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title="Danh sách cần duyệt gấp"
        size="lg"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2 md:p-4">
          {pendingApprovals.length === 0 ? (
            <p className="text-center text-slate-500 py-10 md:py-16 text-base md:text-lg italic">Hiện không có yêu cầu nào cần duyệt 🎉</p>
          ) : (
            pendingApprovals.map((app) => (
              <div
                key={app.id}
                className="p-5 md:p-6 rounded-2xl border border-slate-100 bg-white flex items-center justify-between hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 md:gap-5">
                  <div className={`h-12 md:h-14 w-12 md:w-14 rounded-xl md:rounded-2xl bg-${app.color}-50 text-${app.color}-600 flex items-center justify-center text-xl md:text-2xl`}>
                    <span className="material-symbols-outlined">{app.icon}</span>
                  </div>
                  <div>
                    <p className="text-base md:text-lg font-bold text-slate-900">{app.title}</p>
                    <p className="text-sm md:text-base text-slate-500 mt-1">{app.sub}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="h-10 md:h-12 w-10 md:w-12 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white transition flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-xl md:text-2xl">check</span>
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                    className="h-10 md:h-12 w-10 md:w-12 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white transition flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-xl md:text-2xl">close</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={toast.duration || 3000}
        />
      )}
    </div>
  );
};

export default SubAdminDashboard;