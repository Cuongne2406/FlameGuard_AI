import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Avatar, Badge, Tabs, Modal, Toast } from '../../../components/ui';

/**
 * Profile Page - Hồ sơ cá nhân người dùng (Đã kết nối API & Cho phép cập nhật)
 */
const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const inputRef = useRef(null);

    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // --- 1. HÀM LẤY DỮ LIỆU TỪ API ---
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch('http://127.0.0.1:8000/api/v1/users/me/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // --- 2. HÀM XỬ LÝ THAY ĐỔI INPUT ---
    // Cập nhật các trường ở cấp 1 (name)
    const handleMainInfoChange = (field, value) => {
        setUser(prev => ({ ...prev, [field]: value }));
    };

    // Cập nhật các trường lồng trong info (phone, birthday, gender...)
    const handleNestedInfoChange = (field, value) => {
        setUser(prev => ({
            ...prev,
            info: { ...prev.info, [field]: value }
        }));
    };

    // --- 3. HÀM LƯU THAY ĐỔI (PUT API) ---
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("access_token");
            
            // Format lại ngày sinh: dd/mm/yyyy -> yyyy-mm-dd để Backend đọc được
            let formattedBirthday = null;
            if (user.info?.birthday && user.info.birthday.includes('/')) {
                const parts = user.info.birthday.split('/');
                if (parts.length === 3) {
                    formattedBirthday = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            }

            // Chuẩn bị dữ liệu theo Schema UserUpdate của Backend
            const updateData = {
                full_name: user.name,
                phone: user.info?.phone,
                gender: user.info?.gender,
                birthday: formattedBirthday || user.info?.birthday,
                ethnicity: user.info?.ethnicity,
                address: user.info?.address
            };

            const response = await fetch('http://127.0.0.1:8000/api/v1/users/me/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                // Refresh lại dữ liệu để đảm bảo đồng bộ
                fetchProfile();
            } else {
                const errData = await response.json();
                alert("Lỗi cập nhật: " + (errData.detail || "Không rõ nguyên nhân"));
            }
        } catch (error) {
            console.error("Lỗi khi lưu:", error);
            alert("Lỗi kết nối máy chủ");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarEdit = () => inputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-500">Đang tải hồ sơ cá nhân...</div>;
    if (!user) return <div className="p-20 text-center text-red-500">Không thể tải thông tin.</div>;

    return (
        <div className="space-y-6 relative animate-fade-in">
            {showToast && (
                <Toast
                    message="Cập nhật thông tin hồ sơ thành công!"
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}

            {/* Header Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 relative group">
                        <Avatar
                            src={avatarPreview || user.avatar}
                            name={user.name}
                            size="xl"
                            className="w-32 h-32 text-3xl ring-4 ring-gray-50 bg-white"
                        />
                        <button
                            onClick={handleAvatarEdit}
                            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-all z-10 border-2 border-white"
                        >
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                        </button>
                        <input type="file" ref={inputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>

                    <div className="flex-1">
                        {/* Họ tên cho phép sửa ngay tại đây */}
                        <input
                            type="text"
                            value={user.name}
                            onChange={(e) => handleMainInfoChange('name', e.target.value)}
                            className="text-2xl font-bold text-gray-900 mb-1 bg-transparent border-b border-dashed border-gray-200 focus:border-primary focus:outline-none w-full md:w-auto px-1"
                        />
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4 mt-1">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-lg">school</span>
                                MSSV: {user.studentId}
                            </span>
                            <span className="hidden md:inline text-gray-300">|</span>
                            <span>Chi đoàn: {user.chidoan || "Chưa cập nhật"}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="success" dot>Đang hoạt động</Badge>
                            <Badge variant="primary" dot>Ngày vào Đoàn: {user.joinedDate}</Badge>
                            <Badge variant="warning">{user.role || "Đoàn viên"}</Badge>
                        </div>

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
                                leftIcon={<span className="material-symbols-outlined">{isSaving ? 'sync' : 'save'}</span>}
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-200">
                <Tabs
                    tabs={[
                        { id: 'general', label: 'Thông tin chung', icon: 'person' },
                        { id: 'awards', label: 'Khen thưởng & Kỷ luật', icon: 'emoji_events' }
                    ]}
                    defaultTab={activeTab}
                    onChange={setActiveTab}
                    variant="underline"
                />
            </div>

            {/* Content Section */}
            {activeTab === 'general' && (
                <div className="space-y-6 animate-fade-in">
                    <Card title="Chỉnh sửa thông tin cá nhân & Liên hệ" icon="edit_note">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Số điện thoại */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">phone</span>
                                    <input
                                        type="text"
                                        value={user.info?.phone || ""}
                                        onChange={(e) => handleNestedInfoChange('phone', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>
                            </div>

                            {/* Email (Read Only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email liên hệ</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">mail</span>
                                    <input
                                        type="email"
                                        value={user.info?.email || user.email || ""}
                                        readOnly
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed outline-none"
                                    />
                                </div>
                            </div>

                            {/* Ngày sinh */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày sinh</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
                                    <input
                                        type="text"
                                        value={user.info?.birthday || ""}
                                        onChange={(e) => handleNestedInfoChange('birthday', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="dd/mm/yyyy"
                                    />
                                </div>
                            </div>

                            {/* Giới tính */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Giới tính</label>
                                <select
                                    value={user.info?.gender || "Nam"}
                                    onChange={(e) => handleNestedInfoChange('gender', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            {/* Dân tộc */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Dân tộc</label>
                                <input
                                    type="text"
                                    value={user.info?.ethnicity || ""}
                                    onChange={(e) => handleNestedInfoChange('ethnicity', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="Ví dụ: Kinh"
                                />
                            </div>

                            {/* Địa chỉ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ thường trú</label>
                                <input
                                    type="text"
                                    value={user.info?.address || ""}
                                    onChange={(e) => handleNestedInfoChange('address', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="Số nhà, tên đường, phường/xã..."
                                />
                            </div>
                        </div>
                    </Card>

                    <Card title="Thông tin sinh hoạt Đoàn" icon="groups">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">CHI ĐOÀN</p>
                                <p className="font-medium text-gray-900">{user.chidoan}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">CHỨC VỤ</p>
                                <p className="font-medium text-gray-900">{user.unionInfo?.position || user.role}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">MÃ QR CÁ NHÂN</p>
                                    <button onClick={() => setIsCardOpen(true)} className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                                        <span className="material-symbols-outlined text-base">visibility</span> Xem mã định danh
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Awards section (Keep as read-only as awards are usually given by admin) */}
            {activeTab === 'awards' && (
                <div className="space-y-4 animate-fade-in">
                    <Card title="Danh sách Khen thưởng" icon="emoji_events">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase px-2">Danh hiệu</th>
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase px-4">Năm học</th>
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase text-right">Ngày cấp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {user.awards?.length > 0 ? user.awards.map((award) => (
                                        <tr key={award.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${award.type === 'award' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        <span className="material-symbols-outlined text-lg">{award.type === 'award' ? 'workspace_premium' : 'info'}</span>
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{award.title}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4"><Badge variant="outline">{award.year}</Badge></td>
                                            <td className="py-4 text-right text-gray-500 text-sm">{award.date}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" className="py-8 text-center text-gray-400 italic">Chưa có dữ liệu khen thưởng</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* Modal Thẻ đoàn viên (Keep as dynamic display) */}
            <Modal isOpen={isCardOpen} onClose={() => setIsCardOpen(false)} title="Thẻ Đoàn viên Điện tử">
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-[320px] bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 p-6 text-white flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full border-4 border-white/20 mb-4 overflow-hidden bg-white/10">
                            <Avatar src={user.avatar} name={user.name} size="xl" className="w-full h-full" />
                        </div>
                        <h3 className="text-lg font-black tracking-wide mb-1 uppercase text-center">{user.name}</h3>
                        <p className="text-xs text-white/60 mb-4">MSSV: {user.studentId}</p>
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
                        <div className="bg-white p-3 rounded-2xl shadow-inner mb-2">
                             <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-200 relative">
                                <span className="material-symbols-outlined text-gray-200 text-6xl">qr_code_2</span>
                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                                    <p className="text-[10px] text-blue-900 font-black px-2">LHU-ID: {user.studentId}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex gap-3 w-full">
                        <Button variant="outline" className="flex-1" leftIcon={<span className="material-symbols-outlined">download</span>}>Tải về</Button>
                        <Button variant="primary" className="flex-1" leftIcon={<span className="material-symbols-outlined">print</span>}>In thẻ</Button>
                    </div>
                </div>
            </Modal>

            <div className="text-center mt-8 text-xs text-gray-400">© 2024 Đoàn TNCS Hồ Chí Minh - Văn phòng Đoàn Khoa</div>
        </div>
    );
};

export default Profile;