import { NavLink } from 'react-router-dom';
import UserMenu from './UserMenu';

/**
 * UserSidebar - Sidebar cho trang đoàn viên
 * Menu: Trang chủ, Hồ sơ cá nhân, Nhật ký hoạt động, Kho chứng nhận, Bảng xếp hạng
 */
const UserSidebar = ({ user, isOpen, onClose }) => {
    const activeStyle = "flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white font-medium shadow-sm transition-all duration-200";
    const normalStyle = "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200";

    const menuItems = [
        { to: '/home', icon: 'home', label: 'Trang chủ' },
        { to: '/profile', icon: 'person', label: 'Hồ sơ cá nhân' },
        { to: '/activity', icon: 'history', label: 'Nhật ký hoạt động' },
        { to: '/notifications', icon: 'notifications', label: 'Thông báo' },
        { to: '/certificates', icon: 'workspace_premium', label: 'Kho chứng nhận' },
        { to: '/ranking', icon: 'leaderboard', label: 'Bảng xếp hạng' },
        { to: '/setting', icon: 'settings', label: 'Cài đặt' },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-50 
          w-64 flex-shrink-0 bg-white h-screen flex flex-col shadow-xl overflow-hidden
          transform transition-transform duration-300 lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Header (Logo) */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-xl">school</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-primary text-sm">Đoàn Khoa</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Hệ sinh thái số</span>
                        </div>
                    </div>
                </div>

                {/* Menu List */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={({ isActive }) => isActive ? activeStyle : normalStyle}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="text-sm">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer (User Menu) */}
                <div className="p-4 border-t border-gray-100 mt-auto">
                    <UserMenu user={user} placement="top-right" />
                </div>
            </aside>
        </>
    );
};

export default UserSidebar;
