import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const OrgChartPage = () => {
  const location = useLocation();
  return <Navigate to="/admin/organizations?tab=chart" state={location.state} replace />;
};

export default OrgChartPage;
