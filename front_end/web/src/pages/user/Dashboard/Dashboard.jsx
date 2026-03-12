import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { systemService } from "../../../services/systemService";
import {
  Search,
  Bell,
  Sparkles,
  Trophy,
  Calendar,
  Wallet,
  Zap,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
         const data = await systemService.getSystemDashboard();
         setDashboardData(data);
      } catch (err) { console.error('Error fetching user dashboard:', err); }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Chào mừng */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Xin chào, {user?.full_name?.split(" ").pop() || "Sinh viên"}! 👋
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Hôm nay là {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })}
          </p>
        </div>

        {/* Thanh tìm kiếm nhanh */}
        <div className="relative w-full md:w-80 group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid Layout chính */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Cột trái (4/12) */}
        <div className="md:col-span-3 space-y-6">
          {/* Card Thông tin cá nhân nhanh */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="avatar"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center text-white">
                <Sparkles size={12} />
              </div>
            </div>
            <h3 className="font-bold text-slate-800">{user?.full_name || "Lê Trọng Phúc Hậu"}</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              MSSV: {user?.student_id || "123000926"}
            </p>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase">
              Lớp: 23CT112
            </span>
          </div>

          {/* Cấp độ đoàn viên */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Cấp độ đoàn viên
              </h4>
              <Trophy className="text-amber-500" size={18} />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 font-black text-2xl shadow-inner border border-amber-100/50">
                {user?.level || 5}
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-slate-800">{user?.training_score || 95}</span>
                  <span className="text-slate-400 text-xs font-bold">/100</span>
                </div>
                <p className="text-[10px] font-bold text-emerald-500 uppercase">
                  Top 5% toàn khoa
                </p>
              </div>
            </div>
            <button className="w-full py-2.5 bg-slate-50 hover:bg-blue-50 text-blue-600 rounded-xl text-[11px] font-black transition-colors flex items-center justify-center gap-2 border border-slate-100">
              <Sparkles size={14} /> Đoàn viên Ưu tú
            </button>
          </div>

          {/* Ví của tôi */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="text-slate-400" size={16} />
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Ví của tôi
              </h4>
            </div>
            <p className="text-[10px] text-slate-500 mb-1">
              Trạng thái phí tháng 3/2026
            </p>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-black text-emerald-600">
                Đã hoàn thành
              </span>
            </div>
            <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-[11px] font-black transition-all shadow-lg shadow-orange-200 uppercase tracking-widest">
              Nạp quỹ lớp
            </button>
          </div>
        </div>

        {/* Cột giữa (Trợ lý & Lịch - 6/12) */}
        <div className="md:col-span-6 space-y-6">
          {/* Trợ lý AI DYUS */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Sparkles size={80} className="text-blue-600" />
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">
                    Trợ lý ảo DYUS
                  </h4>
                  <p className="text-[10px] text-emerald-500 font-bold">
                    • Online - Sẵn sàng hỗ trợ
                  </p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-blue-100 transition-colors">
                Mentoring Mode
              </button>
            </div>

            <div className="bg-slate-50/50 rounded-2xl p-4 mb-4 border border-slate-100">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Chào Phúc Hậu! 👋 Mình thấy bạn đang phấn đấu danh hiệu{" "}
                <span className="text-blue-600 font-black">
                  "Sinh viên 5 Tốt"
                </span>
                . Hiện tại tiêu chí{" "}
                <span className="text-orange-500 font-black">Thể lực tốt</span>{" "}
                của bạn cần thêm một hoạt động. Mình đề xuất bạn tham gia giải
                chạy Marathon sắp tới nhé?"
              </p>
            </div>

            {/* Gợi ý sự kiện của AI */}
            {dashboardData?.suggestedEvent && (
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 font-bold">
                  💡
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[11px] font-black text-slate-800 truncate uppercase">
                    {dashboardData.suggestedEvent.name}
                  </h5>
                  <p className="text-[10px] text-slate-400 font-bold">
                    {dashboardData.suggestedEvent.date} • {dashboardData.suggestedEvent.location}
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black transition-transform hover:scale-105">
                  Đăng ký
                </button>
              </div>
            )}

            {/* Input AI */}
            <div className="relative">
              <input
                type="text"
                placeholder="Hỏi DYUS về lộ trình phát triển..."
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-4 pr-12 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-inner"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200 transition-transform active:scale-95">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Sắp diễn ra */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="text-orange-500" size={18} />
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                  Sắp diễn ra
                </h4>
              </div>
              <button className="text-[11px] font-black text-blue-600 hover:underline">
                Xem lịch
              </button>
            </div>

            <div className="flex gap-6 items-center overflow-x-auto pb-4 custom-scrollbar">
              {dashboardData?.timelines?.length > 0 ? dashboardData.timelines.map((event, idx) => (
                <div key={event.id || idx} className="flex gap-6 items-center min-w-[300px] shrink-0">
                  {/* Date Card */}
                  <div className="flex flex-col items-center justify-center w-20 h-24 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner">
                    <span className="text-[10px] font-black text-red-500 uppercase">
                      Bắt đầu
                    </span>
                    <span className="text-lg font-black text-slate-800 truncate px-2 w-full text-center">
                      {event.date?.split(' ')[0] || '12/03'}
                    </span>
                  </div>
                  {/* Event Info */}
                  <div className="flex-1 space-y-3">
                    <h4 className="text-base font-black text-slate-800 leading-tight">
                      {event.label}
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar size={12} />
                        <span className="text-[11px] font-bold">{event.status || 'Sắp diễn ra'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-slate-400 p-4">Không có sự kiện sắp tới</div>
              )}
            </div>
          </div>
        </div>

        {/* Cột phải (Thành tích & Yêu cầu - 3/12) */}
        <div className="md:col-span-3 space-y-6">
          {/* Thành tích mới nhất */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">
              Thành tích mới nhất
            </h4>

            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
              {/* Item 1 */}
              <div className="relative pl-8 group">
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center z-10 border border-white">
                  <Trophy size={12} />
                </div>
                <p className="text-[9px] font-bold text-slate-400 mb-1">
                  01/03/2026
                </p>
                <h5 className="text-[11px] font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase">
                  Giải Nhất Hackathon 2026
                </h5>
                <p className="text-[10px] text-slate-400 mb-2">
                  Cấp trường • Xác thực bởi Khoa CNTT
                </p>
                <button className="text-[10px] font-black text-blue-600 flex items-center gap-1">
                  Xem chứng nhận <ArrowRight size={10} />
                </button>
              </div>

              {/* Item 2 */}
              <div className="relative pl-8 group">
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center z-10 border border-white">
                  <Zap size={12} />
                </div>
                <p className="text-[9px] font-bold text-slate-400 mb-1">
                  20/02/2026
                </p>
                <h5 className="text-[11px] font-black text-slate-800 group-hover:text-red-600 transition-colors uppercase">
                  Hiến máu nhân đạo
                </h5>
                <p className="text-[10px] text-slate-400 mb-2">
                  Đợt 1/2026 • Được xác thực bởi Hội Chữ Thập Đỏ
                </p>
                <button className="text-[10px] font-black text-red-600 flex items-center gap-1">
                  Tải PDF <ArrowRight size={10} />
                </button>
              </div>
            </div>

            <button className="w-full mt-6 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors border-t border-slate-50 pt-4">
              Xem tất cả hoạt động
            </button>
          </div>

          {/* Yêu cầu nhanh */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] p-6 border border-blue-100/50 shadow-inner">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <Sparkles size={16} />
              <h4 className="text-[11px] font-black uppercase tracking-widest">
                Yêu cầu nhanh
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-4">
              Bạn cần giấy xác nhận để bổ sung hồ sơ vay vốn sinh viên?
            </p>
            <button className="w-full py-4 bg-white hover:bg-blue-600 hover:text-white text-blue-600 rounded-[1.5rem] text-[10px] font-black transition-all shadow-md shadow-blue-200/50 border border-blue-200 uppercase tracking-widest">
              1-Click Xin giấy xác nhận
            </button>
          </div>
        </div>
      </div>

      {/* Footer bản quyền */}
      <footer className="text-center py-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          © 2025 Digital Youth Union System (DYUS). Designed for the next
          generation.
        </p>
      </footer>
    </div>
  );
};

export default UserDashboard;
