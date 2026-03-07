import React from "react";
import { Routes, Route } from "react-router-dom";

// admin pages
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import Organization from "../pages/admin/Organization/Organization";
import Campaigns from "../pages/admin/Campaigns/Campaigns";
import Finance from "../pages/admin/Finance/Finance";
import Awards from "../pages/admin/Awards/Awards";
import DigitalDocuments from "../pages/admin/DigitalDocuments/DigitalDocument";
import AIIntelligence from "../pages/admin/AIIntelligence/AIIntelligeance";
import Settings from "../pages/admin/Settings/Settings";
import UserProfile from "../pages/admin/UserProfile/UserProfile";
import UserActivityLog from "../components/admin/Profile/UserActivityLog";
import AdminLayout from "../layouts/AdminLayout";

// user
import UserLayout from "../layouts/UserLayout";
import UserDashboard from "../pages/user/Dashboard/Dashboard";
import DigitalDocument from "../pages/user/DigitalDocument/DigitalDocument";
import UserSetting from "../pages/user/Settings/UserSetting";
import Profile from "../pages/user/Profile/Profile";
import Event from "../pages/user/Event/Event";
import WalletPage from "../pages/user/Wallet/Wallet";

//public



const AppRoutes = () => {
  return (
    <Routes>
      {/* admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="organization" element={<Organization />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="finance" element={<Finance />} />
        <Route path="awards" element={<Awards />} />
        <Route path="documents" element={<DigitalDocuments />} />
        <Route path="ai" element={<AIIntelligence />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="activity-log" element={<UserActivityLog />} />
      </Route>

      {/* user */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="documents" element={<DigitalDocument />} />
        <Route path="settings" element={<UserSetting />} />
        <Route path="profile" element={<Profile />} />
        <Route path="event" element={<Event />} />
        <Route path="wallet" element={<WalletPage />} />
      </Route>


      {/* Route dự phòng cho trang 404 nếu gõ sai URL */}
      <Route
        path="*"
        element={<div className="p-10">404 - Không tìm thấy trang</div>}
      />
    </Routes>
  );
};

// Đảm bảo có dòng này để sửa lỗi "No matching export"
export default AppRoutes;
