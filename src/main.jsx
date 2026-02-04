import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  // Logic xử lý Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark transition-colors duration-300 font-body">
      <div className="flex h-screen overflow-hidden">
        
        {/* --- SIDEBAR --- */}
        <aside className="w-64 flex-shrink-0 bg-primary dark:bg-slate-900 flex flex-col transition-all duration-300 shadow-xl z-20">
          <div className="h-16 flex items-center px-6 border-b border-white/10 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-xl">school</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">LHU YouthHub</span>
            </div>
          </div>
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {/* Active Link Example */}
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/10 text-white shadow-sm border border-white/5" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-medium text-sm">Tổng Quan</span>
            </a>

            {/* Inactive Links */}
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors duration-200 group" href="#">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">notifications</span>
              <span className="font-medium text-sm">Thông Báo</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors duration-200 group" href="#">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">event_note</span>
              <span className="font-medium text-sm">Danh sách chờ duyệt</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors duration-200 group" href="#">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">groups</span>
              <span className="font-medium text-sm">Quản lý & Nhân sự</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors duration-200 group" href="#">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">account_balance_wallet</span>
              <span className="font-medium text-sm">Tài Chính & Hậu Cần</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors duration-200 group" href="#">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">calendar_month</span>
              <span className="font-medium text-sm">Quản lý sự kiện</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors duration-200 group" href="#">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">groups</span>
              <p className="text-sm font-medium">Quản Lý Đoàn Viên</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors duration-200 group" href="#">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">bar_chart</span>
              <span className="text-sm font-medium">Thi đua & Danh hiệu</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors duration-200 group" href="#">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">psychology</span>
              <span className="font-medium text-sm">Phân tích & AI</span>
            </a>
          </nav>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10 dark:border-gray-700">
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors duration-200" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-medium text-sm">Cài Đặt</span>
            </a>
            <div className="mt-4 flex items-center gap-3 px-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                AD
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white">Admin LHU</span>
                <span className="text-[10px] text-blue-200">Quản trị viên</span>
              </div>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          
          {/* Header */}
          <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 shadow-sm z-10">
            <div className="flex items-center gap-4">
              <button className="md:hidden text-gray-500 hover:text-primary">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Bảng Điều Khiển</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </span>
                <input
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all focus:w-72"
                  placeholder="Tìm kiếm đoàn viên..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
                </button>
                
                {/* Theme Toggle Button */}
                <button
                  className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={toggleTheme}
                >
                  {isDarkMode ? (
                    <span className="material-symbols-outlined">light_mode</span>
                  ) : (
                    <span className="material-symbols-outlined">dark_mode</span>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Card 1 */}
              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">TONG DOAN VIEN</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">1,250</h3>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-primary">
                    <span className="material-symbols-outlined">diversity_3</span>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-green-500 flex items-center font-medium">
                    <span className="material-symbols-outlined text-base mr-1">trending_up</span>
                    +3.2%
                  </span>
                  <span className="text-gray-400 ml-2 text-xs">so với tháng trước</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">SU KIEN DANG CHAY</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">3</h3>
                  </div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600">
                    <span className="material-symbols-outlined">local_fire_department</span>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 text-xs">Sắp diễn ra: <span className="font-medium text-gray-700 dark:text-gray-300">Mùa Hè Xanh</span></span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">QUY DOAN</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">15.000k</h3>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-green-500 flex items-center font-medium">
                    <span className="material-symbols-outlined text-base mr-1">arrow_upward</span>
                    Thu
                  </span>
                  <span className="text-gray-400 mx-2">|</span>
                  <span className="text-red-500 flex items-center font-medium">
                    <span className="material-symbols-outlined text-base mr-1">arrow_downward</span>
                    Chi
                  </span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">DIEM AI</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Tích Cực</h3>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600">
                    <span className="material-symbols-outlined">smart_toy</span>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1">
                    <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-purple-600 font-bold ml-2 text-xs">8.5/10</span>
                </div>
              </div>
            </div>

            {/* Charts & Checkins */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Chart Section */}
              <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Muc Do Tham Gia Phong Trao</h3>
                    <p className="text-xs text-gray-500 mt-1">Thống kê hoạt động sinh viên 6 tháng qua</p>
                  </div>
                  <select className="text-sm border-gray-200 dark:border-gray-600 rounded-md bg-transparent text-gray-500 dark:text-gray-300 focus:ring-primary focus:border-primary cursor-pointer">
                    <option>6 Tháng Qua</option>
                    <option>Năm Nay</option>
                  </select>
                </div>
                <div className="relative h-72 w-full">
                  {/* ... Chart Grid Lines ... */}
                  <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 font-medium">
                    {[100, 75, 50, 25, 0].map((val) => (
                      <div key={val} className="border-b border-gray-100 dark:border-gray-700 w-full h-0 flex items-center relative">
                        <span className="absolute -left-8">{val}%</span>
                      </div>
                    ))}
                  </div>
                  {/* SVG Chart */}
                  <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradient-blue" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#0066B3', stopOpacity: 0.25 }}></stop>
                        <stop offset="100%" style={{ stopColor: '#0066B3', stopOpacity: 0 }}></stop>
                      </linearGradient>
                    </defs>
                    <path className="text-primary w-full transition-all duration-1000 ease-out" d="M0,200 C80,180 120,240 200,160 S300,60 400,100 S500,140 600,40 S700,80 800,20 V288 H0 Z" fill="url(#gradient-blue)"></path>
                    <path className="drop-shadow-sm" d="M0,200 C80,180 120,240 200,160 S300,60 400,100 S500,140 600,40 S700,80 800,20" fill="none" stroke="#0066B3" strokeLinecap="round" strokeWidth="3"></path>
                    {/* Points */}
                    <circle className="hover:r-7 transition-all cursor-pointer" cx="20%" cy="63%" fill="#fff" r="5" stroke="#0066B3" strokeWidth="2"></circle>
                    <circle className="hover:r-7 transition-all cursor-pointer" cx="45%" cy="37%" fill="#fff" r="5" stroke="#0066B3" strokeWidth="2"></circle>
                    <circle className="hover:r-7 transition-all cursor-pointer" cx="70%" cy="17%" fill="#fff" r="5" stroke="#0066B3" strokeWidth="2"></circle>
                    <circle className="hover:r-7 transition-all cursor-pointer" cx="95%" cy="10%" fill="#fff" r="5" stroke="#0066B3" strokeWidth="2"></circle>
                  </svg>
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500 font-medium px-2">
                  <span>T5</span><span>T6</span><span>T7</span><span>T8</span><span>T9</span><span>T10</span>
                </div>
              </div>

              {/* Recent Check-ins */}
              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 flex flex-col">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Check-ins</h3>
                    <button className="text-primary hover:bg-blue-50 p-1 rounded transition">
                        <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                    </button>
                 </div>
                 <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    {/* Item 1 */}
                    <div className="flex items-center gap-4 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                        <div className="relative">
                            <img alt="avatar" className="w-10 h-10 rounded-full border border-gray-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj8tVEa4Z2-2TCx4T_zFckhl0RmjdOK8rYXQSdi5A5LWYtUbNEQDAiZ8pG_OAma5qqK6T2w4dQSblf7GnivVs6COLy7QC8HjnFcdsA8MGSHFfWlt-lSZrVYBRyKSovctxsGM3xq0oovaHBQoiBOhpjr4nk2aW2nH7nZ1XIAEbM_cOudFrXEuwETZdAwlpqSdgAThN-XSekuHrxuIJtA7O7KG9WljHGHZsMEMmva8ZFaueUvsvOEZduH4IhGh1DjC9pDfeprpOJRQ4C" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Nguyen Van A</h4>
                            <p className="text-xs text-gray-500">Checked in: Hoi Truong A</p>
                        </div>
                        <span className="text-xs font-mono text-gray-400">2m ago</span>
                    </div>
                    {/* Item 2 */}
                    <div className="flex items-center gap-4 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                        <div className="relative">
                            <img alt="avatar" className="w-10 h-10 rounded-full border border-gray-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLc0Lzn8GsOJRjfzYrftgIleiuseUNQihOHne6-yx6d0nyXh46-hvkpvai1gtVDXNmirq-OdXM0E7JWtTznEsBidDrbFSPJgZl95FEMN3ZHNm3fh2rys8XVowu8YDrgg6M3mZFP5vsFvpCBl8mw_Y86S-kw4BKn4tQc4SY9547-0O4wKHQ88iYiYJ2vQHjvrqz0uzbGvNbY39VIC5nCFBi9EFdgPitdgZQJaFIteNftL_hok5rqk01A8Vl1xfOOcf_0SOoEZOFgsEH" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Tran Thi B</h4>
                            <p className="text-xs text-gray-500">Checked in: San Van Dong</p>
                        </div>
                        <span className="text-xs font-mono text-gray-400">12m ago</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Danh Sách Đoàn Viên</h3>
                    <div className="flex gap-2">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-gray-400 text-lg">filter_list</span>
                            <select className="pl-8 pr-4 py-1.5 text-xs font-medium bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 outline-none focus:border-primary">
                                <option>Tất cả trạng thái</option>
                                <option>Đã đóng phí</option>
                                <option>Chưa đóng phí</option>
                            </select>
                        </div>
                        <button className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">download</span>
                            Xuất Excel
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 font-bold tracking-wider">
                                <th className="px-6 py-4">Sinh Viên</th>
                                <th className="px-6 py-4">MSSV</th>
                                <th className="px-6 py-4">Chi Đoàn</th>
                                <th className="px-6 py-4">Trạng Thái Đóng Phí</th>
                                <th className="px-6 py-4">Ngày Cập Nhật</th>
                                <th className="px-6 py-4 text-right">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                            {/* Row 1 */}
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img alt="student" className="w-9 h-9 rounded-full object-cover border border-gray-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACkEuJ1S40BmBBACXShfp21cnHZF90m89Xp4_B-40yTzoWHotz4RIgyY4aO9_eUYZMPN6391SBkQSn_6MO9uBZFEFBnekgzmPj6fMZLObRDvXWFYno_CJt4v2VSQRJ_vPdaDMMomo1SNqklY1jYQLwgYg2yrxu6dhYL1UNMKjrtBJaK9F6gbKoTdAiccuK2xjV5IikfFc3_qwDFEjJxT8zcJ-6YLE2Pdml-75Jbgg2d_pHh60I_QENMyvBHvpLcvU3AbXGc9RfHqHc" />
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900 dark:text-white">Nguyen Minh Anh</span>
                                            <span className="text-xs text-gray-400">K45 CNTT</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono text-xs">20214589</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">19DTHA2</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                        Da Dong Phi
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">24/10/2023</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-primary transition-colors p-1 rounded hover:bg-blue-50">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                </td>
                            </tr>
                            {/* Row 2 */}
                             <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img alt="student" className="w-9 h-9 rounded-full object-cover border border-gray-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXigEbNS0BKl9ph_unXXXJeemnRjBhdXLpbCO6PGClVDJ3OKFxvtjCzqBi83uy5Odoay7qSj7Wv0D4sjJPzcKsS3Wf4WRzJhwphwEbtBPtsipKrkYZQf842CRh9czdOKQut-gVtGtfHaX_AFM7nDch6TmZR7pDYo-amisswWVzzjCvkVUYR2IwkxniVJv1P60BpMAk4RPVdsJEgUIGYLEpFBsJ6lviJgzRU2jm1U77VwmHBslgToE9MajFGLNgm7JZrwur9B0tQLVt" />
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900 dark:text-white">Tran Van Bao</span>
                                            <span className="text-xs text-gray-400">K44 QTKS</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono text-xs">20201123</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">18QTKS1</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                        Chua Dong
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">--</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-primary transition-colors p-1 rounded hover:bg-blue-50">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400 pb-4">
              © 2024 LHU YouthHub. All rights reserved.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;