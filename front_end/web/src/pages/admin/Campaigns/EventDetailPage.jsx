import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ChevronLeft, Sparkles, Building, Calendar, MapPin, 
  Clock, DollarSign, Users, Award, Shield, CheckCircle, 
  Loader2, AlertCircle, Image, Star, Eye
} from "lucide-react";
import { eventService } from "../../../services/eventService";
import { organizationService } from "../../../services/organizationService";

const EventDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [orgName, setOrgName] = useState("Đơn vị phụ trách");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventService.getEvent(id);
        setEvent(res);

        if (res.org_id) {
          const orgs = await organizationService.getOrganizations();
          const match = orgs.find(o => o.id === res.org_id);
          if (match) setOrgName(match.name);
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Không thể tải thông tin sự kiện này.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <Loader2 className="animate-spin text-[#0061D5]" size={36} />
        <p className="text-slate-500 font-medium text-sm">Đang tải chi tiết sự kiện...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-semibold">
          <AlertCircle size={20} className="shrink-0" />
          <p>{error || "Sự kiện không tồn tại."}</p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
        >
          <ChevronLeft size={16} /> Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors border border-slate-200 bg-white shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 rounded bg-orange-50 text-orange-600 font-bold text-xs uppercase tracking-wider">Chi tiết sự kiện con</span>
              <Sparkles size={16} className="text-amber-500 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">{event.name}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/admin/events/${event.id}/live`)}
            className="bg-[#0061D5] hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-100 flex items-center gap-1.5"
          >
            <Eye size={14} /> Xem Báo Cáo Live
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Cover & Detail fields */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Banner cover */}
          {event.image_url && (
            <div className="h-64 rounded-3xl overflow-hidden border shadow-lg relative">
              <img src={event.image_url} alt={event.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
            </div>
          )}

          {/* Description Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b pb-2">Nội dung chi tiết</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              {event.description || "Sự kiện hiện chưa được điền thông tin chi tiết nội dung."}
            </p>
          </div>

          {/* Core metadata details list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex gap-4">
              <div className="p-3 bg-blue-100/50 text-blue-600 rounded-xl h-11 w-11 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Địa điểm</span>
                <span className="text-sm font-bold text-slate-700">{event.location || "Chưa cập nhật"}</span>
              </div>
            </div>

            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex gap-4">
              <div className="p-3 bg-purple-100/50 text-purple-600 rounded-xl h-11 w-11 flex items-center justify-center shrink-0">
                <Building size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Đơn vị tổ chức</span>
                <span className="text-sm font-bold text-slate-700">{orgName}</span>
              </div>
            </div>

            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex gap-4">
              <div className="p-3 bg-amber-100/50 text-amber-600 rounded-xl h-11 w-11 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Thời gian diễn ra</span>
                <span className="text-xs font-bold text-slate-700 block">Bắt đầu: {event.start_time ? new Date(event.start_time).toLocaleString("vi-VN") : "?"}</span>
                <span className="text-xs font-bold text-slate-700">Kết thúc: {event.end_time ? new Date(event.end_time).toLocaleString("vi-VN") : "?"}</span>
              </div>
            </div>

            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex gap-4">
              <div className="p-3 bg-emerald-100/50 text-emerald-600 rounded-xl h-11 w-11 flex items-center justify-center shrink-0">
                <Star size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Điểm rèn luyện thưởng</span>
                <span className="text-sm font-bold text-slate-700">+{event.points_awarded || 0} ĐRL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Config Summary */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Cấu hình Đăng Ký</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Quy mô sức chứa:</span>
                <span className="font-black text-slate-700">{event.capacity || 100} Sinh viên</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Trạng thái phát hành:</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-700">{event.status}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Smart Check-in:</span>
                <span className="font-bold text-emerald-600">Đã kích hoạt</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Giấy chứng nhận điện tử:</span>
                <span className="font-bold text-blue-600">Mẫu mặc định</span>
              </div>
            </div>
          </div>

          {event.campaign_id && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                <h5 className="text-xs font-bold uppercase tracking-wider">Đã kết nối Chiến dịch cha</h5>
              </div>
              <p className="text-[11px] text-emerald-700 leading-normal font-medium">
                Sự kiện này được ghi nhận nằm trong chiến dịch phụ trách chung của đơn vị.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default EventDetailPage;
