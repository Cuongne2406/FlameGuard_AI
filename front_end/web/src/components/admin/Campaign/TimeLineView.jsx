import React, { useState, useEffect } from "react";
import { Calendar, ChevronRight, ChevronDown, CornerDownRight, Flag } from "lucide-react";
import { campaignService } from "../../../services/campaignService";

const TimeLineView = () => {
  const months = [
    "Jan 2026",
    "Feb 2026",
    "Mar 2026",
    "Apr 2026",
    "May 2026",
    "Jun 2026",
    "Jul 2026",
    "Aug 2026",
    "Sep 2026",
    "Oct 2026",
    "Nov 2026",
    "Dec 2026",
  ];

  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await campaignService.getCampaigns();
        setCampaigns(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };
    fetchCampaigns();
  }, []);

  // Helper tính toán vị trí % trong năm 2026
  const getTimelinePos = (dateInput) => {
    if (!dateInput) return 0;
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const startOfYear = new Date(2026, 0, 1);
    const diff = date - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return Math.max(0, Math.min(100, (dayOfYear / 365) * 100));
  };

  const today = new Date();
  const todayPos = getTimelinePos(today);
  const todayFormatted = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthIdx = today.getMonth();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* 1. Header Timeline (Tháng) */}
      <div className="flex border-b border-slate-200 bg-slate-50/70">
        <div className="w-[280px] p-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider border-r border-slate-200 shrink-0">
          Chiến dịch / Đơn vị phụ trách
        </div>
        <div className="flex-1 flex overflow-x-auto min-w-[1000px]">
          {months.map((month, idx) => (
            <div
              key={month}
              className={`min-w-[100px] flex-1 p-3 text-center text-[11px] font-semibold border-r border-slate-100 last:border-r-0 ${
                idx === currentMonthIdx
                  ? "text-blue-700 font-bold bg-blue-50/60"
                  : "text-slate-500"
              }`}
            >
              {month}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Body Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Cột trái: Tên chiến dịch */}
        <div className="w-[280px] border-r border-slate-200 shrink-0 bg-white z-10 overflow-y-auto">
          <div className="divide-y divide-slate-100">
            {campaigns.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Chưa có dữ liệu chiến dịch
              </div>
            ) : (
              campaigns.map((camp) => (
                <CampaignNameRow
                  key={camp.id}
                  name={camp.name}
                  unit={camp.unit || camp.organization?.name || "Đoàn trường LHU"}
                  isParent
                />
              ))
            )}
          </div>
        </div>

        {/* Cột phải: Biểu đồ Bars */}
        <div className="flex-1 overflow-x-auto bg-white relative">
          <div className="divide-y divide-slate-100 relative min-h-[400px] min-w-[1000px]">
            {/* Vạch kẻ "Hôm nay" động theo ngày thực tế */}
            <div
              className="absolute top-0 bottom-0 w-px bg-rose-500 z-30 pointer-events-none"
              style={{ left: `${todayPos}%` }}
            >
              <div className="absolute top-0 -translate-x-1/2 bg-rose-600 text-white text-[9px] px-2 py-0.5 rounded font-bold whitespace-nowrap shadow-xs">
                Hôm nay ({todayFormatted})
              </div>
            </div>

            {/* Lưới kẻ mờ dọc cho mỗi tháng */}
            <div className="absolute inset-0 flex pointer-events-none">
              {months.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 min-w-[100px] border-r border-slate-100"
                />
              ))}
            </div>

            {campaigns.map((camp) => {
              const startPos = getTimelinePos(camp.start_date);
              const endPos = getTimelinePos(camp.end_date);
              const width = Math.max(3, endPos - startPos);

              const unitStr = String(camp.unit || camp.organization?.name || "");
              const barColor = unitStr.includes("CNTT")
                ? "bg-amber-500 hover:bg-amber-600"
                : unitStr.includes("Xây dựng")
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-blue-600 hover:bg-blue-700";

              return (
                <TimelineRow key={camp.id}>
                  <TimelineBar
                    color={barColor}
                    start={`${startPos}%`}
                    width={`${width}%`}
                    numericWidth={width}
                    label={camp.name}
                    dates={`${camp.start_date || ""} - ${camp.end_date || ""}`}
                    hasMilestone={camp.status === "ONGOING" || camp.status === "RUNNING"}
                  />
                </TimelineRow>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Chú giải (Legend) */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-5 items-center text-xs">
        <LegendItem color="bg-blue-600" label="Chiến dịch cấp Trường" />
        <LegendItem color="bg-emerald-500" label="Cấp Khoa / Viện" />
        <LegendItem color="bg-amber-500" label="Câu lạc bộ / Chi đoàn" />
        <LegendItem isMilestone label="Trọng điểm (Milestone)" />
        <span className="text-[11px] text-slate-400 ml-auto">
          * Trục thời gian chuẩn hóa theo niên khóa 2026
        </span>
      </div>
    </div>
  );
};

// --- Helper Components ---

const CampaignNameRow = ({ name, unit, isParent }) => (
  <div className="h-14 flex items-center px-4 justify-between bg-white hover:bg-slate-50/70 transition-colors">
    <div className="flex items-center gap-2.5 min-w-0 pr-2">
      <Flag size={14} className="text-blue-600 shrink-0" />
      <div className="min-w-0">
        <span className="block text-xs font-bold text-slate-800 truncate" title={name}>
          {name}
        </span>
        <span className="block text-[10px] text-slate-400 truncate mt-0.5">
          {unit}
        </span>
      </div>
    </div>
  </div>
);

const TimelineRow = ({ children }) => (
  <div className="h-14 flex items-center relative group hover:bg-slate-50/30 transition-colors">
    {children}
  </div>
);

const TimelineBar = ({ color, start, width, numericWidth, label, dates, hasMilestone }) => {
  const isShortBar = numericWidth < 14;

  return (
    <div
      className={`absolute h-7 ${color} rounded-md shadow-xs flex items-center px-2.5 z-10 transition-all cursor-pointer group`}
      style={{ left: start, width: width }}
      title={`${label} (${dates})`}
    >
      {hasMilestone && (
        <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-amber-400 rotate-45 border border-white" />
      )}

      {/* If bar is wide enough, show text inside; if short, show text flowing cleanly outside */}
      {isShortBar ? (
        <span className="absolute left-full ml-2 whitespace-nowrap text-[11px] font-semibold text-slate-700 bg-white/95 px-2 py-0.5 rounded border border-slate-200 shadow-xs z-20 pointer-events-none">
          {label}
        </span>
      ) : (
        <span className="text-[10px] font-bold text-white truncate drop-shadow-xs">
          {label}
        </span>
      )}

      {hasMilestone && (
        <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-rose-600 rotate-45 border border-white" />
      )}
    </div>
  );
};

const LegendItem = ({ color, label, isMilestone }) => (
  <div className="flex items-center gap-2">
    {isMilestone ? (
      <div className="w-2.5 h-2.5 bg-amber-400 rotate-45 border border-white shadow-xs shrink-0" />
    ) : (
      <div className={`w-2.5 h-2.5 rounded-full ${color} shrink-0`} />
    )}
    <span className="text-[11px] font-medium text-slate-600">
      {label}
    </span>
  </div>
);

export default TimeLineView;
