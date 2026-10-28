import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  QrCode, 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Send, 
  X, 
  BarChart2, 
  Pause, 
  Play, 
  ArrowLeft,
  Trophy
} from "lucide-react";
import Toast from "../../../components/ui/Toast";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { eventService } from "../../../services/eventService";

const EventLiveReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("qa");
  const [checkinPaused, setCheckinPaused] = useState(false);

  const [eventData, setEventData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [qaList, setQaList] = useState([]);
  const [incidentList, setIncidentList] = useState([]);
  const [classRankings, setClassRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Q&A Answer Modal (replacing prompt)
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQa, setSelectedQa] = useState(null);
  const [answerInput, setAnswerInput] = useState("");

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [evt, regs, qas, incs, liveStats] = await Promise.all([
        eventService.getEvent(id),
        eventService.getEventRegistrations(id),
        eventService.getEventQA(id),
        eventService.getEventIncidents(id),
        eventService.getEventLiveStats(id).catch(() => null)
      ]);

      setEventData(evt);
      setRegistrations(Array.isArray(regs) ? regs : []);
      setQaList(Array.isArray(qas) ? qas : []);
      setIncidentList(Array.isArray(incs) ? incs : []);

      if (liveStats && liveStats.class_rankings && liveStats.class_rankings.length > 0) {
        setClassRankings(liveStats.class_rankings);
      } else {
        // Fallback rankings calculated from real registrations
        const classMap = {};
        (Array.isArray(regs) ? regs : []).forEach((r) => {
          const cName = r.class_name || "Khoa CNTT";
          if (!classMap[cName]) classMap[cName] = { name: cName, total: 0, attended: 0 };
          classMap[cName].total += 1;
          if (r.status === "ATTENDED") classMap[cName].attended += 1;
        });

        const computed = Object.values(classMap).map((c, i) => ({
          rank: i + 1,
          name: c.name,
          percent: c.total > 0 ? Math.round((c.attended / c.total) * 100) : 0,
          attended: c.attended,
          total: c.total
        }));
        setClassRankings(computed);
      }
    } catch (err) {
      console.error("Failed to fetch live report data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReportData();
      const interval = setInterval(fetchReportData, 30000);
      return () => clearInterval(interval);
    }
  }, [id]);

  const checkedInCount = registrations.filter((r) => r.status === "ATTENDED").length;
  const totalRegCount = registrations.length || 1;
  const checkinPercent = ((checkedInCount / totalRegCount) * 100).toFixed(1);

  const handlePauseCheckin = () => {
    setCheckinPaused(!checkinPaused);
    setToast({
      message: checkinPaused ? "Đã tiếp tục phiên check-in trực tiếp" : "Đã tạm dừng phiên check-in trực tiếp",
      type: "info"
    });
  };

  const openAnswerModal = (qa) => {
    setSelectedQa(qa);
    setAnswerInput(qa.answer || "");
    setShowAnswerModal(true);
  };

  const handleSendAnswer = async () => {
    if (!selectedQa || !answerInput.trim()) return;
    try {
      await eventService.answerQA(selectedQa.id, answerInput.trim());
      setQaList((prev) =>
        prev.map((q) =>
          q.id === selectedQa.id ? { ...q, answer: answerInput.trim(), is_answered: true } : q
        )
      );
      setShowAnswerModal(false);
      setSelectedQa(null);
      setAnswerInput("");
      setToast({ message: "✅ Đã gửi phản hồi câu hỏi trực tiếp!", type: "success" });
    } catch (err) {
      setToast({ message: "Lỗi gửi câu trả lời", type: "error" });
    }
  };

  const handleUpdateIncidentStatus = async (incidentId, currentStatus) => {
    const nextStatus = currentStatus === "PENDING" ? "RESOLVED" : "PENDING";
    try {
      await eventService.updateIncidentStatus(incidentId, nextStatus);
      setIncidentList((prev) =>
        prev.map((i) => (i.id === incidentId ? { ...i, status: nextStatus } : i))
      );
      setToast({ message: `Cập nhật sự cố: ${nextStatus}`, type: "success" });
    } catch (err) {
      setToast({ message: "Lỗi cập nhật sự cố", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
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
            <span className="text-slate-600 font-medium">Giám sát & Điều phối Live Event</span>
          </nav>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <h2 className="text-lg md:text-xl font-bold text-slate-900">
              {eventData?.name || "Báo cáo Sự kiện Trực tiếp"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePauseCheckin}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              checkinPaused
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            {checkinPaused ? <Play size={13} /> : <Pause size={13} />}
            <span>{checkinPaused ? "Tiếp tục check-in" : "Tạm dừng check-in"}</span>
          </button>

          <button
            onClick={() => navigate(`/admin_sub/events/${id}/checkin`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <QrCode size={13} />
            <span>Mở Điểm danh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tỷ lệ Check-in Thực tế</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <QrCode size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{checkedInCount}</span>
            <span className="text-xs text-slate-400">/ {totalRegCount} SV ({checkinPercent}%)</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="bg-blue-600 h-full" style={{ width: `${checkinPercent}%` }}></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tương tác Q&A Trực tiếp</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{qaList.length} câu hỏi</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Đã giải đáp: <strong className="text-indigo-600">{qaList.filter((q) => q.is_answered).length}</strong> câu
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sự cố kỹ thuật & An ninh</span>
            <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{incidentList.length} sự cố</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Đang xử lý: <strong className="text-rose-600">{incidentList.filter((i) => i.status === "PENDING").length}</strong>
          </p>
        </div>
      </div>

      {/* Row 2: 2-Column Live Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7/12: Q&A and Incident Live Stream */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("qa")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === "qa"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Hỏi đáp Q&A ({qaList.length})
              </button>
              <button
                onClick={() => setActiveTab("incidents")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === "incidents"
                    ? "bg-rose-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Sự cố ({incidentList.length})
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[380px] flex-1 mt-2">
            {activeTab === "qa" ? (
              qaList.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Chưa có câu hỏi nào từ sinh viên
                </div>
              ) : (
                qaList.map((qa) => (
                  <div key={qa.id} className="py-3 px-1 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-800">{qa.author_name || "Sinh viên"}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          qa.is_answered
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {qa.is_answered ? "Đã trả lời" : "Chờ giải đáp"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-900 font-medium">{qa.question}</p>

                    {qa.answer && (
                      <div className="p-2 bg-blue-50/60 rounded-md text-xs text-blue-900 border border-blue-100">
                        <strong className="text-blue-700">Phản hồi:</strong> {qa.answer}
                      </div>
                    )}

                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => openAnswerModal(qa)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{qa.is_answered ? "Cập nhật câu trả lời" : "Trả lời câu hỏi →"}</span>
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : incidentList.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Không ghi nhận sự cố kỹ thuật nào
              </div>
            ) : (
              incidentList.map((inc) => (
                <div key={inc.id} className="py-3 px-1 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inc.status === "RESOLVED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {inc.status === "RESOLVED" ? "Đã xử lý" : "Cần hỗ trợ"}
                      </span>
                      <span className="text-[11px] text-slate-400">{inc.location || "Hội trường"}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1">{inc.title || inc.description}</p>
                  </div>

                  <button
                    onClick={() => handleUpdateIncidentStatus(inc.id, inc.status)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    {inc.status === "RESOLVED" ? "Đánh dấu chưa xong" : "Đã giải quyết ✓"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 5/12: Bảng xếp hạng Check-in các Chi đoàn */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trophy size={16} className="text-amber-500" />
              <span>Tiến độ Check-in Chi đoàn</span>
            </h3>
            <span className="text-[11px] text-slate-400">Dữ liệu thực từ DB</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[380px] flex-1 mt-2">
            {classRankings.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Chưa có dữ liệu check-in theo lớp
              </div>
            ) : (
              classRankings.map((r, i) => (
                <div key={i} className="py-2.5 px-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                        {r.rank || i + 1}
                      </span>
                      {r.name}
                    </span>
                    <strong className="text-blue-600">{r.percent}%</strong>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${r.percent >= 80 ? "bg-emerald-500" : r.percent >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
                      style={{ width: `${Math.min(100, r.percent)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Enterprise Answer Q&A Modal (Replaces browser prompt) */}
      <Modal
        isOpen={showAnswerModal}
        onClose={() => setShowAnswerModal(false)}
        title="Trả lời câu hỏi sinh viên"
        size="md"
      >
        {selectedQa && (
          <div className="space-y-4 py-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-[11px] text-slate-400 font-medium">Câu hỏi từ: {selectedQa.author_name || "Sinh viên"}</p>
              <p className="text-xs font-bold text-slate-900 mt-1">{selectedQa.question}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nội dung trả lời trực tiếp:
              </label>
              <textarea
                rows={4}
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Nhập câu trả lời chính thức từ Ban Tổ Chức..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" onClick={() => setShowAnswerModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleSendAnswer}>
                Gửi câu trả lời
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EventLiveReport;