import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ListView from "../../../components/admin/Campaign/ListView";

const CampaignListPage = () => {
  const location = useLocation();
  const [triggerCreateModal, setTriggerCreateModal] = useState(false);

  useEffect(() => {
    if (location.state?.openCreate) {
      setTriggerCreateModal(true);
    }
  }, [location.state]);

  return (
    <div className="space-y-6">
      <ListView
        triggerCreateModal={triggerCreateModal}
        onModalClose={() => setTriggerCreateModal(false)}
      />
    </div>
  );
};

export default CampaignListPage;
