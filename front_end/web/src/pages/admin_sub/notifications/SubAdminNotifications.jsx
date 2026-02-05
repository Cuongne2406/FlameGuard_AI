import React from 'react';

const SubAdminNotifications = () => {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg-secretary-light/80 dark:bg-bg-secretary-dark/80 backdrop-blur-md border-b border-[#e6e2db] dark:border-[#3d3321] px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Kênh Thông Báo Chi Đoàn</h2>
            <div className="flex items-center gap-1 group cursor-pointer">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Chi đoàn: 23CT112 - Khoa CNTT</p>
              <span className="material-symbols-outlined text-sm text-gray-500">expand_more</span>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all transform active:scale-95">
            <span className="material-symbols-outlined text-xl">add</span>
            <span className="text-sm font-bold">Tạo thông báo mới</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        
        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            icon="send" 
            label="Tin đã gửi" 
            value="12" 
            color="blue" 
          />
          <StatCard 
            icon="mark_email_read" 
            label="Tỷ lệ đọc" 
            value="98%" 
            color="green" 
          />
          <StatCard 
            icon="chat_bubble" 
            label="Phản hồi" 
            value="5" 
            color="orange" 
          />
        </section>

        {/* Message History */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-secretary rounded-full"></span>
              Lịch sử tin nhắn
            </h3>
            <div className="flex gap-2">
              <FilterBtn label="Tất cả" active={false} />
              <FilterBtn label="Đã gửi" active={true} />
              <FilterBtn label="Lên lịch" active={false} />
            </div>
          </div>

          <div className="space-y-4">
            {/* Urgent Message */}
            <UrgentMessage />
            
            {/* Scheduled Message */}
            <MessageItem 
              title="🗓️ Nhắc lịch họp Chi đoàn tháng 3"
              sub="Tự động gửi vào: 08:00 AM - 01/03/2024"
              status="scheduled"
            />
            
            {/* Sent Message */}
            <MessageItem 
              title="🎉 Chúc mừng sinh nhật tháng 2"
              sub="10/02/2024 • Đã xem: 45/45"
              status="sent"
            />
          </div>
        </section>

      </div>
    </div>
  );
};

// --- Sub Components ---

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  };

  return (
    <div className="bg-white dark:bg-[#2d2516] p-5 rounded-xl border border-[#e6e2db] dark:border-[#3d3321] shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colors[color]}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  );
};

const FilterBtn = ({ label, active }) => (
  <button className={`px-3 py-1 rounded-lg text-sm transition-colors ${
    active 
      ? "text-secretary font-bold bg-secretary/10" 
      : "text-gray-500 hover:text-secretary font-medium hover:bg-gray-100 dark:hover:bg-white/5"
  }`}>
    {label}
  </button>
);

const UrgentMessage = () => (
  <div className="bg-white dark:bg-[#2d2516] p-5 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📢 [GẤP] Hạn chót nộp sổ Đoàn viên</span>
          </h4>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">09:00 AM - Hôm nay</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">group</span>
          Gửi đến: Tất cả thành viên
        </p>
        <div className="mt-4 pt-2 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-green-600 dark:text-green-400">Đã xem: 42/45</span>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-center gap-1">
              Xem ai chưa đọc
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full rounded-full" style={{width: '93%'}}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MessageItem = ({ title, sub, status }) => (
  <div className={`bg-white dark:bg-[#2d2516] p-5 rounded-xl border border-[#e6e2db] dark:border-[#3d3321] shadow-sm hover:shadow-md transition-shadow ${status === 'sent' ? 'opacity-90' : ''}`}>
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex-1 space-y-1">
        <h4 className="text-base font-bold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        {status === 'scheduled' ? (
          <>
            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              Đã lên lịch
            </span>
            <button className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 transition-colors">
              Chỉnh sửa
            </button>
          </>
        ) : (
          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Đã gửi
          </span>
        )}
      </div>
    </div>
  </div>
);

export default SubAdminNotifications;