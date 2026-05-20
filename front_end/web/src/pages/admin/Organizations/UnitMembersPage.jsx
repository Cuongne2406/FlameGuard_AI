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
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/organizations/units")}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-colors border border-slate-200 bg-white shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider">
                Nhân sự đơn vị
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">{unitName}</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {loading ? "Đang tải..." : `${filtered.length} / ${members.length} thành viên`}
            </p>
          </div>
        </div>

        <button
          onClick={exportToExcel}
          disabled={members.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm active:scale-95 disabled:opacity-40"
        >
          <Download size={15} />
          Xuất Excel
        </button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Tìm theo tên, MSSV, số điện thoại, chức vụ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all font-medium"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
          <Loader2 className="animate-spin text-blue-500" size={40} />
          <p className="font-bold text-sm">Đang tải danh sách thành viên...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-2xl text-red-700 text-sm font-semibold">
          <AlertCircle size={20} className="shrink-0" />
          <p>{error}</p>
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-300">
          <Users size={56} strokeWidth={1} />
          <p className="font-bold text-base text-slate-400">Đơn vị này chưa có thành viên nào.</p>
          <p className="text-sm text-slate-400">Hãy bổ nhiệm nhân sự từ trang Danh sách đơn vị.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-12">
                    STT
                  </th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <SortButton field="student_id" label="MSSV" />
                  </th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <SortButton field="full_name" label="Họ và Tên" />
                  </th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Phone size={11} />
                      Số điện thoại
                    </div>
                  </th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <SortButton field="title" label="Chức vụ" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((member, idx) => (
                  <tr
                    key={member.id}
                    className="hover:bg-blue-50/20 transition-colors group"
                  >
                    <td className="px-5 py-4 text-xs font-medium text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg w-fit">
                        <Hash size={10} />
                        {member.student_id || "---"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[11px] font-black flex items-center justify-center shadow-sm shrink-0">
                          {(member.full_name || "?").split(" ").pop().charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 leading-tight">
                            {member.full_name || "Chưa cập nhật"}
                          </p>
                          {member.email && (
                            <p className="text-[10px] text-slate-400 font-medium">
                              {member.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                      {member.phone || (
                        <span className="text-xs text-slate-300 italic">Chưa cập nhật</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          member.title === "Bí thư" || member.title === "Chủ nhiệm"
                            ? "bg-blue-100 text-blue-700"
                            : member.title === "Phó Bí thư"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Award size={9} />
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
              <p className="text-sm text-slate-400 font-bold">
                Không tìm thấy kết quả cho <span className="text-blue-600">"{searchTerm}"</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnitMembersPage;
