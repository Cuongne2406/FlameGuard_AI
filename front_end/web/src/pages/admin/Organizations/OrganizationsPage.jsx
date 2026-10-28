import React, { useEffect, useState } from "react";
import {
  Building2,
  GitBranch,
  UserRound,
  Users,
  ShieldCheck,
  Plus
} from "lucide-react";
import { useSearchParams, useLocation } from "react-router-dom";
import { organizationService } from "../../../services/organizationService";
import UnitList from "../../../components/admin/Org/UnitList";
import MemberProfile from "../../../components/admin/Org/MemberProfile";
import OrgChart from "../../../components/admin/Org/OrgChart";

const OrganizationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Tab state: 'units' | 'members' | 'chart'
  const activeTab = searchParams.get("tab") || "units";

  const [stats, setStats] = useState({
    totalUnits: "0",
    totalLeaders: "0",
    totalMembers: "0",
    subInfo: ""
  });

  const [triggerCreateModal, setTriggerCreateModal] = useState(false);

  useEffect(() => {
    if (location.state?.openCreate) {
      setTriggerCreateModal(true);
    }
  }, [location.state]);

  useEffect(() => {
    organizationService
      .getOrgStats()
      .then((data) => {
        if (!data) return;
        setStats({
          totalUnits: data.totalUnits || "0",
          totalLeaders: data.totalLeaders || "0",
          totalMembers: data.totalMembers || "0",
          subInfo: data.subInfo || ""
        });
      })
      .catch(console.error);
  }, []);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản trị Cơ cấu Tổ chức & Nhân sự
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Không gian quản lý tập trung hệ thống đơn vị, hồ sơ cán bộ Đoàn - Hội và sơ đồ tổ chức
          </p>
        </div>
      </div>

      {/* 4 Compact Metric Bar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Đơn vị trực thuộc</span>
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              {stats.totalUnits}
            </div>
            <p className="text-xs text-slate-500">Khoa, Chi đoàn, CLB</p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
            <Building2 size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Cán bộ chủ chốt</span>
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              {stats.totalLeaders}
            </div>
            <p className="text-xs text-emerald-600 font-medium">Đang phụ trách</p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <UserRound size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Đoàn viên - Hội viên</span>
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              {stats.totalMembers}
            </div>
            <p className="text-xs text-slate-500">{stats.subInfo || "Toàn trường"}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-500">Trạng thái Cơ cấu</span>
            <div className="text-xl font-bold text-emerald-600 tracking-tight">
              100%
            </div>
            <p className="text-xs text-emerald-600 font-medium">Đồng bộ hoàn tất</p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* Underline Tab Enterprise */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 sm:space-x-8 -mb-px overflow-x-auto" aria-label="Tabs">
          <button
            onClick={() => handleTabChange("units")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-xs transition-all whitespace-nowrap ${
              activeTab === "units"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 font-medium"
            }`}
          >
            <Building2 size={16} />
            <span>Danh sách Đơn vị & Chi đoàn</span>
          </button>

          <button
            onClick={() => handleTabChange("members")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-xs transition-all whitespace-nowrap ${
              activeTab === "members"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 font-medium"
            }`}
          >
            <UserRound size={16} />
            <span>Hồ sơ Cán bộ Đoàn - Hội</span>
          </button>

          <button
            onClick={() => handleTabChange("chart")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-xs transition-all whitespace-nowrap ${
              activeTab === "chart"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 font-medium"
            }`}
          >
            <GitBranch size={16} />
            <span>Sơ đồ Cơ cấu Tổ chức</span>
          </button>
        </nav>
      </div>

      {/* Tab Content Display */}
      <div className="space-y-6">
        {activeTab === "units" && (
          <UnitList
            triggerCreateModal={triggerCreateModal}
            onModalClose={() => setTriggerCreateModal(false)}
          />
        )}

        {activeTab === "members" && <MemberProfile />}

        {activeTab === "chart" && <OrgChart />}
      </div>
    </div>
  );
};

export default OrganizationsPage;
