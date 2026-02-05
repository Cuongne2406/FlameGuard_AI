import React from 'react';

const Members = () => {
  // Dữ liệu giả lập (Sau này sẽ lấy từ API Backend)
  const members = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@lhu.edu.vn",
      mssv: "11900123",
      class: "19CNTT1",
      role: "Bí Thư",
      roleColor: "bg-blue-100 text-blue-800 border-blue-200",
      status: "Đã Đóng",
      statusColor: "bg-green-100 text-green-700 border-green-200",
      dotColor: "bg-green-600",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA9OVc1NTsepkCM5fSSHK9j1cL5Ky8fWTKup4bdo6eqHb7EMhYWtzVKPxNjtITm-mkygV8srh8YkKP-w2SjKOk5nLKLmrJx9XWUQRQag2oZbZIo-P8HOpIzzChYxPoP_YAWOMrK4W-skNaxeOeyTMpneDcL_UN7-3WGONgxUOF56eVuEsWwSmqO-EaaQoonIk-9C9QaOcbMOxEHiVw7Ct9gt-AEb6X6Z7VPM2Hm5r8GhmGMjeSfWDfOYrrpRcQwdUmvqR7a1LhghZPt')",
      isImage: true
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@lhu.edu.vn",
      mssv: "12000456",
      class: "20QTKD2",
      role: "Đoàn Viên",
      roleColor: "bg-slate-100 text-slate-600 border-slate-200",
      status: "Chưa Đóng",
      statusColor: "bg-red-50 text-red-700 border-red-100",
      dotColor: "bg-red-500",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuArYNgHx34hCfnNT6EFJ9M37y5iN7t7bIunk3-XThMEPSjrLx6y6H3zEOjfV6Nh2O8-ler9iMkzU7O7xjqXj0pUMzbOd1WfDE5S0AW0uIZSJ0WZUdnzD4Shg4HGqShgsZByRk7dF2S2OLGDzW1Pz6GiXGI4j5VNomGeRlWuSCpkpNyYkc6vcu1HxxG4EzXz7sb64yYptAbJn14s3IvvvExvSNLluub6ZwrjXhZbdpRjjcG463HZC_FoTT-Kv6WtzwaRpKwkgT72HA1U')",
      isImage: true
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@lhu.edu.vn",
      mssv: "12100789",
      class: "21KTOAN",
      role: "Đoàn Viên",
      roleColor: "bg-slate-100 text-slate-600 border-slate-200",
      status: "Đã Đóng",
      statusColor: "bg-green-100 text-green-700 border-green-200",
      dotColor: "bg-green-600",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBIPDXf-lpPIp7A_Y9CBxfU9udgK_nhqTHqmI8zshgXMCHh1E9d5E9qkjiGAs47GipliZwahONLgABEQRioqZEw7Na9OiDpNYM8C2itXVF6PFDg_p-bydFSkiZYscy8Jwwq-tY3XZGz86YWq1V7LZHTwlx1UHElyPuL3Uw5IG3gYgY9ndwO1L3VySt22VsMffnON3kCUlBTkUVHyVrP4ENpInEbAOt6zvClAzCImfkgt8oL7zLifgMfjYbZ24qukVJWMxpsETVl2D8c')",
      isImage: true
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@lhu.edu.vn",
      mssv: "12200333",
      class: "22NNANH",
      role: "Phó Bí Thư",
      roleColor: "bg-blue-100 text-blue-800 border-blue-200",
      status: "Đã Đóng",
      statusColor: "bg-green-100 text-green-700 border-green-200",
      dotColor: "bg-green-600",
      initial: "P",
      isImage: false,
      avatarColor: "bg-indigo-100 text-indigo-500"
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@lhu.edu.vn",
      mssv: "12300999",
      class: "23QTKD1",
      role: "Đoàn Viên",
      roleColor: "bg-slate-100 text-slate-600 border-slate-200",
      status: "Chưa Đóng",
      statusColor: "bg-red-50 text-red-700 border-red-100",
      dotColor: "bg-red-500",
      initial: "H",
      isImage: false,
      avatarColor: "bg-pink-100 text-pink-500"
    }
  ];

  return (
    // Container chính: Không cần margin-left (ml-64) vì Layout đã xử lý
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
              className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/50 sm:text-sm transition-all shadow-sm"
              placeholder="Tìm kiếm thành viên, MSSV..." 
            />
          </div>

          {/* Add New Button */}
          <button className="flex-shrink-0 bg-primary hover:bg-primary-hover text-white flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Thêm Mới</span>
          </button>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon="groups" color="blue" title="Tổng số" value="1,248" />
          <StatCard icon="check_circle" color="green" title="Đã đóng phí" value="892" />
          <StatCard icon="pending" color="red" title="Chưa đóng" value="356" />
        </div>

        {/* Main Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-auto min-h-[500px]">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <Th>Avatar</Th>
                  <Th>Họ Tên</Th>
                  <Th>MSSV</Th>
                  <Th>Chi Đoàn</Th>
                  <Th>Chức Vụ</Th>
                  <Th className="text-center">Trạng Thái Đóng Phí</Th>
                  <Th className="text-right">Thao Tác</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors group">
                    {/* Avatar Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.isImage ? (
                        <div 
                          className="h-10 w-10 rounded-full bg-gray-200 bg-cover bg-center shadow-sm"
                          style={{ backgroundImage: member.avatar }}
                        ></div>
                      ) : (
                        <div className={`h-10 w-10 rounded-full ${member.avatarColor} flex items-center justify-center font-bold text-lg shadow-sm`}>
                          {member.initial}
                        </div>
                      )}
                    </td>

                    {/* Info Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{member.name}</div>
                      <div className="text-xs text-slate-500">{member.email}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      {member.mssv}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {member.class}
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${member.roleColor}`}>
                        {member.role}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${member.statusColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${member.dotColor}`}></span>
                        {member.status}
                      </span>
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-between mt-auto">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700">
                  Đang hiển thị <span className="font-medium">1</span> đến <span className="font-medium">10</span> trong số <span className="font-medium">50</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <PaginationButton icon="chevron_left" rounded="rounded-l-md" />
                  <PaginationButton text="1" active />
                  <PaginationButton text="2" />
                  <PaginationButton text="3" className="hidden md:inline-flex" />
                  <span className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700">...</span>
                  <PaginationButton text="5" className="hidden md:inline-flex" />
                  <PaginationButton icon="chevron_right" rounded="rounded-r-md" />
                </nav>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Sub-components (Tách nhỏ để code gọn hơn) ---

const StatCard = ({ icon, color, title, value }) => {
  // Map màu sắc để render class động
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
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

const PaginationButton = ({ text, icon, active, rounded = "", className = "" }) => {
  const baseClass = "relative inline-flex items-center px-4 py-2 border text-sm font-medium";
  const activeClass = "z-10 bg-orange-50 border-orange-500 text-orange-600";
  const normalClass = "bg-white border-slate-300 text-slate-500 hover:bg-slate-50";

  return (
    <a href="#" className={`${active ? activeClass : normalClass} ${rounded} ${className} ${icon ? 'px-2' : ''}`}>
      {icon ? (
        <>
          <span className="sr-only">Nav</span>
          <span className="material-symbols-outlined text-[16px]">{icon}</span>
        </>
      ) : text}
    </a>
  );
};

export default Members;