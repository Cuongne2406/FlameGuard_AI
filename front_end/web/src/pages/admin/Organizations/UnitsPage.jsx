import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UnitList from "../../../components/admin/Org/UnitList";

const UnitsPage = () => {
  const location = useLocation();
  const [triggerCreateModal, setTriggerCreateModal] = useState(false);

  useEffect(() => {
    if (location.state?.openCreate) {
      setTriggerCreateModal(true);
    }
  }, [location.state]);

  return (
    <div className="space-y-6">
      <UnitList
        triggerCreateModal={triggerCreateModal}
        onModalClose={() => setTriggerCreateModal(false)}
      />
    </div>
  );
};

export default UnitsPage;
