import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';

const AdminLayout = ({ role }) => {
  // 1. Tạo biến để lưu cấu hình hệ thống
  const [systemSettings, setSystemSettings] = useState({
    unit_name: 'LHU YouthHub', // Tên mặc định khi chưa load xong
    logo_url: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 2. Gọi API lấy thông tin hệ thống khi vào trang
  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        // API này thường public hoặc cần token tùy bạn cài đặt, ở đây mình gửi kèm token cho chắc
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/v1/system/", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSystemSettings(data);
        }
      } catch (error) {
        console.error("Lỗi tải cấu hình hệ thống:", error);
      }
    };
    fetchSystemSettings();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* 3. TRUYỀN DỮ LIỆU VÀO SIDEBAR QUA PROP "settings" */}
      <Sidebar
        role={role}
        settings={systemSettings}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      /> 

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header cố định bên trên */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Khu vực nội dung thay đổi (Dynamic Content) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;