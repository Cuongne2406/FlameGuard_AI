const Dashboard = () => {
  return (
    <div className="p-8">
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
              <span className="material-symbols-outlined text-base mr-1">trending_up</span> +3.2%
            </span>
          </div>
        </div>
        {/* Card 2 */}
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
             <span className="text-green-500 font-medium">Thu</span> <span className="mx-2">|</span> <span className="text-red-500 font-medium">Chi</span>
          </div>
        </div>
        {/* Card 3 */}
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
          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1">
             <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Mức độ tham gia phong trào</h3>
            <div className="relative h-64 w-full">
               <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                     <linearGradient id="gradient-blue" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#0066B3" stopOpacity="0.25"></stop>
                        <stop offset="100%" stopColor="#0066B3" stopOpacity="0"></stop>
                     </linearGradient>
                  </defs>
                  <path d="M0,200 C80,180 120,240 200,160 S300,60 400,100 S500,140 600,40 S700,80 800,20 V250 H0 Z" fill="url(#gradient-blue)"></path>
                  <path d="M0,200 C80,180 120,240 200,160 S300,60 400,100 S500,140 600,40 S700,80 800,20" fill="none" stroke="#0066B3" strokeWidth="3"></path>
               </svg>
            </div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Check-ins</h3>
            <div className="space-y-4">
               {/* Item Demo */}
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                     <h4 className="font-semibold text-sm dark:text-white">Nguyen Van A</h4>
                     <p className="text-xs text-gray-500">Checked in: Hoi Truong A</p>
                  </div>
               </div>
            </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
         <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Danh Sách Đoàn Viên</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500">
                  <tr>
                     <th className="px-6 py-4">Sinh Viên</th>
                     <th className="px-6 py-4">MSSV</th>
                     <th className="px-6 py-4">Trạng Thái</th>
                     <th className="px-6 py-4 text-right">Thao Tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                  <tr>
                     <td className="px-6 py-4 font-semibold dark:text-white">Tran Van Bao</td>
                     <td className="px-6 py-4 dark:text-gray-300">20201123</td>
                     <td className="px-6 py-4"><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">Đã đóng phí</span></td>
                     <td className="px-6 py-4 text-right"><button className="text-gray-400">Edit</button></td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;