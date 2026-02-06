import { NavLink, useNavigate } from 'react-router-dom';

/**
 * SettingsSidebar - Sidebar điều hướng cho các trang cài đặt
 */
const SettingsSidebar = () => {
    const activeStyle = "flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-primary font-medium border-l-4 border-primary transition-all";
    const normalStyle = "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all border-l-4 border-transparent";

    const navigate = useNavigate();
    const handleLogout = () => {
        // Có thể thêm logic xóa localstorage/token tại đây
        navigate('/login');
    };

    const menuItems = [
        { to: '/setting/profile', icon: 'person', label: 'Thông Tin Cá Nhân' },
        { to: '/setting/password', icon: 'lock', label: 'Đổi Mật Khẩu' },
        { to: '/setting/social', icon: 'share', label: 'Liên Kết Mạng Xã Hội' },
        { to: '/setting/privacy', icon: 'security', label: 'Quyền Riêng Tư' },
    ];

    return (
        <div className="w-full md:w-64 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
            <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <img src="https://i.pravatar.cc/150?u=2" alt="User" className="w-full h-full rounded-full object-cover" />
                </div>
                <div className="overflow-hidden">
                    <h3 className="font-bold text-gray-900 text-sm truncate">Nguyễn Văn A</h3>
                    <p className="text-xs text-gray-500 truncate">MSSV: 2110456</p>
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
