import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const MembersPage = () => {
  const location = useLocation();
  return <Navigate to="/admin/organizations?tab=members" state={location.state} replace />;
};

export default MembersPage;
