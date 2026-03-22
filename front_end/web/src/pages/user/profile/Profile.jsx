import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
} from "recharts";
import {
  CheckCircle,
  ExternalLink,
  FileDown,
  MapPin,
  GraduationCap,
  Award,
  Zap,
  X,
  Globe,
  Download,
  CheckCircle2,
  FileText,
  Clock,
} from "lucide-react";

import { userService } from "../../../services/userService";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [profileStats, setProfileStats] = useState(null);
  const [skillData, setSkillData] = useState([]);
  const [recentCertificates, setRecentCertificates] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        const data = await userService.getProfileStats();
        setProfileStats(data);
        setSkillData(data.skills || []);
        setRecentCertificates(data.recent_certificates || []);
        setExperiences(data.experiences || []);
      } catch (err) {
        console.error("Failed to fetch profile stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-3 md:p-8 font-sans relative">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* 1. COVER & BASIC INFO CARD */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <div className="h-32 md:h-40 bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 relative">
            <div className="absolute bottom-3 right-3 md:bottom-4 md:right-8 flex gap-2 md:gap-3">
              <button className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg md:rounded-xl text-white text-[10px] md:text-xs font-bold hover:bg-white/20 transition-all">
                <ExternalLink size={12} />
                <span className="hidden sm:inline">Link Hồ sơ</span>
              </button>

              {/* NÚT XUẤT CV ĐÃ ĐƯỢC FIX */}
              <button
                onClick={() => {
                  console.log("Opening Modal..."); // Debug check
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-white text-blue-700 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95 group z-20"
              >
                <FileDown size={12} className="group-hover:animate-bounce" />
                Xuất CV
              </button>
            </div>
          </div>

          <div className="px-5 md:px-8 pb-6 md:pb-8 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-10 md:-mt-12 relative z-10">
            <div className="relative group">
              <img
                src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.student_id || 'Felix'}`}
                alt="Avatar"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl bg-slate-100 object-cover"
              />
              <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 p-1 bg-blue-500 rounded-full border-2 border-white text-white">
                <CheckCircle size={14} fill="currentColor" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                  {user?.full_name || "Sinh viên"}
                </h2>
                <span className="text-[9px] md:text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 md:py-1 rounded-lg uppercase border border-blue-100">
                  MSSV: {user?.student_id || "Chưa cập nhật"}
                </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                <span className="text-blue-600 font-bold flex items-center gap-1">
                  <Zap size={14} fill="currentColor" /> {profileStats?.ranking || "SV loại Giỏi"}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap size={14} /> {user?.university || "ĐH Lạc Hồng"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {user?.address || "Đồng Nai"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* NỘI DUNG NĂNG LỰC & HÀNH TRÌNH (GIỮ NGUYÊN) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* ... (Phần Năng lực và Hành trình của bạn) ... */}
          <div className="lg:col-span-4 bg-white rounded-[1.5rem] p-5 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
              Năng lực
            </h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={skillData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <Radar
                    dataKey="A"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-[1.5rem] p-5 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
              Chứng nhận mới
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentCertificates.length > 0 ? (
                 recentCertificates.map(cert => (
                    <div key={cert.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h5 className="font-black text-xs uppercase">
                        {cert.title}
                      </h5>
                      <p className="text-[10px] text-slate-500">{cert.time}</p>
                    </div>
                 ))
              ) : (
                 <div className="col-span-full text-[10px] text-slate-400 font-bold">Chưa có chứng nhận nào.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. MODAL XUẤT PDF - FIXED PORTAL-LIKE STYLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-5xl h-[90vh] md:h-[85vh] mx-2 md:mx-4 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-4 md:p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <FileText size={20} />
                </div>
                <h3 className="font-black text-slate-800 uppercase text-sm md:text-base">
                  Tùy chỉnh & Xuất CV
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50">
              {/* Preview */}
              <div className="flex-[1.2] p-4 md:p-8 overflow-auto flex justify-center border-r border-slate-200">
                <div className="bg-white w-[595px] min-h-[842px] shadow-2xl p-10 origin-top scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-[0.9]">
                  <div className="border-b-4 border-blue-600 pb-4 mb-6">
                    <h1 className="text-3xl font-black text-slate-900 uppercase">
                      {user?.full_name || "Lê Trọng Phúc Hậu"}
                    </h1>
                    <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-1">
                      {profileStats?.ranking || "Sinh viên 5 Tốt | LHU"}
                    </p>
                    <div className="flex gap-4 mt-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <span className="bg-slate-100 px-2 py-1 rounded">
                        MSSV: {user?.student_id || "23CT112"}
                      </span>
                      <span>{user?.email || "letrongphuchau@email.com"}</span>
                      <span>{user?.phone_number || "(+84) 909 123 456"}</span>
                    </div>
                  </div>
                  {/* Summary */}
                  <div className="mb-6">
                    <h4 className="text-blue-600 font-black text-xs uppercase mb-2">
                      Tóm tắt
                    </h4>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      {profileStats?.summary || "Sinh viên năng động với nền tảng vững chắc về Công nghệ thông tin và kỹ năng lãnh đạo đã được kiểm chứng. Có kinh nghiệm tổ chức các sự kiện quy mô lớn và đạt nhiều giải thưởng trong các cuộc thi học thuật. Hướng tới mục tiêu trở thành một nhà quản lý dự án công nghệ chuyên nghiệp."}
                    </p>
                  </div>
                  {/* Experience */}
                  <div className="mb-6">
                    <h4 className="text-blue-600 font-black text-xs uppercase mb-3">
                      Kinh nghiệm & Hoạt động
                    </h4>
                    <div className="space-y-4">
                      {experiences.length > 0 ? (
                         experiences.map(exp => (
                            <div key={exp.id}>
                              <div className="flex justify-between items-start">
                                <h5 className="font-bold text-xs uppercase">
                                  {exp.role}
                                </h5>
                                <span className="text-[10px] text-slate-400">
                                  {exp.period}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 italic">
                                {exp.location}
                              </p>
                              <ul className="list-disc ml-4 mt-1 text-[10px] text-slate-600 space-y-1">
                                {exp.bullets?.map((bull, i) => (
                                   <li key={i}>{bull}</li>
                                ))}
                              </ul>
                            </div>
                         ))
                      ) : (
                         <div className="text-[10px] text-slate-400">Chưa có kinh nghiệm hoạt động nổi bật.</div>
                      )}
                    </div>
                  </div>
                  {/* Awards */}
                  <div className="mb-6">
                    <h4 className="text-blue-600 font-black text-xs uppercase mb-3">
                      Thành tích nổi bật
                    </h4>
                    <div className="space-y-3">
                      {recentCertificates.length > 0 ? (
                         recentCertificates.map(cert => (
                            <div key={`cv-cert-${cert.id}`} className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                              <div>
                                <h5 className="font-bold text-[11px]">
                                  {cert.title}
                                </h5>
                                <p className="text-[10px] text-slate-500">
                                  {cert.time}
                                </p>
                              </div>
                              <div className="w-8 h-8 bg-white border rounded flex items-center justify-center">
                                <Globe size={14} className="text-slate-300" />
                              </div>
                            </div>
                         ))
                      ) : (
                         <div className="text-[10px] text-slate-400">Chưa có thành tích nổi bật.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex-1 p-6 md:p-8 bg-white overflow-y-auto">
                {/* Section 1: Template */}
                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    Giao diện (Template)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="relative p-1 rounded-xl border-2 border-blue-600 bg-white group overflow-hidden">
                      <div className="aspect-[4/3] bg-slate-50 rounded-lg mb-2 border border-slate-100 flex flex-col p-2 gap-1">
                        <div className="h-1.5 w-1/2 bg-slate-200 rounded" />
                        <div className="h-1 w-full bg-slate-100 rounded" />
                        <div className="h-1 w-full bg-slate-100 rounded" />
                      </div>
                      <span className="text-[10px] font-black text-blue-600 uppercase">
                        Chuẩn ATS (Minimalist)
                      </span>
                      <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-0.5">
                        <CheckCircle2 size={12} />
                      </div>
                    </button>
                    <button className="p-1 rounded-xl border-2 border-slate-50 bg-white group opacity-50">
                      <div className="aspect-[4/3] bg-slate-50 rounded-lg mb-2 border border-slate-100" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Sáng tạo (Creative)
                      </span>
                    </button>
                  </div>
                </section>

                {/* Section 2: Language */}
                <section className="mt-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    Ngôn ngữ hiển thị
                  </h4>
                  <div className="flex p-1 bg-slate-50 rounded-xl">
                    <button className="flex-1 py-2 text-[10px] font-black bg-white shadow-sm rounded-lg text-slate-800">
                      Tiếng Việt
                    </button>
                    <button className="flex-1 py-2 text-[10px] font-bold text-slate-400">
                      Tiếng Anh (Auto-translate)
                    </button>
                  </div>
                </section>

                <section className="mt-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    Dữ liệu hiển thị
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Thông tin cơ bản",
                      "Biểu đồ năng lực",
                      "Lịch sử cống hiến",
                      "Chứng nhận & Giải thưởng",
                    ].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                        />
                        <span className="text-xs font-bold text-slate-600">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t bg-white flex flex-col sm:flex-row gap-3">
              <button className="flex-1 py-3 px-6 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase">
                Gửi qua Email
              </button>
              <button className="flex-[2] py-3 px-6 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                <Download size={16} /> Tải xuống PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
