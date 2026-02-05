import React from 'react';

const AIAnalytics = () => {
  return (
    <div className="flex flex-col h-full bg-background-light bg-grid-pattern overflow-y-auto custom-scrollbar">
      
      {/* --- PAGE HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wider">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary">AI Analytics</span>
          </div>
          <h1 className="text-slate-900 text-3xl font-black leading-tight tracking-[-0.033em] uppercase">BÁO CÁO PHÂN TÍCH AI</h1>
          <p className="text-slate-500 text-sm font-normal">Dữ liệu thời gian thực & Dự đoán xu hướng hành vi sinh viên</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-slate-400 text-[20px]">calendar_today</span>
            <span className="text-sm font-medium text-slate-700">Tháng 10, 2023</span>
            <span className="material-symbols-outlined text-slate-400 text-[20px]">arrow_drop_down</span>
          </div>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </header>

      {/* --- CONTENT CONTAINER --- */}
      <div className="flex-1 px-8 py-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* KPI Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title="Tổng sinh viên" 
            value="12,450" 
            trend="+5%" 
            isPositive={true} 
          />
          <StatCard 
            title="Tương tác tuần" 
            value="85%" 
            trend="+2%" 
            isPositive={true} 
          />
          <StatCard 
            title="Độ hài lòng" 
            value="4.8/5" 
            trend="0%" 
            isNeutral={true} 
          />
          <StatCard 
            title="Dự báo tăng trưởng" 
            value="+12%" 
            trend="+1.5%" 
            isPositive={true} 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sentiment Chart (Donut) */}
          <div className="col-span-1 lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-slate-900 text-lg font-bold">Cảm xúc sinh viên</h3>
                <p className="text-slate-500 text-sm">Phân tích sắc thái (Sentiment Analysis)</p>
              </div>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            
            <div className="relative flex-1 flex items-center justify-center min-h-[260px]">
              {/* SVG Donut Chart */}
              <svg className="transform -rotate-90" height="220" viewBox="0 0 220 220" width="220">
                <circle cx="110" cy="110" fill="none" r="90" stroke="#f1f5f9" strokeWidth="20"></circle>
                {/* Negative (Red) */}
                <circle cx="110" cy="110" fill="none" r="90" stroke="#ef4444" strokeDasharray="56.5 565" strokeDashoffset="-508.5" strokeLinecap="round" strokeWidth="20"></circle>
                {/* Neutral (Gray) */}
                <circle cx="110" cy="110" fill="none" r="90" stroke="#94a3b8" strokeDasharray="169.6 565" strokeDashoffset="-339" strokeLinecap="round" strokeWidth="20"></circle>
                {/* Positive (Blue) */}
                <circle cx="110" cy="110" fill="none" r="90" stroke="#0065b2" strokeDasharray="339 565" strokeDashoffset="0" strokeLinecap="round" strokeWidth="20"></circle>
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 tracking-tight">60%</span>
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">Tích cực</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-100">
              <ChartLegend color="bg-primary" label="Tích cực" value="60%" />
              <ChartLegend color="bg-slate-400" label="Trung lập" value="30%" />
              <ChartLegend color="bg-red-500" label="Tiêu cực" value="10%" />
            </div>
          </div>

          {/* Forecast Chart (Line Graph) */}
          <div className="col-span-1 lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-slate-900 text-lg font-bold">Dự báo tham gia (Forecast)</h3>
                <p className="text-slate-500 text-sm">Dữ liệu tham dự sự kiện & Dự đoán tháng tới</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-primary rounded-full"></span>
                  <span className="text-xs text-slate-600 font-medium">Thực tế</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-primary border-t border-dashed border-white"></span>
                  <span className="text-xs text-slate-600 font-medium">Dự đoán AI</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full min-h-[260px] relative">
              {/* SVG Line Chart */}
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 250">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0065b2" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#0065b2" stopOpacity="0.0"></stop>
                  </linearGradient>
                  <pattern height="50" id="gridPattern" patternUnits="userSpaceOnUse" width="80">
                    <path d="M 80 0 L 0 0 0 50" fill="none" stroke="#f1f5f9" strokeWidth="1"></path>
                  </pattern>
                </defs>
                <rect fill="url(#gridPattern)" height="100%" width="100%"></rect>
                
                {/* Data Fill & Line */}
                <path d="M0,200 L0,150 C50,150 50,100 100,120 C150,140 150,80 200,90 C250,100 250,160 300,140 C350,120 350,50 400,60 C450,70 450,110 500,100 C550,90 550,140 600,130 L600,200 Z" fill="url(#chartGradient)"></path>
                <path d="M0,150 C50,150 50,100 100,120 C150,140 150,80 200,90 C250,100 250,160 300,140 C350,120 350,50 400,60 C450,70 450,110 500,100 C550,90 550,140 600,130" fill="none" stroke="#0065b2" strokeLinecap="round" strokeWidth="3"></path>
                <circle cx="600" cy="130" fill="#fff" r="5" stroke="#0065b2" strokeWidth="3"></circle>
                
                {/* Forecast Line */}
                <path d="M600,130 C650,120 650,40 700,50 C750,60 750,30 800,20" fill="none" stroke="#0065b2" strokeDasharray="6 6" strokeLinecap="round" strokeOpacity="0.6" strokeWidth="3"></path>
                <path d="M600,130 C650,120 650,40 700,50 C750,60 750,30 800,20 L800,200 L600,200 Z" fill="url(#chartGradient)" opacity="0.5"></path>
                
                {/* Labels */}
                <text fill="#64748b" fontFamily="Inter" fontSize="12" x="10" y="240">Tuần 1</text>
                <text fill="#64748b" fontFamily="Inter" fontSize="12" x="210" y="240">Tuần 2</text>
                <text fill="#64748b" fontFamily="Inter" fontSize="12" x="410" y="240">Tuần 3</text>
                <text fill="#0065b2" fontFamily="Inter" fontSize="12" fontWeight="bold" x="610" y="240">Hiện tại</text>
                <text fill="#0065b2" fontFamily="Inter" fontSize="12" opacity="0.7" x="750" y="240">Dự đoán</text>
              </svg>
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="relative w-full rounded-xl bg-gradient-to-r from-white to-blue-50/50 border border-slate-200 border-l-[6px] border-l-primary shadow-lg p-6 overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 rounded-full"></div>
              <div className="bg-white border-2 border-primary/10 rounded-2xl p-4 shadow-sm relative glowing-icon">
                <span className="material-symbols-outlined text-primary text-[32px]">smart_toy</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-primary font-bold text-lg uppercase tracking-tight">AI Insights</h4>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">NEW</span>
              </div>
              <p className="text-slate-700 text-lg font-medium leading-relaxed">
                <span className="font-bold text-slate-900">Gợi ý từ AI:</span> Nên tổ chức thêm hoạt động thể thao để tăng tương tác vào cuối tuần, dựa trên dữ liệu tích cực từ sự kiện "Giải bóng đá sinh viên" tháng trước.
              </p>
              <div className="mt-3 flex gap-3">
                <button className="text-xs font-bold text-primary hover:text-blue-700 underline underline-offset-2">Xem chi tiết dữ liệu nguồn</button>
                <button className="text-xs font-bold text-slate-500 hover:text-slate-700">Bỏ qua gợi ý</button>
              </div>
            </div>
            <div className="shrink-0 mt-4 md:mt-0">
              <button className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors">
                <span>Tạo kế hoạch sự kiện</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs text-slate-400 font-mono">
          <p>SYSTEM STATUS: <span className="text-green-600 font-bold">ONLINE</span> • AI MODEL: V2.4.1 (YOUTH-BERT)</p>
          <p>LAST UPDATED: 2023-10-24 14:30:00 UTC+7</p>
        </div>

      </div>
    </div>
  );
};

// --- Sub Components ---

const StatCard = ({ title, value, trend, isPositive, isNeutral }) => (
  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex items-center justify-between group hover:border-primary/50 transition-colors">
    <div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <p className="text-slate-900 text-2xl font-bold font-mono mt-1">{value}</p>
    </div>
    <div className={`rounded-full px-2 py-1 text-xs font-bold flex items-center gap-1 ${
      isNeutral 
        ? "bg-slate-100 text-slate-500" 
        : isPositive 
          ? "bg-green-50 text-green-600" 
          : "bg-red-50 text-red-600"
    }`}>
      <span className="material-symbols-outlined text-[14px]">
        {isNeutral ? "remove" : isPositive ? "trending_up" : "trending_down"}
      </span>
      {trend}
    </div>
  </div>
);

const ChartLegend = ({ color, label, value }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex items-center gap-2">
      <div className={`size-2 rounded-full ${color}`}></div>
      <span className="text-xs font-semibold text-slate-600">{label}</span>
    </div>
    <span className="text-sm font-bold text-slate-900">{value}</span>
  </div>
);

export default AIAnalytics;