import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CampaignCalendarPage = () => {
  const location = useLocation();
  return <Navigate to="/admin/campaigns?view=calendar" state={location.state} replace />;
};

export default CampaignCalendarPage;
