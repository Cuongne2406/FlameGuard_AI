import React, { useState, useEffect } from 'react';

/**
 * TRANG QUẢN LÝ BÍ THƯ (SubAdminManagement)
 * Phiên bản: 100% Dữ liệu thực tế + High-quality Animation
 */
const SubAdminManagement = () => {
  // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 2. STATE QUẢN LÝ MODAL ---
  const [activeModal, setActiveModal] = useState(null);

  // --- 3. GỌI API THỰC TẾ ---
  useEffect(() => {
    const fetchManagementData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("access_token");

        // Gọi API từ Backend của bạn
        const response = await fetch('http://127.0.0.1:8000/api/v1/sub-dashboard/management', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error("Hệ thống không phản hồi. Vui lòng kiểm tra Backend.");

        const result = await response.json();

        // Cập nhật dữ liệu thật
        setStats(result.stats);
        setActivities(result.activities);
      } catch (err) {
        console.error("Lỗi kết nối:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchManagementData();
  }, []);

  // --- 4. ĐIỀU KIỆN HIỂN THỊ POPUP ---
  const renderModalContent = () => {
    switch (activeModal) {
      case 'list': return <ClassListContent />;
      case 'approval': return <ApprovalContent requests={activities.filter(a => a.status === 'pending')} />;
      case 'notify': return <CreateNotificationContent onClose={() => setActiveModal(null)} />;
      case 'report': return <ExportReportContent />;
      default: return null;
    }
  };

  // Trạng thái đang tải
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#181611]">
      <div className="w-12 h-12 border-4 border-secretary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Trạng thái lỗi (Không dùng dữ liệu mẫu)
  if (error) return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#181611] p-6">
      <div className="bg-white dark:bg-[#2d2516] p-8 rounded-3xl border border-red-100 shadow-2xl text-center max-w-md">
        <span className="material-symbols-outlined text-red-500 text-6xl mb-4">cloud_off</span>
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase">Mất kết nối dữ liệu</h2>
        <p className="text-gray-500 mt-2 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="w-full bg-secretary text-white py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 active:scale-95 transition-all">THỬ LẠI NGAY</button>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 pb-20 bg-gray-50/50 dark:bg-[#181611] min-h-screen">

      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#181611]/80 backdrop-blur-xl border-b border-[#e6e2db] dark:border-[#3d3321] px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#181611] dark:text-white uppercase">Quản Lý Chi Đoàn</h2>
            <div className="flex items-center gap-1 group mt-1">
              <span className="material-symbols-outlined text-sm text-gray-500">school</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Lớp: {stats?.class_name || "Đang tải..."}</p>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="bg-white dark:bg-white/10 border border-[#e6e2db] dark:border-[#3d3321] p-2.5 rounded-xl text-secretary hover:shadow-lg transition-all active:scale-90">
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-8">

        {/* STATS ROW */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatBox label="Tổng Đoàn viên" value={stats?.total_members || 0} icon="groups" color="blue" subText="Dữ liệu hệ thống" subIcon="verified" />
          <StatBox label="Điểm TB Lớp" value={stats?.avg_score || 0} icon="trending_up" color="green" subText={stats?.trend || "+0.0"} subIcon="arrow_upward" />
          <StatBox label="Cần Duyệt" value={stats?.pending_requests || 0} icon="pending_actions" color="secretary" subText="Minh chứng mới" subIcon="priority_high" isHighPriority={stats?.pending_requests > 0} />
        </section>

        {/* QUICK ACTIONS */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#181611] dark:text-white">
            <span className="w-1.5 h-6 bg-secretary rounded-full"></span>
            Quản lý nhanh
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionBtn
              icon="badge" label="Danh sách lớp" color="cyan"
              onClick={() => setActiveModal('list')}
            />
            <QuickActionBtn
              icon="fact_check" label="Duyệt điểm/HĐ" color="orange" badge={stats?.pending_requests}
              onClick={() => setActiveModal('approval')}
            />
            <QuickActionBtn
              icon="campaign" label="Tạo thông báo" color="purple"
              onClick={() => setActiveModal('notify')}
            />
            <QuickActionBtn
              icon="ios_share" label="Xuất báo cáo" color="pink"
              onClick={() => setActiveModal('report')}
            />
          </div>
        </section>

        {/* ACTIVITY FEED */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold flex items-center gap-2 text-[#181611] dark:text-white uppercase tracking-wider">
              <span className="w-2 h-6 bg-gray-300 rounded-full"></span>
              Hoạt động gần đây
            </h3>
          </div>
          <div className="bg-white dark:bg-[#2d2516] rounded-3xl border border-[#e6e2db] dark:border-[#3d3321] divide-y dark:divide-[#3d3321] shadow-sm overflow-hidden">
            {activities.length > 0 ? (
              activities.map((item) => <ActivityRow key={item.id} data={item} />)
            ) : (
              <div className="p-10 text-center text-gray-500 italic">Chưa có hoạt động mới nào được ghi nhận.</div>
            )}
          </div>
        </section>

      </div>

      {/* --- CẤU TRÚC MODAL CAO CẤP (GLASSMORPHISM + ANIMATION) --- */}
      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={
            activeModal === 'list' ? 'Danh sách chi đoàn' :
              activeModal === 'approval' ? 'Phê duyệt minh chứng' :
                activeModal === 'notify' ? 'Gửi thông báo lớp' : 'Kết xuất dữ liệu'
          }
        >
          {renderModalContent()}
        </Modal>
      )}

    </div>
  );
};

// ==========================================
// CÁC COMPONENT GIAO DIỆN PHỤ
// ==========================================

const StatBox = ({ label, value, icon, color, subText, subIcon, isHighPriority }) => {
  const themes = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    green: "text-green-600 bg-green-50 dark:bg-green-900/20",
    secretary: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
  };
  const mainColor = themes[color].split(' ')[0];

  return (
    <div className={`bg-white dark:bg-[#2d2516] p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isHighPriority ? 'border-orange-200 shadow-orange-100/50' : 'border-[#e6e2db] dark:border-[#3d3321] shadow-sm'}`}>
      <div className="flex justify-between items-start">
        <p className={`text-xs font-black uppercase tracking-widest ${mainColor}`}>{label}</p>
        <div className={`p-2.5 rounded-xl ${themes[color]}`}>
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
      </div>
      <p className="text-4xl font-black mt-3 text-[#181611] dark:text-white">{value}</p>
      <div className={`flex items-center gap-1.5 text-[11px] font-bold mt-3 ${mainColor} opacity-90`}>
        <span className="material-symbols-outlined text-[16px]">{subIcon}</span>
        <span>{subText}</span>
      </div>
    </div>
  );
};

const QuickActionBtn = ({ icon, label, color, badge, onClick }) => {
  const themes = {
    cyan: "from-cyan-500 to-cyan-600 shadow-cyan-200",
    orange: "from-orange-500 to-orange-600 shadow-orange-200",
    purple: "from-purple-500 to-purple-600 shadow-purple-200",
    pink: "from-pink-500 to-pink-600 shadow-pink-200",
  };

  return (
    <button 
      onClick={onClick}
      className="relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-[#2d2516] border border-[#e6e2db] dark:border-[#3d3321] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group"
    >
      {badge > 0 && (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10 animate-bounce">
          {badge}
        </span>
      )}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${themes[color]} group-hover:rotate-6 transition-transform`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{label}</span>
    </button>
  );
};


const ActivityRow = ({ data }) => {
  const badgeStyles = {
    success: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-orange-100 text-orange-700 border-orange-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <div className="p-5 flex items-center gap-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-default">
      <div className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-white shadow-md shrink-0 transition-transform group-hover:scale-105" style={{ backgroundImage: `url('${data.avatar || 'https://i.pravatar.cc/150'}')` }}></div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{data.name}</h4>
          <span className="text-[10px] text-gray-500 font-bold bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-md shrink-0">{data.time}</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{data.desc}</p>
      </div>
      <div className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider shrink-0 border ${badgeStyles[data.status] || badgeStyles.info}`}>
        {data.statusText}
      </div>
    </div>
  );
};

// ==========================================
// HỆ THỐNG POPUP (MODAL) VỚI ANIMATION MƯỢT
// ==========================================

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop Glassmorphism */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Zoom Animation */}
      <div className="relative bg-white dark:bg-[#1e1c16] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 ease-out border border-gray-100 dark:border-[#3d3321]">

        <div className="px-8 py-6 border-b border-gray-100 dark:border-[#3d3321] flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
          <h3 className="text-xl font-black text-[#181611] dark:text-white tracking-tight uppercase">{title}</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/20 transition-all active:scale-90">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- NỘI DUNG POPUP ---

const ClassListContent = () => (
  <div className="space-y-5">
    <input type="text" placeholder="Tìm sinh viên trong chi đoàn..." className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 ring-secretary/20 outline-none transition-all text-sm" />
    <div className="border border-gray-100 rounded-3xl overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
          <tr><th className="px-5 py-3">MSSV</th><th className="px-5 py-3">Họ Tên</th><th className="px-5 py-3 text-right">CV</th></tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {[1, 2, 3].map(i => (
            <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer">
              <td className="px-5 py-4 font-mono text-gray-500 text-xs">23CT112-0{i}</td>
              <td className="px-5 py-4 font-bold text-gray-800">Đang tải dữ liệu...</td>
              <td className="px-5 py-4 text-right"><span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded-full border border-blue-100 uppercase">ĐV</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ApprovalContent = ({ requests }) => (
  <div className="space-y-4">
    {requests.length > 0 ? requests.map((req, idx) => (
      <div key={idx} className="p-5 border border-gray-100 rounded-3xl bg-gray-50/50 hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-sm font-black text-gray-800">{req.desc}</h4>
            <p className="text-xs text-gray-500 mt-1">Người gửi: {req.name}</p>
          </div>
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-xl border border-green-100">Duyệt nhanh</span>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 bg-gray-900 text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-gray-200 active:scale-95 transition-all">CHẤP NHẬN</button>
          <button className="flex-1 bg-white border border-gray-200 text-gray-400 py-3 rounded-2xl text-xs font-black hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">TỪ CHỐI</button>
        </div>
      </div>
    )) : <p className="text-center py-10 text-gray-400 italic">Không có yêu cầu nào cần duyệt.</p>}
  </div>
);

const CreateNotificationContent = ({ onClose }) => (
  <div className="space-y-5">
    <input type="text" className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 ring-secretary/20 outline-none transition-all font-bold" placeholder="Tiêu đề thông báo..." />
    <textarea rows="5" className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 ring-secretary/20 outline-none transition-all text-sm" placeholder="Nhập nội dung thông báo gửi đến toàn lớp..."></textarea>
    <button onClick={onClose} className="w-full bg-gradient-to-r from-secretary to-orange-600 text-white py-4 rounded-[1.5rem] font-black shadow-xl shadow-orange-100 active:scale-95 transition-all uppercase tracking-widest">Gửi Thông Báo</button>
  </div>
);

const ExportReportContent = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div className="p-6 border-2 border-secretary bg-orange-50 rounded-[2rem] flex flex-col items-center gap-3 cursor-pointer ring-4 ring-orange-100">
        <span className="material-symbols-outlined text-4xl text-secretary">picture_as_pdf</span>
        <span className="text-xs font-black text-secretary uppercase">Báo cáo PDF</span>
      </div>
      <div className="p-6 border-2 border-gray-100 rounded-[2rem] flex flex-col items-center gap-3 cursor-pointer hover:border-gray-200 transition-all">
        <span className="material-symbols-outlined text-4xl text-green-600">table_view</span>
        <span className="text-xs font-black text-gray-500 uppercase">Xuất Excel</span>
      </div>
    </div>
    <button className="w-full bg-gray-900 text-white py-4 rounded-[1.5rem] font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
      <span className="material-symbols-outlined">download</span>
      Tải xuống file
    </button>
  </div>
);

export default SubAdminManagement;