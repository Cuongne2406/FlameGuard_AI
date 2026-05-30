import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { awardService } from "../../../services/awardService";
import { Trophy, ArrowLeft, Download, Search } from "lucide-react";
import * as XLSX from "xlsx";

const AwardLeaderboardPage = () => {
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

  const filteredRankings = rankings.filter(r => 
    r.class?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.university?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    if (filteredRankings.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }
    const dataToExport = filteredRankings.map(r => ({
      "Hạng": r.rank,
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
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 relative bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Trophy className="text-amber-500" size={24} />
            Bảng Vàng Thi Đua Toàn Trường
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm đơn vị..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 w-64 transition-all"
            />
          </div>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-700 transition-colors"
          >
            <Download size={16} />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-bold">Đang tải bảng xếp hạng...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                  <th className="px-6 py-4 w-20 text-center">Hạng</th>
                  <th className="px-6 py-4">Tên Đơn vị</th>
                  <th className="px-6 py-4">Khoa/Viện</th>
                  <th className="px-6 py-4 text-center">Điểm số</th>
                  <th className="px-6 py-4 text-right">Đánh giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRankings.length > 0 ? (
                  filteredRankings.map((r) => (
                    <tr key={r.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 text-center">
                        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-black shadow-sm ${
                          r.rank === 1 ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                          r.rank === 2 ? 'bg-slate-200 text-slate-600 border border-slate-300' :
                          r.rank === 3 ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                          'bg-slate-50 text-slate-500 border border-slate-100'
                        }`}>
                          {r.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{r.class}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">{r.dept}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-black text-blue-600 text-lg">{r.score}</span>
                      </td>
                      <td className={`px-6 py-4 text-right text-xs font-bold ${r.trendColor}`}>
                        {r.trend}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                      Không tìm thấy đơn vị nào phù hợp.
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
