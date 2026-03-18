import React, { useState, useEffect } from 'react';
import Toast from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { aiService } from "../../../services/aiService";

const SubAdminAIAnalysis = () => {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await aiService.getSubAdminAnalysis();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch sub-admin AI data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const financeReports = data?.financeReports || [];

  // Xuất Excel báo cáo tài chính
  const exportFinanceReport = () => {
    const reportData = [
      ['Tháng', 'Doanh thu', 'Chi phí', 'Lợi nhuận', 'Trạng thái'],
      ...financeReports.map(r => [r.month, r.revenue, r.expense, r.profit, r.status])
    ];
    const ws = XLSX.utils.aoa_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BaoCaoTaiChinh');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), 'BaoCao_TaiChinh_KhoaCNTT.xlsx');
    setToast({ message: 'Đã xuất báo cáo tài chính!', type: 'success' });
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold min-h-screen">Đang tải phân tích AI...</div>;
  if (!data) return <div className="p-8 text-center text-red-500 font-bold min-h-screen">Lỗi tải dữ liệu.</div>;

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-3xl">psychology</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight italic uppercase">Trung tâm Tham mưu & Phân tích Dữ liệu Khoa CNTT</h1>
            <p className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-widest flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              AI đang phân tích dữ liệu từ {data.overview.activeClassesCount} Chi đoàn và {data.overview.studentCount.toLocaleString()} sinh viên
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-500 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">calendar_month</span> {data.overview.month}
          </button>
        </div>
      </div>

      {/* Giữ nguyên phần Giám sát Hiệu quả Hoạt động 20 Lớp */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Class Monitoring */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-600">monitor_heart</span>
              Giám sát Hiệu quả Hoạt động 20 Lớp
            </h3>
            <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-lg">Live Updated</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            {/* Top Tier Side */}
            <div className="bg-emerald-50/30 rounded-[2rem] p-8 border border-emerald-50 space-y-6">
              <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-3 uppercase italic leading-none">
                <span className="material-symbols-outlined">workspace_premium</span>
                Nhóm Dẫn đầu (Top Tier)
              </h4>
              <div className="flex flex-wrap gap-3">
                {data.classMonitoring.topTier.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-white border border-emerald-100 rounded-xl text-xs font-bold text-slate-700 shadow-sm">{tag}</span>
                ))}
                {data.classMonitoring.topTier.length > 2 && (
                   <span className="px-4 py-2 bg-white border border-emerald-100 rounded-xl text-xs font-bold text-slate-400 shadow-sm">
                      +{data.classMonitoring.topTier.length - 2} others
                   </span>
                )}
              </div>
              <p className="text-[11px] font-bold text-emerald-600/70 italic leading-relaxed uppercase tracking-widest">Các lớp này hoàn thành 100% KPI tháng.</p>
            </div>
            {/* Needs Attention Side */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-rose-600 flex items-center gap-3 uppercase italic leading-none">
                <span className="material-symbols-outlined">warning</span>
                Cảnh báo (Needs Attention)
              </h4>
              
              {data.classMonitoring.needsAttention.map((item) => {
                if (item.type === 'engagement') {
                  return (
                    <div key={item.id} className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-4 relative overflow-hidden group">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900">Lớp {item.className}</p>
                          <p className="text-[10px] font-medium text-slate-400 leading-relaxed max-w-[180px]">{item.desc}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-rose-600 font-bold text-[10px] bg-rose-100 px-2 py-0.5 rounded leading-none italic">{item.metric}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 bg-white/60 p-2 rounded-lg border border-rose-50">
                        <span className="material-symbols-outlined text-indigo-500 text-sm">psychology</span>
                        <p className="text-[9px] font-bold text-indigo-600 italic">AI Suggestion: {item.suggestion}</p>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div key={item.id} className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100 flex justify-between items-center group">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900 uppercase italic">Lớp {item.className}</p>
                      <p className="text-[10px] font-medium text-slate-400">{item.desc}</p>
                    </div>
                    {item.action === 'send_reminder' && (
                       <button className="h-8 w-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-100 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="material-symbols-outlined text-xl">send</span>
                       </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Interests & Recommendations */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 italic">
            <span className="material-symbols-outlined text-indigo-600">query_stats</span>
            Sinh viên IT đang quan tâm gì?
          </h3>
          <div className="h-64 bg-slate-50/50 rounded-3xl border border-slate-100 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {data.studentInterests.keywords.map((kw, idx) => (
                 <span key={kw} className={`text-${idx % 2 === 0 ? '2xl' : 'lg'} font-black text-${idx % 3 === 0 ? 'blue-600' : 'slate-900'} italic tracking-tighter hover:scale-110 transition-transform cursor-pointer`}>{kw}</span>
              ))}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-12 -translate-y-1/2 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>
          <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 space-y-4 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-indigo-600 text-xl">temp_preferences_custom</span>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 italic">AI Recommendation</h4>
            </div>
            <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic" dangerouslySetInnerHTML={{__html: data.studentInterests.recommendation.replace(/"(.*?)"/g, '<span class="block text-indigo-700 font-bold text-sm mt-3 uppercase tracking-tighter italic">"$1"</span>')}} />
            <button className="w-full h-11 bg-white border border-indigo-100 rounded-xl text-[10px] font-bold text-slate-900 uppercase tracking-widest shadow-sm hover:bg-indigo-600 hover:text-white transition-all">Lên kế hoạch cho tháng sau</button>
          </div>
        </div>
      </div>

      {/* ROI Analysis Section - giữ nguyên + thêm 3 nút */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-500">payments</span>
            Hiệu quả Đầu tư Sự kiện (ROI Analysis)
          </h3>
          <button 
            onClick={() => setShowFinanceModal(true)}
            className="text-xs font-bold text-blue-600 underline underline-offset-4 decoration-2"
          >
            Xem chi tiết báo cáo tài chính
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {data.roiAnalysis.map((roi) => (
             <div key={roi.id} className="space-y-6">
                <div className={`p-3 ${roi.type === 'High Efficiency' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} text-[10px] font-bold uppercase tracking-widest rounded-lg inline-block italic`}>{roi.type}</div>
                <h4 className="text-xl font-bold text-slate-900 italic uppercase">{roi.title}</h4>
                <div className="h-1 rounded-full bg-slate-50"><div className={`h-full ${roi.type === 'High Efficiency' ? 'bg-emerald-500' : 'bg-rose-500'} rounded-full`} style={{ width: `${roi.roiPercentage}%` }}></div></div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic pt-4">
                  <span>Chi phí / người:</span>
                  <span className="text-slate-900">{roi.costPerPerson}</span>
                </div>
              </div>
          ))}
          {/* AI Strategic Card */}
          <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-full w-40 bg-white/5 translate-x-12 -rotate-12 group-hover:translate-x-0 transition-transform duration-1000"></div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-6 italic flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">auto_awesome</span> AI STRATEGIC INSIGHT
            </h4>
            <p className="text-sm font-bold italic leading-relaxed opacity-90 max-w-xs mb-8">
              "{data.strategicInsight}"
            </p>
            <button 
              onClick={() => setToast({ message: '✅ Đề xuất AI đã được áp dụng thành công!', type: 'success' })}
              className="w-full h-12 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-blue-600 transition-all shadow-xl"
            >
              Áp dụng đề xuất này
            </button>
          </div>
        </div>

        {/* 2 nút mới thêm ở cuối phần ROI */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            onClick={() => setShowPlanModal(true)}
            className="flex-1 h-12 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined">event_note</span>
            Lên kế hoạch cho tháng sau
          </button>
        </div>
      </div>

      {/* Modal Báo cáo Tài chính */}
      <Modal
        isOpen={showFinanceModal}
        onClose={() => setShowFinanceModal(false)}
        title="Báo cáo Tài chính Chi tiết"
        size="xl"
      >
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={exportFinanceReport}
              className="h-10 px-6 bg-emerald-600 text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-all"
            >
              <span className="material-symbols-outlined">download</span>
              Xuất Excel
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Tháng</th>
                  <th className="px-6 py-4 text-right font-semibold text-slate-700">Doanh thu</th>
                  <th className="px-6 py-4 text-right font-semibold text-slate-700">Chi phí</th>
                  <th className="px-6 py-4 text-right font-semibold text-slate-700">Lợi nhuận</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-700">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {financeReports.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{r.month}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">{r.revenue}</td>
                    <td className="px-6 py-4 text-right font-bold text-rose-600">{r.expense}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">{r.profit}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Modal Lên kế hoạch cho tháng sau */}
      <Modal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        title="Lên kế hoạch cho tháng sau"
        size="md"
      >
        <div className="space-y-6 p-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Thời gian kế hoạch</label>
            <input
              type="month"
              className="w-full h-12 px-5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên kế hoạch</label>
            <input
              type="text"
              placeholder="Ví dụ: Workshop GenAI & Machine Learning tháng 12"
              className="w-full h-12 px-5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mô tả chi tiết</label>
            <textarea
              placeholder="Mô tả mục tiêu, ngân sách dự kiến, nội dung chính, đối tượng tham gia..."
              className="w-full h-32 p-5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowPlanModal(false)}
              className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                setShowPlanModal(false);
                setToast({ message: 'Kế hoạch tháng sau đã được lưu thành công!', type: 'success' });
              }}
              className="flex-1 h-12 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Lưu kế hoạch
            </button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubAdminAIAnalysis;