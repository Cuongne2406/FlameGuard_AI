import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ChevronLeft, Sparkles, Building, Calendar, DollarSign, 
  Loader2, AlertCircle, TrendingUp, Flag, Award, Clock, ArrowRight 
} from "lucide-react";
import { campaignService } from "../../../services/campaignService";

const CampaignDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await campaignService.getCampaign(id);
        setCampaign(res);
      } catch (err) {
        console.error("Error fetching campaign details:", err);
        setError("Không thể tải thông tin chiến dịch này.");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <Loader2 className="animate-spin text-[#0061D5]" size={36} />
        <p className="text-slate-500 font-medium text-sm">Đang tải chi tiết chiến dịch...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-semibold">
          <AlertCircle size={20} className="shrink-0" />
          <p>{error || "Chiến dịch không tồn tại."}</p>
        </div>
        <button 
          onClick={() => navigate("/admin/campaigns/calendar")}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
        >
          <ChevronLeft size={16} /> Quay lại Lịch
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/campaigns/calendar")}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors border border-slate-200 bg-white shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 rounded bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider">Chi tiết chiến dịch</span>
              <Sparkles size={16} className="text-amber-500 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">{campaign.name}</h1>
          </div>
        </div>
        <button
          onClick={() => navigate(`/admin/campaigns/edit/${campaign.id}`)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2 rounded-lg text-xs font-bold transition-all border border-slate-200"
        >
          Chỉnh sửa thông tin
        </button>
      </div>

      {/* Main card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column: Summary info cards */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b pb-3">Tổng quan & Kế hoạch</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Mô tả chiến dịch</span>
                <p className="text-slate-600 text-sm leading-relaxed font-medium mt-1">
                  {campaign.description || "Chưa cập nhật mô tả chi tiết cho chiến dịch này."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex gap-3 items-center">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Building size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Đơn vị chủ trì</span>
                    <span className="text-sm font-bold text-slate-700">{campaign.organization_name || "Đoàn trường"}</span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Ngân sách phân bổ</span>
                    <span className="text-sm font-bold text-slate-700">{campaign.total_budget_allocated?.toLocaleString() || "0"} VNĐ</span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Thời gian diễn ra</span>
                    <span className="text-xs font-bold text-slate-700">
                      {campaign.start_date || "?"} đến {campaign.end_date || "?"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Trạng thái</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                      {campaign.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Progress & Analytics summary */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#0061D5] to-blue-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Flag size={80} /></div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-200">Tiến trình chiến dịch</h4>
            <div className="mt-8 space-y-2">
              <span className="text-4xl font-black">{campaign.status === 'COMPLETED' ? '100%' : campaign.status === 'ONGOING' ? '50%' : '10%'}</span>
              <div className="w-full bg-blue-500/30 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-white h-full transition-all duration-1000" 
                  style={{ width: campaign.status === 'COMPLETED' ? '100%' : campaign.status === 'ONGOING' ? '50%' : '10%' }}
                />
              </div>
              <p className="text-[11px] text-blue-100 leading-normal pt-2 font-medium">
                Các sự kiện con của chiến dịch đang diễn ra đúng tiến độ đã đề ra. Nhấn vào lịch để xem chi tiết từng sự kiện.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">Học kỳ áp dụng</h4>
            <div className="flex items-center gap-3">
              <Award className="text-amber-500" size={20} />
              <span className="text-sm font-bold text-slate-700">
                {campaign.academic_term_name || "Học kỳ 1 (2025-2026)"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CampaignDetailPage;
