import React, { useState } from 'react';

const NotificationManager = () => {
  // State để làm tính năng Live Preview (Gõ đến đâu, hiện lên điện thoại đến đó)
  const [title, setTitle] = useState("Thông báo quan trọng về Lịch thi học kỳ I");
  const [content, setContent] = useState("Nhà trường xin thông báo lịch thi chính thức học kỳ I năm học 2023-2024 đã được cập nhật trên cổng thông tin sinh viên. Đề nghị các bạn sinh viên theo dõi để đi thi đúng giờ.");

  return (
    <div className="flex flex-col h-full bg-[#f5f7f8] dark:bg-[#0f1a23] p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1280px] mx-auto w-full">
        
        {/* --- BREADCRUMBS --- */}
        <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
          <span className="text-slate-500 hover:text-primary font-medium flex items-center gap-1 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">home</span> Dashboard
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500 hover:text-primary font-medium cursor-pointer">Thông Báo</span>
          <span className="text-slate-400">/</span>
          <span className="text-primary font-semibold">Tạo Mới (New Push)</span>
        </div>

        {/* --- HEADER --- */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">Quản Lý Thông Báo</h2>
            <p className="text-slate-500 mt-2 text-base">Soạn thảo và gửi thông báo đẩy đến ứng dụng sinh viên LHU YouthHub.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">draft</span> Lưu Nháp
            </button>
          </div>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
          
          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_note</span>
                Chi tiết thông báo
              </h3>
              
              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                {/* Title Input */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Tiêu Đề <span className="text-red-500">*</span></label>
                    <span className="text-slate-400 text-xs">{title.length}/50</span>
                  </div>
                  <input 
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm" 
                    placeholder="Ví dụ: Thông báo nghỉ học đột xuất..." 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={50}
                  />
                </div>

                {/* Content Textarea */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Nội Dung <span className="text-red-500">*</span></label>
                    <span className="text-slate-400 text-xs">{content.length}/150</span>
                  </div>
                  <textarea 
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary min-h-[140px] p-4 shadow-sm resize-none leading-relaxed" 
                    placeholder="Nhập nội dung thông báo chi tiết tại đây..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>

                {/* Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Gửi Đến</label>
                    <div className="relative">
                      <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 pl-4 pr-10 shadow-sm appearance-none outline-none">
                        <option>Toàn Trường</option>
                        <option>Khoa CNTT</option>
                        <option>Khoa Kinh Tế</option>
                        <option>Giảng Viên</option>
                        <option>Sinh Viên K45</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                        <span className="material-symbols-outlined">expand_more</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Loại Thông Báo</label>
                    <div className="relative">
                      <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 pl-4 pr-10 shadow-sm appearance-none outline-none">
                        <option>Tin Tức Chung</option>
                        <option>Học Vụ</option>
                        <option>Hoạt Động Đoàn Hội</option>
                        <option>Khẩn Cấp</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                        <span className="material-symbols-outlined">category</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-primary text-xl block">schedule</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Hẹn Giờ Gửi</p>
                        <p className="text-xs text-slate-500">Lên lịch gửi thông báo tự động</p>
                      </div>
                    </div>
                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 opacity-50 pointer-events-none transition-opacity">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-500">Ngày</label>
                      <input className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-sm h-10 px-2" type="date"/>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-500">Giờ</label>
                      <input className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-sm h-10 px-2" type="time"/>
                    </div>
                  </div>
                </div>

                {/* Send Button */}
                <div className="pt-4">
                  <button className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95">
                    <span className="material-symbols-outlined">send</span>
                    GỬI THÔNG BÁO
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-3">Thông báo sẽ được gửi đến khoảng <span className="font-bold text-slate-600 dark:text-slate-300">12,500 thiết bị</span>.</p>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: PREVIEW */}
          <div className="lg:col-span-5 sticky top-4">
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">smartphone</span> Live Preview
              </h3>
              
              {/* Phone Frame */}
              <div className="relative mx-auto border-slate-900 bg-slate-900 border-[14px] rounded-[2.5rem] h-[640px] w-[320px] shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
                {/* Status Bar */}
                <div className="absolute top-0 inset-x-0 h-8 bg-black/20 z-20 flex justify-between items-center px-6">
                  <span className="text-white text-[10px] font-medium">9:41</span>
                  <div className="flex gap-1 items-center">
                    <span className="material-symbols-outlined text-white text-[12px]">signal_cellular_alt</span>
                    <span className="material-symbols-outlined text-white text-[12px]">wifi</span>
                    <span className="material-symbols-outlined text-white text-[12px] rotate-90">battery_full</span>
                  </div>
                </div>

                {/* Screen Content */}
                <div className="h-full w-full bg-cover bg-center relative" style={{ backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}>
                  
                  {/* Lock Screen Time */}
                  <div className="pt-16 text-center text-white/90 flex flex-col items-center">
                    <span className="material-symbols-outlined mb-2 text-2xl opacity-80">lock</span>
                    <div className="text-6xl font-thin tracking-tight font-display">09:41</div>
                    <div className="text-lg font-normal opacity-80 mt-1">Thứ Hai, 11 Tháng 9</div>
                  </div>

                  {/* Notification Card */}
                  <div className="mt-8 mx-3">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg animate-fade-in-up">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary rounded-lg size-10 flex items-center justify-center shrink-0 shadow-sm">
                          <span className="material-symbols-outlined text-white text-xl">school</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="text-slate-900 font-bold text-sm truncate">LHU YouthHub</h4>
                            <span className="text-slate-500 text-[10px] whitespace-nowrap">Bây giờ</span>
                          </div>
                          
                          {/* HIỂN THỊ DỮ LIỆU TỪ STATE Ở ĐÂY */}
                          <p className="text-slate-800 text-sm font-semibold leading-tight mb-1 truncate">
                             {title || "Tiêu đề thông báo..."}
                          </p>
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                             {content || "Nội dung thông báo sẽ hiển thị ở đây..."}
                          </p>
                        
                        </div>
                      </div>
                    </div>
                    {/* Visual Stack Effect */}
                    <div className="mx-2 mt-2 bg-white/40 backdrop-blur-sm rounded-xl h-2 opacity-50"></div>
                  </div>

                  {/* Bottom Icons */}
                  <div className="absolute bottom-6 inset-x-0 px-8 flex justify-between items-center text-white/50">
                    <div className="size-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                      <span className="material-symbols-outlined">flashlight_on</span>
                    </div>
                    <div className="size-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                      <span className="material-symbols-outlined">photo_camera</span>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-50"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotificationManager;