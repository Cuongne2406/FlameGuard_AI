import React, { useState } from "react";
import { Settings, Shield, ClipboardList, Lock, Save } from "lucide-react";
import TabGeneral from "../../../components/admin/Settings/TabGeneral";
import TabRBAC from "../../../components/admin/Settings/TabRBAC";
import TabAuditLog from "../../../components/admin/Settings/TabAuditLog";
import TabSecurity from "../../../components/admin/Settings/TabSecurity";
import { systemService } from "../../../services/systemService";

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [pendingChanges, setPendingChanges] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await systemService.updateSettingsBatch(pendingChanges);
      alert("Đã lưu tất cả thay đổi thành công!");
      setPendingChanges({}); // Clear after save
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Lỗi khi lưu thiết lập. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

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
        <button 
          onClick={handleSave}
          disabled={isSaving || Object.keys(pendingChanges).length === 0}
          className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
            isSaving || Object.keys(pendingChanges).length === 0 
            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
            : "bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700"
          }`}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : <Save size={16} />} 
          {isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
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
        {activeTab === "general" && <TabGeneral onUpdate={(changes) => setPendingChanges(prev => ({ ...prev, ...changes }))} />}
        {activeTab === "rbac" && <TabRBAC onNavigateToLogs={() => setActiveTab("audit")} />}
        {activeTab === "audit" && <TabAuditLog />}
        {activeTab === "security" && <TabSecurity onUpdate={(changes) => setPendingChanges(prev => ({ ...prev, ...changes }))} />}
      </div>
    </div>
  );
};

export default SystemSettings;
