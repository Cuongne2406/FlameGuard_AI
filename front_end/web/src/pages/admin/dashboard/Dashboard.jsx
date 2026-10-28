import React, { useState, useRef, useEffect } from "react";
import {
  Users,
  Wallet,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ShieldAlert,
  Zap,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Clock,
  Sparkles,
  FileText,
  Trophy,
  AlertTriangle
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { systemService } from "../../../services/systemService";

const MainDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    timelines: [],
    risks: [],
    pendingApprovals: [],
    aiSentiment: [],
    aiKeywords: []
  });

  const [selectedYear, setSelectedYear] = useState("2025-2026");
  const [selectedSemester, setSelectedSemester] = useState("Học kỳ 1");
  const [approvalTab, setApprovalTab] = useState("ALL"); // ALL, SV5T, FINANCE, DOCUMENT

  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isSemesterOpen, setIsSemesterOpen] = useState(false);

  const navigate = useNavigate();
  const yearRef = useRef(null);
  const semesterRef = useRef(null);

  const years = ["2023-2024", "2024-2025", "2025-2026"];
  const semesters = ["Học kỳ 1", "Học kỳ 2", "Học kỳ Hè"];

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await systemService.getSystemDashboard({
        year: selectedYear,
        semester: selectedSemester
      });
      setDashboardData(data || {});
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedYear, selectedSemester]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        yearRef.current &&
        !yearRef.current.contains(event.target) &&
        semesterRef.current &&
        !semesterRef.current.contains(event.target)
      ) {
        setIsYearOpen(false);
        setIsSemesterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const stats = dashboardData.stats || {};
  const timelines = dashboardData.timelines || [];
  const risks = dashboardData.risks || [];
  const pendingApprovals = dashboardData.pendingApprovals || [];
  const aiSentiment = dashboardData.aiSentiment || [];
  const aiKeywords = dashboardData.aiKeywords || [];

  // Filter approvals by tab
  const filteredApprovals = pendingApprovals.filter((item) => {
    if (approvalTab === "ALL") return true;
    return item.module === approvalTab;
  });

  const positiveItem = aiSentiment.find((a) => a.name === "Tích cực");
  const positiveVal = positiveItem ? positiveItem.value : 73;

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto font-sans">
      {/* --- TOP BAR --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Bảng điều khiển Điều hành Trung tâm
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng hợp dữ liệu phong trào, nhân sự, tài chính và chỉ số phê duyệt toàn diện
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Refresh Button */}
          <button
            onClick={fetchDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-medium text-slate-600 shadow-xs transition-colors"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Cập nhật</span>
          </button>

          {/* Year Dropdown */}
          <div className="relative" ref={yearRef}>
            <button
              onClick={() => setIsYearOpen(!isYearOpen)}
              className={`flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border text-xs transition-all shadow-xs ${
                isYearOpen
                  ? "border-blue-500 ring-2 ring-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="text-slate-400">Năm học:</span>
              <span className="font-semibold text-slate-700">{selectedYear}</span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-150 ${
                  isYearOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isYearOpen && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => {
                      setSelectedYear(y);
                      setIsYearOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs hover:bg-blue-50 transition-colors ${
                      selectedYear === y
                        ? "text-blue-600 font-bold bg-blue-50/50"
                        : "text-slate-600"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Semester Dropdown */}
          <div className="relative" ref={semesterRef}>
            <button
              onClick={() => setIsSemesterOpen(!isSemesterOpen)}
              className={`flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border text-xs transition-all shadow-xs ${
                isSemesterOpen
                  ? "border-blue-500 ring-2 ring-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="text-slate-400">Học kỳ:</span>
              <span className="font-semibold text-slate-700">{selectedSemester}</span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-150 ${
                  isSemesterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSemesterOpen && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {semesters.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSemester(s);
                      setIsSemesterOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs hover:bg-blue-50 transition-colors ${
                      selectedSemester === s
                        ? "text-blue-600 font-bold bg-blue-50/50"
                        : "text-slate-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- ROW 1: 4 ENTERPRISE KPI CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Members */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-shadow flex items-start justify-between">
          <div className="space-y-1.5 flex-1 min-w-0 pr-2">
            <span className="text-xs font-medium text-slate-500">Tổng Đoàn viên - Sinh viên</span>
            <div className="text-2xl font-bold text-slate-800 tracking-tight">
              {stats.totalMembers?.toLocaleString("vi-VN") || "0"}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              {stats.memberGrowth || "+8.4% so với kỳ trước"}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
            <Users size={20} />
          </div>
        </div>

        {/* KPI 2: Available Budget */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-shadow flex items-start justify-between">
          <div className="space-y-1.5 flex-1 min-w-0 pr-2">
            <span className="text-xs font-medium text-slate-500">Ngân sách Khả dụng</span>
            <div className="text-2xl font-bold text-slate-800 tracking-tight truncate">
              {stats.availableBudgetStr || "0 VNĐ"}
            </div>
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.budgetLeftPercent || 0}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 flex justify-between">
                <span>Còn {stats.budgetLeftPercent || 0}%</span>
                <span className="text-slate-400">Tổng: {stats.totalBudgetStr || "0 VNĐ"}</span>
              </p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <Wallet size={20} />
          </div>
        </div>

        {/* KPI 3: Events & Campaigns */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-shadow flex items-start justify-between">
          <div className="space-y-1.5 flex-1 min-w-0 pr-2">
            <span className="text-xs font-medium text-slate-500">Sự kiện & Phong trào</span>
            <div className="text-2xl font-bold text-slate-800 tracking-tight">
              {stats.eventsThisWeek ?? "0"}
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {stats.eventsThisWeekLabel ? `Tuần: ${stats.eventsThisWeekLabel}` : "Sự kiện đang triển khai"}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
            <Calendar size={20} />
          </div>
        </div>

        {/* KPI 4: Pending Approvals */}
        <div
          onClick={() => {
            const el = document.getElementById("approval-queue-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-shadow flex items-start justify-between cursor-pointer group"
        >
          <div className="space-y-1.5 flex-1 min-w-0 pr-2">
            <span className="text-xs font-medium text-slate-500">Đang chờ Phê duyệt</span>
            <div className="text-2xl font-bold text-amber-600 tracking-tight">
              {stats.pendingApprovalsCount ?? "0"}
            </div>
            <p className="text-[11px] text-amber-600 group-hover:text-amber-700 font-semibold flex items-center gap-1">
              Xem hàng đợi xử lý <ArrowRight size={12} />
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* --- ROW 2: CENTRALIZED APPROVAL QUEUE & TIMELINES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="approval-queue-section">
        {/* Left Column (7/12): Centralized Approval Queue */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-100 text-amber-700">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 leading-none">
                  Hàng đợi Phê duyệt Tập trung
                </h2>
                <span className="text-[11px] text-slate-400">
                  {pendingApprovals.length} đề xuất đang chờ Ban Thường vụ xử lý
                </span>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
              {[
                { key: "ALL", label: "Tất cả" },
                { key: "SV5T", label: "Hồ sơ SV5T" },
                { key: "FINANCE", label: "Kinh phí" },
                { key: "DOCUMENT", label: "Văn bản" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setApprovalTab(tab.key)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    approvalTab === tab.key
                      ? "bg-slate-800 text-white font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Approvals Table / List */}
          <div className="flex-1 overflow-x-auto divide-y divide-slate-100">
            {filteredApprovals.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Không có đề xuất nào đang chờ duyệt trong mục này
              </div>
            ) : (
              filteredApprovals.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 border ${
                        item.module === "SV5T"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : item.module === "FINANCE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {item.moduleLabel || item.module}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{item.requester}</span>
                        {item.amountStr && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-emerald-600">
                              {item.amountStr}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span>{item.createdAt}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(item.targetUrl)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold rounded-lg text-xs shrink-0 transition-colors"
                  >
                    Xử lý ngay <ArrowRight size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (5/12): Timelines of Campaigns & Events */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                  <Zap size={16} />
                </div>
                <h2 className="text-sm font-bold text-slate-800">
                  Tiến độ Chiến dịch & Sự kiện
                </h2>
              </div>
              <button
                onClick={() => navigate("/admin/campaigns")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Xem tất cả <ChevronDown size={14} className="-rotate-90" />
              </button>
            </div>

            <div className="space-y-4">
              {timelines.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Chưa có chiến dịch nào được khởi tạo
                </div>
              ) : (
                timelines.map((camp) => (
                  <div key={camp.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800 truncate pr-2">
                        {camp.name || camp.label}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          camp.status === "Hoàn thành"
                            ? "bg-emerald-50 text-emerald-700"
                            : camp.status === "Đang diễn ra"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {camp.status || `${camp.percent}%`}
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>{camp.orgName || "Đoàn trường LHU"}</span>
                      <span>{camp.date}</span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${camp.color || "bg-blue-600"}`}
                        style={{ width: `${camp.percent || 15}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Theo dõi kế hoạch hành động toàn trường</span>
            <button
              onClick={() => navigate("/admin/campaigns?view=timeline")}
              className="text-blue-600 hover:underline font-semibold"
            >
              Góc nhìn Gantt →
            </button>
          </div>
        </div>
      </div>

      {/* --- ROW 3: RISK CONTROL & AI SENTIMENT CORNER --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Risk Controls */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert size={18} />
              <h2 className="text-sm font-bold text-slate-800">
                Cảnh báo & Kiểm soát Rủi ro
              </h2>
            </div>
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2 py-0.5 rounded-md">
              {risks.length} Mục cần lưu ý
            </span>
          </div>

          <div className="space-y-3">
            {risks.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Hệ thống ổn định, không có rủi ro nào ghi nhận
              </div>
            ) : (
              risks.map((risk) => (
                <div
                  key={risk.id}
                  className={`p-3.5 rounded-lg border flex items-start justify-between gap-3 ${
                    risk.color || "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={15} className="shrink-0 text-amber-600" />
                      <h4 className="text-xs font-bold leading-tight">
                        {risk.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-normal pl-5">
                      {risk.desc}
                    </p>
                  </div>

                  {risk.actionUrl && (
                    <button
                      onClick={() => navigate(risk.actionUrl)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 shrink-0 shadow-2xs transition-colors"
                    >
                      Kiểm tra
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: AI Sentiment Corner */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
                  <Sparkles size={16} />
                </div>
                <h2 className="text-sm font-bold text-slate-800">
                  Góc Lắng nghe Sinh viên (AI Sentiment)
                </h2>
              </div>
              <button
                onClick={() => navigate("/admin/ai")}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Chi tiết AI →
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Donut Chart */}
              <div className="w-36 h-36 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aiSentiment}
                      innerRadius={42}
                      outerRadius={58}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {aiSentiment.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-slate-400 font-medium">Tích cực</span>
                  <span className="text-lg font-black text-slate-800">
                    {positiveVal}%
                  </span>
                </div>
              </div>

              {/* Legend & Breakdown */}
              <div className="flex-1 w-full space-y-2.5">
                {aiSentiment.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-600 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Keywords / Hashtags */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Từ khóa thảo luận nổi bật
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {aiKeywords.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md font-medium border border-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
