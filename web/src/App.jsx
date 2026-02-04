import { Routes, Route } from 'react-router-dom';

// Layouts
import UserLayout from './components/UserComponents/UserLayout';

// Admin Layout (existing)
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/admin/Dashboard';

// User Pages
import Login from './pages/user/login/Login';
import Home from './pages/user/dashboard/Home';

import Profile from './pages/user/profile/Profile';
import ActivityLog from './pages/user/activity/ActivityLog';
import NotificationPage from './pages/user/notification/NotificationPage';
import Certificates from './pages/user/certificates/Certificates';
import Ranking from './pages/user/ranking/Ranking';

import SettingsLayout from './components/SettingsComponents/SettingsLayout';
import EditProfile from './pages/user/setting/editprofile/EditProfile';
import ChangePassword from './pages/user/setting/changepassword/ChangePassword';
import SocialLinks from './pages/user/setting/linktosocial/SocialLinks';
import Privacy from './pages/user/setting/privacy/Privacy';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* User Routes - with UserLayout */}
      <Route element={<UserLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/activity" element={<ActivityLog />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/ranking" element={<Ranking />} />

        {/* Settings Routes - Nested Layout */}
        <Route path="/settings" element={<SettingsLayout />}>
          <Route index element={<EditProfile />} />
          <Route path="profile" element={<EditProfile />} />
          <Route path="password" element={<ChangePassword />} />
          <Route path="social" element={<SocialLinks />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>
      </Route>

      {/* Admin Routes - with old Layout */}
      <Route path="/admin" element={
        <div className="flex h-screen bg-background-light dark:bg-background-dark font-body overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
              <Dashboard />
            </main>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;