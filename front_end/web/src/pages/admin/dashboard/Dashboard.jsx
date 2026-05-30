import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  ShieldAlert,
  Zap,
  Search,
  Info,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { systemService } from "../../../services/systemService";

const MainDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    timelines: [],
    risks: [],
    aiSentiment: [],
    aiKeywords: []
  });

  const [selectedYear, setSelectedYear] = useState("2025-2026");
  const [selectedSemester, setSelectedSemester] = useState("Học kỳ 1");

  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isSemesterOpen, setIsSemesterOpen] = useState(false);

  // --- REFS ĐỂ XỬ LÝ CLICK OUTSIDE ---
  const yearRef = useRef(null);
  const semesterRef = useRef(null);

  const years = ["2023-2024", "2024-2025", "2025-2026"];
  const semesters = ["Học kỳ 1", "Học kỳ 2", "Học kỳ Hè"];

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const data = await systemService.getSystemDashboard({ year: selectedYear, semester: selectedSemester });
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [selectedYear, selectedSemester]);

  // --- LOGIC: CLICK RA NGOÀI THÌ ĐÓNG CẢ HAI ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra nếu vị trí click không nằm trong cả 2 vùng Ref
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

  return (
    <div className="flex-1 bg-gray-50 min-h-screen p-6 overflow-y-auto">
      {/* --- TOP BAR --- */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Search className="text-blue-500" size={20} />
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
            Hệ thống Quản lý Đoàn - Hội DYUS
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Dropdown Năm học */}
          <div className="relative" ref={yearRef}>
            <button
              onClick={() => setIsYearOpen(!isYearOpen)}
              className={`flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border transition-all text-sm ${
                isYearOpen
                  ? "border-blue-500 ring-2 ring-blue-50"
                  : "border-slate-200 hover:border-blue-400"
              }`}
            >
              <span className="text-slate-500">Năm học:</span>
              <span className="font-semibold text-slate-700">
                {selectedYear}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isYearOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isYearOpen && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => {
                      setSelectedYear(y);
                      setIsYearOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${
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

          {/* Dropdown Học kỳ */}
          <div className="relative" ref={semesterRef}>
            <button
              onClick={() => setIsSemesterOpen(!isSemesterOpen)}
              className={`flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border transition-all text-sm ${
                isSemesterOpen
                  ? "border-blue-500 ring-2 ring-blue-50"
                  : "border-slate-200 hover:border-blue-400"
              }`}
            >
              <span className="text-slate-500">Học kỳ:</span>
              <span className="font-semibold text-slate-700">
                {selectedSemester}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isSemesterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isSemesterOpen && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {semesters.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSemester(s);
                      setIsSemesterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${
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

      {/* --- STATS CARDS (Hàng 1) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Tổng Đoàn viên"
          value={dashboardData.stats.totalMembers || "0"}
          sub={dashboardData.stats.memberGrowth || ""}
          icon={<UsersIcon />}
        />
        <StatCard
          title="Ngân sách khả dụng"
          value={dashboardData.stats.totalBudgetStr || "0 VNĐ"}
          sub={`${dashboardData.stats.budgetLeftPercent || 0}% còn lại`}
          progress={dashboardData.stats.budgetLeftPercent || 0}
          icon={<BankIcon />}
        />
        <StatCard
          title="Tổng sự kiện trong tuần này"
          value={dashboardData.stats.eventsThisWeek ?? "0"}
          sub={dashboardData.stats.eventsThisWeekLabel ? `Tuần: ${dashboardData.stats.eventsThisWeekLabel}` : "Tổng sự kiện 7 ngày qua"}
          icon={<CalendarIcon />}
        />
      </div>

      {/* --- TIMELINE SECTION --- */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Zap className="text-blue-500" size={20} />
            <h2 className="font-bold text-slate-800">
              Tiến độ Nhiệm kỳ & Chiến dịch trọng điểm
            </h2>
          </div>
        </div>
        <div className="space-y-6">
          {dashboardData.timelines.map((timeline) => (
            <ProgressRow
              key={timeline.id}
              label={timeline.label}
              date={timeline.date}
              percent={timeline.percent}
              status={timeline.status}
              color={timeline.color}
            />
          ))}
        </div>
      </div>

      {/* --- LOWER SECTION (Risks & AI) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-red-600 font-bold">
              <ShieldAlert size={20} />
              <h2>Cảnh báo & Kiểm soát Rủi ro</h2>
            </div>
            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">
              2 Critical
            </span>
          </div>
          <div className="space-y-4">
            {dashboardData.risks.map((risk) => (
              <RiskItem
                key={risk.id}
                title={risk.title}
                desc={risk.desc}
                color={risk.color}
              />
            ))}
          </div>
        </div>

        {/* AI Analytics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Zap className="text-indigo-600" size={18} />
            </div>
            <h2 className="font-bold text-slate-800">
              Góc Lắng nghe Sinh viên (AI)
            </h2>
            <span className="text-slate-400 text-xs font-normal ml-auto italic">
              Real-time Analysis
            </span>
          </div>
          <div className="flex items-center gap-8 flex-1">
            <div className="w-32 h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.aiSentiment}
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboardData.aiSentiment.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400">Positive</span>
                <span className="text-lg font-bold text-slate-800">
                  {dashboardData.aiSentiment.find(a => a.name === "Tích cực")?.value || 0}%
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {dashboardData.aiSentiment.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-slate-500">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Top Keywords
            </span>
            <div className="flex gap-2 flex-wrap">
              {dashboardData.aiKeywords.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-1 bg-slate-50 text-slate-500 rounded-md font-medium border border-slate-100 hover:bg-blue-50 hover:text-blue-600 cursor-default transition-colors"
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

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, sub, icon, progress }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
    <div className="space-y-2 w-full">
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      {progress && (
        <div className="w-full h-1.5 bg-slate-100 rounded-full my-2">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      <p
        className={`text-xs ${sub.includes("+") ? "text-green-500 font-medium" : "text-slate-400"}`}
      >
        {sub}
      </p>
    </div>
    <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
  </div>
);

const ProgressRow = ({ label, date, percent, status, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-semibold">
      <span className="text-slate-700">{label}</span>
      <span
        className={
          status === "Hoàn thành" ? "text-green-500" : "text-slate-400"
        }
      >
        {status || `${percent}%`}
      </span>
    </div>
    <p className="text-[10px] text-slate-400 mb-1">{date}</p>
    <div className="w-full h-2 bg-slate-100 rounded-full">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: percent ? `${percent}%` : "10%" }}
      ></div>
    </div>
  </div>
);

const RiskItem = ({ title, desc, color }) => (
  <div
    className={`${color} p-4 rounded-xl flex items-center justify-between border border-transparent hover:border-slate-200 transition-all`}
  >
    <div>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
    </div>
  </div>
);

// SVG Icons
const UsersIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3b82f6"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const BankIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#10b981"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21h18"></path>
    <path d="M3 10h18"></path>
    <path d="M5 6l7-3 7 3"></path>
    <path d="M4 10v11"></path>
    <path d="M20 10v11"></path>
    <path d="M8 14v3"></path>
    <path d="M12 14v3"></path>
    <path d="M16 14v3"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8b5cf6"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default MainDashboard;
