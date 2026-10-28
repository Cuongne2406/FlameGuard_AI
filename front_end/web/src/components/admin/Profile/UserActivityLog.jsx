import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  History,
  LogIn,
  Save,
  RefreshCw,
  Trash2,
  FileText,
  User,
  Shield,
  Calendar,
  Filter
} from "lucide-react";
import { activityLogService } from "../../../services/activityLogService";

const UserActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả vai trò");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const pageSize = 20;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await activityLogService.getLogs({
        skip: (page - 1) * pageSize,
        limit: pageSize,
        date_from: dateFrom,
        date_to: dateTo,
        role: roleFilter
      });
      setLogs(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, dateFrom, dateTo, roleFilter]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await activityLogService.exportLogs({
        date_from: dateFrom,
        date_to: dateTo,
        role: roleFilter
      });
    } catch (err) {
      alert("Lỗi khi xuất dữ liệu");
    } finally {
      setIsExporting(false);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "Gần đây";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const getLogIcon = (action = "") => {
    const act = action.toLowerCase();
    if (act.includes("delete") || act.includes("xóa")) {
      return <Trash2 size={15} className="text-rose-600" />;
    }
    if (act.includes("login") || act.includes("đăng nhập")) {
      return <LogIn size={15} className="text-blue-600" />;
    }
    if (act.includes("approve") || act.includes("duyệt")) {
      return <Save size={15} className="text-emerald-600" />;
    }
    return <FileText size={15} className="text-indigo-600" />;
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (log.action || "").toLowerCase().includes(q) ||
      (log.user_name || "").toLowerCase().includes(q) ||
      (log.ip_address || "").toLowerCase().includes(q) ||
      (log.details || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <History size={22} className="text-blue-600" />
            Nhật ký Hoạt động Hệ thống (Audit Log)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi vết kiểm toán toàn diện các thao tác đăng nhập, chỉnh sửa dữ liệu và phê duyệt
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Download size={15} />
          <span>{isExporting ? "Đang xuất..." : "Xuất File CSV"}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date range */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <Calendar size={14} className="text-slate-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-transparent text-slate-600 outline-none text-xs"
            />
            <span className="text-slate-300">-</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-transparent text-slate-600 outline-none text-xs"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:bg-white"
          >
            <option value="Tất cả vai trò">Tất cả vai trò</option>
            <option value="UNIVERSITY_ADMIN">Quản trị viên Trường</option>
            <option value="FACULTY_ADMIN">Cán bộ Khoa / Viện</option>
            <option value="STUDENT">Sinh viên</option>
          </select>

          <button
            onClick={fetchLogs}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Lọc
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo hành động, người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-blue-600" />
            Đang tải dữ liệu kiểm toán hệ thống...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Shield size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">Không có nhật ký nào được ghi nhận</p>
            <p className="text-slate-400 mt-1">Các thao tác trên hệ thống sẽ tự động được ghi lại tại đây</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 w-12 text-center">Loại</th>
                  <th className="px-4 py-3.5">Hành động</th>
                  <th className="px-4 py-3.5">Người thực hiện</th>
                  <th className="px-4 py-3.5">Chi tiết / IP</th>
                  <th className="px-4 py-3.5 text-right">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 text-center">
                      <div className="p-1.5 rounded-md bg-slate-100 inline-flex items-center justify-center">
                        {getLogIcon(log.action)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      {log.action}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-slate-400" />
                        <span>{log.user_name || log.user?.full_name || "Quản trị viên"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                      {log.details || log.ip_address || "IP: 127.0.0.1"}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-400 whitespace-nowrap">
                      {formatDateTime(log.created_at || log.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>
              Trang {page} / {totalPages} (Tổng {total} bản ghi)
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-medium disabled:opacity-40"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-medium disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityLog;
