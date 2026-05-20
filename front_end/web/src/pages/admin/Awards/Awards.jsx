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
  ExternalLink,
  MessageSquare,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { awardService } from "../../../services/awardService";

const Awards = () => {
  const navigate = useNavigate();
  // --- BỔ SUNG STATE ---
  const [rankings, setRankings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({ remainingDays: '0', submitted: '0', approved: '0', passRate: '0%' });
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchCandidates = async () => {
    try {
      const awardsData = await awardService.getAwardsList();
      setCandidates(awardsData || []);
    } catch(err) {}
  };

  const handleProcessCandidate = async (status, comments) => {
    if (!selectedCandidate) return;
    setIsProcessing(true);
    try {
      await awardService.updateAwardAssessment(selectedCandidate.id, {
        status,
        comments
      });
      await fetchCandidates();
      setSelectedCandidate(null);
    } catch (err) {
      alert("Lỗi khi xử lý hồ sơ!");
    } finally {
      setIsProcessing(false);
    }
  };


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
            <button 
              onClick={() => navigate('/admin/awards/leaderboard')}
              className="text-blue-600 text-xs font-bold hover:underline"
            >
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
            candidates.map((c, i) => (
              <CandidateCard 
                key={i} 
                candidate={c} 
                onClick={(cand) => setSelectedCandidate(cand)} 
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-6 text-xs text-slate-400">Không có ứng viên nào đang chờ duyệt.</div>
          )}
        </div>
      </div>

      {/* 4. APPLICATION DETAIL MODAL */}
      <ApplicationDetailModal 
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onProcess={handleProcessCandidate}
        isProcessing={isProcessing}
      />
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


const CandidateCard = ({ candidate, onClick }) => {
  const { full_name, student_id, university, status } = candidate;
  
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
    <div onClick={() => onClick(candidate)} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 flex justify-between items-center hover:shadow-md hover:border-blue-200 cursor-pointer transition-all group">
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

const ApplicationDetailModal = ({ candidate, onClose, onProcess, isProcessing }) => {
  const [feedback, setFeedback] = useState("");

  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-2xl uppercase shadow-inner">
              {candidate.full_name?.split(" ").pop()?.charAt(0) || "?"}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">{candidate.full_name || "Chưa có tên"}</h3>
              <p className="text-sm font-bold text-slate-500 mt-1">{candidate.student_id} • {candidate.university}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                  candidate.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 
                  candidate.status === 'REJECTED' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {candidate.status}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">
                  Nộp: {new Date(candidate.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hồ sơ Khen thưởng</h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="font-bold text-slate-800 text-sm">{candidate.award_name || 'Sinh viên 5 tốt'}</div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {candidate.description || "Không có ghi chú thêm."}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tài liệu Minh chứng</h4>
            {candidate.evidence_url ? (
              <a 
                href={candidate.evidence_url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <ExternalLink size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-blue-700">Mở Link Minh Chứng</div>
                    <div className="text-[10px] text-blue-400 truncate max-w-[300px]">{candidate.evidence_url}</div>
                  </div>
                </div>
                <div className="text-blue-500 font-bold text-xs uppercase group-hover:underline">Xem ngay</div>
              </a>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-500 italic">
                Ứng viên không cung cấp link minh chứng.
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare size={12} /> Phản hồi cho Sinh viên
            </h4>
            <textarea 
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Nhập lý do từ chối hoặc lời phê bình (tùy chọn)..."
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        {candidate.status === 'PENDING' && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
            <button 
              disabled={isProcessing}
              onClick={() => onProcess('REJECTED', feedback)}
              className="flex-1 py-4 bg-white border border-rose-200 text-rose-600 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-rose-50 active:scale-95 transition-all text-center"
            >
              Từ chối
            </button>
            <button 
              disabled={isProcessing}
              onClick={() => onProcess('APPROVED', feedback)}
              className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all text-center"
            >
              {isProcessing ? "Đang xử lý..." : "Duyệt Hồ sơ"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Awards;
