import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header đơn giản cho khách */}
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold text-primary">LHU YouthHub (Public)</h1>
      </header>

      {/* Nội dung trang con (Home, Login...) sẽ hiện ở đây */}
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-100 p-4 text-center mt-auto">
        Footer nội dung
      </footer>
    </div>
  );
};

export default PublicLayout;