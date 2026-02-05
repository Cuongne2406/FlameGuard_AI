import React from 'react';

const EventManager = () => {
  // Mock Data: Giả lập dữ liệu sự kiện
  const events = [
    {
      id: 1,
      name: "Workshop Kỹ Năng Mềm",
      category: "Phát triển bản thân",
      date: "20/10/2023",
      location: "Hội trường A",
      current: 150,
      max: 200,
      icon: "lightbulb",
      iconBg: "bg-indigo-100 text-indigo-600",
      progressColor: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      name: "Ngày Hội Việc Làm 2023",
      category: "Hướng nghiệp",
      date: "25/10/2023",
      location: "Sân trường LHU",
      current: 500,
      max: 1000,
      icon: "work",
      iconBg: "bg-blue-100 text-blue-600",
      progressColor: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 3,
      name: "Seminar Công Nghệ 4.0",
      category: "Học thuật",
      date: "01/11/2023",
      location: "Phòng B202",
      current: 80,
      max: 100,
      icon: "mic",
      iconBg: "bg-purple-100 text-purple-600",
      progressColor: "bg-green-100 text-green-800"
    },
    {
      id: 4,
      name: "Cuộc Thi Hùng Biện",
      category: "Ngoại khóa",
      date: "10/11/2023",
      location: "Hội trường B",
      current: 200,
      max: 250,
      icon: "record_voice_over",
      iconBg: "bg-rose-100 text-rose-600",
      progressColor: "bg-red-100 text-red-800"
    },
    {
      id: 5,
      name: "Tình Nguyện Mùa Hè Xanh",
      category: "Tình nguyện",
      date: "15/11/2023",
      location: "Địa phương",
      current: 40,
      max: 50,
      icon: "volunteer_activism",
      iconBg: "bg-teal-100 text-teal-600",
      progressColor: "bg-gray-100 text-gray-800"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      
      {/* --- TOP HEADER AREA --- */}
      <header className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 px-8 py-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 flex-shrink-0 z-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">QUẢN LÝ SỰ KIỆN</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Quản lý và theo dõi các hoạt động sinh viên</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-gray-900 text-sm font-bold rounded-lg shadow-sm hover:shadow transition-all duration-200">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="uppercase tracking-wide">Tạo Sự Kiện Mới</span>
          </button>
        </div>
      </header>

      {/* --- CONTENT BODY --- */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          
          {/* Search & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="relative flex-1 max-w-md min-w-[300px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">search</span>
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-700 dark:text-gray-200 placeholder-gray-400" 
                placeholder="Tìm kiếm sự kiện theo tên hoặc địa điểm..." 
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Trạng thái:</span>
              <select className="form-select text-sm py-2 pl-3 pr-8 rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:border-primary focus:ring-primary/50 cursor-pointer outline-none">
                <option>Tất cả</option>
                <option>Sắp diễn ra</option>
                <option>Đang diễn ra</option>
                <option>Đã kết thúc</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-auto min-h-[400px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                    <Th width="w-[35%]">Tên Sự Kiện</Th>
                    <Th width="w-[15%]">Ngày Tổ Chức</Th>
                    <Th width="w-[20%]">Địa Điểm</Th>
                    <Th width="w-[15%]" className="text-center">Số Lượng</Th>
                    <Th width="w-[15%]" className="text-right">Hành Động</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {events.map((event) => (
                    <tr key={event.id} className="group hover:bg-orange-50/30 dark:hover:bg-gray-700/30 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${event.iconBg}`}>
                            <span className="material-symbols-outlined">{event.icon}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-hover transition-colors">{event.name}</p>
                            <p className="text-xs text-gray-500">{event.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-gray-400">calendar_today</span>
                          {event.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-gray-400">location_on</span>
                          {event.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.progressColor}`}>
                          {event.current}/{event.max}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary text-primary-hover hover:bg-primary hover:text-gray-900 text-xs font-bold uppercase tracking-wide transition-all duration-200">
                          <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                          Lấy Mã QR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between mt-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hiển thị <span className="font-medium text-gray-900 dark:text-gray-200">1</span> đến <span className="font-medium text-gray-900 dark:text-gray-200">5</span> của <span className="font-medium text-gray-900 dark:text-gray-200">20</span> sự kiện
              </p>
              <nav className="flex items-center gap-1">
                <PaginationBtn icon="chevron_left" disabled />
                <PaginationBtn text="1" active />
                <PaginationBtn text="2" />
                <PaginationBtn text="3" />
                <span className="px-2 text-gray-400">...</span>
                <PaginationBtn icon="chevron_right" />
              </nav>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---

const Th = ({ children, width, className = "" }) => (
  <th className={`px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${width} ${className}`}>
    {children}
  </th>
);

const PaginationBtn = ({ text, icon, active, disabled }) => {
  const baseClass = "rounded-md text-sm font-medium transition-colors";
  const activeClass = "px-3 py-1 bg-primary text-gray-900 shadow-sm";
  const normalClass = "px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700";
  const iconClass = "p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 disabled:opacity-50";

  if (icon) {
    return (
      <button className={iconClass} disabled={disabled}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </button>
    );
  }

  return (
    <button className={active ? activeClass : normalClass}>
      {text}
    </button>
  );
};

export default EventManager;