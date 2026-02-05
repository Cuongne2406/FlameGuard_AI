import React from 'react';

const ApprovalQueue = () => {
  // Mock Data: Dữ liệu giả lập
  const requests = [
    {
      id: 1,
      reqId: "#REQ-001",
      name: "Nguyễn Văn A",
      studentId: "20110345",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-xe9fpB6YuJ7KHPOxhDfhf25ONyi8JMS9km4tyf-tCYLQdRMNyHBs7VxTh3YmvBFW4PI3ZaowgTz9McnZSrqq96iWnx2uZV2wMxlILmHS8Gk1KrsfIomNaU-6JAJ6ajaIdCXoQuVzZHgfj33AregJzcf-zPLb6KA1rCNBs-QzSv9KfshmQlemIFsdgOy5wLHHe5Xok52w0JnTs1xXjBz0pMY4UDd1FV6i6XnRcDOYUbzXcuqXtgFLquzjFs31PRq0rRnrGswVSeSq')",
      type: "cert", // cert hoặc room
      typeName: "Cấp Giấy Chứng Nhận",
      date: "24/05/2024",
      status: "pending"
    },
    {
      id: 2,
      reqId: "#REQ-002",
      name: "Lê Thị B",
      studentId: "20110346",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAiigQiteiV-yxGL1hKMYoUlxLAnAuqLHfwiF6sScFhEYWZX2ICGit5HHDaEgNGU2F7Zfw5aHijqw7GGMFboI7U_qiPidoEx6qrIVRomqF9a11MmnqocRjSV6QsRNX2ouVbsgzu6vbCnO9rmIFpL9mZg7RQA18EGTJlegjijjfIV-dSvwpqMuyAgg9shOLCkcobBodlnJlauESlaShq8yYCdY29Ex5fevCDf0PpbEX8aph7M-jam9glibnGMRZd59X7vwr1Lj2cm9us')",
      type: "room",
      typeName: "Đặt Phòng Họp",
      date: "23/05/2024",
      status: "pending"
    },
    {
      id: 3,
      reqId: "#REQ-003",
      name: "Trần Văn C",
      studentId: "20110355",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRnLx0ZIYcJv35-54Og8ez8f2Hp9WXvy2rIcPxHEaVohvLvYMA_XpcdICqo0IfskT_1jKaNRKCCFnEmCNZMA7TBpi337WRmZQaA1gXg0yZCPRxhkEj-gNFCTgdmdzR5ni5l-5WmMiWDUIYhCrTz183VPoU46_2mzd-XN-vv30aeFKwgzqzhK5jC9Tuk_yoR8UShH61WyDt_bz9G464k8CzedAzpSPyBVkSWVZMzWNxeJp0RICtqkjcE6pEsjpgiIl68vmUXsF4ZdwJ')",
      type: "cert",
      typeName: "Cấp Giấy Chứng Nhận",
      date: "23/05/2024",
      status: "pending"
    },
    {
      id: 4,
      reqId: "#REQ-004",
      name: "Phạm Thị D",
      studentId: "20110360",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBehLnQmcuX-Xzl1gB54CvuI4h65JSLqdyS88qWXRoLHkn6raFgcJicXnUCPrfWectgia1_aUwjJsM4s2vMmD7BSWAOq8Uyr_-kYvCLmqGUTzI5LO8vYHgFwPW8QdvHHdPnWedPzMbdXbMiAy7Ra0B9DaYVH7u8mA7Hs9MWICjAuIrfccswreadq0D72DUfhrkM_Z8sai3YHwc0g9lBXxH-sYTKuhFfNxODJeBW4n8o_o8A9Ked4WFRmXH9hRC5T3fnb9afC4UHcAVj')",
      type: "room",
      typeName: "Đặt Phòng Họp",
      date: "22/05/2024",
      status: "pending"
    },
    {
      id: 5,
      reqId: "#REQ-005",
      name: "Hoàng Văn E",
      studentId: "20110382",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuATkDsjB_6H_kaV390nEe8BQF0xN0IYML_lqvXTFVx3uGBrxnI7c72LLoWNXUyNqJUCupf0UBO5OflaDNd1mAE5MrWMzV4HazduZURff7fKqKtXzlg-cJWe9YskQDNWVGb4_jhPMV016WAWfx9BOlocg10wRbhGVQvV1V-GI65S9mgAgzBuJrqenyUUKjQz77P2DoqE3GDOYwveowNDhZSUy1YFZi3LZjRufhMHwktto5Pucbz8f8yfjaqb1bkPtRJVmX9eqCoKBWVa')",
      type: "cert",
      typeName: "Cấp Giấy Chứng Nhận",
      date: "22/05/2024",
      status: "pending"
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f5f7f8] dark:bg-[#0f1a23] p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6">
        
        {/* --- PAGE HEADING --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">DANH SÁCH YÊU CẦU CHỜ DUYỆT</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý các yêu cầu cấp chứng nhận và đặt phòng của sinh viên.</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
            </button>
          </div>
        </div>

        {/* --- FILTER & SEARCH CARD --- */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[280px] relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                placeholder="Tìm kiếm theo Tên SV hoặc Mã Số..." 
                type="text"
              />
            </div>
            
            {/* Type Filter */}
            <div className="w-full sm:w-auto">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">filter_list</span>
                <select className="appearance-none w-full sm:w-48 pl-10 pr-8 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer outline-none">
                  <option value="">Tất cả loại yêu cầu</option>
                  <option value="cert">Cấp Giấy Chứng Nhận</option>
                  <option value="room">Đặt Phòng Họp</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">expand_more</span>
              </div>
            </div>

            {/* Date Range */}
            <div className="w-full sm:w-auto">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">calendar_today</span>
                <input 
                  className="w-full sm:w-48 pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer outline-none" 
                  placeholder="Chọn ngày..." 
                  type="date"
                />
              </div>
            </div>
          </div>

          {/* Quick Filters / Chips */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 overflow-x-auto pb-1">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              All Requests <span className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-[10px] shadow-sm">45</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 text-xs font-semibold">
              Certificates <span className="bg-blue-100 dark:bg-blue-800 px-1.5 py-0.5 rounded-md text-[10px]">12</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              Room Booking
            </button>
          </div>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
                  <Th width="w-[140px]">Mã Yêu Cầu</Th>
                  <Th>Họ Tên Sinh Viên</Th>
                  <Th>Loại Yêu Cầu</Th>
                  <Th>Ngày Gửi</Th>
                  <Th>Trạng Thái</Th>
                  <Th className="text-right">Thao Tác</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {requests.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="py-4 px-6 text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {item.reqId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div 
                            className="size-9 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-600"
                            style={{ backgroundImage: item.avatar }}
                          ></div>
                          {/* Online indicator */}
                          <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-500 rounded-full border-2 border-white dark:border-[#1e293b]"></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">ID: {item.studentId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <TypeBadge type={item.type} label={item.typeName} />
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-800">
                        <span className="size-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                        Chờ Duyệt
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded shadow-sm transition-colors">
                          <span className="material-symbols-outlined text-[16px]">check</span>
                          Duyệt
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded transition-colors">
                          <span className="material-symbols-outlined text-[16px]">close</span>
                          Từ Chối
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION --- */}
          <div className="px-6 py-4 bg-white dark:bg-[#1e293b] border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">Hiển thị <span className="font-medium text-slate-900 dark:text-white">1</span> đến <span className="font-medium text-slate-900 dark:text-white">5</span> của <span className="font-medium text-slate-900 dark:text-white">45</span> yêu cầu</span>
            <div className="flex items-center gap-1">
              <PaginationButton text="Trước" disabled />
              <PaginationButton text="1" active />
              <PaginationButton text="2" />
              <PaginationButton text="3" />
              <span className="px-2 text-slate-400">...</span>
              <PaginationButton text="Sau" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub-components để code gọn hơn ---

const Th = ({ children, width, className = "" }) => (
  <th className={`py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${width} ${className}`}>
    {children}
  </th>
);

const TypeBadge = ({ type, label }) => {
  const styles = type === 'cert' 
    ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800 text-blue-600"
    : "bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800 text-purple-600";
    
  const icon = type === 'cert' ? "verified" : "meeting_room";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}>
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
      {label}
    </span>
  );
};

const PaginationButton = ({ text, active, disabled }) => {
  const base = "px-3 py-1 rounded text-sm transition-colors";
  const normal = "border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700";
  const act = "bg-primary text-white font-medium";
  const dis = "border border-gray-200 dark:border-gray-700 text-slate-300 dark:text-slate-600 cursor-not-allowed";

  return (
    <button className={`${base} ${active ? act : disabled ? dis : normal}`} disabled={disabled}>
      {text}
    </button>
  );
};

export default ApprovalQueue;