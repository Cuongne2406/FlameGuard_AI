import React from 'react';
import { useState } from 'react';
import { Input, Button } from '../../../components/ui';

/**
 * ForgotPassword - Trang Quên mật khẩu
 * Quản lý 2 bước: 
 * - Bước 1: Nhập thông tin & Xác thực OTP (Ảnh 3)
 * - Bước 2: Tạo mật khẩu mới (Ảnh 2)
 */
const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: OTP, 2: New Password

    return (
        <div className="min-h-screen bg-[#f8faff] font-display">
            {/* Header */}
            <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-12 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#007bff] rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">school</span>
                    </div>
                    <span className="font-bold text-[#1e293b] text-lg">Đoàn Khoa Digital</span>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Trang chủ</button>
                    <button className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Liên hệ</button>
                    <button className="bg-[#007bff] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                        Đăng nhập
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-20 px-4">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                    {/* Title Area */}
                    <div className="p-8 border-b border-gray-50 flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-[#1e293b]">Quên mật khẩu</h2>
                            <p className="text-sm text-gray-400 mt-1">Hệ sinh thái số quản lý hoạt động Đoàn Khoa - Truy cập hệ thống</p>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                            <span className="material-symbols-outlined text-sm">help</span>
                            <span className="text-xs font-bold">Trợ giúp</span>
                        </button>
                    </div>

                    <div className="p-8">
                        {step === 1 ? (
                            /* GIAI ĐOẠN 1: NHẬP THÔNG TIN & OTP (Ảnh 3) */
                            <div className="space-y-8">
                                <section className="space-y-6">
                                    <h3 className="text-base font-bold text-[#1e293b] border-l-4 border-[#007bff] pl-3">
                                        Thông tin cá nhân
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input label="Họ và tên" placeholder="Nhập họ tên đầy đủ" />
                                        <div className="space-y-1">
                                            <Input
                                                label="Mã số sinh viên (MSSV)"
                                                placeholder="Ví dụ: 2112345"
                                                leftIcon={<span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>}
                                            />
                                            <p className="text-[10px] text-gray-400">Định dạng 7 chữ số</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#1e293b]">Chi đoàn</label>
                                        <select className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                                            <option value="">Chọn chi đoàn của bạn</option>
                                        </select>
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="text-base font-bold text-[#1e293b] border-l-4 border-[#007bff] pl-3">
                                        Vui lòng nhập email của bạn
                                    </h3>
                                    <Input label="Email sinh viên" placeholder="email@student.university.edu.vn" />

                                    <div className="space-y-4">
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Vui lòng nhập mã OTP chúng tôi đã gửi cho bạn qua email <span className="font-bold text-[#1e293b]">*****email@student.university.edu.vn</span>. Mã xác thực có giá trị trong vòng 120s
                                        </p>
                                        {/* OTP Input Boxes */}
                                        <div className="flex justify-between gap-2 max-w-sm mx-auto">
                                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                                <input
                                                    key={i}
                                                    type="text"
                                                    maxLength="1"
                                                    className="w-12 h-12 border-2 border-gray-100 rounded-lg text-center font-bold text-lg focus:border-[#007bff] focus:outline-none transition-all"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                <div className="space-y-4 text-center">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full bg-[#007bff] hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-100 transition-all"
                                    >
                                        Xác nhận
                                    </button>
                                    <p className="text-sm text-gray-500 font-medium">
                                        Đã có tài khoản? <button className="text-[#007bff] font-bold hover:underline">Đăng nhập ngay</button>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* GIAI ĐOẠN 2: TẠO MẬT KHẨU MỚI (Ảnh 2) */
                            <div className="space-y-8">
                                <section className="space-y-6">
                                    <h3 className="text-base font-bold text-[#1e293b] border-l-4 border-[#007bff] pl-3">
                                        Tạo mật khẩu mới
                                    </h3>
                                    <div className="space-y-4">
                                        <Input label="Mật khẩu mới" type="password" placeholder="Mật khẩu mới" />
                                        <Input label="Xác nhận mật khẩu mới" type="password" placeholder="Xác nhận mật khẩu mới" />
                                    </div>
                                </section>

                                <div className="space-y-4 text-center">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="w-full bg-[#007bff] hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-100 transition-all"
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Copy */}
                <footer className="mt-12 text-center space-y-2">
                    <p className="text-[10px] text-gray-400 font-medium">© 2024 Đoàn Thanh Niên Cộng Sản Hồ Chí Minh - Hệ Thống Quản Lý Đoàn Viên Số</p>
                    <p className="text-[10px] text-gray-400">Mọi thắc mắc vui lòng liên hệ Văn phòng Đoàn khoa qua Hotline: 1900 xxxx</p>
                </footer>
            </main>
        </div>
    );
};

export default ForgotPassword;
