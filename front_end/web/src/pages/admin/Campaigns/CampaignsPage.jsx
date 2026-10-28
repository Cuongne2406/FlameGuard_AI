import React, { useEffect, useMemo, useState } from "react";
import {
  List,
  Calendar,
  GitBranch,
  Megaphone,
  Plus,
  PlayCircle,
  CheckCircle2,
  DollarSign,
  CalendarPlus
} from "lucide-react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { campaignService } from "../../../services/campaignService";
import ListView from "../../../components/admin/Campaign/ListView";
import TimeLineView from "../../../components/admin/Campaign/TimeLineView";
import CalendarView from "../../../components/admin/Campaign/CalendarView";

const CampaignsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // View state: 'list' | 'timeline' | 'calendar'
  const activeView = searchParams.get("view") || "list";

  const [campaigns, setCampaigns] = useState([]);
  const [triggerCreateModal, setTriggerCreateModal] = useState(false);

  useEffect(() => {
    if (location.state?.openCreate) {
      setTriggerCreateModal(true);
    }
  }, [location.state]);

  useEffect(() => {
    campaignService
      .getCampaigns()
      .then((data) => setCampaigns(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const stats = useMemo(() => {
    const total = campaigns.length;
    const running = campaigns.filter(
      (item) => item.status === "RUNNING" || item.status === "ONGOING"
    ).length;
    const completed = campaigns.filter(
      (item) => item.progress === 100 || item.status === "COMPLETED"
    ).length;
    const budgetTotal = campaigns.reduce((sum, item) => {
      const amount = Number.parseFloat(String(item.budget || 0).replace("tr", ""));
      return sum + (Number.isNaN(amount) ? 0 : amount);
    }, 0);

    return { total, running, completed, budgetTotal };
  }, [campaigns]);

  const handleViewChange = (view) => {
    setSearchParams({ view });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Trung tâm Quản lý Chiến dịch & Sự kiện
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Không gian điều phối phong trào thanh niên, lịch trình Gantt và hoạt động sự kiện toàn trường
          </p>
        </div>

        {/* 2 Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate("/admin/campaigns/calendar/create-event")}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition-colors"
          >
            <CalendarPlus size={15} />
            <span>+ Tạo Sự kiện</span>
          </button>

          <button
            onClick={() => {
              if (activeView === "list") {
                setTriggerCreateModal(true);
              } else {
                navigate("/admin/campaigns/create");
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus size={16} />
            <span>+ Tạo Chiến dịch</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Tổng Chiến dịch</span>
            <div className="text-2xl font-bold text-slate-800 tracking-tight">
              {stats.total}
            </div>
            <p className="text-[11px] text-slate-400">Niên khóa 2025-2026</p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <Megaphone size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Đang triển khai</span>
            <div className="text-2xl font-bold text-blue-600 tracking-tight">
              {stats.running}
            </div>
            <p className="text-[11px] text-blue-600 font-medium">Cần theo dõi sát</p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <PlayCircle size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Đã hoàn thành</span>
            <div className="text-2xl font-bold text-emerald-600 tracking-tight">
              {stats.completed}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">Đạt mục tiêu</p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Ngân sách Phân bổ</span>
            <div className="text-2xl font-bold text-slate-800 tracking-tight">
              {stats.budgetTotal > 0 ? `${stats.budgetTotal}tr` : "130tr"}
            </div>
            <p className="text-[11px] text-slate-400">Tổng quỹ giải ngân</p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      {/* View Switcher Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => handleViewChange("list")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            activeView === "list"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <List size={15} />
          <span>Danh sách Chiến dịch</span>
        </button>

        <button
          onClick={() => handleViewChange("timeline")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            activeView === "timeline"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <GitBranch size={15} />
          <span>Tiến độ Timeline (Gantt)</span>
        </button>

        <button
          onClick={() => handleViewChange("calendar")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            activeView === "calendar"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Calendar size={15} />
          <span>Lịch tháng Sự kiện</span>
        </button>
      </div>

      {/* Active View Render */}
      <div className="space-y-6">
        {activeView === "list" && (
          <ListView
            triggerCreateModal={triggerCreateModal}
            onModalClose={() => setTriggerCreateModal(false)}
          />
        )}

        {activeView === "timeline" && <TimeLineView />}

        {activeView === "calendar" && <CalendarView />}
      </div>
    </div>
  );
};

export default CampaignsPage;
