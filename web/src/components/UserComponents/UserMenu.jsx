import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui';

/**
 * UserMenu - Dropdown menu cho User (Profile, Settings, Logout)
 * @param {object} user - Thông tin user
 * @param {string} placement - Vị trí dropdown: 'bottom-right' (Header) | 'top-right' (Sidebar)
 */
const UserMenu = ({ user, placement = 'bottom-right' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Thực hiện logic logout (xóa token...) tại đây nếu cần
        setIsOpen(false);
        navigate('/login');
    };

    const handleNavigate = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    // Xác định vị trí menu
    const menuClasses = placement === 'top-right'
        ? 'bottom-full left-0 mb-2 w-56 origin-bottom-left' // Cho Sidebar (hiện lên trên)
        : 'top-full right-0 mt-2 w-48 origin-top-right';    // Cho Header (hiện xuống dưới)

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 focus:outline-none group rounded-lg transition-colors"
            >
                {/* Custom trigger content passed as children or default avatar */}
                <Avatar
                    src={user?.avatar}
                    name={user?.name || 'User'}
                    size={placement === 'top-right' ? 'md' : 'sm'}
                    className="cursor-pointer ring-2 ring-transparent group-hover:ring-gray-200 transition-all"
                />

                {/* Chỉ hiện tên ở Sidebar mode (optional, tuỳ design cha) */}
                {placement === 'top-right' && (
                    <div className="flex flex-col items-start min-w-0 md:hidden lg:flex text-left">
                        <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                            {user?.name || 'Nguyễn Văn A'}
                        </span>
                        <span className="text-xs text-gray-500 truncate">User</span>
                    </div>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={`absolute z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1 ${menuClasses} animate-fade-in`}>

                    {/* Header info in menu (mobile or context) */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Nguyễn Văn A'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                    </div>

                    <div className="py-1">
                        <button
                            onClick={() => handleNavigate('/profile')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">person</span>
                            Hồ sơ cá nhân
                        </button>
                        <button
                            onClick={() => handleNavigate('/settings/profile')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">settings</span>
                            Cài đặt
                        </button>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                        >
                            <span className="material-symbols-outlined text-lg">logout</span>
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
