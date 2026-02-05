import React from 'react';
import { useState } from 'react';
import { Input, Button } from '../../../components/ui';

/**
 * Register - Trang Đăng ký Tài khoản Đoàn viên
 * Layout: Header Logo | Main Card | Sectioned Forms
 */
const Register = () => {
    const [step, setStep] = useState(1); // Để xử lý logic cho user (nếu cần chia bước)

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
            <main className="py-12 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                    {/* Title Area */}
                    <div className="p-8 border-b border-gray-50 flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-[#1e293b]">Đăng Ký Tài Khoản Đoàn Viên</h2>
                            <p className="text-sm text-gray-400 mt-1">Hệ sinh thái số quản lý hoạt động Đoàn Khoa - Truy cập hệ thống</p>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                            <span className="material-symbols-outlined text-sm">help</span>
                            <span className="text-xs font-bold">Trợ giúp</span>
                        </button>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Section 1: Thông tin cá nhân */}
                        <section className="space-y-6">
                            <h3 className="text-base font-bold text-[#1e293b] border-l-4 border-[#007bff] pl-3 flex items-center gap-2">
                                Thông tin cá nhân
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Họ và tên"
                                    placeholder="Nhập họ tên đầy đủ"
                                />
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
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                                    <option value="">Chọn chi đoàn của bạn</option>
                                    <option value="21CT111">21CT111</option>
                                    <option value="21CT112">21CT112</option>
                                </select>
                            </div>
                        </section>

                        {/* Section 2: Liên hệ & Bảo mật */}
                        <section className="space-y-6">
                            <h3 className="text-base font-bold text-[#1e293b] border-l-4 border-[#007bff] pl-3">
                                Liên hệ & Bảo mật
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Email sinh viên"
                                    placeholder="email@student.university.edu.vn"
                                />
                                <Input
                                    label="Số điện thoại"
                                    placeholder="09xx xxx xxx"
                                />
                            </div>
                            <div className="relative">
                                <Input
                                    label="Mật khẩu"
                                    type="password"
                                    placeholder="Tối thiểu 8 ký tự"
                                    leftIcon={<span className="material-symbols-outlined text-gray-400 text-sm">visibility</span>}
                                />
                            </div>
                        </section>

                        {/* Section 3: Ảnh thẻ */}
                        <section className="space-y-6 text-center">
                            <h3 className="text-base font-bold text-[#1e293b] border-l-4 border-[#007bff] pl-3 text-left">
                                Ảnh thẻ đoàn viên
                            </h3>
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 bg-gray-50/30 flex flex-col items-center justify-center gap-4 group hover:border-[#007bff] transition-colors cursor-pointer">
                                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                    <span className="material-symbols-outlined text-gray-400 text-3xl group-hover:text-[#007bff]">add_a_photo</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#1e293b]">Tải lên ảnh chân dung (3x4)</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Định dạng JPG, PNG. Tối đa 2MB. Ảnh sẽ được dùng làm thẻ điện tử.</p>
                                </div>
                                <Button variant="outline" size="sm" className="px-6 font-bold border-gray-200 text-gray-600">
                                    Chọn tệp tin
                                </Button>
                            </div>
                        </section>

                        {/* Action */}
                        <div className="pt-6 space-y-4 text-center">
                            <button className="w-full bg-[#007bff] hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98]">
                                Đăng ký tài khoản
                            </button>
                            <p className="text-sm text-gray-500 font-medium">
                                Đã có tài khoản? <button className="text-[#007bff] font-bold hover:underline">Đăng nhập ngay</button>
                            </p>
                        </div>
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

export default Register;
