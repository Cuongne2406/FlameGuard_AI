import React, { useState, useContext, useEffect } from "react";
import {
  Trophy,
  Calendar,
  FileText,
  History,
  BarChart3,
  ShieldCheck,
  Medal
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import AwardPeriodsView from "../../../components/awards/AwardPeriodsView";
import AwardApplicationsView from "../../../components/awards/AwardApplicationsView";
import AwardHistoryView from "../../../components/awards/AwardHistoryView";
import AwardDashboardView from "../../../components/awards/AwardDashboardView";
import AwardLeaderboardPage from "./AwardLeaderboardPage";

const getEffectiveAwardRole = (user, roles = []) => {
  if (!user) return "ADMIN";
  const username = (user.student_id || user.email || "").toLowerCase();
  if (username === "chutich" || roles.includes("LEADER")) return "LEADER";
  if (username === "thanhpho" || roles.includes("PROVINCE")) return "PROVINCE";
  if (username === "admin" || roles.includes("UNIVERSITY_ADMIN")) return "ADMIN";
  if (roles.includes("FACULTY_ADMIN") || username.startsWith("truong")) return "SCHOOL";
  return "ADMIN";
};

const getRoleBadge = (role) => {
  switch (role) {
    case "ADMIN":
      return { label: "Ban Thường vụ Đoàn Trường (UNIVERSITY_ADMIN)", bg: "bg-blue-50 text-blue-700 border-blue-200" };
    case "PROVINCE":
      return { label: "Ban Thường vụ Đoàn Trường (UNIVERSITY_ADMIN)", bg: "bg-purple-50 text-purple-700 border-purple-200" };
    case "LEADER":
      return { label: "Hội đồng Khen thưởng Cấp Trường (LEADER)", bg: "bg-amber-50 text-amber-700 border-amber-200" };
    case "SCHOOL":
      return { label: "Ban Chấp hành Đoàn Khoa (FACULTY_ADMIN)", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    default:
      return { label: "Đoàn viên / Sinh viên", bg: "bg-slate-100 text-slate-700 border-slate-200" };
  }
};

const Awards = () => {
  const { user, roles } = useContext(AuthContext);
  const awardRole = getEffectiveAwardRole(user, roles);
  const roleBadge = getRoleBadge(awardRole);

  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(urlTab || "applications");

  useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const tabs = [
    { id: "periods", label: "Đợt xét chọn SV5T", icon: <Calendar size={15} /> },
    { id: "applications", label: "Danh sách Hồ sơ", icon: <FileText size={15} /> },
    { id: "history", label: "Lịch sử xét duyệt", icon: <History size={15} /> },
    { id: "dashboard", label: "Thống kê & Báo cáo", icon: <BarChart3 size={15} /> },
    { id: "leaderboard", label: "Bảng vàng Thi đua", icon: <Medal size={15} /> },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 animate-in fade-in duration-200 font-sans">
      {/* 1. TOP HEADER & ROLE BADGE */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
              <Trophy size={20} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Hệ thống Xét chọn Danh hiệu "Sinh viên 5 Tốt" Trực tuyến
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Quy trình thẩm định hồ sơ, minh chứng và phê duyệt danh hiệu Sinh viên 5 Tốt cấp Trường
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${roleBadge.bg}`}>
            <ShieldCheck size={14} />
            <span>{roleBadge.label}</span>
          </div>
        </div>
      </div>

      {/* 2. TAB NAVIGATION */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
        {activeTab === "periods" && (
          <AwardPeriodsView currentUser={user} role={awardRole} />
        )}
        {activeTab === "applications" && (
          <AwardApplicationsView currentUser={user} role={awardRole} />
        )}
        {activeTab === "history" && (
          <AwardHistoryView currentUser={user} role={awardRole} />
        )}
        {activeTab === "dashboard" && (
          <AwardDashboardView currentUser={user} role={awardRole} />
        )}
        {activeTab === "leaderboard" && (
          <AwardLeaderboardPage embedded={true} />
        )}
      </div>
    </div>
  );
};

export default Awards;
