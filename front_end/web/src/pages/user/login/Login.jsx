import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  // State quản lý dữ liệu nhập vào
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hàm xử lý khi bấm nút Đăng Nhập
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError('');
    setLoading(true);

    try {
      // --- BƯỚC 1: GỌI API LOGIN ĐỂ LẤY TOKEN ---
      const formData = new URLSearchParams();
      formData.append('username', username); 
      formData.append('password', password); 

      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Đăng nhập thất bại! Kiểm tra lại tài khoản.');
      }

      // Lưu Token vào kho
      localStorage.setItem('access_token', data.access_token);
      console.log("1. Token đã lưu thành công.");

      // --- BƯỚC 2: GỌI API LẤY THÔNG TIN USER (ĐÃ THÊM AUTHORIZATION) ---
      // Lưu ý: Phải dùng Bearer token vừa lấy được gửi ngược lên header
      const meResponse = await fetch('http://127.0.0.1:8000/api/v1/users/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${data.access_token}`, // Dòng cực kỳ quan trọng
            'Content-Type': 'application/json'  
        }
      });

      if (!meResponse.ok) {
        // Nếu DB thiếu mã OTP hoặc lỗi Schema, nó sẽ rơi vào đây
        throw new Error("Xác thực thông tin người dùng thất bại (Có thể do dữ liệu DB chưa đủ).");
      }

      const userData = await meResponse.json();
      console.log("Dữ liệu User nhận được:", userData);
      
      // --- BƯỚC 3: LƯU ROLE VÀ ĐIỀU HƯỚNG ---
      localStorage.setItem('user_role', userData.role); // Lưu role để AppRoutes sử dụng

      // Phân luồng điều hướng dựa trên Role
      if (userData.role === 'SUPER_ADMIN') {
          navigate('/admin/dashboard');
      } 
      else if (userData.role === 'SUB_ADMIN') { 
          navigate('/admin_sub/dashboard');
      } 
      else {
          // Sinh viên và các role khác
          navigate('/home');
      }

    } catch (err) {
      console.error("Lỗi hệ thống:", err);
      setError(err.message);
      // Xóa dữ liệu cũ nếu lỗi để đảm bảo an toàn
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            LHU YouthHub
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Đăng nhập hệ thống quản lý
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative animate-pulse" role="alert">
            <span className="block sm:inline text-xs font-bold">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="username" className="sr-only">Tài khoản</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="MSSV / Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mật khẩu</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-all shadow-md active:scale-95"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                   <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"></svg>
                   Đang xác thực...
                </span>
              ) : 'Đăng Nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;