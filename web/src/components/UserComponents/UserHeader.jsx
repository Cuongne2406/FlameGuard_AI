import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

/**
 * UserHeader - Header cho trang đoàn viên
 * Hiển thị: Menu mobile toggle, Search (optional), Notifications, Help, User avatar
 */
const UserHeader = ({ user, onMenuClick }) => {
    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
            {/* Left: Mobile menu toggle + Greeting */}
            <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <span className="material-symbols-outlined text-gray-600">menu</span>
                </button>

                {/* Greeting - hidden on mobile */}
                <div className="hidden sm:block">
                    <h1 className="text-lg font-semibold text-gray-900">
                        Chào {user?.name?.split(' ').pop() || 'bạn'},
                    </h1>
                    <p className="text-sm text-gray-500">
                        Chúc bạn một ngày năng động!
                    </p>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Date */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg mr-2">
                    <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
                    <span className="text-sm text-gray-600">
                        {new Date().toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                </div>

                {/* Notifications */}
                <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-gray-600">notifications</span>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
                </Link>

                {/* Help */}
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-gray-600">help</span>
                </button>

                {/* User Menu Dropdown */}
                <div className="ml-2">
                    <UserMenu user={user} placement="bottom-right" />
                </div>
            </div>
        </header>
    );
};

export default UserHeader;
