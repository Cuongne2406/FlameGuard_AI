import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AdminLayout = ({ role }) => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar cố định bên trái, truyền role để biết ẩn hiện menu nào */}
      <Sidebar role={role} /> 

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header cố định bên trên */}
        <Header />

        {/* Khu vực nội dung thay đổi (Dynamic Content) */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet /> {/* <--- Nội dung trang con hiện ở đây */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;