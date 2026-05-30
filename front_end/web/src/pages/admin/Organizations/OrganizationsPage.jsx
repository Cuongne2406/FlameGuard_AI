import React, { useEffect, useState } from "react";
import { ArrowRight, Briefcase, GitBranch, Plus, UserRound, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { organizationService } from "../../../services/organizationService";

const quickLinks = [
  {
    title: "Sơ đồ cây",
    description: "Theo dõi cấu trúc tổng thể và mối liên kết giữa các đơn vị.",
    path: "/admin/organizations/org-chart",
    icon: GitBranch,
  },
  {
    title: "Danh sách đơn vị",
    description: "Quản lý khoa, câu lạc bộ, đội nhóm và chi đoàn theo route riêng.",
    path: "/admin/organizations/units",
    icon: Briefcase,
  },
  {
    title: "Hồ sơ cán bộ",
    description: "Theo dõi nhân sự phụ trách, vai trò và tình trạng hoạt động.",
    path: "/admin/organizations/members",
    icon: UserRound,
  },
];

const OrganizationsPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUnits: "0",
    totalLeaders: "0",
    totalMembers: "0",
    subInfo: "",
  });

  useEffect(() => {
    organizationService
      .getOrgStats()
      .then((data) => {
        if (!data) return;

        setStats({
          totalUnits: data.totalUnits || "0",
          totalLeaders: data.totalLeaders || "0",
          totalMembers: data.totalMembers || "0",
          subInfo: data.subInfo || "",
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
            Admin / Organizations
          </span>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-100">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800">
                Cơ cấu Tổ chức & Cán bộ
              </h1>
              <p className="text-sm font-medium text-slate-400">
                Trang tổng quan cho điều hướng, thống kê và truy cập nhanh các phân hệ con.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            navigate("/admin/organizations/units", {
              state: { openCreate: true },
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700"
        >
          <Plus size={18} />
          Thêm đơn vị
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatSummary
          icon={<Briefcase size={20} />}
          label="Đơn vị trực thuộc"
          value={stats.totalUnits}
          sub={stats.subInfo}
          color="blue"
        />
        <StatSummary
          icon={<Users size={20} />}
          label="Cán bộ chủ chốt"
          value={stats.totalLeaders}
          sub="Đang đương nhiệm"
          color="purple"
        />
        <StatSummary
          icon={<UserRound size={20} />}
          label="Tổng nhân sự"
          value={stats.totalMembers}
          sub="Đoàn viên, sinh viên"
          color="emerald"
        />
      </div>

      <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-black text-slate-800">Điều hướng nhanh</h2>
          <p className="text-sm text-slate-400">
            Mỗi nhóm chức năng giờ có URL riêng để deep link, bookmark và highlight đúng trên sidebar.
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

const StatSummary = ({ icon, label, value, sub, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="flex items-center gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className={`rounded-2xl p-4 ${colors[color]}`}>{icon}</div>
      <div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-black text-slate-800">{value}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {label}
          </p>
        </div>
        <p className="text-xs font-medium text-slate-400">{sub}</p>
      </div>
    </div>
  );
};

export default OrganizationsPage;
