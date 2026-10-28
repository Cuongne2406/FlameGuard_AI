import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  FileDown, 
  UserCheck, 
  X, 
  ArrowLeft 
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Toast from "../../../components/ui/Toast";
import { eventService } from "../../../services/eventService";

const EventRegistrationApproval = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [eventData, setEventData] = useState(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const [regs, evt] = await Promise.all([
        eventService.getEventRegistrations(id),
        eventService.getEvent(id).catch(() => null)
      ]);

      if (evt) setEventData(evt);

      const mapped = Array.isArray(regs)
        ? regs.map((reg, index) => ({
            id: reg.id || `REG-${index}`,
            name: reg.user_full_name || (reg.user_id ? `Sinh viên (${reg.user_id.slice(0, 8)})` : "Sinh viên"),
            student_code: reg.student_code || "---",
            class_name: reg.class_name || "Khoa CNTT",
            time: reg.created_at
              ? new Date(reg.created_at).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : "Hôm nay",
            status: reg.status === "ATTENDED"
              ? "Đã tham gia"
              : reg.status === "REGISTERED"
              ? "Đã duyệt"
              : reg.status === "PENDING"
              ? "Chờ duyệt"
              : "Từ chối"
          }))
        : [];

      setRegistrations(mapped);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchRegistrations();
  }, [id]);

  const handleApprove = async (regId) => {
    try {
      await eventService.updateRegistration(id, regId, { status: "REGISTERED" });
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status: "Đã duyệt" } : r))
      );
      setToast({ message: "✅ Đã phê duyệt đăng ký tham gia sự kiện!", type: "success" });
    } catch (err) {
      setToast({ message: "Lỗi phê duyệt", type: "error" });
    }
  };

  const handleReject = async (regId) => {
    try {
      await eventService.updateRegistration(id, regId, { status: "REJECTED" });
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status: "Từ chối" } : r))
      );
      setToast({ message: "❌ Đã từ chối đăng ký tham gia", type: "info" });
    } catch (err) {
      setToast({ message: "Lỗi khi cập nhật trạng thái", type: "error" });
    }
  };

  const filteredRegistrations = registrations.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.class_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToExcel = () => {
    const data = [
      ["STT", "Họ và tên Sinh viên", "Mã số SV", "Chi đoàn / Lớp", "Thời gian đăng ký", "Trạng thái"],
      ...filteredRegistrations.map((r, i) => [
        i + 1,
        r.name,
        r.student_code,
        r.class_name,
        r.time,
        r.status
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachDangKy");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `DanhSach_DangKy_${(eventData?.name || "SuKien").replace(/\s+/g, "_")}.xlsx`);
    setToast({ message: "Xuất file Excel thành công!", type: "success" });
  };

  const totalRegistered = registrations.length;
  const approvedCount = registrations.filter((r) => r.status === "Đã duyệt" || r.status === "Đã tham gia").length;
  const pendingCount = registrations.filter((r) => r.status === "Chờ duyệt").length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
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
            <span className="text-slate-600 font-medium">Xét duyệt Đăng ký Tham gia</span>
          </nav>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            {eventData?.name || "Danh sách Đăng ký Sự kiện"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-xs"
          >
            <FileDown size={14} className="text-slate-500" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng đăng ký</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalRegistered}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Đã phê duyệt vé</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{approvedCount}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Chờ duyệt</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{pendingCount}</div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
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

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <th className="py-3 px-4">Họ tên Sinh viên</th>
                <th className="py-3 px-4">Mã số SV</th>
                <th className="py-3 px-4">Chi đoàn / Lớp</th>
                <th className="py-3 px-4">Thời gian đăng ký</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    Đang tải danh sách đăng ký...
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    Không tìm thấy sinh viên đăng ký nào
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((r) => {
                  const isApproved = r.status === "Đã duyệt" || r.status === "Đã tham gia";
                  const isPending = r.status === "Chờ duyệt";
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">{r.student_code}</td>
                      <td className="py-3 px-4 text-slate-600">{r.class_name}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{r.time}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isApproved
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isPending
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {isApproved ? (
                            <CheckCircle2 size={11} />
                          ) : isPending ? (
                            <Clock size={11} />
                          ) : (
                            <XCircle size={11} />
                          )}
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isApproved && (
                            <button
                              onClick={() => handleApprove(r.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-colors"
                            >
                              Duyệt
                            </button>
                          )}
                          {r.status !== "Từ chối" && (
                            <button
                              onClick={() => handleReject(r.id)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md text-xs font-semibold transition-colors"
                            >
                              Từ chối
                            </button>
                          )}
                        </div>
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

export default EventRegistrationApproval;