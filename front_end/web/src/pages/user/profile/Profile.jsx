import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Avatar, Badge, Tabs, Modal, Toast } from '../../../components/ui';

/**
 * Profile Page - Hồ sơ cá nhân người dùng
 */
const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const inputRef = useRef(null);

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
        },

        awards: [
            { id: 1, title: 'Đoàn viên Xuất sắc học kỳ I', year: '2023-2024', type: 'award', date: '20/02/2024' },
            { id: 2, title: 'Giải Ba Olympic Tin học', year: '2022-2023', type: 'award', date: '15/05/2023' },
            { id: 3, title: 'Không có kỷ luật', year: 'Tất cả', type: 'info', date: '-' }
        ]
    };

    const tabs = [
        { id: 'general', label: 'Thông tin chung', icon: 'person' },
        { id: 'awards', label: 'Khen thưởng & Kỷ luật', icon: 'emoji_events' },
    ];

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleAvatarEdit = () => {
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
        <div className="space-y-6 relative">
            {showToast && (
                <Toast
                    message="Đã lưu thông tin hồ sơ thành công!"
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}

            {/* Header Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar with Edit Icon */}
                    <div className="flex-shrink-0 relative group">
                        <Avatar
                            src={avatarPreview || user.avatar}
                            name={user.name}
                            size="xl"
                            className="w-32 h-32 text-3xl ring-4 ring-gray-50 bg-white"
                        />
                        {/* Nút Camera tải ảnh - Bên phải dưới */}
                        <button
                            onClick={handleAvatarEdit}
                            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-all scale-90 hover:scale-100 z-10 border-2 border-white"
                            title="Tải lên ảnh mới"
                        >
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                        </button>

                        {/* Icon bút sửa hồ sơ - Bên trái dưới */}
                        <button
                            onClick={() => navigate('/setting/profile')}
                            className="absolute bottom-0 left-0 p-2 bg-white text-gray-500 rounded-full shadow-md border border-gray-200 hover:text-primary transition-colors z-10 scale-90 hover:scale-100"
                            title="Chỉnh sửa hồ sơ"
                        >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>

                        <input
                            type="file"
                            ref={inputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
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
                            <Button
                                variant="secondary"
                                leftIcon={<span className="material-symbols-outlined">qr_code</span>}
                                onClick={() => setIsCardOpen(true)}
                            >
                                Thẻ đoàn viên
                            </Button>
                            <Button
                                variant="primary"
                                leftIcon={<span className="material-symbols-outlined">save</span>}
                                onClick={handleSave}
                            >
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
                                <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium">
                                    {user.name}
                                </div>
                            </div>

                            {/* Số điện thoại */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                                <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2 font-medium">
                                    <span className="material-symbols-outlined text-gray-400 text-lg">phone</span>
                                    {user.info.phone}
                                </div>
                            </div>

                            {/* Ngày sinh & Giới tính */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày sinh</label>
                                    <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2 font-medium">
                                        <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
                                        {user.info.birthday}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Giới tính</label>
                                    <div className="relative">
                                        <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium">
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
                                <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2 font-medium">
                                    <span className="material-symbols-outlined text-gray-400 text-lg">mail</span>
                                    {user.info.email}
                                </div>
                            </div>

                            {/* Dân tộc */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Dân tộc</label>
                                <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium">
                                    {user.info.ethnicity}
                                </div>
                            </div>

                            {/* Địa chỉ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ thường trú</label>
                                <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium">
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
                                    <button
                                        onClick={() => setIsCardOpen(true)}
                                        className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
                                    >
                                        <span className="material-symbols-outlined text-base">visibility</span>
                                        Xem mã định danh
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'awards' && (
                <div className="space-y-4 animate-fade-in">
                    <Card title="Danh sách Khen thưởng" icon="emoji_events">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Danh hiệu / Giải thưởng</th>
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider px-4">Năm học</th>
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ngày cấp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {user.awards.map((award) => (
                                        <tr key={award.id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${award.type === 'award' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        <span className="material-symbols-outlined text-lg">
                                                            {award.type === 'award' ? 'workspace_premium' : 'info'}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{award.title}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge variant="outline">{award.year}</Badge>
                                            </td>
                                            <td className="py-4 text-right text-gray-500 text-sm font-medium">
                                                {award.date}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Card title="Kỷ luật" icon="gavel" variant="danger">
                        <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-red-900">Chúc mừng! Bạn không có hồ sơ kỷ luật.</p>
                                <p className="text-xs text-red-700/70">Hãy tiếp tục phát huy tinh thần đoàn viên gương mẫu.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Modal Thẻ đoàn viên */}
            <Modal
                isOpen={isCardOpen}
                onClose={() => setIsCardOpen(false)}
                title="Thẻ Đoàn viên Điện tử"
            >
                <div className="flex flex-col items-center">
                    {/* Card Preview */}
                    <div className="w-full max-w-[320px] bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl overflow-hidden shadow-2xl relative border border-white/10">
                        {/* Header của thẻ */}
                        <div className="h-14 bg-white/10 backdrop-blur-md flex items-center justify-center gap-2 border-b border-white/5">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/vi/1/1a/Logo_Doan_TNCS_Ho_Chi_Minh.svg"
                                alt="Logo Đoàn"
                                className="w-8 h-8"
                            />
                            <div className="text-center uppercase leading-none">
                                <p className="text-[8px] font-bold text-white/70">ĐOÀN TNCS HỒ CHÍ MINH</p>
                                <p className="text-[10px] font-black text-white">TRƯỜNG ĐẠI HỌC LẠC HỒNG</p>
                            </div>
                        </div>

                        {/* Nội dung thẻ */}
                        <div className="p-6 flex flex-col items-center text-white">
                            <div className="w-24 h-24 rounded-full border-4 border-white/20 mb-4 overflow-hidden bg-white/10 flex items-center justify-center">
                                <Avatar src={user.avatar} name={user.name} size="xl" className="w-full h-full" />
                            </div>
                            <h3 className="text-lg font-black tracking-wide mb-1 uppercase">{user.name}</h3>
                            <p className="text-xs text-white/60 mb-4 font-medium">MSSV: {user.studentId}</p>

                            <div className="grid grid-cols-2 gap-4 w-full mb-6">
                                <div className="text-center p-2 bg-white/5 rounded-xl">
                                    <p className="text-[8px] text-white/50 uppercase">Chi đoàn</p>
                                    <p className="text-[10px] font-bold">{user.chidoan}</p>
                                </div>
                                <div className="text-center p-2 bg-white/5 rounded-xl">
                                    <p className="text-[8px] text-white/50 uppercase">Ngày vào Đoàn</p>
                                    <p className="text-[10px] font-bold">{user.joinedDate}</p>
                                </div>
                            </div>

                            {/* QR Code Placeholder */}
                            <div className="bg-white p-3 rounded-2xl shadow-inner mb-2">
                                <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-200 relative overflow-hidden">
                                    <span className="material-symbols-outlined text-gray-200 text-6xl">qr_code_2</span>
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                                        <p className="text-[10px] text-blue-900 font-black text-center px-2">LHU-ID: {user.studentId}</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] italic text-white/40 mb-2">Thẻ có giá trị xác thực sinh hoạt Đoàn</p>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                        <div className="absolute top-1/2 -right-12 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="mt-8 flex gap-3 w-full">
                        <Button variant="outline" className="flex-1" leftIcon={<span className="material-symbols-outlined">download</span>}>Tải về máy</Button>
                        <Button variant="primary" className="flex-1" leftIcon={<span className="material-symbols-outlined">print</span>}>In thẻ</Button>
                    </div>
                </div>
            </Modal>

            {/* Footer Copyright */}
            <div className="text-center mt-8 text-xs text-gray-400">
                © 2024 Đoàn TNCS Hồ Chí Minh - Văn phòng Đoàn Khoa
            </div>
        </div>
    );
};

export default Profile;
