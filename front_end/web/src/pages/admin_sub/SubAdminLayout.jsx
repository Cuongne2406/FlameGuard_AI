import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin_sub/Sidebar';

const SubAdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="ml-72 min-h-screen">
        <div className="max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>

      <style>{`
                /* Global refinements for Mockup Alignment */
                body {
                    @apply bg-[#F8FAFC];
                }
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
                /* Soften all transitions for premium feel */
                * {
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
    </div>
  );
};

export default SubAdminLayout;
