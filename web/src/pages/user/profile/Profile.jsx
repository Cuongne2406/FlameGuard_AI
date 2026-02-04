import { useState } from 'react';
import { Card, Button, Avatar, Badge, Tabs } from '../../../components/ui';

/**
 * Profile Page - Hồ sơ cá nhân người dùng
 */
const Profile = () => {
    // Mock user data
    const user = {
        name: 'NGUYỄN VĂN A',
        studentId: '21123456',
        chidoan: 'Công nghệ thông tin 01',
        avatar: null,
        joinedDate: '19/05/2019',
        status: 'active',
        role: 'Đoàn viên',

        info: {
            birthday: '15/01/2003',
            gender: 'Nam',
            email: 'an.nguyen.sv@university.edu.vn',
            phone: '0901234567',
            ethnicity: 'Kinh',
            address: '123 Đường 3/2, Quận 10, TP. Hồ Chí Minh'
        },

        unionInfo: {
            position: 'Đoàn viên',
            joinDate: '19/05/2019',
            place: 'Trường THPT Nguyễn Thượng Hiền'
        }
    };

    const tabs = [
        { id: 'general', label: 'Thông tin chung', icon: 'person' },
        { id: 'awards', label: 'Khen thưởng & Kỷ luật', icon: 'emoji_events' },
        { id: 'settings', label: 'Cài đặt tài khoản', icon: 'settings' },
    ];

    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="space-y-6">
            {/* Header Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Keep Avatar */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-3">
                        <Avatar
                            src={user.avatar}
                            name={user.name}
                            size="xl"
                            className="w-32 h-32 text-3xl"
                        />
                        <button className="p-2 bg-primary text-white rounded-full shadow-lg -mt-8 ml-20 hover:bg-primary-hover transition-colors">
                            <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-lg">school</span>
                                MSSV: {user.studentId}
                            </span>
                            <span className="hidden md:inline text-gray-300">|</span>
                            <span>Chi đoàn: {user.chidoan}</span>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="success" dot>Đã đóng Đoàn phí</Badge>
                            <Badge variant="primary" dot>Ngày vào Đoàn: {user.joinedDate}</Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            <Button variant="secondary" leftIcon={<span className="material-symbols-outlined">qr_code</span>}>
                                Thẻ đoàn viên
                            </Button>
                            <Button variant="primary" leftIcon={<span className="material-symbols-outlined">save</span>}>
                                Lưu thay đổi
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
                <Tabs
                    tabs={tabs}
                    defaultTab={activeTab}
                    onChange={setActiveTab}
                    variant="underline"
                />
            </div>

            {/* Content Section */}
            {activeTab === 'general' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Personal Info & Contact Info */}
                    <Card title="Thông tin cá nhân & Liên hệ" icon="person">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Họ và tên */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                                <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900">
                                    {user.name}
                                </div>
                            </div>

                            {/* Số điện thoại */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                                <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-400 text-lg">phone</span>
                                    {user.info.phone}
                                </div>
                            </div>

                            {/* Ngày sinh & Giới tính */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày sinh</label>
                                    <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
                                        {user.info.birthday}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Giới tính</label>
                                    <div className="relative">
                                        <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20">
                                            <option>Nam</option>
                                            <option>Nữ</option>
                                        </select>
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <span className="material-symbols-outlined">expand_more</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email liên hệ</label>
                                <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-400 text-lg">mail</span>
                                    {user.info.email}
                                </div>
                            </div>

                            {/* Dân tộc */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Dân tộc</label>
                                <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900">
                                    {user.info.ethnicity}
                                </div>
                            </div>

                            {/* Địa chỉ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ thường trú</label>
                                <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900">
                                    {user.info.address}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Union Info */}
                    <Card title="Thông tin sinh hoạt Đoàn" icon="groups">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">CHI ĐOÀN</p>
                                <p className="font-medium text-gray-900">{user.chidoan}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">CHỨC VỤ</p>
                                <p className="font-medium text-gray-900">{user.unionInfo.position}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">MÃ QR CÁ NHÂN</p>
                                    <a href="#" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                                        <span className="material-symbols-outlined text-base">visibility</span>
                                        Xem mã định danh
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'awards' && (
                <div className="text-center py-10 text-gray-500">
                    Nội dung Khen thưởng & Kỷ luật đang cập nhật...
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="text-center py-10 text-gray-500">
                    Vui lòng truy cập trang Cài đặt để chỉnh sửa thông tin tài khoản.
                </div>
            )}

            {/* Footer Copyright */}
            <div className="text-center mt-8 text-xs text-gray-400">
                © 2024 Đoàn TNCS Hồ Chí Minh - Văn phòng Đoàn Khoa
            </div>
        </div>
    );
};

export default Profile;
