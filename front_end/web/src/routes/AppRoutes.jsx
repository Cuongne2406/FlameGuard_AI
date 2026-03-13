import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../components/Login";
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
import NotificationManager from "../pages/admin/notification_management/NotificationManager";

// admin sub pages
import SubAdminLayout from "../pages/admin_sub/SubAdminLayout";
import SubAdminDashboard from "../pages/admin_sub/dashboard/SubAdminDashboard";
import SubAdminApprovals from "../pages/admin_sub/approvals/SubAdminApprovals";
import SubAdminClasses from "../pages/admin_sub/classes/SubAdminClasses";
import SubAdminClubs from "../pages/admin_sub/clubs/SubAdminClubs";
import SubAdminEvents from "../pages/admin_sub/events/SubAdminEvents";
import EventFeedbackAnalysis from "../pages/admin_sub/events/EventFeedbackAnalysis";
import EventLiveReport from "../pages/admin_sub/events/EventLiveReport";
import EventManualCheckin from "../pages/admin_sub/events/EventManualCheckin";
import EventRegistrationApproval from "../pages/admin_sub/events/EventRegistrationApproval";
import EventSummary from "../pages/admin_sub/events/EventSummary";
import SubAdminFinance from "../pages/admin_sub/finance/SubAdminFinance";
import SubAdminAwards from "../pages/admin_sub/awards/SubAdminAwards";
import SubAdminNotifications from "../pages/admin_sub/notifications/SubAdminNotifications";
import SubAdminAIAnalysis from "../pages/admin_sub/aianalysis/SubAdminAIAnalysis";
import SubAdminSettings from "../pages/admin_sub/settings/SubAdminSettings";

// user pages
import UserLayout from "../layouts/UserLayout";
import UserDashboard from "../pages/user/Dashboard/Dashboard";
import DigitalDocument from "../pages/user/DigitalDocument/DigitalDocument";
import UserSetting from "../pages/user/Settings/UserSetting";
import Profile from "../pages/user/Profile/Profile";
import Event from "../pages/user/Event/Event";
import WalletPage from "../pages/user/Wallet/Wallet";

//public pages
import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/public/home/Home";
import News from "../pages/public/New";
import NewsDetail from "../pages/public/NewDetail";
import Activities from "../pages/public/Activities";
import Academic from "../pages/public/Academic";
import Contact from "../pages/public/Contact";


const AppRoutes = () => {
  return (
    <Routes>
      {/* admin */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['UNIVERSITY_ADMIN']} />
      }>
        <Route element={<AdminLayout />}>
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
          <Route path="notifications" element={<NotificationManager />} />
        </Route>
      </Route>

      {/* admin_sub */}
      <Route path="/admin_sub" element={
        <ProtectedRoute allowedRoles={['FACULTY_ADMIN', 'UNIVERSITY_ADMIN']} />
      }>
        <Route element={<SubAdminLayout />}>
          <Route index element={<SubAdminDashboard />} />
          <Route path="dashboard" element={<SubAdminDashboard />} />
          <Route path="approvals" element={<SubAdminApprovals />} />
        <Route path="classes" element={<SubAdminClasses />} />
        <Route path="clubs" element={<SubAdminClubs />} />
        <Route path="events" element={<SubAdminEvents />} />
        <Route path="events/feedback" element={<EventFeedbackAnalysis />} />
        <Route path="events/live-report" element={<EventLiveReport />} />
        <Route path="events/manual-checkin" element={<EventManualCheckin />} />
        <Route path="events/registration-approval" element={<EventRegistrationApproval />} />
        <Route path="events/summary" element={<EventSummary />} />
        <Route path="finance" element={<SubAdminFinance />} />
        <Route path="awards" element={<SubAdminAwards />} />
        <Route path="notifications" element={<SubAdminNotifications />} />
        <Route path="ai-analysis" element={<SubAdminAIAnalysis />} />
          <Route path="settings" element={<SubAdminSettings />} />
        </Route>
      </Route>

      {/* user */}
      <Route path="/user" element={
        <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY_ADMIN', 'UNIVERSITY_ADMIN']} />
      }>
        <Route element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="documents" element={<DigitalDocument />} />
        <Route path="settings" element={<UserSetting />} />
        <Route path="profile" element={<Profile />} />
        <Route path="event" element={<Event />} />
          <Route path="wallet" element={<WalletPage />} />
        </Route>
      </Route>

      {/* public */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="tin-tuc" element={<News />} />
        <Route path="tin-tuc/:id" element={<NewsDetail />} />
        <Route path="hoat-dong" element={<Activities />} />
        <Route path="hoc-thuat" element={<Academic />} />
        <Route path="lien-he" element={<Contact />} />
      </Route>

      {/* login */}
      <Route path="/login" element={<Login />} />

      {/* Route dự phòng cho trang 404 nếu gõ sai URL */}
      <Route
        path="*"
        element={<div className="p-10">404 - Không tìm thấy trang</div>}
      />
    </Routes>
  );
};


export default AppRoutes;
