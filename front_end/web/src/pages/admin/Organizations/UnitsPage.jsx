import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const UnitsPage = () => {
  const location = useLocation();
  return <Navigate to="/admin/organizations?tab=units" state={location.state} replace />;
};

export default UnitsPage;
