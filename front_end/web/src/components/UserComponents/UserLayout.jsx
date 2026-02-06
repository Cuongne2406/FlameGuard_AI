import React from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import UserHeader from './UserHeader';

/**
 * UserLayout - Layout wrapper cho các trang đoàn viên
 * Bao gồm: Sidebar + Header + Main content area
 */
const UserLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Mock user data - sau này sẽ lấy từ context/redux
    const user = {
        name: 'Nguyễn Văn A',
        studentId: '2110456',
        avatar: null,
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <UserSidebar
                user={user}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <UserHeader
                    user={user}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 lg:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserLayout;
