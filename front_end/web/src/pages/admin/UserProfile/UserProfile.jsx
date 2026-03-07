import React, { useState } from "react";
import { User, ShieldCheck, Camera, Save } from "lucide-react";
import TabAccountInfo from "../../../components/admin/Profile/TabAccountInfo";
import TabSecurityLogin from "../../../components/admin/Profile/TabSecurityLogin";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header Profile */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hau"
              alt="Avatar"
            />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
            <Camera size={14} />
          </button>
        </div>

        <div className="z-10 text-center md:text-left space-y-1">
          <h2 className="text-2xl font-black text-slate-800">
            Lê Trọng Phúc Hậu
          </h2>
          <p className="text-sm font-bold text-blue-600">
            Super Admin • ban-it-truong
          </p>
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100">
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1.5 bg-slate-100/50 border border-slate-200 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${
            activeTab === "info"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <User size={16} /> Thông tin chung
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${
            activeTab === "security"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <ShieldCheck size={16} /> Bảo mật & Đăng nhập
        </button>
      </div>

      {/* Render Content */}
      <div className="transition-all duration-300">
        {activeTab === "info" ? <TabAccountInfo /> : <TabSecurityLogin />}
      </div>
    </div>
  );
};

export default UserProfile;
