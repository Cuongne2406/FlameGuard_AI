import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

// Khởi tạo Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Lưu thông tin người dùng
  const [roles, setRoles] = useState([]); // Lưu danh sách phân quyền (RBAC)
  const [loading, setLoading] = useState(true); // Trạng thái chờ load ban đầu
  const [error, setError] = useState(null); // Lưu lỗi đăng nhập

  // Hàm chạy 1 lần khi ứng dụng F5 (reload)
  useEffect(() => {
    checkUserLogged();
  }, []);

  // Hàm xác thực token đang có
  const checkUserLogged = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        // Lấy thông tin user hiện tại nếu có token
        const userData = await userService.getMe();
        setUser(userData);
        // Trích xuất roles thành mảng string ['STUDENT', 'FACULTY_ADMIN'] dễ quản lý
        if (userData && userData.roles) {
           setRoles(userData.roles.map(r => r.name));
        }
      } catch (err) {
        console.error("Phiên đăng nhập không hợp lệ hoặc đã hết hạn", err);
        logout();
      }
    }
    setLoading(false);
  };

  // Hàm Login
  const login = async (username, password) => {
    setError(null);
    try {
      const res = await authService.login({ username, password });
      
      // Nếu Backend yêu cầu 2FA
      if (res.requires_2fa) {
        return { requires2fa: true, userId: res.user_id };
      }

      // Lưu token vào Storage
      localStorage.setItem('accessToken', res.access_token);
      
      // Fetch dữ liệu profile
      await checkUserLogged();
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại.');
      return { success: false, error: err.message };
    }
  };

  // Hàm Xác thực mã OTP
  const verifyOtp = async (userId, otpCode) => {
    setError(null);
    try {
      const res = await authService.verify2fa({ user_id: userId, otp_code: otpCode });
      
      localStorage.setItem('accessToken', res.access_token);
      await checkUserLogged();
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Mã xác thực không hợp lệ.');
      return { success: false, error: err.message };
    }
  };

  // Hàm Logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setRoles([]);
    // Xóa session ở Backend nếu cần thiết: authService.logout()
  };

  // Kiểm tra quyền (trợ thủ cho Route)
  const hasRole = (requiredRole) => {
    return roles.includes(requiredRole);
  };

  return (
    <AuthContext.Provider value={{ user, roles, loading, error, login, verifyOtp, logout, hasRole, checkUserLogged }}>
      {children}
    </AuthContext.Provider>
  );
};
