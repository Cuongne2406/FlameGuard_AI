import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  Search,
  Download,
  Loader2,
  Users,
  Phone,
  Hash,
  Award,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { organizationService } from "../../../services/organizationService";
import * as XLSX from "xlsx";

const UnitMembersPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const unitName = location.state?.unitName || "Đơn vị";

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("full_name");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const data = await organizationService.getOrganizationMembers(id);
        setMembers(data || []);
      } catch (err) {
        console.error("Failed to load members:", err);
        setError("Không thể tải danh sách thành viên. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [id]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = members
    .filter((m) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        m.full_name?.toLowerCase().includes(term) ||
        m.student_id?.toLowerCase().includes(term) ||
        m.phone?.toLowerCase().includes(term) ||
        m.title?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      const va = (a[sortField] || "").toString().toLowerCase();
      const vb = (b[sortField] || "").toString().toLowerCase();
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const exportToExcel = () => {
    const rows = filtered.map((m, i) => ({
      STT: i + 1,
      MSSV: m.student_id || "---",
      "Họ và tên": m.full_name || "",
      "Số điện thoại": m.phone || "Chưa cập nhật",
      "Chức vụ": m.title || "Thành viên",
      Email: m.email || "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách");
    XLSX.writeFile(wb, `Nhan_Su_${unitName.replace(/\s+/g, "_")}.xlsx`);
  };

  const SortButton = ({ field, label }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 group hover:text-blue-600 transition-colors"
    >
      {label}
      <ArrowUpDown
        size={12}
        className={`transition-colors ${
          sortField === field ? "text-blue-600" : "text-slate-300 group-hover:text-blue-400"
        }`}
      />
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/organizations?tab=units")}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors border border-slate-200 bg-white shadow-xs"
            title="Quay lại danh sách đơn vị"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px] uppercase tracking-wider">
                Nhân sự đơn vị
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">{unitName}</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {loading ? "Đang tải..." : `${filtered.length} / ${members.length} thành viên`}
            </p>
          </div>
        </div>

        <button
          onClick={exportToExcel}
          disabled={members.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs disabled:opacity-40"
        >
          <Download size={15} />
          <span>Xuất Excel</span>
        </button>
      </div>

      {/* Search bar */}
      <div className="relative w-full sm:w-80">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Tìm theo tên, MSSV, SĐT, chức vụ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all shadow-xs"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 bg-white rounded-xl border border-slate-200">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="font-medium text-xs text-slate-500">Đang tải danh sách thành viên...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
          <AlertCircle size={18} className="shrink-0" />
          <p>{error}</p>
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-300 bg-white rounded-xl border border-slate-200">
          <Users size={48} strokeWidth={1.5} className="text-slate-300" />
          <p className="font-semibold text-sm text-slate-600">Đơn vị này chưa có thành viên nào.</p>
          <p className="text-xs text-slate-400">Hãy bổ nhiệm nhân sự từ tab Danh sách đơn vị.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200">
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-12">
                    STT
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <SortButton field="student_id" label="MSSV" />
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <SortButton field="full_name" label="Họ và Tên" />
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} />
                      Số điện thoại
                    </div>
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <SortButton field="title" label="Chức vụ" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((member, idx) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md w-fit">
                        <Hash size={11} className="text-slate-400" />
                        {member.student_id || "---"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {(member.full_name || "?").split(" ").pop().charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            {member.full_name || "Chưa cập nhật"}
                          </p>
                          {member.email && (
                            <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                              {member.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                      {member.phone || (
                        <span className="text-xs text-slate-300 italic">Chưa cập nhật</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                          member.title === "Bí thư" || member.title === "Chủ nhiệm"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : member.title === "Phó Bí thư"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {member.title || "Thành viên"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && searchTerm && (
            <div className="py-12 text-center">
              <p className="text-xs text-slate-400 font-medium">
                Không tìm thấy kết quả cho <span className="text-blue-600 font-semibold">"{searchTerm}"</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnitMembersPage;
