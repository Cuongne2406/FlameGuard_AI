import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  GanttChartSquare,
  List,
  Megaphone,
  Plus,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { campaignService } from "../../../services/campaignService";

const quickLinks = [
  {
    title: "Danh sách chiến dịch",
    description: "Quản lý dữ liệu, bộ lọc, ngân sách và thao tác tạo sửa chiến dịch.",
    path: "/admin/campaigns/list",
    icon: List,
  },
  {
    title: "Timeline",
    description: "Theo dõi tiến độ chiến dịch trên trục thời gian theo từng giai đoạn.",
    path: "/admin/campaigns/timeline",
    icon: GanttChartSquare,
  },
  {
    title: "Lịch sự kiện",
    description: "Quan sát chiến dịch theo lịch tháng để dễ điều phối nguồn lực.",
    path: "/admin/campaigns/calendar",
    icon: Calendar,
  },
];

const CampaignsPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    campaignService
      .getCampaigns()
      .then((data) => setCampaigns(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const stats = useMemo(() => {
    const total = campaigns.length;
    const running = campaigns.filter(
      (item) => item.status === "RUNNING" || item.status === "ONGOING",
    ).length;
    const completed = campaigns.filter((item) => item.progress === 100).length;
    const budget = campaigns.reduce((sum, item) => {
      const amount = Number.parseFloat(String(item.budget).replace("tr", ""));
      return sum + (Number.isNaN(amount) ? 0 : amount);
    }, 0);

    return { total, running, completed, budget };
  }, [campaigns]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
            Admin / Campaigns
          </span>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-100">
              <Megaphone size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800">
                Chiến dịch & Sự kiện
              </h1>
              <p className="text-sm font-medium text-slate-400">
                Trang tổng quan cho điều hướng nhanh, thống kê và quản lý chiến dịch theo route riêng.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            navigate("/admin/campaigns/list", {
              state: { openCreate: true },
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700"
        >
          <Plus size={18} />
          Tạo chiến dịch
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard label="Tổng chiến dịch" value={stats.total} sub="Đang quản lý" />
        <StatCard label="Đang diễn ra" value={stats.running} sub="Cần theo dõi" color="blue" />
        <StatCard label="Hoàn thành" value={stats.completed} sub="Đã khép lại" color="emerald" />
        <StatCard label="Ngân sách" value={`${stats.budget}tr`} sub="Tổng phân bổ" color="amber" />
      </div>

      <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-black text-slate-800">Điều hướng nhanh</h2>
          <p className="text-sm text-slate-400">
            Mỗi kiểu hiển thị được tách thành route độc lập để bookmark, mở trực tiếp và highlight chính xác trong sidebar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="group rounded-[1.75rem] border border-slate-100 bg-slate-50/60 p-5 transition-all hover:border-blue-200 hover:bg-blue-50/60"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-2xl bg-white p-3 text-blue-600 shadow-sm">
                    <Icon size={20} />
                  </div>
                  <ArrowRight
                    className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-600"
                    size={18}
                  />
                </div>
                <h3 className="text-base font-black text-slate-800">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, color = "slate" }) => {
  const colors = {
    slate: "bg-slate-50 text-slate-700",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className={`mb-4 inline-flex rounded-2xl px-3 py-2 text-xs font-bold ${colors[color]}`}>
        {label}
      </div>
      <p className="text-3xl font-black text-slate-800">{value}</p>
      <p className="mt-2 text-sm font-medium text-slate-400">{sub}</p>
    </div>
  );
};

export default CampaignsPage;
