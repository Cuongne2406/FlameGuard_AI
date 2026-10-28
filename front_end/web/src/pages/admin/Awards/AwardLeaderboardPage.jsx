import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { awardService } from "../../../services/awardService";
import { Trophy, ArrowLeft, Download, Search } from "lucide-react";
import * as XLSX from "xlsx";

const AwardLeaderboardPage = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await awardService.getLeaderboard();
        setRankings(data || []);
      } catch (err) {
        console.error("Lỗi khi tải bảng xếp hạng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const filteredRankings = rankings.filter((r) =>
    (r.class || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.dept || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.university || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    if (filteredRankings.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }
    const dataToExport = filteredRankings.map((r) => ({
      Hạng: r.rank,
      "Tên Đơn vị": r.class,
      "Khoa/Viện": r.dept,
      "Điểm Thi Đua": r.score,
      "Xu hướng": r.trend
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BangVangThiDua");
    XLSX.writeFile(workbook, "Bang_Vang_Thi_Dua.xlsx");
  };

  return (
    <div className={`space-y-4 ${embedded ? "" : "p-6 max-w-7xl mx-auto"}`}>
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          {!embedded && (
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600 border border-amber-200">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-tight">
                Bảng Vàng Thi Đua & Xếp Hạng Đơn vị
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Xếp hạng thi đua phong trào Sinh viên 5 Tốt toàn trường
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Tìm theo tên đơn vị..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all"
            />
          </div>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download size={14} />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            Đang tải dữ liệu bảng vàng thi đua...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3.5 w-16 text-center">Hạng</th>
                  <th className="px-4 py-3.5">Tên Đơn vị</th>
                  <th className="px-4 py-3.5">Khoa / Viện</th>
                  <th className="px-4 py-3.5 text-center">Điểm Thi Đua</th>
                  <th className="px-4 py-3.5 text-right">Xu hướng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRankings.length > 0 ? (
                  filteredRankings.map((r) => (
                    <tr key={r.id || r.rank} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 text-center">
                        <div
                          className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                            r.rank === 1
                              ? "bg-amber-100 text-amber-700 border border-amber-300 shadow-xs"
                              : r.rank === 2
                              ? "bg-slate-200 text-slate-700 border border-slate-300 shadow-xs"
                              : r.rank === 3
                              ? "bg-orange-100 text-orange-700 border border-orange-300 shadow-xs"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {r.rank}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-800 text-xs block">
                          {r.class}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">
                        {r.dept}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-extrabold text-blue-600 text-sm">
                          {r.score}
                        </span>
                      </td>
                      <td className={`px-4 py-3.5 text-right text-xs font-semibold ${r.trendColor || "text-emerald-600"}`}>
                        {r.trend || "+5 hạng"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center text-slate-400">
                      Không tìm thấy đơn vị nào phù hợp với bộ lọc tìm kiếm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AwardLeaderboardPage;
