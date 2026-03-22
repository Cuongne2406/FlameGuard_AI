import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Trash2,
  LogIn,
  Save,
  RefreshCw,
  FileText,
  User,
  MoreVertical,
} from "lucide-react";
import { activityLogService } from "../../../services/activityLogService";

const TabAuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả vai trò");
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
  }, [page]);

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

  const totalPages = Math.ceil(total / pageSize);

  const getLogIcon = (type) => {
    switch (type) {
      case "danger": return <Trash2 size={14} />;
      case "info": return <LogIn size={14} />;
      case "success": return <RefreshCw size={14} />;
      default: return <Save size={14} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Bộ lọc và Công cụ (Giữ nguyên giao diện) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
              />
            </div>
            <span className="text-slate-400 font-bold text-xs">-</span>
            <div className="relative">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
              />
            </div>
          </div>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none font-sans"
          >
            <option>Tất cả vai trò</option>
            <option>System</option>
            <option>SUPER_ADMIN</option>
            <option>GLOBAL_ADMIN</option>
            <option>UNIVERSITY_ADMIN</option>
            <option>FACULTY_ADMIN</option>
          </select>
          <button 
            onClick={() => { setPage(1); fetchLogs(); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all font-sans"
          >
            <Filter size={14} /> Lọc
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50 font-sans"
          >
            {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />} 
            {isExporting ? "Đang xuất..." : "Xuất báo cáo"}
          </button>
        </div>
      </div>

      {/* Bảng Nhật ký */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người thực hiện</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vai trò</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hành động</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Đối tượng tác động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.length > 0 ? logs.map((log) => (
              <tr key={log.id} className={`hover:bg-slate-50/80 transition-colors ${log.type === "danger" ? "bg-red-50/30" : ""}`}>
                <td className="px-6 py-4 text-[11px] font-bold text-slate-500 italic">{log.time}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white ring-2 ring-slate-50">{log.initials}</div>
                    <span className="text-xs font-black text-slate-700">{log.user}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-400">{log.role}</td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-2 text-xs font-black ${
                      log.type === "danger" ? "text-red-600" : log.type === "success" ? "text-emerald-600" : log.type === "info" ? "text-blue-600" : "text-slate-700"
                    }`}>
                    {getLogIcon(log.type)}
                    {log.action}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-500">{log.target}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-400">
                  {loading ? "Đang tải dữ liệu..." : "Chưa có log hệ thống nào."}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Phân trang động */}
        <div className="p-5 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
          <p className="text-[11px] font-bold text-slate-400">
            Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} trong tổng số {total} bản ghi
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, i, arr) => (
                <React.Fragment key={p}>
                  {i > 0 && arr[i-1] !== p - 1 && <span className="px-2 text-slate-400">...</span>}
                  <button
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all ${
                      page === p
                        ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                        : "hover:bg-white text-slate-400"
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabAuditLog;
