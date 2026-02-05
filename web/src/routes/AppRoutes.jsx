import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ==============================
// 1. IMPORT LAYOUTS
// ==============================
import AdminLayout from '../layouts/AdminLayout';
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../components/UserComponents/UserLayout';
import SettingsLayout from '../components/SettingsComponents/SettingsLayout';
// Import Layout riêng cho Cài đặt hệ thống (Trang mới)
import AdminSettingsLayout from '../pages/admin/settings/AdminSettingsLayout';

// ==============================
// 2. IMPORT PAGES
// ==============================

// --- GROUP A: PUBLIC PAGES ---
import PublicHome from '../pages/public/home/Home';
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

// --- GROUP E: ADMIN PAGES ---
import AdminDashboard from '../pages/admin/dashboard/Dashboard';
import Members from '../pages/admin/member_management/member';
import EventManager from '../pages/admin/event_management/EventManager';
import NotificationManager from '../pages/admin/notification_management/NotificationManager';
import ApprovalQueue from '../pages/admin/approval_queue/ApprovalQueue';
import FinancialManager from '../pages/admin/financial_management/FinancialManager';
import AchievementLeaderboard from '../pages/admin/achievements/AchievementLeaderboard';
import AIAnalytics from '../pages/admin/AI_Data_Insight/AIAnalytics';

// --- GROUP F: SYSTEM SETTINGS (Trang tách biệt) ---
import GeneralSettings from '../pages/admin/settings/general/GeneralSettings';
import SecuritySettings from '../pages/admin/settings/security/SecuritySettings';
import NotificationSettings from '../pages/admin/settings/notifications/NotificationSettings';
import IntegrationSettings from '../pages/admin/settings/integrations/IntegrationSettings';

const AppRoutes = () => {
  return (
    <Routes>

      {/* --- KHU VỰC 1: PUBLIC --- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PublicHome />} />
        <Route path="/tin-tuc" element={<News />} />
        <Route path="/tin-tuc/:id" element={<NewsDetail />} />
        <Route path="/hoat-dong" element={<Activities />} />
        <Route path="/hoc-thuat" element={<Academic />} />
        <Route path="/lien-he" element={<Contact />} />
      </Route>


      {/* --- KHU VỰC 2: AUTHENTICATION --- */}
      <Route path="/login" element={<Login />} />


      {/* --- KHU VỰC 3: USER (Sinh viên) --- */}
      <Route element={<UserLayout />}>
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


      {/* --- ADMIN DASHBOARD --- */}
      <Route path="/admin" element={<AdminLayout />}>
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


      {/* SYSTEM SETTINGS */}
      <Route path="/system-settings" element={<AdminSettingsLayout />}>
          <Route index element={<Navigate to="general" replace />} />
          <Route path="general" element={<GeneralSettings />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="notifications" element={<NotificationSettings />} />
          <Route path="integrations" element={<IntegrationSettings />} />
      </Route>


      {/* --- FALLBACK --- */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRoutes;