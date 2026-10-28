import React, { useState, useEffect } from "react";
import {
  Brain,
  Activity,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Zap,
  Clock,
  ChevronDown,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { aiService } from "../../../services/aiService";

const AIIntelligence = () => {
  const [data, setData] = useState(null);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAIData = async () => {
    setLoading(true);
    try {
      const [result, auditList] = await Promise.all([
        aiService.getAdminAnalysis(),
        aiService.getAudits()
      ]);
      setData(result);
      setAudits(Array.isArray(auditList) ? auditList : []);
    } catch (error) {
      console.error("Failed to fetch admin AI analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIData();
  }, []);

  const handleUpdateAuditStatus = async (auditId, newAction) => {
    setActionLoading(auditId);
    try {
      await aiService.updateAuditAction(auditId, newAction);
      setAudits((prev) =>
        prev.map((a) => (a.id === auditId ? { ...a, action_taken: newAction } : a))
      );
    } catch (err) {
      console.error("Lỗi cập nhật kiểm duyệt:", err);
      alert("Không thể cập nhật trạng thái kiểm duyệt.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs font-medium min-h-[500px] flex flex-col items-center justify-center gap-2">
        <RefreshCw size={24} className="animate-spin text-indigo-600 mb-1" />
        <span>Đang khởi động & đồng bộ AI Intelligence Engine...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-rose-500 font-bold min-h-[400px]">
        Không thể kết nối đến máy chủ AI Analytics.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* 1. Top Enterprise Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
            <Brain size={22} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">
              Trung tâm Trí tuệ Nhân tạo & Giám sát Tự động
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Phân tích sắc thái ngôn luận, dự báo quy mô sự kiện và kiểm duyệt nội dung cộng đồng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Engine</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Hoạt động
            </span>
          </div>
          <div className="w-px h-7 bg-slate-200" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Phản hồi đã xử lý</span>
            <span className="font-bold text-slate-700">
              {data.overview?.totalFeedbacksProcessed || 15} lượt
            </span>
          </div>
          <div className="w-px h-7 bg-slate-200" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Độ tin cậy</span>
            <span className="font-bold text-indigo-600">
              {data.overview?.systemHealth || 98}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Sentiment Trends */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Activity size={16} className="text-indigo-600" />
                  Biểu đồ Sắc thái & Cảm xúc Sinh viên (7 Ngày gần nhất)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Phân tích tâm lý từ bình luận diễn đàn, mạng xã hội và cổng khảo sát
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                Toàn trường LHU
              </span>
            </div>

            {/* Sentiment Histogram Bars */}
            <div className="h-44 flex items-end justify-between px-4 relative mt-2">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 backdrop-blur-xs border border-indigo-100 px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-3">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-700">
                      Chỉ số Cảm xúc Tích cực: {data.overview?.sentimentScore || 8.6}/10
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Đoàn viên hài lòng cao với các hoạt động SV5T và tình nguyện hè
                    </p>
                  </div>
                </div>
              </div>

              {(data.overview?.sentimentHistory || []).map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group relative z-0">
                  <div className="w-2 group-hover:w-3 transition-all rounded-full bg-slate-100 h-28 relative overflow-hidden">
                    <div
                      className={`absolute bottom-0 w-full transition-all duration-700 ${
                        item.value < 0 ? "bg-rose-500" : "bg-indigo-600"
                      }`}
                      style={{ height: `${Math.min(100, Math.max(15, Math.abs(item.value)))}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${
                      item.isStrong ? "text-indigo-600 font-bold" : "text-slate-400"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Thuật toán mô hình ngôn ngữ tiếng Việt (PhoBERT + Fine-tuning)</span>
            <span className="text-indigo-600 font-semibold">Tần suất quét: 15 phút/lần</span>
          </div>
        </div>

        {/* Right Column (1/3): Auto Moderation List with Action Buttons */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <ShieldCheck size={16} className="text-indigo-600" />
                Kiểm duyệt Nội dung Tự động
              </h3>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200">
                {audits.length} Mục ghi nhận
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {audits.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Không có nội dung nào cần kiểm duyệt
                </div>
              ) : (
                audits.map((item) => {
                  const isPublished = item.action_taken === "AUTO_PUBLISHED";
                  const isHidden = item.action_taken === "AUTO_HIDDEN";
                  const isFlagged = item.action_taken === "FLAGGED_FOR_REVIEW";

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isHidden
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {isPublished
                            ? "Hiển thị"
                            : isHidden
                            ? "Đã ẩn"
                            : "Cần xem xét"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.content_type || "Bình luận"}
                        </span>
                      </div>

                      <p className="text-slate-700 leading-snug font-medium italic">
                        "{item.content_text}"
                      </p>

                      {item.reason && (
                        <p className="text-[10px] text-slate-400">
                          Lý do: {item.reason}
                        </p>
                      )}

                      {/* Action Buttons: Allow or Hide */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200/60">
                        <button
                          disabled={actionLoading === item.id || isPublished}
                          onClick={() => handleUpdateAuditStatus(item.id, "AUTO_PUBLISHED")}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            isPublished
                              ? "bg-emerald-100 text-emerald-800 cursor-default"
                              : "bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600"
                          }`}
                        >
                          <Eye size={12} />
                          Duyệt hiện
                        </button>

                        <button
                          disabled={actionLoading === item.id || isHidden}
                          onClick={() => handleUpdateAuditStatus(item.id, "AUTO_HIDDEN")}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            isHidden
                              ? "bg-rose-100 text-rose-800 cursor-default"
                              : "bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600"
                          }`}
                        >
                          <EyeOff size={12} />
                          Ẩn nội dung
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Event Prediction & Chatbot Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Attendance Forecast */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-600" />
              Dự báo Quy mô Sự kiện: {data.eventForecast?.eventName || "Ngày hội Việc làm & Chuyển đổi số"}
            </h3>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
              Độ tin cậy: 94%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Dự báo số lượng tham dự
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-slate-800">
                  {data.eventForecast?.predictedAttendance || 420}
                </span>
                <span className="text-xs text-slate-500 font-medium">người</span>
              </div>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">
                {data.eventForecast?.capacityWarning || "Khuyến nghị mở rộng thêm Hội trường phụ"}
              </p>
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-lg space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-800 font-bold text-xs">
                <Zap size={14} /> Khuyến nghị Ban Tổ chức
              </div>
              <p className="text-[11px] text-indigo-900/80 leading-relaxed">
                {data.eventForecast?.recommendation || "Nên bố trí 2 bàn check-in QR Code tại sảnh A và livestream bổ sung tại Hội trường B."}
              </p>
            </div>
          </div>
        </div>

        {/* Chatbot & Virtual Assistant Stats */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-600" />
              Trợ lý Ảo Đoàn - Hội (Chatbot Assistant)
            </h3>
            <span className="text-xs text-slate-400">Tự động trả lời 24/7</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-center">
              <div className="text-xl font-bold text-emerald-800">
                {data.chatbotStats?.answeredQuestions || 184}
              </div>
              <span className="text-[10px] font-semibold uppercase text-emerald-600">
                Câu hỏi đã giải đáp
              </span>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-center">
              <div className="text-xl font-bold text-blue-800">
                {data.chatbotStats?.timeSaved || "28.5 giờ"}
              </div>
              <span className="text-[10px] font-semibold uppercase text-blue-600">
                Tiết kiệm thời gian cán bộ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIIntelligence;
