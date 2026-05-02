import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Bell,
  Calendar,
  QrCode,
  Search,
  Sparkles,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { systemService } from "../../../services/systemService";
import { userService } from "../../../services/userService";

const quickKeywords = ["Mùa hè xanh", "Tình nguyện", "Workshop AI"];

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [profileStats, setProfileStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dash, stats] = await Promise.all([
          systemService.getSystemDashboard(),
          userService.getProfileStats(),
        ]);
        setDashboardData(dash);
        setProfileStats(stats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const upcomingEvents = useMemo(() => {
    const source = dashboardData?.timelines || [];
    if (!searchQuery.trim()) return source;

    const query = searchQuery.toLowerCase();
    return source.filter((event) => {
      const label = (event.label || "").toLowerCase();
      const status = (event.status || "").toLowerCase();
      const date = (event.date || "").toLowerCase();
      return label.includes(query) || status.includes(query) || date.includes(query);
    });
  }, [dashboardData, searchQuery]);

  const latestCertificates = profileStats?.recent_certificates || [];

  return (
    <div className="space-y-6">
      <section className="app-card overflow-hidden">
        <div className="app-hero relative px-5 pb-8 pt-6 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%)]" />
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-white/78">Chào buổi sáng,</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                  {user?.full_name || "Sinh viên"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/82">
                  Hôm nay mình ưu tiên sự kiện mới, check-in nhanh và hồ sơ cá nhân
                  của bạn giống như trên app mobile.
                </p>
              </div>

              <div className="flex items-center gap-3 self-start rounded-full bg-white/14 px-4 py-2 text-white backdrop-blur">
                <Bell size={16} />
                <span className="text-sm font-semibold">
                  {new Date().toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="rounded-[26px] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-3 rounded-[20px] border border-slate-100 bg-slate-50 px-4 py-3">
                  <Search size={18} className="text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Tìm sự kiện, địa điểm, hoạt động..."
                    className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {quickKeywords.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => setSearchQuery(keyword)}
                      className="app-chip hover:bg-slate-50"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              <div className="app-gradient-panel flex flex-col justify-between gap-4 px-5 py-5 text-white">
                <div>
                  <div className="inline-flex rounded-full bg-white/18 px-3 py-1 text-[11px] font-black">
                    CHECK-IN NHANH
                  </div>
                  <h3 className="mt-3 text-2xl font-black">Quét QR trong vài giây</h3>
                  <p className="mt-2 text-sm leading-6 text-white/84">
                    Nút check-in luôn nổi bật ở trang chủ để vào sự kiện nhanh hơn.
                  </p>
                </div>

                <button className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-indigo-600 transition-transform hover:scale-[0.98]">
                  <QrCode size={18} />
                  Mở máy quét
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
          <div className="app-card-muted p-5">
            <Award size={18} className="text-indigo-600" />
            <p className="mt-4 text-3xl font-black text-slate-800">
              {user?.training_score || 0}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-500">Điểm rèn luyện</p>
          </div>

          <div className="app-card-muted p-5">
            <BadgeCheck size={18} className="text-emerald-500" />
            <p className="mt-4 text-3xl font-black text-slate-800">
              {user?.level || 1}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-500">Cấp độ hiện tại</p>
          </div>

          <div className="app-card-muted p-5">
            <Sparkles size={18} className="text-amber-500" />
            <p className="mt-4 text-3xl font-black text-slate-800">
              {latestCertificates.length}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-500">Chứng nhận gần đây</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="app-section-title">Hoạt động sắp tới</h3>
            </div>
            <button className="text-sm font-bold text-indigo-600">Xem tất cả</button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 4).map((event, index) => (
                <article key={event.id || index} className="app-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-500">
                        Sự kiện
                      </p>
                      <h4 className="mt-3 text-lg font-black leading-7 text-slate-800">
                        {event.label}
                      </h4>
                    </div>
                    <div className="rounded-[20px] bg-indigo-50 px-3 py-2 text-center text-indigo-600">
                      <p className="text-[10px] font-black uppercase">Ngày</p>
                      <p className="text-sm font-black">
                        {(event.date || "").split(" ")[0] || "--/--"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="app-chip">
                      <Calendar size={14} />
                      {event.status || "Sắp diễn ra"}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <div className="app-card p-8 text-center text-sm font-medium text-slate-500 md:col-span-2">
                Chưa có hoạt động phù hợp với từ khóa hiện tại.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="app-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                  Thông tin cá nhân
                </p>
                <h3 className="mt-3 text-2xl font-black text-slate-800">
                  {user?.full_name || "Sinh viên"}
                </h3>
                <p className="mt-2 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                  MSSV: {user?.student_id || "Chưa cập nhật"}
                </p>
              </div>
              <img
                src={
                  user?.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.student_id || "Felix"}`
                }
                alt="avatar"
                className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md"
              />
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-500">
                <span>Tiến trình cấp độ</span>
                <span className="text-slate-800">
                  {profileStats?.training_score || user?.training_score || 0}/
                  {(user?.level || 1) * 1000} XP
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
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
          </div>

          <div className="app-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">Chứng nhận mới nhất</h3>
              <button className="text-sm font-bold text-indigo-600">Mở hồ sơ</button>
            </div>

            <div className="mt-5 space-y-3">
              {latestCertificates.length > 0 ? (
                latestCertificates.slice(0, 3).map((certificate) => (
                  <div
                    key={certificate.id}
                    className="app-card-muted flex items-center justify-between p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-800">
                        {certificate.title}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {certificate.time || "Xác thực bởi hệ thống"}
                      </p>
                    </div>
                    <ArrowRight size={18} className="shrink-0 text-slate-400" />
                  </div>
                ))
              ) : (
                <div className="app-card-muted p-5 text-sm text-slate-500">
                  Chưa có chứng nhận nào được ghi nhận.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
