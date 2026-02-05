import React from 'react';

const SubAdminDashboard = () => {
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg-secretary-light/80 dark:bg-bg-secretary-dark/80 backdrop-blur-md border-b border-[#e6e2db] dark:border-[#3d3321] px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#181611] dark:text-white">Chào buổi sáng, Đ/c Hậu! 👋</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Thứ Tư, 26/03/2026 - Hôm nay lớp có 1 sự kiện</p>
          </div>
          <button className="hidden md:flex bg-white dark:bg-white/10 border border-[#e6e2db] dark:border-[#3d3321] p-2 rounded-xl items-center justify-center hover:shadow-sm transition-all">
            <span className="material-symbols-outlined text-gray-500">settings</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        
        {/* Alert Section */}
        <section>
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-800/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>notifications_active</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-yellow-50">Nhắc nhở quan trọng</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Hạn nộp danh sách Đoàn viên ưu tú còn 2 ngày.</p>
              </div>
            </div>
            <a href="#" className="text-sm font-bold text-secretary hover:text-orange-600 flex items-center gap-1 sm:ml-auto group">
              Xử lý ngay
              <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </a>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Attendance Card */}
          <div className="bg-white dark:bg-[#2d2516] p-6 rounded-xl border border-[#e6e2db] dark:border-[#3d3321] shadow-sm flex items-center justify-between">
            <div className="flex flex-col h-full justify-center">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tỷ lệ đi học</h3>
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">Rất tốt</p>
              <p className="text-xs text-gray-400 mt-1">Dựa trên 5 buổi học gần nhất</p>
            </div>
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-blue-50 dark:text-blue-900/20" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-blue-600 dark:text-blue-500" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeDasharray="301.59" strokeDashoffset="15.08" strokeLinecap="round" strokeWidth="8"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-[#181611] dark:text-white">95%</span>
              </div>
            </div>
          </div>

          {/* Funds Card */}
          <div className="bg-white dark:bg-[#2d2516] p-6 rounded-xl border border-[#e6e2db] dark:border-[#3d3321] shadow-sm flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quỹ Chi Đoàn</h3>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">savings</span>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-black text-[#181611] dark:text-white">1.500.000đ</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-500">Đã thu</span>
                <span className="text-green-600">40/45 bạn</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '88%'}}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-secretary rounded-full"></span>
            Phím tắt nhanh
          </h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <ActionBtn icon="qr_code_scanner" label="Quét Check-in" color="blue" />
            <ActionBtn icon="calendar_add_on" label="Tạo Sự Kiện" color="purple" />
            <ActionBtn icon="campaign" label="Loa Thông Báo" color="orange" />
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
              Hoạt động mới nhất
            </h3>
          </div>
          <div className="bg-white dark:bg-[#2d2516] rounded-xl border border-[#e6e2db] dark:border-[#3d3321] divide-y dark:divide-[#3d3321] shadow-sm">
            <ActivityItem 
              name="Nguyễn Văn An" 
              time="5 phút trước" 
              action="Vừa check-in: Hội thảo AI" 
              avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuBCnNZwETHpbuehXE8yizgLmaqBdabSWDa8C1E6nZTIjz9H22xB6gHOJo-z7h9JzUi9P6I1ct95koTUE_-B-hQN6Z8GXwpbhsCDqV4VOMiFgHgxj2AKA8HPPvJ9cjA2NQUvgGyXjVgcponIpSpknLYnUtyzEEbut7fl4qK-CKuZWQEbzXBIHX_QUYI95ok1TBuyteQuTKNfv4mFew7fl5NW7JPnHg2nSa3KpE41cF2nzlZRjzb2uffvJNoYD7IP78oo80pjCJQl0wIn" 
            />
            <ActivityItem 
              name="Lê Thị Bình" 
              time="1 giờ trước" 
              action="Yêu cầu cộng điểm: Hiến máu" 
              avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCOZ4vPpesGUdExIKU9YzuSXT8Bfm6KtMs-TE0XMO9WkIXzd2Nfgj5MDjIaygk3NLVXbIqo2oOb10v_Vd5fH2nJ38vamSz4S0o7mmoESEAIJU_croC-4f_ZIrA0139R-fIN6gWw8d2zQT4QBpIqlR210XUZKDWfU-PWelqiEGBMYsXGo0VANiM3STx-bLcjy3h86hSiZNztXlL0lE68ki5ziolX1DGyqRDWoX2ttF3n6CShnVrT3PwONvuwl5ea2ezqCvl_DpdbIcsE" 
            />
          </div>
        </section>

      </div>
    </>
  );
};

// --- Sub Components for cleaner code ---

const ActionBtn = ({ icon, label, color }) => {
  // Map color prop to Tailwind classes dynamically is tricky in runtime if not safelisted, 
  // so we use specific conditions or a mapping object.
  const colors = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 group-hover:bg-orange-600",
  };

  return (
    <button className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-[#2d2516] border border-[#e6e2db] dark:border-[#3d3321] rounded-2xl shadow-sm hover:border-secretary/50 hover:bg-secretary/5 transition-all group min-w-[160px]">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:text-white transition-colors ${colors[color]}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{label}</span>
    </button>
  );
};

const ActivityItem = ({ name, time, action, avatar }) => (
  <div className="p-4 flex items-center gap-4 hover:bg-bg-secretary-light dark:hover:bg-white/5 transition-colors group">
    <div className="w-10 h-10 rounded-full bg-cover bg-center border border-gray-200" style={{backgroundImage: `url('${avatar}')`}}></div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-bold">{name}</h4>
        <span className="text-[10px] text-gray-400 font-medium">{time}</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{action}</p>
    </div>
  </div>
);

export default SubAdminDashboard;