import React, { useState, useEffect } from 'react';
import { Card, Button, Avatar, Badge, Tabs, Modal, Input } from '../../../components/ui';

/**
 * Profile Page - Thông tin cá nhân (Đã tích hợp API & Chỉnh sửa)
 */
const Profile = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // --- 1. STATE DỮ LIỆU NGƯỜI DÙNG ---
    const [user, setUser] = useState({
        name: "",
        studentId: "",
        email: "",
        chidoan: "",
        role: "",
        avatar: "",
        joinedDate: "",
        info: {
            phone: "",
            birthday: "",
            gender: "Nam",
            ethnicity: "Kinh",
            address: ""
        },
        awards: []
    });

    // --- 2. GỌI API LẤY THÔNG TIN ---
    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://127.0.0.1:8000/api/v1/users/me", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
        } catch (error) {
            console.error("Lỗi tải thông tin cá nhân:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // --- 3. LOGIC CẬP NHẬT THÔNG TIN ---
    const handleNestedInfoChange = (field, value) => {
        setUser(prev => ({
            ...prev,
            info: {
                ...prev.info,
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://127.0.0.1:8000/api/v1/users/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(user.info)
            });

            if (response.ok) {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="py-20 text-center text-gray-400">Đang tải hồ sơ Đoàn viên...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-left">
            {/* Header / Cover */}
            <div className="relative">
                <div className="h-48 md:h-64 bg-gradient-to-r from-primary/90 to-blue-700 rounded-3xl overflow-hidden shadow-lg">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,#fff_0%,transparent_50%)]"></div>
                    <div className="absolute top-6 right-8 flex gap-2">
                        <Button variant="white" size="sm" onClick={() => setIsCardOpen(true)} leftIcon={<span className="material-symbols-outlined">qr_code_2</span>}>
                            Thẻ ID
                        </Button>
                    </div>
                </div>

                <div className="px-8 -mt-20 md:-mt-24 flex flex-col md:flex-row items-end gap-6 relative z-10">
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                            <Avatar src={user.avatar} name={user.name} className="w-full h-full text-4xl" />
                        </div>
                        <button className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                        </button>
                    </div>

                    <div className="flex-1 pb-4 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                            <h1 className="text-3xl font-black text-white drop-shadow-md">{user.name}</h1>
                            <Badge variant="primary" className="bg-white/20 text-white border-white/30 backdrop-blur-md self-center md:self-auto">
                                MSSV: {user.studentId}
                            </Badge>
                        </div>
                        <p className="text-white/80 font-medium flex items-center justify-center md:justify-start gap-2">
                            <span className="material-symbols-outlined text-sm">school</span>
                            Sinh viên - {user.chidoan}
                        </p>
                    </div>

                    <div className="pb-4">
                        <Button
                            variant="primary"
                            className="shadow-xl shadow-primary/20 px-8"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
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
                                        value={user.email || ""}
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
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">CHI ĐOÀN</p>
                                <p className="font-medium text-gray-900">{user.chidoan}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">CHỨC VỤ</p>
                                <p className="font-medium text-gray-900 text-left">{user.role}</p>
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

                    <Card title="Kỷ luật" icon="gavel">
                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-green-900">Chúc mừng! Bạn không có hồ sơ kỷ luật.</p>
                                <p className="text-xs text-green-700/70">Hãy tiếp tục phát huy tinh thần đoàn viên gương mẫu.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Modal Thẻ đoàn viên */}
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
                                <p className="text-[10px] font-bold">{user.joinedDate || "---"}</p>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-2xl shadow-inner mb-2">
                            <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-200 relative">
                                <span className="material-symbols-outlined text-gray-200 text-6xl">qr_code_2</span>
                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                                    <p className="text-[10px] text-blue-900 font-black px-2 text-center">LHU-ID: {user.studentId}</p>
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