import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Award,
  CheckCircle,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  Zap,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { userService } from "../../../services/userService";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profileStats, setProfileStats] = useState(null);
  const [skillData, setSkillData] = useState([]);
  const [recentCertificates, setRecentCertificates] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        const data = await userService.getProfileStats();
        setProfileStats(data);
        setSkillData(data.skills || []);
        setRecentCertificates(data.recent_certificates || []);
        setExperiences(data.experiences || []);
      } catch (error) {
        console.error("Failed to fetch profile stats:", error);
      }
    };

    fetchProfileStats();
  }, []);

  const normalizedSkills = useMemo(
    () =>
      skillData.length
        ? skillData.map((skill) => ({
            subject: skill.subject,
            score: skill.list_score || skill.A || 0,
          }))
        : [
            { subject: "Lãnh đạo", score: 85 },
            { subject: "Giao tiếp", score: 75 },
            { subject: "Kỹ thuật", score: 70 },
            { subject: "Sáng tạo", score: 80 },
          ],
    [skillData]
  );

  const selectedSkill = normalizedSkills[selectedSkillIndex] || normalizedSkills[0];

  return (
    <div className="space-y-6">
      <section className="app-card overflow-hidden">
        <div className="app-hero relative px-5 pb-8 pt-6 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%)]" />
          <div className="relative">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="relative">
                  <img
                    src={
                      user?.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.student_id || "Felix"}`
                    }
                    alt="Avatar"
                    className="h-24 w-24 rounded-full border-4 border-white/40 object-cover shadow-xl md:h-28 md:w-28"
                  />
                  <div className="absolute bottom-1 right-1 rounded-full border-2 border-white bg-white p-1 text-indigo-600">
                    <CheckCircle size={14} fill="currentColor" />
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-black tracking-tight text-white">
                    {user?.full_name || "Sinh viên"}
                  </h2>
                  <div className="mt-3 inline-flex rounded-full bg-white/16 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                    MSSV: {user?.student_id || "Chưa cập nhật"}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/82">
                    <span className="flex items-center gap-1.5">
                      <Zap size={14} />
                      {profileStats?.ranking || "Sinh viên nổi bật"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap size={14} />
                      {user?.university || "ĐH Lạc Hồng"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {user?.address || "Đồng Nai"}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] bg-white/16 p-4 text-white backdrop-blur">
                <p className="text-sm text-white/74">Tiến trình cấp độ</p>
                <p className="mt-3 text-2xl font-black">
                  {profileStats?.training_score || user?.training_score || 0}/
                  {(user?.level || 1) * 1000} XP
                </p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/18">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#F59E0B,#FBBF24)]"
                    style={{
                      width: `${Math.min(
                        (((profileStats?.training_score || user?.training_score || 0) /
                          ((user?.level || 1) * 1000)) *
                          100),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-[24px] bg-white/16 p-4 text-white backdrop-blur">
                <p className="text-sm text-white/74">Cấp độ hiện tại</p>
                <p className="mt-3 text-2xl font-black">Lvl {user?.level || 1}</p>
                <p className="mt-2 text-sm text-white/82">
                  Theo dõi điểm rèn luyện và huy hiệu giống app mobile.
                </p>
              </div>

              <div className="rounded-[24px] bg-white/16 p-4 text-white backdrop-blur">
                <p className="text-sm text-white/74">Chứng nhận gần đây</p>
                <p className="mt-3 text-2xl font-black">{recentCertificates.length}</p>
                <p className="mt-2 text-sm text-white/82">
                  Hồ sơ luôn ưu tiên các thành tích mới nhất.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.3fr_0.9fr] md:p-6">
          <div className="app-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="app-section-title text-[1.5rem]">Năng lực cá nhân</h3>
              <span className="app-chip">
                <Award size={14} />
                Theo dõi tiến bộ
              </span>
            </div>

            <div className="mt-6 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={normalizedSkills}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#64748B" }} />
                  <Radar
                    dataKey="score"
                    stroke="#4F46E5"
                    fill="#6366F1"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {normalizedSkills.map((skill, index) => (
                <button
                  key={skill.subject}
                  onClick={() => setSelectedSkillIndex(index)}
                  className={`${
                    index === selectedSkillIndex ? "app-chip app-chip-active" : "app-chip"
                  }`}
                >
                  {skill.subject}
                </button>
              ))}
            </div>

            <div className="app-card-muted mt-5 p-5">
              <p className="text-sm font-semibold text-slate-500">Chi tiết khi bấm</p>
              <h4 className="mt-3 text-3xl font-black text-slate-800">
                {selectedSkill?.subject}
              </h4>
              <p className="mt-2 text-lg font-black text-indigo-600">
                {selectedSkill?.score} điểm
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="app-card p-6">
              <h3 className="text-xl font-black text-slate-800">Chứng nhận mới nhất</h3>
              <div className="mt-5 space-y-3">
                {recentCertificates.length > 0 ? (
                  recentCertificates.slice(0, 4).map((certificate) => (
                    <div
                      key={certificate.id}
                      className="app-card-muted flex items-center justify-between p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-800">
                          {certificate.title}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock size={12} />
                          {certificate.time || "Xác thực bởi hệ thống"}
                        </p>
                      </div>
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                    </div>
                  ))
                ) : (
                  <div className="app-card-muted p-5 text-sm text-slate-500">
                    Chưa có chứng nhận nào.
                  </div>
                )}
              </div>
            </div>

            <div className="app-card p-6">
              <h3 className="text-xl font-black text-slate-800">Kinh nghiệm & hoạt động</h3>
              <div className="mt-5 space-y-4">
                {experiences.length > 0 ? (
                  experiences.slice(0, 4).map((experience) => (
                    <div key={experience.id} className="app-card-muted p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-black text-slate-800">
                            {experience.role}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {experience.location}
                          </p>
                        </div>
                        <span className="app-chip whitespace-nowrap">{experience.period}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="app-card-muted p-5 text-sm text-slate-500">
                    Chưa có hoạt động nổi bật được thêm vào hồ sơ.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
