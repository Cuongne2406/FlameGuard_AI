import React from "react";
import { ChevronDown, CornerDownRight } from "lucide-react";

const TimeLineView = () => {
  // Danh sách các tháng hiển thị trên header
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

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden animate-in slide-in-from-right-4 duration-500">
      {/* 1. Header Timeline (Tháng) */}
      <div className="flex border-b border-slate-100 bg-slate-50/50">
        <div className="w-[300px] p-4 font-bold text-[11px] text-slate-400 uppercase tracking-widest border-r border-slate-200 shrink-0">
          Chiến dịch / Đơn vị
        </div>
        <div className="flex-1 flex overflow-x-auto">
          {months.map((month) => (
            <div
              key={month}
              className={`min-w-[120px] flex-1 p-4 text-center text-[10px] font-bold border-r border-slate-100 last:border-r-0 ${month === "Feb 2026" ? "text-blue-600 bg-blue-50/30" : "text-slate-400"}`}
            >
              {month}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Body Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Vạch kẻ "Hôm nay" - Cố định vị trí dựa theo thời gian thực tế trong ảnh */}
        <div className="absolute left-[300px] ml-[15%] top-0 bottom-0 w-px bg-red-500 z-20 pointer-events-none">
          <div className="absolute top-0 -translate-x-1/2 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap shadow-sm">
            Hôm nay (14/02)
          </div>
        </div>

        {/* Cột trái: Tên chiến dịch */}
        <div className="w-[300px] border-r border-slate-200 shrink-0 bg-white z-10">
          <div className="divide-y divide-slate-50">
            <CampaignNameRow name="Chiến dịch Mùa Hè Xanh 2026" isParent />
            <CampaignNameRow name="Mặt trận Xây cầu (Khoa XD)" isSub />
            <CampaignNameRow name="Mặt trận Dạy học (Khoa CNTT)" isSub />
            <CampaignNameRow name="Tháng Thanh Niên" isParent />
            <CampaignNameRow name="Chào đón Tân Sinh viên K52" isParent />
          </div>
        </div>

        {/* Cột phải: Biểu đồ Bars */}
        <div className="flex-1 overflow-x-auto bg-white">
          <div className="divide-y divide-slate-50 relative min-h-[500px]">
            {/* Lưới kẻ mờ dọc cho mỗi tháng */}
            <div className="absolute inset-0 flex pointer-events-none">
              {months.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 min-w-[120px] border-r border-slate-200"
                ></div>
              ))}
            </div>

            {/* Bars: Mùa hè xanh */}
            <TimelineRow>
              <TimelineBar
                color="bg-blue-500"
                start="52%"
                width="30%"
                label="Mùa Hè Xanh 2026 (01/06 - 15/08)"
                hasMilestone
              />
            </TimelineRow>

            <TimelineRow>
              <TimelineBar color="bg-emerald-500" start="58%" width="15%" />
            </TimelineRow>

            <TimelineRow>
              <TimelineBar color="bg-orange-500" start="52%" width="18%" />
            </TimelineRow>

            {/* Bars: Tháng thanh niên */}
            <TimelineRow>
              <TimelineBar
                color="bg-blue-400"
                start="18%"
                width="10%"
                label="Tháng Thanh Niên"
                hasMilestone
              />
            </TimelineRow>

            {/* Bars: Tân sinh viên */}
            <TimelineRow>
              <TimelineBar
                color="bg-blue-300"
                start="85%"
                width="12%"
                label="Chào Tân SV K52"
              />
            </TimelineRow>
          </div>
        </div>
      </div>

      {/* 3. Chú giải (Legend) - Theo ảnh */}
      <div className="p-4 bg-white border-t border-slate-100 flex gap-6 items-center">
        <LegendItem color="bg-blue-500" label="Chiến dịch cấp Trường" />
        <LegendItem color="bg-emerald-500" label="Khoa Xây dựng" />
        <LegendItem color="bg-orange-500" label="Khoa CNTT" />
        <LegendItem isMilestone label="Sự kiện quan trọng (Milestone)" />
      </div>
    </div>
  );
};

// --- Helper Components ---

const CampaignNameRow = ({ name, isParent, isSub }) => (
  <div
    className={`h-14 flex items-center px-4 gap-2 ${isSub ? "bg-slate-50/30" : "bg-white"}`}
  >
    {isParent && <ChevronDown size={14} className="text-slate-400" />}
    {isSub && <CornerDownRight size={14} className="text-slate-300 ml-4" />}
    <div
      className={`flex items-center gap-2 ${isParent ? "font-bold text-slate-700" : "text-slate-500 text-xs font-medium"}`}
    >
      {isParent && <span className="text-red-500">🚩</span>}
      <span className="truncate leading-tight">{name}</span>
    </div>
  </div>
);

const TimelineRow = ({ children }) => (
  <div className="h-14 flex items-center relative group hover:bg-slate-50/40 transition-colors">
    {children}
  </div>
);

const TimelineBar = ({ color, start, width, label, hasMilestone }) => (
  <div
    className={`absolute h-6 ${color} rounded-md shadow-sm flex items-center px-3 z-10 transition-transform hover:scale-[1.02] cursor-pointer`}
    style={{ left: start, width: width }}
  >
    {hasMilestone && (
      <div className="absolute -left-1 -top-1 w-3 h-3 bg-yellow-400 rotate-45 border-2 border-white"></div>
    )}
    <span className="text-[9px] font-bold text-white truncate">{label}</span>
    {hasMilestone && (
      <div className="absolute -right-1 -top-1 w-3 h-3 bg-red-600 rotate-45 border-2 border-white"></div>
    )}
  </div>
);

const LegendItem = ({ color, label, isMilestone }) => (
  <div className="flex items-center gap-2">
    {isMilestone ? (
      <div className="w-3 h-3 bg-yellow-400 rotate-45 border border-white shadow-sm"></div>
    ) : (
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
    )}
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
      {label}
    </span>
  </div>
);

export default TimeLineView;
