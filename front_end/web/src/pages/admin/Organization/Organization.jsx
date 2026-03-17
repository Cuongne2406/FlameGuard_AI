import React, { useState, useEffect } from "react";
import { Plus, Download, Users, Briefcase } from "lucide-react";
import OrgChart from "../../../components/admin/Org/OrgChart"; // Sơ đồ cây
import UnitList from "../../../components/admin/Org/UnitList"; // Danh sách đơn vị
import MemberProfiles from "../../../components/admin/Org/MemberProfile"; // Hồ sơ cán bộ
import { organizationService } from "../../../services/organizationService";

const Organization = () => {
  // Quản lý tab đang hiển thị
  const [activeTab, setActiveTab] = useState("list");
  const [stats, setStats] = useState({ totalUnits: '0', totalLeaders: '0', totalMembers: '0', subInfo: '' });
  const [triggerCreate, setTriggerCreate] = useState(false);

  useEffect(() => {
    organizationService.getOrgStats().then(data => {
      if (data) setStats({
         totalUnits: data.totalUnits || '0',
         totalLeaders: data.totalLeaders || '0', 
         totalMembers: data.totalMembers || '0',
         subInfo: data.subInfo || ''
      });
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
            <Users size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Cơ cấu Tổ chức & Cán bộ
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={16} /> Xuất Danh sách
          </button> */}
          <button 
            onClick={() => {
              setActiveTab("list");
              setTriggerCreate(true);
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            <Plus size={16} /> Thêm Đơn vị
          </button>
        </div>
      </div>

      {/* 2. Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          icon={<Users size={20} />}
          label="Tổng nhân sự"
          value={stats.totalMembers}
          sub="Đoàn viên, sinh viên"
          color="emerald"
        />
      </div>

      {/* 3. Main Content Card */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        {/* Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-slate-50 overflow-x-auto scrollbar-hide">
          <TabTrigger
            id="chart"
            label="Sơ đồ Cây (Org Chart)"
            active={activeTab}
            onClick={setActiveTab}
          />
          <TabTrigger
            id="list"
            label="Danh sách Đơn vị"
            active={activeTab}
            onClick={setActiveTab}
          />
          <TabTrigger
            id="members"
            label="Hồ sơ Cán bộ"
            active={activeTab}
            onClick={setActiveTab}
          />
        </div>

        {/* 4. Content Area - Chuyển đổi giữa các Component */}
        <div className="p-6">
          {activeTab === "chart" && <OrgChart />}
          {activeTab === "list" && (
            <UnitList 
              triggerCreateModal={triggerCreate} 
              onModalClose={() => setTriggerCreate(false)} 
            />
          )}
          {activeTab === "members" && <MemberProfiles />}
        </div>
      </div>
    </div>
  );
};

// Component con: Thẻ thống kê nhanh
const StatSummary = ({ icon, label, value, sub, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5 shadow-sm">
      <div className={`p-4 rounded-2xl ${colors[color]}`}>{icon}</div>
      <div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-black text-slate-800">{value}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {label}
          </p>
        </div>
        <p className="text-xs font-medium text-slate-400">{sub}</p>
      </div>
    </div>
  );
};

// Component con: Nút Tab
const TabTrigger = ({ id, label, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-6 py-5 text-sm font-bold transition-all relative whitespace-nowrap ${
      active === id ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {label}
    {active === id && (
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>
    )}
  </button>
);

export default Organization;
