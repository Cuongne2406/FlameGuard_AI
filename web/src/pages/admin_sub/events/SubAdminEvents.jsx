import React from 'react';

const SubAdminEvents = () => {
  return (
    <div className="animate-in fade-in duration-500 pb-20 bg-[#fcfcfb] dark:bg-background-dark min-h-full">
      
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#e6e2db] dark:border-[#3d3321] px-8 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#181611] dark:text-white uppercase">Quản Lý Sự Kiện & Phong Trào</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Theo dõi tham gia chi đoàn 23CT112</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-white dark:bg-white/5 border border-[#e6e2db] dark:border-[#3d3321] px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-gray-400 mr-2 text-xl">filter_alt</span>
              <span className="text-sm font-bold">Tháng 3/2026</span>
              <span className="material-symbols-outlined text-gray-400 ml-1 text-xl">expand_more</span>
            </div>
            <button className="bg-secretary hover:bg-secretary/90 text-white px-4 py-2 rounded-xl shadow-lg shadow-secretary/20 font-bold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">add_circle</span>
              <span className="hidden sm:inline">Tạo sự kiện lớp</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8 space-y-8">
        
        {/* Spotlight Event (Tiêu điểm) */}
        <section>
          <div className="bg-white dark:bg-[#2d2516] rounded-2xl border border-secretary/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6">
              <span className="px-3 py-1 bg-secretary text-white text-[10px] font-black rounded-full uppercase tracking-wider">Tiêu điểm</span>
            </div>
            <div className="p-8 md:flex items-center gap-8">
              <div 
                className="w-full md:w-48 h-48 rounded-xl bg-cover bg-center border border-gray-100 flex-shrink-0 mb-6 md:mb-0" 
                style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBCnNZwETHpbuehXE8yizgLmaqBdabSWDa8C1E6nZTIjz9H22xB6gHOJo-z7h9JzUi9P6I1ct95koTUE_-B-hQN6Z8GXwpbhsCDqV4VOMiFgHgxj2AKA8HPPvJ9cjA2NQUvgGyXjVgcponIpSpknLYnUtyzEEbut7fl4qK-CKuZWQEbzXBIHX_QUYI95ok1TBuyteQuTKNfv4mFew7fl5NW7JPnHg2nSa3KpE41cF2nzlZRjzb2uffvJNoYD7IP78oo80pjCJQl0wIn')"}}
              ></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secretary text-xl">event</span>
                  <span className="text-sm font-bold text-gray-500">26/03/2026 — Khu du lịch Bửu Long</span>
                </div>
                <h3 className="text-3xl font-black text-[#181611] dark:text-white mb-4">Hội Trại Truyền Thống 26/3</h3>
                
                {/* Progress Bar */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Tiến độ đăng ký lớp:</span>
                      <span className="text-lg font-black text-green-600">40/45 <span className="text-xs font-medium text-gray-400">Đoàn viên</span></span>
                    </div>
                    <span className="text-sm font-black text-green-600">88%</span>
                  </div>
                  <div className="w-full h-4 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[88%] rounded-full shadow-[0_0_12px_rgba(34,197,94,0.3)]"></div>
                  </div>
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Còn 5 bạn chưa đăng ký
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="bg-[#2563eb] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/20">
                    <span className="material-symbols-outlined">campaign</span>
                    Gửi nhắc nhở nhanh
                  </button>
                  <button className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-bold transition-all">
                    Xem danh sách
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Events List */}
        <section>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-7 bg-secretary rounded-full"></span>
            Danh sách sự kiện khác
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Event Card 1 (Finished) */}
            <EventCard 
              icon="smart_toy" 
              iconColor="purple"
              status="finished"
              title="Hội thảo AI & Future"
              date="15/03/2026"
              isFull
            />

            {/* Event Card 2 (Active) */}
            <EventCard 
              icon="volunteer_activism" 
              iconColor="red"
              status="active"
              title="Hiến máu nhân đạo"
              date="30/03/2026"
              progress={33}
              attendees={15}
              hasAvatars
            />

            {/* Add New Card */}
            <div className="bg-white/50 dark:bg-white/5 rounded-xl border border-dashed border-[#e6e2db] dark:border-[#3d3321] p-5 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white dark:hover:bg-white/10 hover:border-secretary transition-all h-full min-h-[200px]">
              <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-secretary/10 transition-colors">
                <span className="material-symbols-outlined text-gray-400 group-hover:text-secretary">add_box</span>
              </div>
              <p className="text-sm font-bold text-gray-500 group-hover:text-secretary">Thêm phong trào mới</p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

// --- Sub Components ---

const EventCard = ({ icon, iconColor, status, title, date, isFull, progress, attendees, hasAvatars }) => {
  const colors = {
    purple: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    red: "text-red-600 bg-red-100 dark:bg-red-900/30",
  };

  const statusBadge = status === 'finished' 
    ? "bg-gray-100 dark:bg-white/5 text-gray-500" 
    : "bg-green-100 dark:bg-green-900/30 text-green-600";

  const statusText = status === 'finished' ? "Đã kết thúc" : "Đang mở đơn";

  return (
    <div className="bg-white dark:bg-[#2d2516] rounded-xl border border-[#e6e2db] dark:border-[#3d3321] p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[iconColor]}`}>
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>{icon}</span>
          </div>
          <span className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase ${statusBadge}`}>{statusText}</span>
        </div>
        <h4 className="font-bold text-lg mb-1">{title}</h4>
        <p className="text-xs text-gray-500 mb-3">Ngày: {date}</p>
        
        {progress && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-gray-500 uppercase">Tiến độ đăng ký</span>
              <span>{attendees}/45 ({progress}%)</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full" style={{width: `${progress}%`}}></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5 mt-4">
        {isFull ? (
          <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            100% THAM GIA
          </span>
        ) : hasAvatars ? (
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#2d2516] bg-cover bg-gray-200" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCOZ4vPpesGUdExIKU9YzuSXT8Bfm6KtMs-TE0XMO9WkIXzd2Nfgj5MDjIaygk3NLVXbIqo2oOb10v_Vd5fH2nJ38vamSz4S0o7mmoESEAIJU_croC-4f_ZIrA0139R-fIN6gWw8d2zQT4QBpIqlR210XUZKDWfU-PWelqiEGBMYsXGo0VANiM3STx-bLcjy3h86hSiZNztXlL0lE68ki5ziolX1DGyqRDWoX2ttF3n6CShnVrT3PwONvuwl5ea2ezqCvl_DpdbIcsE')"}}></div>
            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#2d2516] bg-cover bg-gray-200" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAixg418-z5WuW64nRd2QnUmudPpeU06Xm-LBfAkkPcyuE3iefnLdDw8WtbOdcM3GsxSQbmi6bWqg48f7WfuykBfTrrwBWfv8J08wyHfZaxPmP_Gae6BQ6GSEdQIoDSlOzBAfwu7Ls_DAym2dX9wceYUYT9ZRHPjwZAfX3nyytxqQHbVTWVzwslkhIowbUsru6WszgtdATVXKuK4Hz1IaK0xeWG_V9pl5Wr0RQlaTCn1TqJqOKYLVuhMSCYwjkPUoNpZ2wqG3XK87th')"}}></div>
            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#2d2516] bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500">+13</div>
          </div>
        ) : <div></div>}
        
        <button className={`${isFull ? 'text-secretary text-xs font-bold hover:underline' : 'bg-secretary text-white px-3 py-1.5 rounded-lg text-xs font-bold'}`}>
          {isFull ? "Chi tiết" : "Quản lý"}
        </button>
      </div>
    </div>
  );
};

export default SubAdminEvents;