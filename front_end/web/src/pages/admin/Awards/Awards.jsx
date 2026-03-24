import React, { useState } from "react";
import {
  Trophy,
  Users,
  FileCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react";
import { awardService } from "../../../services/awardService";

const Awards = () => {
  // --- BỔ SUNG STATE ---
  const [rankings, setRankings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({ remainingDays: '0', submitted: '0', approved: '0', passRate: '0%' });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const awardsData = await awardService.getAwardsList();
        const statsData = await awardService.getAwardStats('all');
        
        // Cập nhật bằng dữ liệu API khi có backend thực tế
        setCandidates(awardsData || []);
        setRankings(statsData?.rankings || []);
        if (statsData?.summary) {
          setStats(statsData.summary);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu khen thưởng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 relative">
      {/* 1. HEADER & TOP BANNER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Trophy className="text-blue-600" size={24} />
          Quản lý Thi đua & Khen thưởng Năm học 2025-2026
        </h2>
        <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold text-slate-600 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/10">
          <option>Sinh viên 5 Tốt cấp Trường</option>
        </select>
      </div>

      {/* BANNER TỔNG QUAN NỔI BẬT */}
      <div className="bg-[#1D4ED8] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
        <div className="absolute right-[-20px] top-[-20px] opacity-10">
          <Trophy size={200} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-2">
              <span className="bg-blue-400/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                Đang diễn ra
              </span>
              <span className="text-blue-100 text-[10px] font-bold">
                Hạn chót: 20/01/2026
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight">
              Xét duyệt Sinh viên 5 Tốt cấp Trường
            </h1>
            <p className="text-blue-100 text-xs leading-relaxed opacity-80 font-medium">
              Hệ thống đang mở cổng nhận hồ sơ minh chứng trực tuyến. Các đơn vị
              vui lòng đôn đốc sinh viên hoàn thiện đúng hạn.
            </p>
          </div>

          <div className="flex items-center gap-10">
            <SummaryItem label="Ngày còn lại" value={stats.remainingDays} />
            <div className="w-px h-12 bg-white/20"></div>
            <SummaryItem label="Hồ sơ đã nộp" value={stats.submitted} />
            <div className="w-px h-12 bg-white/20"></div>
            <SummaryItem label="Đã duyệt" value={stats.approved} />
            <div className="w-px h-12 bg-white/20"></div>
            <SummaryItem label="Tỷ lệ đạt" value={stats.passRate} />
          </div>
        </div>
      </div>

      {/* 2. BẢNG VÀNG */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-black text-slate-700 flex items-center gap-2">
              <TrendingUp className="text-amber-500" size={18} /> Bảng vàng Thi
              đua Khối Khoa/Viện
            </h3>
            <button className="text-blue-600 text-xs font-bold hover:underline">
              Xem chi tiết
            </button>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-4 py-3">Hạng</th>
                  <th className="px-4 py-3">Đơn vị</th>
                  <th className="px-4 py-3 text-right">Điểm thi đua</th>
                  <th className="px-4 py-3 text-right">Xu hướng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rankings.length > 0 ? (
                  rankings.map((r, i) => <RankRow key={i} {...r} />)
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-xs text-slate-400">Không có dữ liệu thi đua.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. TIẾN ĐỘ XÉT DUYỆT (Giữ nguyên) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-slate-700 flex items-center gap-2 text-sm uppercase tracking-tight">
            <FileCheck size={18} className="text-blue-600" /> Tiến độ Xét duyệt
            Hồ sơ
          </h3>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <TabBtn label="Sinh viên 5 Tốt" active />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidates.length > 0 ? (
            candidates.map((c, i) => <CandidateCard key={i} {...c} />)
          ) : (
            <div className="col-span-2 text-center py-6 text-xs text-slate-400">Không có ứng viên nào đang chờ duyệt.</div>
          )}
        </div>
      </div>

    </div>
  );
};

// --- Helper Components (Giữ nguyên từ mã của bạn) ---
const SummaryItem = ({ label, value }) => (
  <div className="text-center">
    <div className="text-2xl font-black tracking-tight">{value}</div>
    <div className="text-[9px] font-bold uppercase text-blue-200 tracking-widest">
      {label}
    </div>
  </div>
);

const RankRow = ({ rank, name, score, trend, trendIcon, trendColor }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="px-4 py-4">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${rank === 1 ? "bg-amber-100 text-amber-600" : rank === 2 ? "bg-slate-100 text-slate-500" : "bg-orange-50 text-orange-600"}`}
      >
        {rank}
      </div>
    </td>
    <td className="px-4 py-4 font-bold text-slate-700 text-xs">{name}</td>
    <td className="px-4 py-4 text-right font-black text-blue-600 text-sm">
      {score}
    </td>
    <td className="px-4 py-4 text-right">
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black ${trendColor}`}
      >
        {trendIcon} {trend}
      </span>
    </td>
  </tr>
);


const CandidateCard = ({ full_name, student_id, university, status }) => {
  // Mapping màu sắc dựa trên status
  const statusColors = {
    PENDING: "bg-amber-100 text-amber-600 border border-amber-200",
    APPROVED: "bg-emerald-100 text-emerald-600 border border-emerald-200",
    REJECTED: "bg-rose-100 text-rose-600 border border-rose-200",
  };

  const statusColor = statusColors[status] || "bg-slate-100 text-slate-400";
  const displayName = full_name || "Chưa có tên";
  const displayId = student_id || "N/A";
  const displayUnit = university || "N/A";
  
  // Trích xuất chữ cái đầu của tên (Safe split)
  const nameParts = displayName.split(" ");
  const initial = nameParts.length > 0 ? nameParts[nameParts.length - 1].charAt(0) : "?";

  return (
    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 flex justify-between items-center hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs uppercase">
          {initial}
        </div>
        <div>
          <h5 className="text-xs font-black text-slate-800">{displayName}</h5>
          <p className="text-[10px] text-slate-400 font-medium">
            {displayId} • {displayUnit}
          </p>
        </div>
      </div>
      <span
        className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${statusColor}`}
      >
        {status}
      </span>
    </div>
  );
};

const TabBtn = ({ label, active }) => (
  <button
    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${active ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
  >
    {label}
  </button>
);

export default Awards;
