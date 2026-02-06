import React from 'react';

const SubAdminManagement = () => {
  // Mock Data: Hoạt động gần đây
  const recentActivities = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      time: "5 phút trước",
      desc: "Vừa check-in: Hội thảo AI & Future Career",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCnNZwETHpbuehXE8yizgLmaqBdabSWDa8C1E6nZTIjz9H22xB6gHOJo-z7h9JzUi9P6I1ct95koTUE_-B-hQN6Z8GXwpbhsCDqV4VOMiFgHgxj2AKA8HPPvJ9cjA2NQUvgGyXjVgcponIpSpknLYnUtyzEEbut7fl4qK-CKuZWQEbzXBIHX_QUYI95ok1TBuyteQuTKNfv4mFew7fl5NW7JPnHg2nSa3KpE41cF2nzlZRjzb2uffvJNoYD7IP78oo80pjCJQl0wIn",
      status: "success",
      statusText: "Thành công"
    },
    {
      id: 2,
      name: "Lê Thị Bình",
      time: "1 giờ trước",
      desc: "Gửi yêu cầu cộng điểm: Hiến máu nhân đạo đợt 2",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOZ4vPpesGUdExIKU9YzuSXT8Bfm6KtMs-TE0XMO9WkIXzd2Nfgj5MDjIaygk3NLVXbIqo2oOb10v_Vd5fH2nJ38vamSz4S0o7mmoESEAIJU_croC-4f_ZIrA0139R-fIN6gWw8d2zQT4QBpIqlR210XUZKDWfU-PWelqiEGBMYsXGo0VANiM3STx-bLcjy3h86hSiZNztXlL0lE68ki5ziolX1DGyqRDWoX2ttF3n6CShnVrT3PwONvuwl5ea2ezqCvl_DpdbIcsE",
      status: "pending",
      statusText: "Chờ duyệt"
    },
    {
      id: 3,
      name: "Trần Minh Cường",
      time: "2 giờ trước",
      desc: "Đã cập nhật hồ sơ Đoàn viên điện tử",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAixg418-z5WuW64nRd2QnUmudPpeU06Xm-LBfAkkPcyuE3iefnLdDw8WtbOdcM3GsxSQbmi6bWqg48f7WfuykBfTrrwBWfv8J08wyHfZaxPmP_Gae6BQ6GSEdQIoDSlOzBAfwu7Ls_DAym2dX9wceYUYT9ZRHPjwZAfX3nyytxqQHbVTWVzwslkhIowbUsru6WszgtdATVXKuK4Hz1IaK0xeWG_V9pl5Wr0RQlaTCn1TqJqOKYLVuhMSCYwjkPUoNpZ2wqG3XK87th",
      status: "info",
      statusText: "Hồ sơ"
    }
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* --- Top Header (Bảng điều khiển) --- */}
      <header className="sticky top-0 z-10 bg-bg-secretary-light/80 dark:bg-bg-secretary-dark/80 backdrop-blur-md border-b border-[#e6e2db] dark:border-[#3d3321] px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Bảng Điều Khiển Bí Thư</h2>
            <div className="flex items-center gap-1 group cursor-pointer">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Chi đoàn: 23CT112 - Khoa CNTT</p>
              <span className="material-symbols-outlined text-sm text-gray-500">expand_more</span>
            </div>
          </div>
          <button className="bg-white dark:bg-white/10 border border-[#e6e2db] dark:border-[#3d3321] p-2 rounded-xl flex items-center justify-center hover:shadow-sm transition-all text-secretary active:scale-95">
            <span className="material-symbols-outlined">swap_horiz</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        
        {/* --- 1. Overview Stats Row --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatBox 
            label="Tổng Đoàn viên" 
            value="45" 
            icon="groups" 
            color="blue" 
            subText="100% Đã cài App" 
            subIcon="verified"
          />
          <StatBox 
            label="Điểm TB Lớp" 
            value="85.5" 
            icon="trending_up" 
            color="green" 
            subText="+2.0 trend" 
            subIcon="arrow_upward"
          />
          <StatBox 
            label="Cần Duyệt" 
            value="03" 
            icon="pending_actions" 
            color="secretary" 
            subText="Yêu cầu mới chờ xử lý" 
            subIcon="priority_high"
            isHighPriority
          />
        </section>

        {/* --- 2. Quick Management Actions --- */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-secretary rounded-full"></span>
            Quản lý nhanh
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionBtn 
              icon="badge" 
              label="Danh sách lớp" 
              color="cyan"
            />
            <QuickActionBtn 
              icon="fact_check" 
              label="Duyệt điểm/HĐ" 
              color="orange" 
              badge="3"
            />
            <QuickActionBtn 
              icon="campaign" 
              label="Tạo thông báo" 
              color="purple"
            />
            <QuickActionBtn 
              icon="ios_share" 
              label="Xuất báo cáo" 
              color="pink"
            />
          </div>
        </section>

        {/* --- 3. Recent Activity Feed --- */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-secretary rounded-full"></span>
              Hoạt động gần đây
            </h3>
            <button className="text-secretary text-sm font-bold hover:underline">Xem tất cả</button>
          </div>
          
          <div className="bg-white dark:bg-[#2d2516] rounded-xl border border-[#e6e2db] dark:border-[#3d3321] divide-y dark:divide-[#3d3321] shadow-sm overflow-hidden">
            {recentActivities.map((item) => (
              <ActivityRow key={item.id} data={item} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

// --- Sub Components ---

const StatBox = ({ label, value, icon, color, subText, subIcon, isHighPriority }) => {
  const themes = {
    blue: "text-blue-600 bg-blue-600 dark:text-blue-400",
    green: "text-green-600 bg-green-600 dark:text-green-400",
    secretary: "text-secretary bg-secretary dark:text-secretary",
  };

  return (
    <div className={`bg-white dark:bg-[#2d2516] p-5 rounded-xl border ${isHighPriority ? 'border-secretary/30' : 'border-[#e6e2db] dark:border-[#3d3321]'} shadow-sm flex flex-col gap-1 ${isHighPriority ? 'ring-1 ring-secretary/10' : ''}`}>
      <div className="flex justify-between items-start">
        <p className={`text-sm font-semibold ${themes[color].split(' ')[0]}`}>{label}</p>
        <span className={`material-symbols-outlined text-white ${themes[color].split(' ')[1]} rounded-lg p-1 text-[16px]`}>
          {icon}
        </span>
      </div>
      <p className="text-3xl font-black mt-1">{value}</p>
      <div className={`flex items-center gap-1 text-[12px] font-bold mt-2 ${themes[color].split(' ')[0]}`}>
        <span className="material-symbols-outlined text-[14px]">{subIcon}</span>
        <span>{subText}</span>
      </div>
    </div>
  );
};

const QuickActionBtn = ({ icon, label, color, badge }) => {
  const themes = {
    cyan: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-100 dark:border-cyan-800/30 text-cyan-800 dark:text-cyan-200 icon-bg:bg-cyan-500 shadow-cyan-200",
    orange: "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/30 text-orange-800 dark:text-orange-200 icon-bg:bg-orange-500 shadow-orange-200",
    purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30 text-purple-800 dark:text-purple-200 icon-bg:bg-purple-500 shadow-purple-200",
    pink: "bg-pink-50 dark:bg-pink-900/20 border-pink-100 dark:border-pink-800/30 text-pink-800 dark:text-pink-200 icon-bg:bg-pink-500 shadow-pink-200",
  };

  const current = themes[color];

  return (
    <button className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border hover:scale-[1.02] transition-transform ${current.split(' icon-bg:')[0]}`}>
      {badge && (
        <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-2 ring-white dark:ring-transparent">
          {badge}
        </span>
      )}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg dark:shadow-none ${current.split('icon-bg:')[1].split(' ')[0]}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="text-sm font-bold text-center">{label}</span>
    </button>
  );
};

const ActivityRow = ({ data }) => {
  const badgeStyles = {
    success: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
    pending: "bg-secretary/20 text-secretary border border-secretary/30",
    info: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  };

  return (
    <div className="p-4 flex items-center gap-4 hover:bg-bg-secretary-light dark:hover:bg-white/5 transition-colors group cursor-pointer">
      <div 
        className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-secretary/20 shrink-0" 
        style={{backgroundImage: `url('${data.avatar}')`}}
      ></div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold truncate">{data.name}</h4>
          <span className="text-[10px] text-gray-400 font-medium shrink-0">{data.time}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {data.desc.includes(':') ? (
            <>
              {data.desc.split(':')[0]}: <span className="font-bold text-[#181611] dark:text-white">{data.desc.split(':')[1]}</span>
            </>
          ) : data.desc}
        </p>
      </div>
      <div className={`px-3 py-1 text-[10px] font-bold rounded-full shrink-0 ${badgeStyles[data.status]}`}>
        {data.statusText}
      </div>
    </div>
  );
};

export default SubAdminManagement;