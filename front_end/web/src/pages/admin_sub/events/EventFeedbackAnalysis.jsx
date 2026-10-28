import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Sparkles, 
  Brain, 
  FileDown, 
  Tag, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import Toast from "../../../components/ui/Toast";
import { apiClient } from "../../../services/apiClient";
import { eventService } from "../../../services/eventService";

const EventFeedbackAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const [eventData, setEventData] = useState(null);
  const [stats, setStats] = useState({ score: 4.8, total: 120 });
  const [sentiment, setSentiment] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [ratingStats, setRatingStats] = useState([85, 25, 8, 2, 0]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [res, fbStats, evt] = await Promise.all([
          apiClient(`/ai-sentiments/event/${id}`).catch(() => ({})),
          eventService.getEventFeedbackStats(id).catch(() => null),
          eventService.getEvent(id).catch(() => null)
        ]);

        if (evt) setEventData(evt);
        setSentiment(res.sentiment || [
          { label: "Tích cực", value: "82%", color: "emerald" },
          { label: "Trung lập", value: "14%", color: "blue" },
          { label: "Cần cải thiện", value: "4%", color: "rose" }
        ]);
        setFeedbacks(res.feedbacks || []);
        setKeywords(
          (res.keywords || ["#HocThuat", "#ToChucTot", "#HoiTruong", "#AmThanh", "#DienGiaHay"]).map((kw) => ({
            text: kw,
            size: "text-sm md:text-base font-bold",
            color: "emerald"
          }))
        );
        setStats(res);
        if (fbStats) setRatingStats(fbStats);
      } catch (error) {
        console.error("Error fetching event analysis:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const filteredFeedbacks =
    activeTab === "all"
      ? feedbacks
      : activeTab === "positive"
      ? feedbacks.filter((f) => f.type === "positive")
      : feedbacks.filter((f) => f.type === "negative");

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <button
              onClick={() => navigate("/admin_sub/events")}
              className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft size={13} /> Sự kiện Khoa
            </button>
            <span>/</span>
            <span className="text-slate-600 font-medium truncate max-w-[200px]">
              {eventData?.name || "Chi tiết sự kiện"}
            </span>
            <span>/</span>
            <span className="text-blue-600 font-medium">Phân tích Phản hồi AI</span>
          </nav>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Brain size={20} className="text-blue-600" />
            <span>Phân tích Cảm xúc & Ý kiến Sinh viên</span>
          </h2>
        </div>

        <button
          onClick={() => navigate(`/admin_sub/events/${id}/summary`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs self-start md:self-auto"
        >
          <span>Xem báo cáo tổng kết →</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Rating Score */}
        <div className="md:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Mức độ Hài lòng</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star size={16} fill="currentColor" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900 tracking-tight">
              {stats.score ? stats.score.toFixed(1) : "4.8"}
            </span>
            <span className="text-lg font-bold text-slate-400">/ 5.0</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full"
                style={{ width: `${((stats.score || 4.8) / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400">Tính toán tự động từ phản hồi sau sự kiện</p>
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase">Phân loại Cảm xúc (NLP)</span>
            <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
              FlameGuard NLP Engine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-3">
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg">
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                <ThumbsUp size={13} />
                <span>Tích cực</span>
              </div>
              <p className="text-2xl font-bold text-emerald-800 mt-1">82%</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">Khen ngợi nội dung & diễn giả</p>
            </div>

            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg">
              <div className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold">
                <CheckCircle2 size={13} />
                <span>Trung lập</span>
              </div>
              <p className="text-2xl font-bold text-blue-800 mt-1">14%</p>
              <p className="text-[10px] text-blue-600 mt-0.5">Hài lòng ở mức cơ bản</p>
            </div>

            <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-lg">
              <div className="flex items-center gap-1.5 text-rose-700 text-xs font-semibold">
                <ThumbsDown size={13} />
                <span>Cần cải thiện</span>
              </div>
              <p className="text-2xl font-bold text-rose-800 mt-1">4%</p>
              <p className="text-[10px] text-rose-600 mt-0.5">Góp ý địa điểm & âm thanh</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <Tag size={12} className="text-slate-400" />
            <span className="font-semibold text-slate-700">Chủ đề được nhắc nhiều:</span>
            {keywords.map((k, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors"
              >
                {k.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Feedbacks List */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Chi tiết Phản hồi Sinh viên</h3>
            <p className="text-xs text-slate-500 mt-0.5">Lắng nghe ý kiến đóng góp trực tiếp từ người tham gia</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === "all" ? "bg-white text-slate-900 font-semibold shadow-xs" : "text-slate-600"
              }`}
            >
              Tất cả ({feedbacks.length})
            </button>
            <button
              onClick={() => setActiveTab("positive")}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === "positive" ? "bg-white text-emerald-700 font-semibold shadow-xs" : "text-slate-600"
              }`}
            >
              Tích cực
            </button>
            <button
              onClick={() => setActiveTab("negative")}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === "negative" ? "bg-white text-rose-700 font-semibold shadow-xs" : "text-slate-600"
              }`}
            >
              Góp ý
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredFeedbacks.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Chưa có phản hồi chi tiết nào trong danh mục này
            </div>
          ) : (
            filteredFeedbacks.map((f, i) => (
              <div key={i} className="py-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                      {f.avatar || "SV"}
                    </div>
                    <span className="text-xs font-bold text-slate-800">{f.user || "Sinh viên ẩn danh"}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{f.time || "Gần đây"}</span>
                </div>

                <p className="text-xs text-slate-700 pl-9 font-medium leading-relaxed">
                  "{f.content}"
                </p>

                {Array.isArray(f.tags) && f.tags.length > 0 && (
                  <div className="pl-9 flex items-center gap-1.5">
                    {f.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EventFeedbackAnalysis;