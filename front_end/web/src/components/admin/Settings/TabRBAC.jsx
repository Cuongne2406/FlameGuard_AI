import React from "react";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Eye,
  Plus,
  History,
  Settings,
  Zap,
  Bug,
} from "lucide-react";
import { Toggle } from "../ui/Toggle";

const TabRBAC = () => {
  // Dữ liệu ma trận phân quyền dựa trên thiết kế
  const roles = [
    "SUPER ADMIN",
    "BÍ THƯ KHOA",
    "BÍ THƯ LỚP",
    "BAN TRUYỀN THÔNG",
  ];

  const permissions = [
    { name: "Duyệt Ngân sách", rights: [true, true, false, false] },
    { name: "Đăng bài Sự kiện", rights: [true, true, true, true] },
    {
      name: "Xem thông tin cá nhân SV",
      rights: [true, true, "readonly", false],
    },
    { name: "Cấu hình Hệ thống (Admin)", rights: [true, false, false, false] },
  ];

  const recentAuditLogs = [
    {
      action: "Deleted Event",
      user: "Admin_Hau",
      time: "2m ago",
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      action: "Approved Budget",
      user: "BiThu_KhoaCNTT",
      time: "15m ago",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      action: "Auto-Backup",
      user: "System",
      time: "1h ago",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      action: "Password Reset",
      user: "BiThu_Lop18",
      time: "3h ago",
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      {/* CỘT TRÁI: MA TRẬN PHÂN QUYỀN & THÔNG SỐ */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-xl">
                <Shield size={20} className="text-slate-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">
                  Ma trận Phân quyền (Role-Based Access Control)
                </h3>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black hover:bg-blue-100 transition-all">
              <Plus size={14} /> Thêm Vai trò Mới
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Quyền hạn / Chức năng
                </th>
                {roles.map((role, i) => (
                  <th
                    key={i}
                    className={`px-4 py-4 text-[10px] font-black text-center uppercase tracking-tighter ${i === 0 ? "text-blue-600" : "text-slate-400"}`}
                  >
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {permissions.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 text-xs font-black text-slate-700">
                    {p.name}
                  </td>
                  {p.rights.map((status, idx) => (
                    <td key={idx} className="px-4 py-5 text-center">
                      <div className="flex justify-center">
                        {status === true && (
                          <CheckCircle2
                            size={18}
                            className="text-emerald-500"
                          />
                        )}
                        {status === false && (
                          <XCircle size={18} className="text-slate-200" />
                        )}
                        {status === "readonly" && (
                          <div className="flex flex-col items-center gap-1">
                            <Eye size={18} className="text-amber-500" />
                            <span className="text-[8px] font-black text-amber-600 uppercase">
                              Read only
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* THÔNG SỐ HỆ THỐNG */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Settings size={16} className="text-slate-400" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Thông số hệ thống & Môi trường
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-slate-700">
                    Maintenance Mode
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Tạm ngưng truy cập người dùng
                  </p>
                </div>
                <Toggle checked={false} />
              </div>
              <div className="flex justify-between items-center text-blue-600">
                <div className="space-y-0.5">
                  <p className="text-xs font-black">Real-time Sync</p>
                  <p className="text-[10px] font-bold opacity-70">
                    Đồng bộ dữ liệu thời gian thực
                  </p>
                </div>
                <Toggle checked={true} color="bg-blue-600" />
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-slate-700 italic">
                    Debug Mode
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Hiển thị log lỗi chi tiết (Dev only)
                  </p>
                </div>
                <Toggle checked={false} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  Niên khóa / Năm học
                </label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
                  <option>2025-2026</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  Học kỳ hiện tại
                </label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
                  <option>Học kỳ 1</option>
                  <option>Học kỳ 2</option>
                  <option>Hè</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: NHẬT KÝ TRUY VẾT NHANH */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full">
          <div className="flex items-center gap-3 mb-6">
            <History size={18} className="text-slate-400" />
            <h3 className="text-sm font-black text-slate-800">
              Nhật ký Truy vết (Audit Logs)
            </h3>
          </div>

          <div className="space-y-4">
            {recentAuditLogs.map((log, i) => (
              <div
                key={i}
                className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div
                  className={`w-10 h-10 rounded-full ${log.bg} flex items-center justify-center shrink-0`}
                >
                  {i === 0 ? (
                    <XCircle size={18} className={log.color} />
                  ) : i === 1 ? (
                    <CheckCircle2 size={18} className={log.color} />
                  ) : i === 2 ? (
                    <Zap size={18} className={log.color} />
                  ) : (
                    <Bug size={18} className={log.color} />
                  )}
                </div>
                <div className="space-y-1 overflow-hidden">
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-[11px] font-black text-slate-700 truncate">
                      {log.action}
                    </p>
                    <span className="text-[9px] font-bold text-slate-300 whitespace-nowrap">
                      {log.time}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">
                    User{" "}
                    <span className="text-slate-600 font-black">
                      @{log.user}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 text-[10px] font-black text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-50 transition-all">
            View Full Logs →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabRBAC;
