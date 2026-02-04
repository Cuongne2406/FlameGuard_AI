import React from 'react';
import { Button, Badge } from '../../../../components/ui';

/**
 * SocialLinks - Trang liên kết mạng xã hội
 */
const SocialLinks = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h1 className="text-xl font-bold text-gray-900">Liên Kết Mạng Xã Hội</h1>
                <p className="text-sm text-gray-500 mt-1">Quản lý các tài khoản liên kết để đăng nhập nhanh chóng</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Tài Khoản Liên Kết</h3>

                <div className="space-y-4">
                    {/* Google - Connected */}
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center p-2">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Google Account</h4>
                                <div className="flex items-center gap-1.5 text-xs text-success font-medium">
                                    <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                                    Đã liên kết
                                </div>
                            </div>
                        </div>
                        <Button variant="danger" size="sm" className="bg-white text-danger border border-red-100 hover:bg-red-50">
                            Hủy liên kết
                        </Button>
                    </div>

                    {/* Facebook - Not connected */}
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white">
                                <i className="fab fa-facebook-f text-lg font-bold">f</i>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Facebook Account</h4>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                    Chưa liên kết
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            Kết nối
                        </Button>
                    </div>

                    {/* Zalo - Not connected */}
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#0068FF] rounded-full flex items-center justify-center text-white font-bold text-xs">
                                Zalo
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Zalo Account</h4>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                    Chưa liên kết
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            Kết nối
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Việc liên kết giúp bạn đăng nhập nhanh hơn mà không cần nhớ mật khẩu.
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <div>
                    <h4 className="font-bold text-primary text-sm">Bảo mật tài khoản</h4>
                    <p className="text-xs text-blue-700 mt-1">
                        Chúng tôi không chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ ba nào khi thực hiện liên kết tài khoản.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SocialLinks;
