import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import { Modal, Button } from '../ui';

/**
 * UserHeader - Header cho trang đoàn viên
 * Hiển thị: Menu mobile toggle, Search (optional), Notifications, Help, User avatar
 */
const UserHeader = ({ user, onMenuClick, onHelpClick }) => {
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const handleHelpOpen = () => {
        setIsHelpOpen(true);
        if (onHelpClick) onHelpClick();
    };

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
                {/* Home Link (New) */}
                <Link to="/home" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600" title="Trang chủ">
                    <span className="material-symbols-outlined">home</span>
                </Link>

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
                <button
                    onClick={handleHelpOpen}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <span className="material-symbols-outlined text-gray-600">help</span>
                </button>

                {/* User Menu Dropdown */}
                <div className="ml-2">
                    <UserMenu user={user} placement="bottom-right" />
                </div>
            </div>

            {/* Help Modal */}
            <Modal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
                title="Trung tâm Trợ giúp & Hỗ trợ"
                footer={
                    <Button variant="primary" fullWidth onClick={() => setIsHelpOpen(false)}>Đã hiểu</Button>
                }
            >
                <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-xl flex items-center gap-4 border border-blue-100">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-primary">contact_support</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Bạn cần hỗ trợ kỹ thuật?</p>
                            <p className="text-xs text-blue-600 font-medium">Chúng tôi luôn sẵn sàng 24/7</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                            <span className="material-symbols-outlined text-gray-400">call</span>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hotline Văn phòng Đoàn</p>
                                <p className="text-sm font-bold text-gray-700">1900 1234 (Nhánh 2)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                            <span className="material-symbols-outlined text-gray-400">person</span>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Người phụ trách bộ lọc/dữ liệu</p>
                                <p className="text-sm font-bold text-gray-700">Đ/c Nguyễn Văn A - 0987.xxx.xxx</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                            <span className="material-symbols-outlined text-gray-400">mail</span>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email hỗ trợ</p>
                                <p className="text-sm font-bold text-gray-700">support.doankhoa@lhu.edu.vn</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <p className="text-[11px] text-gray-400 text-center italic">
                            "Mọi ý kiến đóng góp giúp hệ thống hoàn thiện hơn xin gửi về văn phòng Đoàn khoa."
                        </p>
                    </div>
                </div>
            </Modal>
        </header>
    );
};

export default UserHeader;
