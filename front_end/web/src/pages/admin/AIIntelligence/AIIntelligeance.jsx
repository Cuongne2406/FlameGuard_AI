import React from "react";
import {
  Brain,
  Activity,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Zap,
  Clock,
  ChevronDown,
} from "lucide-react";

const IntelligeanceAI = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. TOP STATUS BAR */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
            <Brain size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">
              Trung tâm Phân tích & Giám sát Thông minh
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              (DYUS Brain)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <StatusIndicator
            label="AI Engine"
            status="Online"
            color="text-emerald-500"
          />
          <div className="w-px h-8 bg-slate-100"></div>
          <StatusIndicator
            label="Đang xử lý"
            value="12,458"
            sub="luồng dữ liệu"
          />
          <div className="w-px h-8 bg-slate-100"></div>
          <StatusIndicator
            label="Cập nhật"
            value="Real-time"
            icon={<Clock size={12} />}
          />
        </div>
      </div>

      {/* 2. MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Box: Biểu đồ Cảm xúc Sinh viên (Occupies 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <Activity size={18} className="text-indigo-500" /> Biểu đồ Cảm
                xúc Sinh viên (7 Ngày)
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Phân tích sắc thái bình luận từ MXH & Cổng thông tin
              </p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600">
              Toàn trường <ChevronDown size={14} />
            </button>
          </div>

          {/* Simulated Chart Area */}
          <div className="h-48 flex items-end justify-between px-4 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Floating Warning Box like in the image */}
              <div className="bg-white/80 backdrop-blur-md border border-red-100 p-4 rounded-2xl shadow-2xl flex items-start gap-3 z-10 animate-bounce-subtle">
                <div className="p-2 bg-red-50 text-red-500 rounded-full">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-red-600 uppercase">
                    Cảnh báo Tiêu cực (Thứ 6)
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Phát hiện lượng lớn phản hồi tại <strong>Khu B</strong>
                    <br />
                    liên quan đến từ khóa:
                  </p>
                  <div className="flex gap-1 mt-2">
                    <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[9px] font-bold rounded">
                      #Giữ_xe
                    </span>
                    <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[9px] font-bold rounded">
                      #Kẹt_thang_máy
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Chart Bars/Lines placeholder */}
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-2 group">
                <div
                  className={`w-1 group-hover:w-2 transition-all rounded-full bg-slate-100 h-32 relative overflow-hidden`}
                >
                  <div
                    className={`absolute bottom-0 w-full ${day === "T6" ? "bg-red-400 h-[80%]" : "bg-indigo-400 h-[40%] opacity-20"}`}
                  ></div>
                </div>
                <span
                  className={`text-[10px] font-black ${day === "T6" ? "text-red-500" : "text-slate-300"}`}
                >
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Box: Kiểm duyệt Tự động (Right Sidebar) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm">
              <ShieldCheck size={18} className="text-indigo-600" /> Kiểm duyệt
              Tự động
            </h3>
            <span className="bg-blue-600 text-[9px] text-white px-2 py-0.5 rounded-full font-black animate-pulse">
              Live Stream
            </span>
          </div>

          <div className="space-y-4 flex-1">
            <AuditItem
              status="Auto-Published"
              time="09:41 AM"
              text='"Hoạt động Mùa Hè Xanh năm nay tổ chức rất chuyên nghiệp!"'
              color="text-emerald-500 bg-emerald-50"
            />
            <AuditItem
              status="Auto-Hidden & Reported"
              time="09:40 AM"
              text='"*** *** ban tổ chức làm ăn như ***..."'
              color="text-red-500 bg-red-50"
            />
            <AuditItem
              status="Flagged for Review"
              time="09:38 AM"
              text='"Nên xem lại cách bố trí bãi xe, sinh viên chờ quá lâu."'
              color="text-amber-500 bg-amber-50"
            />
          </div>
        </div>

        {/* Box: Dự báo Sự kiện (Bottom Left) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden">
          <div>
            <h3 className="font-black text-slate-800 flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-indigo-600" /> Dự báo Sự
              kiện: Ngày hội Việc làm
            </h3>
            <div className="relative h-32 w-full bg-slate-50 rounded-2xl flex items-center justify-center">
              {/* Visual of the curve */}
              <div className="absolute inset-0 p-4">
                <div className="w-full h-full border-b border-l border-slate-200 relative">
                  {/* <div className="absolute bottom-10 left-0 w-full h-20 border-t-2 border-dashed border-red-300">
                    <span className="absolute -top-6 right-0 text-[8px] font-black text-red-400 bg-white px-2">
                      Max Capacity (Hội trường A)
                    </span>
                  </div> */}
                  <svg
                    className="absolute bottom-0 left-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,80 Q25,75 50,40 T100,0"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="4"
                    />
                  </svg>
                </div>
              </div>
              <div className="z-10 bg-white/90 px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 shadow-sm border border-indigo-100">
                Confidence: 94%
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Dự báo tham dự
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-800">
                  2,500
                </span>
                <span className="text-xs font-bold text-slate-400">người</span>
              </div>
              <p className="text-red-500 text-[11px] font-bold flex items-center gap-1">
                <TrendingUp size={14} /> ~ 150% Công suất Hội trường A
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-700 font-black text-[11px] mb-2">
                <Zap size={14} /> AI Recommendation
              </div>
              <p className="text-[10px] text-indigo-600/80 leading-relaxed font-medium mb-3">
                Mở thêm <strong>Hội trường C</strong> để phân tải lưu lượng. Cần
                15 TNV hỗ trợ điều phối.
              </p>
              <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-indigo-100">
                Phê duyệt đề xuất
              </button>
            </div>
          </div>
        </div>

        {/* Box: Chatbot Assistant (Bottom Right) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <h3 className="font-black text-slate-800 flex items-center gap-2 mb-6">
            <MessageSquare size={18} className="text-emerald-500" /> Chatbot
            Assistant
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <div className="text-xl font-black text-emerald-700">1,500</div>
              <div className="text-[8px] font-bold text-emerald-600 uppercase">
                Câu hỏi đã trả lời
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
              <div className="text-xl font-black text-blue-700">45h</div>
              <div className="text-[8px] font-bold text-blue-600 uppercase">
                Thời gian tiết kiệm
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Chủ đề HOT (24h)
            </h4>
            <div className="space-y-3">
              <HotTopic
                label="1. Quy chế điểm rèn luyện"
                count="450 q"
                color="bg-emerald-400"
                width="w-full"
              />
              <HotTopic
                label="2. Lịch thi Học kỳ 1"
                count="210 q"
                color="bg-emerald-400"
                width="w-[45%]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pb-4">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
          © 2025 Digital Youth Union System (DYUS). Powered by DYUS Brain AI
          Core 2.0.
        </p>
      </div>
    </div>
  );
};

// --- Sub-components ---

const StatusIndicator = ({ label, value, status, sub, icon, color }) => (
  <div className="flex items-center gap-2">
    <div className="text-right">
      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
        {label}
      </div>
      <div className="flex items-center justify-end gap-1">
        {icon && <span className="text-slate-400">{icon}</span>}
        <span
          className={`text-xs font-black ${status ? color : "text-slate-700"}`}
        >
          {status || value}
        </span>
        {sub && (
          <span className="text-[9px] font-bold text-slate-400">{sub}</span>
        )}
      </div>
    </div>
    {status && (
      <div
        className={`w-2 h-2 rounded-full animate-pulse ${color.replace("text", "bg")}`}
      ></div>
    )}
  </div>
);

const AuditItem = ({ status, time, text, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <span
        className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${color}`}
      >
        {status}
      </span>
      <span className="text-[9px] text-slate-300 font-bold">{time}</span>
    </div>
    <p className="text-[10px] text-slate-600 font-medium italic bg-slate-50/50 p-2 rounded-lg border border-slate-50">
      {text}
    </p>
  </div>
);

const HotTopic = ({ label, count, color, width }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-bold text-slate-700">
      <span>{label}</span>
      <span className="text-emerald-600">{count}</span>
    </div>
    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
      <div className={`${color} h-full ${width}`}></div>
    </div>
  </div>
);

export default IntelligeanceAI;
