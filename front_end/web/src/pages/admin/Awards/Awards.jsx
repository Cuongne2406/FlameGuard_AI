import React, { useState } from "react";
import {
  Trophy,
  Users,
  FileCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Edit3,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  X, // Thêm icon đóng modal
} from "lucide-react";
import { awardService } from "../../../services/awardService";

const Awards = () => {
  // --- BỔ SUNG STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [criteria, setCriteria] = useState([]);
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
        // Nếu API trả về stats chi tiết:
        // setStats(statsData?.stats || { remainingDays: '0', submitted: '0', ... })
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

      {/* 2. BẢNG VÀNG & CẤU HÌNH TIÊU CHÍ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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

        {/* --- CẤU HÌNH TIÊU CHÍ (Phần thay đổi) --- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-700 flex items-center gap-2">
              <Edit3 className="text-slate-400" size={18} /> Cấu hình Bộ tiêu
              chí
            </h3>
          </div>
          <div className="space-y-3">
            {criteria.map((item, index) => (
              <CriterionItem key={index} {...item} />
            ))}

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 border-2 border-dashed border-slate-100 rounded-xl text-[11px] font-bold text-slate-400 hover:border-blue-200 hover:text-blue-500 transition-all active:scale-95"
            >
              + Thêm tiêu chí mới
            </button>
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

      {/* --- MODAL HỘP THOẠI THÊM MỚI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800">
                Tiêu chí thi đua
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setIsModalOpen(false);
              }}
            >
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Tên tiêu chí
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên hoạt động..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Điểm thưởng/phạt
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: +10 hoặc -5"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Lưu tiêu chí
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

const CriterionItem = ({ label, points, color, icon }) => (
  <div
    className={`flex justify-between items-center p-4 rounded-xl border border-transparent hover:border-slate-100 transition-all ${color.split(" ")[0].replace("bg-", "bg-opacity-20 bg-")}`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      <span className="text-xs font-bold text-slate-700">{label}</span>
    </div>
    <span className={`text-sm font-black ${color.split(" ")[1]}`}>
      {points}
    </span>
  </div>
);

const CandidateCard = ({ name, id, unit, status, statusColor }) => (
  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 flex justify-between items-center hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs uppercase">
        {name.split(" ").pop().charAt(0)}
      </div>
      <div>
        <h5 className="text-xs font-black text-slate-800">{name}</h5>
        <p className="text-[10px] text-slate-400 font-medium">
          {id} • {unit}
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

const TabBtn = ({ label, active }) => (
  <button
    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${active ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
  >
    {label}
  </button>
);

export default Awards;
