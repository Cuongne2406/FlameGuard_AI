import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ==============================
// 1. IMPORT LAYOUTS
// ==============================
// Layout Admin (Của BẠN)
import AdminLayout from '../layouts/AdminLayout';

// Layout Public & User (Của BẠN KIA - Hãy đảm bảo đã copy file vào đúng chỗ)
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../components/UserComponents/UserLayout';
import SettingsLayout from '../components/SettingsComponents/SettingsLayout';


// ==============================
// 2. IMPORT PAGES
// ==============================

// --- GROUP A: PUBLIC PAGES (Khách xem) ---
import PublicHome from '../pages/public/home/Home';
import News from '../pages/public/New';
import NewsDetail from '../pages/public/NewDetail';
import Activities from '../pages/public/Activities';
import Academic from '../pages/public/Academic';
import Contact from '../pages/public/Contact';

// --- GROUP B: AUTH (Đăng nhập) ---
import Login from '../pages/user/login/Login';

// --- GROUP C: USER PAGES (Sinh viên) ---
import UserHome from '../pages/user/dashboard/Home'; // Đổi tên để không nhầm với Admin
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

// --- GROUP E: ADMIN PAGES (Của BẠN) ---
import AdminDashboard from '../pages/admin/dashboard/Dashboard'; // Đổi tên cho rõ
import Members from '../pages/admin/member_management/member'; 
import EventManager from '../pages/admin/event_management/EventManager';
import NotificationManager from '../pages/admin/notification_management/NotificationManager';
import ApprovalQueue from '../pages/admin/approval_queue/ApprovalQueue';
import FinancialManager from '../pages/admin/financial_management/FinancialManager';
import AchievementLeaderboard from '../pages/admin/achievements/AchievementLeaderboard';
import AIAnalytics from '../pages/admin/AI_Data_Insight/AIAnalytics';


const AppRoutes = () => {
  return (
    <Routes>
      
      {/* =========================================================
          KHU VỰC 1: PUBLIC (Trang chủ, Tin tức...) - Ai cũng xem được
         ========================================================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PublicHome />} />
        <Route path="/tin-tuc" element={<News />} />
        <Route path="/tin-tuc/:id" element={<NewsDetail />} />
        <Route path="/hoat-dong" element={<Activities />} />
        <Route path="/hoc-thuat" element={<Academic />} />
        <Route path="/lien-he" element={<Contact />} />
      </Route>


      {/* =========================================================
          KHU VỰC 2: AUTHENTICATION
         ========================================================= */}
      <Route path="/login" element={<Login />} />


      {/* =========================================================
          KHU VỰC 3: USER (Sinh viên sau khi đăng nhập)
         ========================================================= */}
      <Route element={<UserLayout />}>
        {/* Đường dẫn: domain.com/home */}
        <Route path="/home" element={<UserHome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/activity" element={<ActivityLog />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/ranking" element={<Ranking />} />

        {/* Cấu trúc lồng nhau cho Settings */}
        <Route path="/settings" element={<SettingsLayout />}>
          <Route index element={<EditProfile />} />
          <Route path="profile" element={<EditProfile />} />
          <Route path="password" element={<ChangePassword />} />
          <Route path="social" element={<SocialLinks />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>
      </Route>


      {/* =========================================================
          KHU VỰC 4: ADMIN (Quản trị viên) - Code của BẠN
         ========================================================= */}
      <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Navigate to="dashboard" replace />} />
           
           <Route path="dashboard" element={<AdminDashboard />} />
           <Route path="users" element={<Members />} /> 
           <Route path="events" element={<EventManager />} />
           <Route path="notifications" element={<NotificationManager />} />
           <Route path="approvals" element={<ApprovalQueue />} />
           <Route path="finance" element={<FinancialManager />} />
           <Route path="achievements" element={<AchievementLeaderboard />} />
           <Route path="ai-analysis" element={<AIAnalytics />} />
      </Route>


      {/* =========================================================
          FALLBACK: Trang 404 hoặc Redirect
         ========================================================= */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRoutes;