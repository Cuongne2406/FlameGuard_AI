import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Component bảo vệ các Route.
 * @param {Array} allowedRoles - Danh sách các Role được phép truy cập (VD: ['STUDENT', 'FACULTY_ADMIN'])
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, roles, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    // Hiển thị loading spinner hoặc giao diện chờ khi đang verify token
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 1. Nếu chưa đăng nhập -> Đẩy về trang Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Nếu đã đăng nhập nhưng không có Role phù hợp -> Đẩy về trang chủ / hoặc báo lỗi 403
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = roles.some(role => allowedRoles.includes(role));
    if (!hasPermission) {
      // Logic dự phòng redirect về dashboard tương ứng với role cao nhất
      if (roles.includes("UNIVERSITY_ADMIN")) {
         return <Navigate to="/admin/dashboard" replace />;
      } else if (roles.includes("FACULTY_ADMIN")) {
         return <Navigate to="/admin-sub/dashboard" replace />;
      } else {
         return <Navigate to="/user/dashboard" replace />;
      }
    }
  }

  // Khớp tất cả điều kiện -> Cho phép render các Route con
  return <Outlet />;
};

export default ProtectedRoute;
