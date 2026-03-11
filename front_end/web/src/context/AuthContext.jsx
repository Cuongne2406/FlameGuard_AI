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
      // 1. Gửi request lấy jwt
      const res = await authService.login({ username, password });
      
      // 2. Lưu token vào Storage
      localStorage.setItem('accessToken', res.access_token);
      
      // 3. Fetch dữ liệu profile
      await checkUserLogged();
      
      return true; // Login thành công
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại.');
      return false;
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
    <AuthContext.Provider value={{ user, roles, loading, error, login, logout, hasRole, checkUserLogged }}>
      {children}
    </AuthContext.Provider>
  );
};
