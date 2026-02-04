import React from 'react';
import { Outlet } from 'react-router-dom';
// Import Navbar, Footer dành cho khách...

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header>Menu Ngang Cho Khách</header>
      
      <main className="flex-1">
        <Outlet />
      </main>

      <footer>Footer Thông Tin</footer>
    </div>
  );
};
export default PublicLayout;