import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Flag,
  Sparkles,
  ChevronRight as ChevronIcon,
  Clock,
} from "lucide-react";
import { campaignService } from "../../../services/campaignService";

const CalendarView = ({ onSelectCampaign }) => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await campaignService.getCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };
    fetchCampaigns();
  }, []);

  // Sự kiện lịch động
  const [events, setEvents] = useState([]);

  return (
    <div className="flex gap-6 h-full animate-in fade-in duration-500">
      {/* CỘT TRÁI: BỘ LỊCH CHÍNH */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* Header của Lịch */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="px-3 py-1 text-[11px] font-bold bg-white shadow-sm rounded-md">
                Tháng
              </button>
              <button className="px-3 py-1 text-[11px] font-bold text-slate-400">
                Tuần
              </button>
              <button className="px-3 py-1 text-[11px] font-bold text-slate-400">
                Ngày
              </button>
            </div>
            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1">
              <button className="p-1 hover:bg-slate-50 rounded">
                <ChevronLeft size={14} />
              </button>
              <button className="px-2 py-1 text-[10px] font-bold uppercase">
                Today
              </button>
              <button className="p-1 hover:bg-slate-50 rounded">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            Tháng 06, 2026
          </h3>

          <button className="flex items-center gap-2 bg-[#0061D5] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-100">
            <Plus size={16} /> Tạo sự kiện
          </button>
        </div>

        {/* Grid Lịch */}
        <div className="flex-1 overflow-auto">
          <table className="w-full h-full border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/50">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <th
                      key={day}
                      className="py-3 border-r border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase"
                    >
                      {day}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="h-28">
                  {Array.from({ length: 7 }).map((_, colIndex) => {
                    const dayNum = rowIndex * 7 + colIndex - 3; // Giả lập ngày bắt đầu
                    return (
                      <td
                        key={colIndex}
                        className="border-r border-b border-slate-100 p-2 relative align-top hover:bg-slate-50/30 transition-colors"
                      >
                        <span
                          className={`text-xs font-bold ${dayNum > 0 && dayNum <= 30 ? "text-slate-400" : "text-slate-200"}`}
                        >
                          {dayNum > 0 && dayNum <= 30 ? dayNum : ""}
                        </span>

                        {/* Render sự kiện động từ API */}
                        {events.filter(e => e.day === dayNum).map((evt, i) => (
                           <EventTag
                             key={i}
                             color={evt.color || "bg-blue-600"}
                             title={evt.title}
                             icon={<Flag size={10} fill="white" />}
                           />
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CỘT PHẢI: SIDEBAR THÔNG TIN */}
      <div className="w-80 space-y-6">
        {/* Box: Chú giải */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">
            CHỦ GIẢI & PHÂN LOẠI
          </h4>
          <div className="space-y-3">
            <LegendItem color="bg-blue-600" label="Cấp Trường" />
            <LegendItem color="bg-emerald-500" label="Khoa Xây dựng" />
            <LegendItem color="bg-orange-500" label="Khoa CNTT" />
          </div>
        </div>

        {/* Box: Mật độ sự kiện (AI suggest) */}
        <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Sparkles size={40} />
          </div>
          <h4 className="flex items-center gap-2 text-[11px] font-bold text-blue-700 mb-2">
            <Sparkles size={14} /> Mật độ sự kiện
          </h4>
          <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
            Tuần 2 tháng 6 có mật độ sự kiện cao (3 hoạt động trùng nhau). Hãy
            chú ý điều phối nhân sự.
          </p>
        </div>

        {/* Box: Sắp diễn ra */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">
            SẮP DIỄN RA
          </h4>
          <div className="space-y-5">
            {campaigns.length === 0 && (
               <div className="text-[11px] text-slate-400 italic">Chưa có sự kiện nào.</div>
            )}
            {campaigns.slice(0, 2).map((camp, idx) => (
               <UpcomingEvent
                 key={`camp-${camp.id}`}
                 date={String((idx + 1) * 5).padStart(2, "0")}
                 month="THG 6"
                 title={camp.name}
                 time={camp.time}
               />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const EventTag = ({ color, title, icon }) => (
  <div
    className={`mt-1 ${color} text-white p-1 rounded flex items-center gap-1 text-[9px] font-bold shadow-sm`}
  >
    {icon} {title}
  </div>
);

const EventBar = ({ color, title, width }) => (
  <div
    className={`absolute top-8 left-0 ${width} ${color} p-1.5 border-y border-current/10 text-[9px] font-black z-10 flex items-center gap-1`}
  >
    <div className="w-1 h-3 bg-current rounded-full mr-1"></div>
    {title}
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-3">
    <div className={`w-3 h-3 rounded-full ${color}`}></div>
    <span className="text-[11px] font-bold text-slate-600">{label}</span>
  </div>
);

const UpcomingEvent = ({ date, month, title, time }) => (
  <div className="flex items-start gap-4 group cursor-pointer">
    <div className="text-center border-r border-slate-100 pr-4">
      <div className="text-[9px] font-bold text-slate-400 uppercase">
        {month}
      </div>
      <div className="text-xl font-black text-slate-800">{date}</div>
    </div>
    <div className="flex-1">
      <h5 className="text-[11px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors leading-tight mb-1">
        {title}
      </h5>
      <p className="text-[10px] text-slate-400 font-medium">{time}</p>
    </div>
  </div>
);

export default CalendarView;
