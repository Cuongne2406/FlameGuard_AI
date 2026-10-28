import React, { useState, useRef, useEffect, useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/admin_sub/Sidebar";
import Header from "../../components/admin_sub/Header";

const SubAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);

  // Auto scroll to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50/70 overflow-hidden relative font-sans text-slate-900">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(true)} 
          onLogout={handleLogout} 
        />
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-7 max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubAdminLayout;