import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  // 1. Khai báo state
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Hàm tính toán thời gian "Online/Offline"
  const getActiveStatus = (lastLoginTime) => {
    if (!lastLoginTime) {
        return { text: "Chưa đăng nhập", color: "bg-gray-400", isOnline: false };
    }

    const now = new Date();
    const loginDate = new Date(lastLoginTime);
    const diffInSeconds = Math.floor((now - loginDate) / 1000);

    // Dưới 5 phút (300 giây) -> Coi là Online
    if (diffInSeconds < 300) {
        return { text: "Đang hoạt động", color: "bg-green-500", isOnline: true };
    }

    // Xử lý hiển thị thời gian "Cách đây bao lâu"
    let timeText = "";
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        timeText = `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        timeText = `${hours} giờ trước`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        timeText = `${days} ngày trước`;
    }

    return { text: timeText, color: "bg-gray-400", isOnline: false };
  };

  // 3. Gọi API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        const [dashboardRes, usersRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/v1/dashboard/summary", { method: "GET", headers }),
          // Lấy 10 người mới nhất để demo cho đẹp
          fetch("http://127.0.0.1:8000/api/v1/users?limit=10", { method: "GET", headers })
        ]);

        if (!dashboardRes.ok || !usersRes.ok) throw new Error("Lỗi tải dữ liệu");

        setData(await dashboardRes.json());
        setUsers(await usersRes.json());

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Lỗi: {error}</div>;

  const stats = data?.stats || {};
  const feeStatus = data?.fee_status || { paid: 0, unpaid: 0 };
  const recentCheckins = data?.recent_checkins || [];

  return (
    <div className="p-8">
      {/* --- PHẦN 1: STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">TONG DOAN VIEN</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total_students}</h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-primary"><span className="material-symbols-outlined">diversity_3</span></div>
          </div>
          <div className="flex items-center text-sm"><span className="text-green-500 flex items-center font-medium">+100% (Demo)</span></div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">QUY DOAN (Ước tính)</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{(feeStatus.paid * 20).toLocaleString()}k</h3>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600"><span className="material-symbols-outlined">payments</span></div>
          </div>
          <div className="flex items-center text-sm"><span className="text-green-500 font-medium">Đã đóng: {feeStatus.paid}</span></div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
             <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">DIEM AI</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.ai_status}</h3>
             </div>
             <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600"><span className="material-symbols-outlined">smart_toy</span></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1">
             <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>

      {/* --- PHẦN 2: BIỂU ĐỒ (Giữ nguyên SVG tĩnh) --- */}
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
        
        {/* Recent Check-ins */}
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-card border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Check-ins</h3>
            <div className="space-y-4">
               {recentCheckins.length === 0 ? (
                 <p className="text-sm text-gray-500">Chưa có ai điểm danh.</p>
               ) : (
                 recentCheckins.map((checkin, index) => (
                   <div key={index} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {checkin.name.charAt(0)}
                      </div>
                      <div>
                         <h4 className="font-semibold text-sm dark:text-white">{checkin.name}</h4>
                         <p className="text-xs text-gray-500">Vừa tham gia: {checkin.event}</p>
                         <p className="text-[10px] text-gray-400">{new Date(checkin.time).toLocaleString()}</p>
                      </div>
                   </div>
                 ))
               )}
            </div>
        </div>
      </div>

      {/* --- PHẦN 3: DANH SÁCH USER (CÓ TRẠNG THÁI ONLINE) --- */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
         <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Danh Sách Đoàn Viên</h3>
            <button className="text-sm text-blue-600 hover:underline">Xem tất cả</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500">
                  <tr>
                     <th className="px-6 py-4">Sinh Viên</th>
                     <th className="px-6 py-4">MSSV</th>
                     <th className="px-6 py-4">Email</th>
                     <th className="px-6 py-4">Chức vụ</th>
                     <th className="px-6 py-4">Trạng Thái</th>
                     <th className="px-6 py-4 text-right">Thao Tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                  {users.length === 0 ? (
                    <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Chưa có dữ liệu</td></tr>
                  ) : (
                    users.map((user) => {
                      // Tính toán trạng thái cho từng user
                      const status = getActiveStatus(user.last_login);
                      
                      return (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                           <td className="px-6 py-4 font-semibold dark:text-white">{user.full_name}</td>
                           <td className="px-6 py-4 dark:text-gray-300">{user.mssv}</td>
                           <td className="px-6 py-4 text-gray-500 text-xs">{user.email}</td>
                           <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                  user.role === 'SUB_ADMIN' 
                                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                  {user.role === 'SUB_ADMIN' ? 'Ban Chấp Hành' : 'Đoàn Viên'}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {/* Dấu chấm tròn Online/Offline */}
                                <span className={`h-2.5 w-2.5 rounded-full ${status.color}`}></span>
                                {/* Text hiển thị trạng thái */}
                                <span className={`text-xs ${status.isOnline ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                                    {status.text}
                                </span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                  <span className="material-symbols-outlined text-xl">edit_square</span>
                              </button>
                           </td>
                        </tr>
                      );
                    })
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;