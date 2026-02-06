import { useState } from 'react';
import { Card, Input, Button, Avatar } from '../../../../components/ui';

/**
 * EditProfile - Trang chỉnh sửa thông tin cá nhân
 */
const EditProfile = () => {
    const [formData, setFormData] = useState({
        phone: '0901 234 567',
        email: 'nguyenvana@lhu.edu.vn',
        address: '123 Đường CMT8, Phường Quyết Thắng, TP. Biên Hòa, Đồng Nai'
    });

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h1 className="text-xl font-bold text-gray-900">Chỉnh Sửa Hồ Sơ</h1>
                <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin cá nhân và quản lý tài khoản của bạn</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                {/* Avatar Section */}
                <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 mb-6">
                    <div className="relative mb-4">
                        <Avatar
                            src="https://i.pravatar.cc/150?u=2"
                            size="xl"
                            className="w-24 h-24 ring-4 ring-blue-50"
                        />
                        <button className="absolute bottom-0 right-0 bg-white border border-gray-200 p-1.5 rounded-full shadow-sm hover:bg-gray-50">
                            <span className="material-symbols-outlined text-gray-600 text-sm">camera_alt</span>
                        </button>
                    </div>
                    <h3 className="font-bold text-gray-900">Ảnh đại diện</h3>
                    <p className="text-xs text-gray-500 mt-1 mb-3">Hỗ trợ JPG, PNG. Tối đa 2MB.</p>
                    <Button variant="secondary" size="sm">Tải lên ảnh mới</Button>
                </div>

                {/* Contact Info */}
                <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-l-4 border-primary pl-2">
                        Thông tin liên lạc
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input
                            label="Số Điện Thoại"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <Input
                            label="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <Input
                        label="Địa Chỉ Liên Lạc"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                </div>

                {/* Student Info (Read-only) */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-l-4 border-gray-400 pl-2">
                        Thông tin sinh viên
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200 font-normal">CHỈ ĐỌC</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Mã Số Sinh Viên"
                            value="2110456"
                            readOnly
                            leftIcon={<span className="material-symbols-outlined text-sm">lock</span>}
                        />
                        <Input
                            label="Lớp"
                            value="21CT111"
                            readOnly
                            leftIcon={<span className="material-symbols-outlined text-sm">lock</span>}
                        />
                        <Input
                            label="Khoa"
                            value="Công nghệ thông tin"
                            readOnly
                            leftIcon={<span className="material-symbols-outlined text-sm">lock</span>}
                        />
                    </div>
                </div>

                {/* Action */}
                <div className="mt-8 flex justify-end">
                    <Button variant="primary" size="lg" leftIcon={<span className="material-symbols-outlined">save</span>}>
                        LƯU THAY ĐỔI
                    </Button>
                </div>
            </div>

            {/* Hint */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">info</span>
                <div>
                    <h4 className="font-bold text-primary text-sm">Bạn gặp khó khăn trong việc thay đổi thông tin?</h4>
                    <p className="text-xs text-blue-700 mt-1">
                        Nếu các thông tin "Chỉ đọc" bị sai lệch, vui lòng liên hệ phòng Đào tạo để được hỗ trợ điều chỉnh chính xác nhất.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
