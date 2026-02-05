import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../utils/storage'; // Tận dụng file utils vừa tạo

const ProtectedRoute = ({ allowedRoles }) => {
  // const token = getToken();
  
  // // Giả sử lấy role từ localStorage (thực tế nên decode từ token hoặc gọi API)
  // const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  // const userRole = user.role; // Ví dụ: 'SUPER_ADMIN', 'MANAGER'

  // // 1. Chưa đăng nhập -> Đá về trang Login
  // if (!token) {
  //   return <Navigate to="/login" replace />;
  // }

  // // 2. Đã đăng nhập nhưng không đúng quyền (Ví dụ Manager đòi vào trang Admin Tổng)
  // // allowedRoles là mảng các quyền được phép, ví dụ: ['SUPER_ADMIN']
  // if (allowedRoles && !allowedRoles.includes(userRole)) {
  //   return <Navigate to="/403" replace />; // Trang báo lỗi không có quyền
  // }

  const isAuth = true; 

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  // 3. Hợp lệ -> Cho đi tiếp
  return <Outlet />;
};

export default ProtectedRoute;