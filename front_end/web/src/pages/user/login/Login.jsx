import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // Hàm xử lý đăng nhập giả
  const handleFakeLogin = (role) => {
    // 1. Lưu role vào bộ nhớ trình duyệt (LocalStorage)
    localStorage.setItem('userRole', role);
    localStorage.setItem('accessToken', 'fake-token-123456');

    // 2. Điều hướng dựa trên Role khớp với AppRoutes.jsx
    if (role === 'SUPER_ADMIN') {
      alert("Đang vào với quyền: ADMIN TỔNG");
      navigate('/admin/dashboard'); // Vào khu vực Admin
    } 
    else if (role === 'SUB_ADMIN') {
      alert("Đang vào với quyền: BÍ THƯ CHI ĐOÀN");
      navigate('/admin-sub/dashboard'); // Vào khu vực Sub-Admin mới tạo
    }
    else if (role === 'STUDENT') {
      alert("Đang vào với quyền: SINH VIÊN");
      navigate('/home'); // Vào khu vực User
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-6 font-display">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-primary uppercase">Hệ Thống YouthHub</h1>
        <p className="text-gray-500 font-medium">Giả Lập Đăng Nhập (Chế độ phát triển)</p>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-4 w-96 border border-gray-100">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest text-center mb-2">Chọn vai trò truy cập</p>

        {/* NÚT 1: ADMIN TỔNG */}
        <button 
          onClick={() => handleFakeLogin('SUPER_ADMIN')}
          className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200"
        >
          <span className="material-symbols-outlined">admin_panel_settings</span>
          ADMIN TỔNG (Trường)
        </button>

        {/* NÚT 2: SUB-ADMIN (Bí thư - Mới thêm) */}
        <button 
          onClick={() => handleFakeLogin('SUB_ADMIN')}
          className="flex items-center justify-center gap-3 bg-[#f2a60d] hover:bg-[#d9950b] text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-100"
        >
          <span className="material-symbols-outlined">local_police</span>
          BÍ THƯ (Sub-Admin)
        </button>

        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink-0 mx-4 text-gray-300 text-[10px] font-bold uppercase tracking-tighter">Sinh viên</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* NÚT 3: USER */}
        <button 
          onClick={() => handleFakeLogin('STUDENT')}
          className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-100"
        >
          <span className="material-symbols-outlined">person</span>
          SINH VIÊN (User)
        </button>
      </div>
      
      <div className="flex items-center gap-2 text-gray-400 font-mono text-[10px]">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        SYSTEM READY • NO DATABASE CONNECTED
      </div>
    </div>
  );
};

export default Login;