import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  X, 
  UserCheck, 
  ArrowLeft, 
  QrCode, 
  AlertCircle,
  GraduationCap
} from "lucide-react";
import Toast from "../../../components/ui/Toast";
import { eventService } from "../../../services/eventService";

const EventManualCheckin = ({ eventId, onClose }) => {
  const { id } = useParams();
  const effectiveEventId = eventId || id;
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAttendees = async () => {
    if (!effectiveEventId) return;
    try {
      setLoading(true);
      const [regs, evt] = await Promise.all([
        eventService.getEventRegistrations(effectiveEventId),
        eventService.getEvent(effectiveEventId).catch(() => null)
      ]);

      if (evt) setEventData(evt);

      const mappedAttendees = Array.isArray(regs)
        ? regs.map((reg, index) => ({
            id: reg.id || `ATT-${index}`,
            name: reg.user_full_name || (reg.user_id ? `Sinh viên (${reg.user_id.slice(0, 8)})` : "Khách mời"),
            student_code: reg.student_code || "---",
            class_name: reg.class_name || "Khoa CNTT",
            time: reg.status === "ATTENDED"
              ? new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
              : "--:--",
            status: reg.status === "ATTENDED" ? "Checked-in" : "Pending",
            originalData: reg
          }))
        : [];

      setAttendees(mappedAttendees);
    } catch (error) {
      console.error("Failed to fetch attendees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [effectiveEventId]);

  const handleCheckin = async (regId) => {
    try {
      await eventService.updateRegistration(effectiveEventId, regId, { status: "ATTENDED" });
      setToast({
        message: "✅ Điểm danh thành công! Đã tự động ghi nhận +5 điểm rèn luyện cho sinh viên.",
        type: "success"
      });
      setAttendees((prev) =>
        prev.map((a) =>
          a.id === regId
            ? {
                ...a,
                status: "Checked-in",
                time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
              }
            : a
        )
      );
    } catch (error) {
      setToast({ message: "Lỗi khi điểm danh", type: "error" });
    }
  };

  const filteredAttendees = attendees.filter((sv) =>
    sv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sv.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sv.class_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const checkedInCount = attendees.filter((a) => a.status === "Checked-in").length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <button
              onClick={() => (onClose ? onClose() : navigate("/admin_sub/events"))}
              className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft size={13} /> Sự kiện Khoa
            </button>
            <span>/</span>
            <span className="text-slate-600 font-medium">Điểm danh thủ công & Tích lũy điểm</span>
          </nav>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck size={20} className="text-blue-600" />
            <span>{eventData?.name || "Điểm danh Sự kiện Khoa"}</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Đã check-in: {checkedInCount} / {attendees.length} sinh viên
            </span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo Tên sinh viên, MSSV hoặc Lớp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 font-medium"
          />
        </div>

        {/* Attendees Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <th className="py-3 px-4">Sinh viên</th>
                <th className="py-3 px-4">Mã số SV</th>
                <th className="py-3 px-4">Chi đoàn / Lớp</th>
                <th className="py-3 px-4 text-center">Thời gian Check-in</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    Đang tải danh sách sinh viên đăng ký...
                  </td>
                </tr>
              ) : filteredAttendees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    Không tìm thấy sinh viên nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((sv) => {
                  const isChecked = sv.status === "Checked-in";
                  return (
                    <tr key={sv.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{sv.name}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">{sv.student_code}</td>
                      <td className="py-3 px-4 text-slate-600">{sv.class_name}</td>
                      <td className="py-3 px-4 text-center text-slate-500 font-mono">{sv.time}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isChecked
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {isChecked ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                          {isChecked ? "Đã điểm danh (+5đ)" : "Chưa điểm danh"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isChecked ? (
                          <span className="text-[11px] font-semibold text-emerald-600">Đã ghi nhận</span>
                        ) : (
                          <button
                            onClick={() => handleCheckin(sv.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-colors"
                          >
                            <UserCheck size={13} />
                            <span>Check-in</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EventManualCheckin;