import React, { useState, useContext } from "react";
import {
  Trophy,
  Calendar,
  FileText,
  History,
  ShieldCheck,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import AwardPeriodsView from "../../../components/awards/AwardPeriodsView";
import AwardApplicationsView from "../../../components/awards/AwardApplicationsView";
import AwardHistoryView from "../../../components/awards/AwardHistoryView";

const SubAdminAwards = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("applications");

  const tabs = [
    { id: "applications", label: "Hồ sơ của Đơn vị", icon: <FileText size={16} /> },
    { id: "periods", label: "Đợt khen thưởng đang mở", icon: <Calendar size={16} /> },
    { id: "history", label: "Lịch sử duyệt & phản hồi", icon: <History size={16} /> },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 1. HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Trophy size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Quản lý Thi đua Sinh viên 5 Tốt · Cấp Khoa
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Sơ duyệt hồ sơ sinh viên Khoa, đính kèm minh chứng và bổ sung theo yêu cầu thẩm định của Đoàn Trường
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <ShieldCheck size={14} />
            <span>Ban Chấp hành Đoàn Khoa</span>
          </div>
        </div>
      </div>

      {/* 2. TAB NAVIGATION */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}
      <div>
        {activeTab === "applications" && (
          <AwardApplicationsView 
            currentUser={user} 
            role="SCHOOL" 
            organization_id={user?.managed_org_id || ""}
          />
        )}
        {activeTab === "periods" && (
          <AwardPeriodsView currentUser={user} role="SCHOOL" />
        )}
        {activeTab === "history" && (
          <AwardHistoryView currentUser={user} role="SCHOOL" />
        )}
      </div>
    </div>
  );
};

export default SubAdminAwards;