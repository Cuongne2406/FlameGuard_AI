import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CampaignTimelinePage = () => {
  const location = useLocation();
  return <Navigate to="/admin/campaigns?view=timeline" state={location.state} replace />;
};

export default CampaignTimelinePage;
