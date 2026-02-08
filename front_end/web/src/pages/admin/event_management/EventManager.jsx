import React, { useState, useEffect } from 'react';
// Hãy chắc chắn đường dẫn import này đúng với cấu trúc folder của bạn (lùi ra 3 cấp)
import AddEventModal from '../../../components/admin/AddEventModal'; 

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL"); // State cho bộ lọc
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Hàm gọi API (Có tham số filter)
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      // Tạo URL với query params
      let url = `http://127.0.0.1:8000/api/v1/events/?search=${searchTerm}`;
      if (filterStatus !== "ALL") {
        url += `&status=${filterStatus}`;
      }

      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setEvents(await response.json());
      }
    } catch (error) {
      console.error("Lỗi tải sự kiện:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi filter hoặc search thay đổi
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEvents();
    }, 300); // Debounce để tránh gọi API quá nhiều khi gõ phím
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterStatus]);

  // Format ngày tháng đẹp
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F7FA] dark:bg-slate-900 p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1280px] mx-auto w-full">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Quản Lý Sự Kiện</h2>
            <p className="text-slate-500 mt-1">Quản lý và theo dõi các hoạt động sinh viên</p>
          </div>

          <div className="flex gap-3">
             {/* Nút cài đặt (UI cũ) */}
             <button className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">tune</span>
             </button>

             {/* --- NÚT TẠO SỰ KIỆN (MỚI & ĐẸP HƠN) --- */}
             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-cyan-500/30 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all duration-200"
             >
                <span className="material-symbols-outlined">add_circle</span>
                TẠO SỰ KIỆN MỚI
             </button>
          </div>
        </div>

        {/* TOOLBAR & FILTER */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-t-xl border-b border-slate-100 dark:border-slate-700 flex flex-wrap gap-4 justify-between items-center shadow-sm">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <span className="material-symbols-outlined">search</span>
                </span>
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-700 dark:text-white transition-all"
                    placeholder="Tìm kiếm sự kiện theo tên hoặc địa điểm..."
                />
            </div>

            {/* --- BỘ LỌC HOẠT ĐỘNG --- */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Trạng thái:</span>
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 border-none text-sm font-semibold text-slate-700 dark:text-white py-2 pl-3 pr-8 rounded-lg outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                >
                    <option value="ALL">Tất cả</option>
                    <option value="UPCOMING">Sắp diễn ra</option>
                    <option value="ONGOING">Đang diễn ra</option>
                    <option value="COMPLETED">Đã kết thúc</option>
                </select>
            </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-slate-800 rounded-b-xl shadow-sm border border-t-0 border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 font-bold border-b border-slate-100 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-4">Tên sự kiện</th>
                            <th className="px-6 py-4">Ngày tổ chức</th>
                            <th className="px-6 py-4">Địa điểm</th>
                            <th className="px-6 py-4 text-center">Số lượng</th>
                            <th className="px-6 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                        {loading ? (
                             <tr><td colSpan="5" className="p-8 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
                        ) : events.length === 0 ? (
                             <tr><td colSpan="5" className="p-8 text-center text-slate-400">Không tìm thấy sự kiện nào</td></tr>
                        ) : (
                            events.map((event) => (
                                <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${
                                                event.status === 'UPCOMING' ? 'bg-blue-50 text-blue-600' :
                                                event.status === 'ONGOING' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                <span className="material-symbols-outlined text-xl">event</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white">{event.title}</p>
                                                <p className="text-xs text-slate-500">{event.status === 'UPCOMING' ? 'Sắp diễn ra' : event.status}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 text-base">calendar_today</span>
                                            {formatDate(event.start_time)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 text-base">location_on</span>
                                            {event.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-100">
                                            {event.max_participants} vé
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ml-auto transition-all">
                                            <span className="material-symbols-outlined text-sm">qr_code_2</span>
                                            LẤY MÃ QR
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination UI (Tĩnh) */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <span className="text-xs text-slate-500">Hiển thị {events.length} sự kiện</span>
                {/* Pagination Controls... */}
            </div>
        </div>

      </div>

      {/* Modal Import */}
      <AddEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchEvents}
      />
    </div>
  );
};

export default EventManagement;