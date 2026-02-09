import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

/**
 * SettingsSidebar - Sidebar điều hướng cho các trang cài đặt
 * Đã cập nhật logic kéo dữ liệu Họ tên và MSSV từ API
 */
const SettingsSidebar = () => {
    const navigate = useNavigate();



    // --- LOGIC KÉO API ---
    const [userData, setUserData] = useState({
        full_name: '',
        mssv: '',
        avatar_url: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                // Gọi API lấy thông tin người dùng hiện tại
                const response = await fetch('http://127.0.0.1:8000/api/v1/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData({
                        full_name: data.full_name, // Lấy từ trường full_name trong model
                        mssv: data.mssv,           // Lấy từ trường mssv trong model
                        avatar_url: data.avatar_url // Lấy từ trường avatar_url trong model
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

        fetchUserData();
    }, []);

    // Logic đăng xuất
    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
            localStorage.clear();
            navigate("/login");
        }
    };

    // --- GIỮ NGUYÊN GIAO DIỆN ---
    const activeStyle = "flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-primary font-medium border-l-4 border-primary transition-all";
    const normalStyle = "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all border-l-4 border-transparent";

    const menuItems = [
        { to: '/settings/profile', icon: 'person', label: 'Thông Tin Cá Nhân' },
        { to: '/settings/password', icon: 'lock', label: 'Đổi Mật Khẩu' },
        { to: '/settings/social', icon: 'share', label: 'Liên Kết Mạng Xã Hội' },
        { to: '/settings/privacy', icon: 'security', label: 'Quyền Riêng Tư' },
    ];

    return (
        <div className="w-full md:w-64 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
            <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    <img
                        src={userData.avatar_url || "https://i.pravatar.cc/150?u=default"}
                        alt="User"
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
                <div className="overflow-hidden">
                    <h3 className="font-bold text-gray-900 text-sm truncate">
                        {userData.full_name || "Đang tải..."}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                        MSSV: {userData.mssv || "..."}
                    </p>
                </div>
            </div>

            <nav className="space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => isActive ? activeStyle : normalStyle}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className={normalStyle + " w-full text-danger hover:text-danger hover:bg-red-50"}
                >
                    <span className="material-symbols-outlined">logout</span>
                    <span className="text-sm">Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsSidebar;