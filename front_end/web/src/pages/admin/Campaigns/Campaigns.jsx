import React, { useState } from "react";
import {
  List,
  GanttChartSquare as TimelineIcon,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";
// Import các sub-components
import ListView from "../../../components/admin/Campaign/ListView";
import TimeLineView from "../../../components/admin/Campaign/TimeLineView";
import CalendarView from "../../../components/admin/Campaign/CalendarView";

const Campaigns = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header điều hướng */}
      <div className="bg-white border-b border-slate-200 px-6 pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Toàn cảnh Chiến dịch & Sự kiện 2025-2026
          </h2>
          <div className="flex gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <TabButton
                active={activeTab === "list"}
                onClick={() => setActiveTab("list")}
                icon={<List size={16} />}
                label="Danh sách"
              />
              <TabButton
                active={activeTab === "timeLine"}
                onClick={() => setActiveTab("timeLine")}
                icon={<TimelineIcon size={16} />}
                label="Timeline"
              />
              <TabButton
                active={activeTab === "calendar"}
                onClick={() => setActiveTab("calendar")}
                icon={<CalendarIcon size={16} />}
                label="Lịch"
              />
            </div>
          </div>
        </div>

        {/* {activeTab !== "calendar" && (
          // <div className="flex gap-4 pb-4 items-center animate-in fade-in">
          //   <div className="relative flex-1 max-w-md">
          //     <Search
          //       className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          //       size={16}
          //     />
          //     <input
          //       type="text"
          //       placeholder="Tìm kiếm chiến dịch/khoa..."
          //       className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100"
          //     />
          //   </div>
          //   <FilterSelect label="Trạng thái: Tất cả" />
          //   <FilterSelect label="Đơn vị: Tất cả" />
          </div>
        )} */}
      </div>

      {/* Nội dung hiển thị dựa trên tab */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "list" && <ListView />}
        {activeTab === "timeLine" && <TimeLineView />}
        {activeTab === "calendar" && <CalendarView />}
      </div>
    </div>
  );
};

// Helper components nội bộ
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${active ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
  >
    {icon} {label}
  </button>
);

const FilterSelect = ({ label }) => (
  <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600">
    {label} <ChevronRight size={14} className="rotate-90 text-slate-400" />
  </button>
);

export default Campaigns;
