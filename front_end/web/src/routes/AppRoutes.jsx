import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ==============================
// 1. IMPORT LAYOUTS
// ==============================
import AdminLayout from '../layouts/AdminLayout';
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../components/UserComponents/UserLayout';
import SettingsLayout from '../components/SettingsComponents/SettingsLayout';
import AdminSettingsLayout from '../pages/admin/settings/AdminSettingsLayout';
import SubAdminLayout from '../pages/admin_sub/SubAdminLayout'; // Import Layout Sub Admin

// ==============================
// 2. IMPORT PAGES
// ==============================

// --- GROUP A: PUBLIC PAGES ---
import News from '../pages/public/New';
import NewsDetail from '../pages/public/NewDetail';
import Activities from '../pages/public/Activities';
import Academic from '../pages/public/Academic';
import Contact from '../pages/public/Contact';

// --- GROUP B: AUTH ---
import Login from '../pages/user/login/Login'; 

// --- GROUP C: USER PAGES ---
import UserHome from '../pages/user/dashboard/Home';
import Profile from '../pages/user/profile/Profile';
import ActivityLog from '../pages/user/activity/ActivityLog';
import NotificationPage from '../pages/user/notification/NotificationPage';
import Certificates from '../pages/user/certificates/Certificates';
import Ranking from '../pages/user/ranking/Ranking';

// --- GROUP D: USER SETTINGS ---
import EditProfile from '../pages/user/setting/editprofile/EditProfile';
import ChangePassword from '../pages/user/setting/changepassword/ChangePassword';
import SocialLinks from '../pages/user/setting/linktosocial/SocialLinks';
import Privacy from '../pages/user/setting/privacy/Privacy';

// --- Group: Sub Admin Pages ---
import SubAdminDashboard from '../pages/admin_sub/dashboard/SubAdminDashboard';
import SubAdminManagement from '../pages/admin_sub/management/SubAdminManagement';
import SubAdminNotifications from '../pages/admin_sub/notifications/SubAdminNotifications';
import SubAdminEvents from '../pages/admin_sub/events/SubAdminEvents';

// --- GROUP E: ADMIN PAGES ---
import AdminDashboard from '../pages/admin/dashboard/Dashboard';
import Members from '../pages/admin/member_management/member';
import EventManager from '../pages/admin/event_management/EventManager';
import NotificationManager from '../pages/admin/notification_management/NotificationManager';
import ApprovalQueue from '../pages/admin/approval_queue/ApprovalQueue';
import FinancialManager from '../pages/admin/financial_management/FinancialManager';
import AchievementLeaderboard from '../pages/admin/achievements/AchievementLeaderboard';
import AIAnalytics from '../pages/admin/AI_Data_Insight/AIAnalytics';

// --- GROUP F: SYSTEM SETTINGS ---
import GeneralSettings from '../pages/admin/settings/general/GeneralSettings';
import SecuritySettings from '../pages/admin/settings/security/SecuritySettings';
import NotificationSettings from '../pages/admin/settings/notifications/NotificationSettings';
import IntegrationSettings from '../pages/admin/settings/integrations/IntegrationSettings';
import HelpCenter from '../pages/admin/settings/help/HelpCenter';


// ==============================
// 3. TẠO KHIÊN BẢO VỆ (PRIVATE ROUTE)
// ==============================
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" replace />;
};

// --- HÀM LOGIC: ĐIỀU HƯỚNG THEO ROLE (NEW) ---
const getRedirectPath = (role) => {
    // Nếu là Sub Admin (Cán bộ Đoàn) -> Về Dashboard Sub Admin
    // Lưu ý: Kiểm tra kỹ trong Database role của bạn là 'ADMIN' hay 'SUB_ADMIN' nhé
    if (role === 'ADMIN') return '/admin-sub/dashboard'; 
    
    // Nếu là Super Admin -> Về Dashboard Admin Tổng
    if (role === 'SUPER_ADMIN') return '/admin/dashboard';
    
    // Mặc định (Sinh viên/User) -> Về trang Home User
    return '/home';
};

const AppRoutes = () => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role"); // Lấy role đã lưu lúc Login

  return (
    <Routes>

      {/* --- XỬ LÝ TRANG CHỦ (ROOT) - THÔNG MINH HƠN --- */}
      {/* Logic: Có token ? Điều hướng theo Role : Về trang Login */}
      <Route path="/" element={
        token ? <Navigate to={getRedirectPath(role)} replace /> : <Navigate to="/login" replace />
      } />


      {/* --- PUBLIC PAGES --- */}
      <Route element={<PublicLayout />}>
        <Route path="/tin-tuc" element={<News />} />
        <Route path="/tin-tuc/:id" element={<NewsDetail />} />
        <Route path="/hoat-dong" element={<Activities />} />
        <Route path="/hoc-thuat" element={<Academic />} />
        <Route path="/lien-he" element={<Contact />} />
      </Route>


      {/* --- AUTHENTICATION --- */}
      <Route path="/login" element={<Login />} />


      {/* --- USER (STUDENT) --- */}
      <Route element={<PrivateRoute><UserLayout /></PrivateRoute>}>
        <Route path="/home" element={<UserHome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/activity" element={<ActivityLog />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/ranking" element={<Ranking />} />

        <Route path="/settings" element={<SettingsLayout />}>
          <Route index element={<EditProfile />} />
          <Route path="profile" element={<EditProfile />} />
          <Route path="password" element={<ChangePassword />} />
          <Route path="social" element={<SocialLinks />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>
      </Route>


      {/* --- SUB ADMIN (CÁN BỘ ĐOÀN) --- */}
      <Route path="/admin-sub" element={
        <PrivateRoute>
          <SubAdminLayout />
        </PrivateRoute>
      }>
        {/* Vào /admin-sub thì tự nhảy vào dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* Đường dẫn thực tế: /admin-sub/dashboard */}
        <Route path="dashboard" element={<SubAdminDashboard />} />
        <Route path="management" element={<SubAdminManagement />} />
        <Route path="events" element={<SubAdminEvents />} />
        <Route path="notifications" element={<SubAdminNotifications />} />
      </Route>


      {/* --- SUPER ADMIN (QUẢN TRỊ VIÊN) --- */}
      <Route path="/admin" element={
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="events" element={<EventManager />} />
        <Route path="notifications" element={<NotificationManager />} />
        <Route path="approvals" element={<ApprovalQueue />} />
        <Route path="finance" element={<FinancialManager />} />
        <Route path="achievements" element={<AchievementLeaderboard />} />
        <Route path="ai-analysis" element={<AIAnalytics />} />
      </Route>


      {/* --- SYSTEM SETTINGS --- */}
      <Route path="/system-settings" element={
        <PrivateRoute>
           <AdminSettingsLayout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="general" replace />} />
        <Route path="general" element={<GeneralSettings />} />
        <Route path="security" element={<SecuritySettings />} />
        <Route path="notifications" element={<NotificationSettings />} />
        <Route path="integrations" element={<IntegrationSettings />} />
        <Route path="help" element={<HelpCenter />} />
      </Route>


      {/* --- FALLBACK --- */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRoutes;