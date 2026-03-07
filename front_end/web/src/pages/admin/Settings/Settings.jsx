import React, { useState } from "react";
import { Settings, Shield, ClipboardList, Lock, Save } from "lucide-react";
import TabGeneral from "../../../components/admin/Settings/TabGeneral";
import TabRBAC from "../../../components/admin/Settings/TabRBAC";
import TabAuditLog from "../../../components/admin/Settings/TabAuditLog";
import TabSecurity from "../../../components/admin/Settings/TabSecurity";

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "Cài đặt Chung", icon: <Settings size={14} /> },
    { id: "rbac", label: "Phân quyền", icon: <Shield size={14} /> },
    { id: "audit", label: "Nhật ký", icon: <ClipboardList size={14} /> },
    { id: "security", label: "Bảo mật", icon: <Lock size={14} /> },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-black text-slate-800">
          Thiết lập Hệ thống
        </h2>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2">
          <Save size={16} /> Lưu Thay Đổi
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-200/50 p-1.5 rounded-2xl w-fit border border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black transition-all ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Rendering */}
      <div className="animate-in fade-in duration-300">
        {activeTab === "general" && <TabGeneral />}
        {activeTab === "rbac" && <TabRBAC />}
        {activeTab === "audit" && <TabAuditLog />}
        {activeTab === "security" && <TabSecurity />}
      </div>
    </div>
  );
};

export default SystemSettings;
