import React, { useState, useEffect } from 'react';
import AddMemberModal from '../../../components/admin/AddMemberModal';

const Members = () => {
  // 1. State quản lý dữ liệu
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. Hàm gọi API lấy danh sách
  const fetchMembers = async (search = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      // Gọi API Backend: Lấy 50 người, có hỗ trợ tìm kiếm
      let url = "http://127.0.0.1:8000/api/v1/users/?limit=50";
      if (search) {
        url += `&search=${search}`;
      }

      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API lần đầu khi vào trang
  useEffect(() => {
    fetchMembers();
  }, []);

  // Xử lý tìm kiếm khi nhấn Enter
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchMembers(searchTerm);
    }
  };

  // Hàm tạo Avatar chữ cái (Vd: Nguyễn Văn A -> A)
  const getAvatarChar = (name) => {
    if (!name) return "U";
    const words = name.trim().split(' ');
    return words[words.length - 1].charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F7FA]">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm z-10">
        <div>
          <h2 className="text-slate-800 text-2xl font-black leading-tight tracking-tight">QUẢN LÝ NHÂN SỰ</h2>
          <p className="text-slate-500 text-sm mt-1">Danh sách đoàn viên và cán bộ đoàn</p>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400">search</span>
            </div>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/50 sm:text-sm transition-all shadow-sm"
              placeholder="Tìm tên, MSSV, lớp..." 
            />
          </div>

          {/* Add New Button (Đã gắn sự kiện mở Modal) */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0 bg-primary hover:bg-primary-hover text-white flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Thêm Mới</span>
          </button>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        
        {/* Stats Cards (Số liệu tạm tính từ danh sách hiện tại) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard icon="groups" color="blue" title="Tổng nhân sự" value={members.length} />
          <StatCard icon="verified_user" color="purple" title="Cán bộ đoàn" value={members.filter(m => m.role === 'SUB_ADMIN').length} />
          <StatCard icon="school" color="green" title="Đoàn viên" value={members.filter(m => m.role === 'STUDENT').length} />
        </div>

        {/* Main Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-auto min-h-[500px]">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <Th>Avatar</Th>
                  <Th>Họ Tên & Email</Th>
                  <Th>MSSV</Th>
                  <Th>Chi Đoàn</Th>
                  <Th>Chức Vụ</Th>
                  <Th className="text-center">Trạng Thái</Th>
                  <Th className="text-right">Thao Tác</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                    <tr><td colSpan="7" className="p-8 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
                ) : members.length === 0 ? (
                    <tr><td colSpan="7" className="p-8 text-center text-slate-400">Không tìm thấy kết quả nào</td></tr>
                ) : (
                    members.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50 transition-colors group">
                        {/* Avatar Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-bold text-white text-lg shadow-sm`}>
                              {getAvatarChar(member.full_name)}
                            </div>
                        </td>

                        {/* Info Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-slate-900">{member.full_name}</div>
                          <div className="text-xs text-slate-500">{member.email}</div>
                        </td>

                        {/* MSSV */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono font-medium">
                          {member.mssv}
                        </td>
                        
                        {/* Lớp / Chi Đoàn */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {member.class_name ? (
                              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                                  {member.class_name}
                              </span>
                          ) : <span className="text-slate-300 italic text-xs">--</span>}
                        </td>

                        {/* Role Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.role === 'SUB_ADMIN' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border bg-purple-50 text-purple-700 border-purple-100">
                                  Ban Chấp Hành
                              </span>
                          ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-slate-50 text-slate-600 border-slate-200">
                                  Đoàn Viên
                              </span>
                          )}
                        </td>

                        {/* Status (Online/Offline) */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {member.last_login ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-green-50 text-green-700 border-green-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                              </span>
                          ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-slate-50 text-slate-400 border-slate-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Offline
                              </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors" title="Xem chi tiết">
                              <span className="material-symbols-outlined text-[20px]">visibility</span>
                            </button>
                            <button className="text-slate-400 hover:text-primary p-1 rounded hover:bg-orange-50 transition-colors" title="Chỉnh sửa">
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination (Tạm thời để tĩnh) */}
          <div className="bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-between mt-auto">
             {/* ... Phần phân trang giữ nguyên hoặc ẩn đi nếu chưa cần ... */}
             <p className="text-sm text-slate-500">Hiển thị tối đa 50 kết quả mới nhất.</p>
          </div>
        </div>
      </div>

      {/* --- MODAL THÊM MỚI (Đã import và sử dụng) --- */}
      <AddMemberModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={() => fetchMembers(searchTerm)}
      />

    </div>
  );
};

// --- Sub-components ---
const StatCard = ({ icon, color, title, value }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600"
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors[color]}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium uppercase">{title}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

const Th = ({ children, className = "" }) => (
  <th className={`px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

export default Members;