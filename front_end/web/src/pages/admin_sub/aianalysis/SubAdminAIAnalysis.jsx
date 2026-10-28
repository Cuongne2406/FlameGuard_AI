import React, { useState, useEffect, useContext } from 'react';
import { 
  Cpu, Sparkles, TrendingUp, AlertTriangle, Send, Download, 
  MessageSquare, Users, CheckCircle2, RefreshCw, BarChart2,
  Calendar, Layers, ThumbsUp, ShieldAlert, Award
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Toast from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import { aiService } from '../../../services/aiService';
import { notificationService } from '../../../services/notificationService';
import { AuthContext } from '../../../context/AuthContext';

const SubAdminAIAnalysis = () => {
  const { user } = useContext(AuthContext);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('insights'); // 'insights' | 'feedback'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reminder Modal State
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [reminderMessage, setReminderMessage] = useState('');
  const [sendingReminder, setSendingReminder] = useState(false);

  const facultyTitle = user?.managed_org_name || 'Đoàn - Hội Khoa Công nghệ Thông tin';

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await aiService.getSubAdminAnalysis();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch AI analysis:', error);
      setToast({ message: 'Lỗi tải phân tích AI: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler: Export Strategic Report to Excel
  const exportStrategicReport = () => {
    if (!data) return;

    const topClasses = (data.classMonitoring?.topTier || []).map(c => [c, 'Xuất sắc', 'Đạt 100% chỉ tiêu']);
    const attentionClasses = (data.classMonitoring?.needsAttention || []).map(c => [c.className, 'Cần nhắc nhở', c.desc || 'Tỷ lệ tham gia thấp']);

    const matrixData = [
      ['BÁO CÁO CHIẾN LƯỢC & GIÁM SÁT CHI ĐOÀN - ' + facultyTitle],
      ['Thời điểm xuất:', new Date().toLocaleString('vi-VN')],
      ['Tổng số Chi đoàn:', data.overview?.activeClassesCount || 0],
      ['Tổng số Đoàn viên:', data.overview?.studentCount || 0],
      ['Điểm Cảm xúc / Hài lòng TB:', data.overview?.sentimentScore || 0],
      [],
      ['--- DANH SÁCH CHI ĐOÀN DẪN ĐẦU & CẦN LƯU Ý ---'],
      ['Tên Chi đoàn', 'Phân loại', 'Ghi chú / Nhận xét'],
      ...topClasses,
      ...attentionClasses,
      [],
      ['--- ĐÁNH GIÁ HIỆU QUẢ CÁC SỰ KIỆN GẦN ĐÂY ---'],
      ['Tên sự kiện', 'Mức độ hiệu quả', 'Tỷ lệ tham gia thực tế (%)'],
      ...(data.roiAnalysis || []).map(r => [r.title, r.type, `${r.roiPercentage}%`])
    ];

    const ws = XLSX.utils.aoa_to_sheet(matrixData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BaoCao_ChienLuoc');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), `BaoCao_ChienLuoc_${facultyTitle.replace(/\s+/g, '_')}.xlsx`);
    setToast({ message: 'Đã xuất báo cáo chiến lược (.xlsx) thành công!', type: 'success' });
  };

  // Handler: Open Reminder Modal
  const handleOpenReminder = (classItem) => {
    setSelectedClass(classItem);
    setReminderMessage(
      `Ban Thường vụ ${facultyTitle} nhắc nhở Chi đoàn ${classItem.className || classItem} khẩn trương hoàn thành chỉ tiêu thu nộp Đoàn phí và triển khai đăng ký phong trào tuần này.`
    );
    setShowReminderModal(true);
  };

  // Handler: Submit Reminder Notification
  const handleSendReminder = async () => {
    if (!reminderMessage.trim()) {
      setToast({ message: 'Vui lòng nhập nội dung nhắc nhở', type: 'error' });
      return;
    }

    setSendingReminder(true);
    try {
      // Send notification through system
      await notificationService.sendSystemNotification(
        user?.id || 'broadcast',
        `[Nhắc nhở] Ban Thường vụ ${facultyTitle}`,
        reminderMessage
      );
      setToast({ message: `Đã gửi nhắc nhở tới Ban Chấp Hành Chi đoàn ${selectedClass?.className || selectedClass}!`, type: 'success' });
      setShowReminderModal(false);
    } catch (err) {
      setToast({ message: 'Lỗi gửi nhắc nhở: ' + err.message, type: 'error' });
    } finally {
      setSendingReminder(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu size={22} className="text-blue-600" />
            Phân tích Dữ liệu AI & Lắng nghe Ý kiến {facultyTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp dữ liệu hoạt động thực tế, phân tích cảm xúc đoàn viên và tham mưu chỉ đạo phong trào cấp Khoa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-sm transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>
          <button
            onClick={exportStrategicReport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold text-white shadow-sm transition-all"
          >
            <Download size={14} />
            Xuất Báo cáo Chiến lược
          </button>
        </div>
      </div>

      {/* Compact Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Điểm Cảm xúc / Hài lòng</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {data?.overview?.sentimentScore || 0} <span className="text-xs font-normal text-slate-500">/ 5.0</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Chỉ số tích cực từ sinh viên
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Chi đoàn Theo dõi</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Layers size={16} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {data?.overview?.activeClassesCount || 0} <span className="text-xs font-normal text-slate-500">Chi đoàn</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Đang hoạt động trong Khoa
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Quy mô Đoàn viên</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Users size={16} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {(data?.overview?.studentCount || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">sinh viên</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Tổng đoàn viên thuộc Khoa
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Ý kiến / Phản hồi</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <MessageSquare size={16} />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {data?.overview?.totalFeedbacksProcessed || 0} <span className="text-xs font-normal text-slate-500">lượt gửi</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {data?.overview?.month || 'Học kỳ hiện tại'}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('insights')}
          className={`pb-3 text-xs font-bold tracking-tight transition-all relative flex items-center gap-2 ${
            activeTab === 'insights'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart2 size={16} />
          Tham mưu Chiến lược & Giám sát Chi đoàn
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`pb-3 text-xs font-bold tracking-tight transition-all relative flex items-center gap-2 ${
            activeTab === 'feedback'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare size={16} />
          Lắng nghe Ý kiến & Phản hồi Sinh viên
        </button>
      </div>

      {/* Tab 1: Strategic Insights & Monitoring */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7/12: Class Performance Monitoring */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award size={16} className="text-blue-600" />
                  Giám sát Hoạt động các Chi đoàn trong Khoa
                </h3>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">
                  Dữ liệu thực DB
                </span>
              </div>

              {/* Top Tier */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Nhóm Chi đoàn Dẫn đầu (Top Tier)
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700">100% Hoàn thành KPI</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(data?.classMonitoring?.topTier || []).map((className) => (
                    <span 
                      key={className} 
                      className="px-2.5 py-1 bg-white border border-emerald-200 rounded-lg text-xs font-semibold text-slate-700 shadow-sm"
                    >
                      {className}
                    </span>
                  ))}
                </div>
              </div>

              {/* Needs Attention */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-500" /> Cảnh báo & Đề xuất hành động
                </h4>

                {(data?.classMonitoring?.needsAttention || []).length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                    Tất cả các Chi đoàn trong Khoa hiện đang duy trì tiến độ hoạt động tốt.
                  </div>
                ) : (
                  (data.classMonitoring.needsAttention || []).map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl flex items-center justify-between gap-3 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 text-xs">{item.className}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                      <button
                        onClick={() => handleOpenReminder(item)}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-blue-300 text-blue-600 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1 transition-all"
                      >
                        <Send size={12} /> Gửi nhắc nhở
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right 5/12: Student Interests & AI Recommendations */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-600" />
                  Xu hướng Quan tâm của Sinh viên
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {data?.studentInterests?.recommendation || 'Hệ thống đang tổng hợp dữ liệu tham gia sự kiện và đăng ký câu lạc bộ của sinh viên.'}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(data?.studentInterests?.keywords || []).map((kw, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-semibold"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strategic Insight Box */}
              <div className="p-4 bg-slate-900 text-white rounded-xl shadow-sm space-y-2">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu size={14} /> Gợi ý Chỉ đạo từ Hệ thống
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {data?.strategicInsight || 'Đẩy mạnh phong trào học thuật gắn với nghiên cứu khoa học và chuẩn đầu ra kỹ năng mềm cho đoàn viên sinh viên.'}
                </p>
              </div>
            </div>
          </div>

          {/* ROI & Event Effectiveness Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-600" />
              Đánh giá Hiệu quả Tổ chức Sự kiện gần đây
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-2.5 px-4">Tên Sự kiện</th>
                    <th className="py-2.5 px-4">Đánh giá Hiệu quả</th>
                    <th className="py-2.5 px-4">Tỷ lệ Tham gia</th>
                    <th className="py-2.5 px-4 text-right">Chi phí / SV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {(data?.roiAnalysis || []).length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-400">
                        Chưa có dữ liệu sự kiện hoàn tất để đánh giá hiệu quả
                      </td>
                    </tr>
                  ) : (
                    (data?.roiAnalysis || []).map((roi) => (
                      <tr key={roi.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-slate-900">{roi.title}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                            roi.type === 'High Efficiency'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {roi.type === 'High Efficiency' ? 'Hiệu quả cao' : 'Bình thường'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">{roi.roiPercentage}%</td>
                        <td className="py-3 px-4 text-right text-slate-500">{roi.costPerPerson || 'N/A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Feedback & Voice of Students */}
      {activeTab === 'feedback' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare size={16} className="text-blue-600" />
                Lắng nghe Ý kiến & Góp ý của Sinh viên
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tổng hợp phản hồi ẩn danh từ sinh viên các Chi đoàn trong Khoa qua khảo sát sự kiện và cổng góp ý.
              </p>
            </div>
          </div>

          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-slate-500 space-y-2">
            <ThumbsUp size={32} className="mx-auto text-blue-500/70" />
            <p className="text-xs font-semibold text-slate-800">
              Điểm số Cảm xúc Đoàn viên Khoa đạt mức {data?.overview?.sentimentScore || 0} / 5.0
            </p>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              Chưa phát hiện nguy cơ khiếu nại hoặc bất bình đẳng trong công tác phong trào tháng này.
            </p>
          </div>
        </div>
      )}

      {/* Modal: Send Reminder */}
      <Modal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        title="Gửi Thông Báo / Nhắc Nhở Tới Chi Đoàn"
        size="md"
      >
        <div className="space-y-4 py-2 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Đơn vị nhận</span>
            <span className="font-bold text-slate-900 text-sm">
              Ban Chấp Hành Chi đoàn {selectedClass?.className || selectedClass}
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold block">Nội dung nhắc nhở</label>
            <textarea
              rows="4"
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-blue-500 resize-none font-medium leading-relaxed"
            />
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-200">
            <button
              onClick={() => setShowReminderModal(false)}
              className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold"
            >
              Hủy
            </button>
            <button
              onClick={handleSendReminder}
              disabled={sendingReminder}
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm flex items-center justify-center gap-1.5"
            >
              <Send size={13} />
              {sendingReminder ? 'Đang gửi...' : 'Gửi Nhắc Nhở'}
            </button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SubAdminAIAnalysis;