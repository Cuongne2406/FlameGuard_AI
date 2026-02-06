import React, { useState, useRef } from 'react';
import { Input, Button } from '../ui';

/**
 * RegisterForm - Nội dung form đăng ký tài khoản
 */
const RegisterForm = ({ onSuccess, onToggleLogin }) => {
    const [avatarPreview, setAvatarPreview] = useState(null);
    const inputRef = useRef(null);

    const handleUploadClick = () => {
        inputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className="space-y-10">
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
                    />
                </div>
            </section>

            {/* Section 3: Ảnh thẻ */}
            <section className="space-y-6 text-center">
                <h3 className="text-base font-bold text-[#1e293b] border-l-4 border-[#007bff] pl-3 text-left">
                    Ảnh thẻ đoàn viên
                </h3>
                <div
                    onClick={handleUploadClick}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-10 bg-gray-50/30 flex flex-col items-center justify-center gap-4 group hover:border-[#007bff] transition-colors cursor-pointer overflow-hidden relative"
                >
                    {avatarPreview ? (
                        <div className="w-40 h-52 relative group/preview">
                            <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-md" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-lg">
                                <span className="text-white text-xs font-bold">Thay đổi ảnh</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <span className="material-symbols-outlined text-gray-400 text-3xl group-hover:text-[#007bff]">add_a_photo</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#1e293b]">Tải lên ảnh chân dung (3x4)</p>
                                <p className="text-[10px] text-gray-400 mt-1">Định dạng JPG, PNG. Tối đa 2MB. Ảnh sẽ được dùng làm thẻ điện tử.</p>
                            </div>
                        </>
                    )}

                    <Button variant="outline" size="sm" className="px-6 font-bold border-gray-200 text-gray-600 font-display">
                        {avatarPreview ? 'Chọn lại tệp tin' : 'Chọn tệp tin'}
                    </Button>

                    <input
                        type="file"
                        ref={inputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            </section>

            {/* Action */}
            <div className="pt-6 space-y-4 text-center">
                <button
                    onClick={onSuccess}
                    className="w-full bg-[#007bff] hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] font-display uppercase tracking-wider"
                >
                    Đăng ký tài khoản
                </button>
                {onToggleLogin && (
                    <p className="text-sm text-gray-500 font-medium font-display">
                        Đã có tài khoản? <button onClick={onToggleLogin} className="text-[#007bff] font-bold hover:underline">Đăng nhập ngay</button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default RegisterForm;
