import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layouts
import AdminLayout from '../layouts/AdminLayout';
import PublicLayout from '../layouts/PublicLayout';

// Import Pages
import Home from '../pages/public/home/Home';
import Dashboard from '../pages/admin/dashboard/Dashboard'; // Admin Dashboard
import Members from '../pages/admin/member_management/member';
import Login from '../pages/auth/Login';
import EventManager from '../pages/admin/event_management/EventManager';
import NotificationManager from '../pages/admin/notification_management/NotificationManager';
import ApprovalQueue from '../pages/admin/approval_queue/ApprovalQueue';
import FinancialManager from '../pages/admin/financial_management/FinancialManager';
import AchievementLeaderboard from '../pages/admin/achievements/AchievementLeaderboard';
import AIAnalytics from '../pages/admin/AI_Data_Insight/AIAnalytics';

// Import Route
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ---  PUBLIC  --- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ---  ADMIN TỔNG  --- */}
      <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout role="SUPER_ADMIN" />}>
           <Route path="dashboard" element={<Dashboard />} />
           <Route path="members" element={<Members />} /> 
           <Route path="events" element={<EventManager />} />
           <Route path="notifications" element={<NotificationManager />} />
           <Route path="approvals" element={<ApprovalQueue />} />
           <Route path="finance" element={<FinancialManager />} />
           <Route path="achievements" element={<AchievementLeaderboard />} />
           <Route path="ai-analysis" element={<AIAnalytics />} />
        </Route>
      </Route>

      
      
    </Routes>
    
  );
};

export default AppRoutes;

// Dành cho sub Admin (chưa phát triển)
// {/* ---  SUB-ADMIN --- */}
//       <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'SUPER_ADMIN']} />}>
//         <Route path="/manager" element={<AdminLayout role="MANAGER" />}>
//            <Route path="dashboard" element={<ManagerDashboard />} />
//            {/* Sub-admin cũng có thể xem trang Members nhưng có thể bị hạn chế nút sửa/xóa */}
//            <Route path="users" element={<Members />} /> 
//         </Route>
//       </Route>
      
//       {/* Trang lỗi 404 */}
//       <Route path="*" element={<div>404 Not Found</div>} />
