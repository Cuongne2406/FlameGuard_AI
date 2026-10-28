import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CampaignListPage = () => {
  const location = useLocation();
  return <Navigate to="/admin/campaigns?view=list" state={location.state} replace />;
};

export default CampaignListPage;
