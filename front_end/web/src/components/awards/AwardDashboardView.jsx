import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Flag,
  BarChart3,
  PieChart as PieIcon,
  RefreshCw,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { awardService } from "../../services/awardService";

// Enterprise chart color palette
const COLORS = ["#2563EB", "#059669", "#D97706", "#7C3AED", "#0284C7", "#E11D48"];
const POLITICAL_COLORS = {
  "Đảng viên": "#DC2626", // Red for party member
  "Đoàn viên": "#2563EB", // Blue for youth union
  "Khác": "#94A3B8",      // Neutral slate
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-md p-2.5 text-xs">
        <p className="font-semibold text-slate-800 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="flex items-center gap-2" style={{ color: entry.color || entry.fill }}>
            <span className="font-medium">{entry.name}:</span>
            <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AwardDashboardView = () => {
  const [stats, setStats] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);

  // Load periods
  useEffect(() => {
    const loadPeriods = async () => {
      try {
        const data = await awardService.getPeriods();
        setPeriods(data || []);
      } catch (err) {
        console.error("Error loading periods for dashboard:", err);
      }
    };
    loadPeriods();
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedPeriod) params.period_id = selectedPeriod;
      if (selectedYear) params.year = parseInt(selectedYear, 10);
      const data = await awardService.getDashboardStats(params);
      setStats(data);
    } catch (err) {
      console.error("Error fetching SV5T stats:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, selectedYear]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const cards = [
    {
      title: "Tổng số hồ sơ",
      value: stats?.total_applications ?? 0,
      icon: <FileText size={20} className="text-blue-600" />,
      bgIcon: "bg-blue-50",
      description: "Tất cả hồ sơ đề cử trong hệ thống",
    },
    {
      title: "Đảng viên",
      value: stats?.party_member_count ?? 0,
      icon: <Flag size={20} className="text-rose-600" />,
      bgIcon: "bg-rose-50",
      description: "Ứng viên là Đảng viên ĐCSVN",
    },
    {
      title: "Đoàn viên",
      value: stats?.union_member_count ?? 0,
      icon: <Users size={20} className="text-indigo-600" />,
      bgIcon: "bg-indigo-50",
      description: "Đoàn viên TNCS Hồ Chí Minh",
    },
    {
      title: "Đạt danh hiệu",
      value: stats?.approved_count ?? 0,
      icon: <CheckCircle2 size={20} className="text-emerald-600" />,
      bgIcon: "bg-emerald-50",
      description: "Chủ tịch hội đồng đã phê duyệt",
    },
    {
      title: "Không đạt",
      value: stats?.rejected_count ?? 0,
      icon: <XCircle size={20} className="text-rose-600" />,
      bgIcon: "bg-rose-50",
      description: "Hồ sơ không đủ điều kiện xét",
    },
    {
      title: "Đang xét duyệt",
      value: stats?.in_review_count ?? 0,
      icon: <Clock size={20} className="text-amber-600" />,
      bgIcon: "bg-amber-50",
      description: "Hồ sơ đang qua các vòng thẩm định",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. FILTER CONTROLS */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={20} />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Thống kê Tổng hợp Xét chọn SV5T</h3>
            <p className="text-[11px] text-slate-500">Dữ liệu thời gian thực cập nhật từ các cấp Hội Đồng</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Tất cả đợt khen thưởng</option>
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} ({p.name})
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Tất cả các năm</option>
            <option value="2026">Năm 2026</option>
            <option value="2025">Năm 2025</option>
            <option value="2024">Năm 2024</option>
          </select>

          <button
            type="button"
            onClick={fetchStats}
            className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
            title="Làm mới"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-blue-600" : ""} />
          </button>
        </div>
      </div>

      {/* 2. 6 SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{c.title}</span>
              <div className={`p-1.5 rounded-lg ${c.bgIcon}`}>{c.icon}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{loading ? "..." : c.value}</div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{c.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. 4 RECHARTS GRAPHS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Hồ sơ theo Đợt khen thưởng */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hồ sơ theo Đợt khen thưởng</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Số lượng hồ sơ tiếp nhận phân bổ theo từng đợt</p>
            </div>
            <BarChart3 size={16} className="text-slate-400" />
          </div>
          <div className="h-64">
            {stats?.by_period && stats.by_period.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.by_period} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="code" tick={{ fontSize: 11, fill: "#64748B" }} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Số lượng hồ sơ" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Chưa có dữ liệu theo đợt
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Tỷ lệ Đảng viên / Đoàn viên */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tỷ lệ Thành phần Đoàn - Đảng</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Cơ cấu Đảng viên, Đoàn viên trong hồ sơ đề cử</p>
            </div>
            <PieIcon size={16} className="text-slate-400" />
          </div>
          <div className="h-64 flex items-center justify-center">
            {stats?.political_ratio && stats.political_ratio.some((item) => item.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.political_ratio}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.political_ratio.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={POLITICAL_COLORS[entry.name] || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Chưa có dữ liệu thành phần chính trị
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Phân bổ theo Năm học */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Phân bổ theo Năm học của Sinh viên</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Số lượng hồ sơ tương ứng từ Sinh viên Năm 1 đến Năm 5</p>
            </div>
            <BarChart3 size={16} className="text-slate-400" />
          </div>
          <div className="h-64">
            {stats?.by_academic_year && stats.by_academic_year.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.by_academic_year} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Số sinh viên" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Chưa có dữ liệu năm học
              </div>
            )}
          </div>
        </div>

        {/* Chart 4: Phân bổ theo Đơn vị / Trường */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Phân bổ theo Trường / Đơn vị</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Số lượng hồ sơ đề cử từ từng đơn vị đào tạo</p>
            </div>
            <BarChart3 size={16} className="text-slate-400" />
          </div>
          <div className="h-64">
            {stats?.by_school && stats.by_school.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.by_school}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Hồ sơ" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Chưa có dữ liệu đơn vị
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardDashboardView;
