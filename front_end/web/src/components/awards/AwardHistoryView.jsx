import React, { useState, useEffect, useCallback } from "react";
import {
  History,
  Search,
  Filter,
  ArrowRight,
  RefreshCw,
  Clock,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AwardStatusBadge from "./AwardStatusBadge";
import { awardService } from "../../services/awardService";

const AwardHistoryView = () => {
  const [histories, setHistories] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Load periods
  useEffect(() => {
    const loadPeriods = async () => {
      try {
        const data = await awardService.getPeriods();
        setPeriods(data || []);
      } catch (err) {
        console.error("Error loading periods for history filter:", err);
      }
    };
    loadPeriods();
  }, []);

  // Fetch histories
  const fetchHistories = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedPeriod) params.period_id = selectedPeriod;
      const data = await awardService.getApprovalHistories(params);
      setHistories(data || []);
    } catch (err) {
      console.error("Error fetching histories:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchHistories();
  }, [fetchHistories]);

  // Filter in memory for search & action
  const filteredHistories = histories.filter((item) => {
    if (actionFilter && item.action !== actionFilter) return false;
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const matchApp = item.application_code?.toLowerCase().includes(query);
      const matchCandidate = item.candidate_name?.toLowerCase().includes(query);
      const matchActor = item.actor_name?.toLowerCase().includes(query);
      const matchNote = item.note?.toLowerCase().includes(query);
      if (!matchApp && !matchCandidate && !matchActor && !matchNote) return false;
    }
    return true;
  });

  const paginatedHistories = filteredHistories.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredHistories.length / pageSize) || 1;

  // Action badge color
  const getActionBadgeClass = (action) => {
    if (!action) return "bg-slate-100 text-slate-700 border-slate-200";
    if (action.includes("Phê duyệt")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (action.includes("Từ chối")) return "bg-rose-50 text-rose-700 border-rose-200";
    if (action.includes("Trả")) return "bg-amber-50 text-amber-700 border-amber-200";
    if (action.includes("Đủ tiêu chuẩn")) return "bg-purple-50 text-purple-700 border-purple-200";
    if (action.includes("Nộp")) return "bg-sky-50 text-sky-700 border-sky-200";
    if (action.includes("Lưu tạm")) return "bg-slate-50 text-slate-600 border-slate-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <div className="space-y-4">
      {/* 1. FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Tìm theo mã hồ sơ, người thực hiện, ghi chú..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
            >
              <option value="">Tất cả đợt khen thưởng</option>
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} ({p.name})
                </option>
              ))}
            </select>

            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
            >
              <option value="">Tất cả thao tác</option>
              <option value="Nộp hồ sơ">Nộp hồ sơ</option>
              <option value="Nộp lại hồ sơ">Nộp lại hồ sơ</option>
              <option value="Bổ sung hồ sơ">Bổ sung hồ sơ</option>
              <option value="Đoàn Trường trả về">Đoàn Trường yêu cầu bổ sung</option>
              <option value="Góp ý chỉnh sửa">Góp ý chỉnh sửa</option>
              <option value="Lưu tạm kết quả chấm">Lưu tạm kết quả chấm</option>
              <option value="Đủ tiêu chuẩn">Đủ tiêu chuẩn</option>
              <option value="Chủ tịch phê duyệt">Chủ tịch phê duyệt</option>
              <option value="Chủ tịch từ chối">Chủ tịch từ chối</option>
              <option value="Chủ tịch trả lại">Chủ tịch trả lại</option>
            </select>

            <button
              type="button"
              onClick={fetchHistories}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              title="Tải lại dữ liệu"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-blue-600" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. HISTORY TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Mã hồ sơ / Ứng viên</th>
                <th className="py-3 px-4">Thao tác</th>
                <th className="py-3 px-4">Chuyển trạng thái</th>
                <th className="py-3 px-4">Người thực hiện</th>
                <th className="py-3 px-4">Ghi chú / Lý do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw size={24} className="animate-spin text-blue-600 mx-auto mb-2" />
                    Đang tải lịch sử xét duyệt...
                  </td>
                </tr>
              ) : paginatedHistories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Chưa có bản ghi lịch sử xét duyệt nào.
                  </td>
                </tr>
              ) : (
                paginatedHistories.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <div className="font-medium text-slate-800">
                        {h.created_at ? new Date(h.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {h.created_at ? new Date(h.created_at).toLocaleDateString("vi-VN") : "—"}
                      </div>
                    </td>

                    {/* Application info */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{h.application_code || "Hồ sơ"}</div>
                      <div className="text-[11px] text-slate-500">{h.candidate_name || "—"}</div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getActionBadgeClass(h.action)}`}>
                        {h.action}
                      </span>
                    </td>

                    {/* State transition */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {h.from_status ? (
                          <AwardStatusBadge status={h.from_status} />
                        ) : (
                          <span className="text-slate-400 font-mono text-[10px]">Tạo mới</span>
                        )}
                        <ArrowRight size={13} className="text-slate-400 shrink-0" />
                        <AwardStatusBadge status={h.to_status} />
                      </div>
                    </td>

                    {/* Actor */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <User size={13} className="text-slate-400" />
                        <span>{h.actor_name || "Hệ thống"}</span>
                      </div>
                    </td>

                    {/* Note */}
                    <td className="py-3.5 px-4">
                      {h.note ? (
                        <p className="text-slate-600 text-[11px] max-w-xs leading-relaxed italic bg-slate-50 p-2 rounded border border-slate-100">
                          "{h.note}"
                        </p>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Tổng số <strong>{filteredHistories.length}</strong> thao tác đã ghi nhận
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="font-medium text-slate-700">
              Trang {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardHistoryView;
