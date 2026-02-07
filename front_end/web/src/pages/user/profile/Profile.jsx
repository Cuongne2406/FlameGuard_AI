import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Avatar, Badge, Tabs, Modal, Toast } from '../../../components/ui';
// import api from '../../../services/api';

/**
 * Profile Page - Hồ sơ cá nhân người dùng (Đã kết nối API)
 */
const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); // State lưu dữ liệu user thật
    const inputRef = useRef(null);

    // Hàm gọi API lấy thông tin user
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Giả sử API endpoint là /users/me hoặc /auth/me
                // Bạn cần thay đổi đường dẫn này cho khớp với Backend của bạn
                const response = await api.get('/users/me'); 
                
                // Format dữ liệu từ API về dạng frontend cần
                const userData = response.data;
                setUser({
                    ...userData,
                    // Map các trường từ DB sang frontend nếu tên khác nhau
                    name: userData.full_name,
                    studentId: userData.mssv,
                    chidoan: userData.class_name,
                    joinedDate: userData.join_date ? new Date(userData.join_date).toLocaleDateString('vi-VN') : 'N/A',
                    info: {
                        phone: userData.phone || 'Chưa cập nhật',
                        birthday: userData.birthday ? new Date(userData.birthday).toLocaleDateString('vi-VN') : 'Chưa cập nhật',
                        gender: userData.gender || 'Chưa cập nhật',
                        email: userData.email,
                        ethnicity: userData.ethnicity || 'Kinh',
                        address: userData.address || 'Chưa cập nhật'
                    },
                    unionInfo: {
                        position: userData.union_position || 'Đoàn viên',
                    },
                    // Nếu API trả về achievements
                    awards: userData.achievements ? userData.achievements.map(a => ({
                        id: a.id,
                        title: a.title,
                        year: a.year,
                        type: a.type,
                        date: new Date(a.date_received).toLocaleDateString('vi-VN')
                    })) : []
                });
            } catch (error) {
                console.error("Lỗi tải thông tin:", error);
                // Có thể show toast lỗi ở đây
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const tabs = [
        { id: 'general', label: 'Thông tin chung', icon: 'person' },
        { id: 'awards', label: 'Khen thưởng & Kỷ luật', icon: 'emoji_events' },
    ];

    // Xử lý upload avatar (Demo frontend)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
            // TODO: Gọi API upload ảnh lên server tại đây
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Đang tải hồ sơ...</div>;
    }

    if (!user) {
        return <div className="p-8 text-center text-red-500">Không tìm thấy thông tin người dùng.</div>;
    }

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
                    {/* Avatar */}
                    <div className="flex-shrink-0 relative group">
                        <Avatar
                            src={user.avatar}
                            name={user.name}
                            size="xl"
                            className="w-32 h-32 text-3xl ring-4 ring-gray-50 bg-white"
                        />
                        <button
                            onClick={() => inputRef.current.click()}
                            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-all scale-90 hover:scale-100 z-10 border-2 border-white"
                        >
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                        </button>
                        <input type="file" ref={inputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>

                    {/* Info Text */}
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
                            <Badge variant="primary" dot>Ngày vào Đoàn: {user.joinedDate}</Badge>
                            <Badge variant="warning">{user.unionInfo.position}</Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            <Button variant="secondary" onClick={() => setIsCardOpen(true)} leftIcon={<span className="material-symbols-outlined">qr_code</span>}>
                                Thẻ đoàn viên
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/settings/profile')} leftIcon={<span className="material-symbols-outlined">edit</span>}>
                                Chỉnh sửa
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <Tabs tabs={tabs} defaultTab={activeTab} onChange={setActiveTab} variant="underline" />
            </div>

            {/* Tab Content: Thông tin chung */}
            {activeTab === 'general' && (
                <div className="space-y-6 animate-fade-in">
                    <Card title="Thông tin cá nhân" icon="person">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoItem label="Họ và tên" value={user.name} />
                            <InfoItem label="Số điện thoại" value={user.info.phone} icon="phone" />
                            <InfoItem label="Ngày sinh" value={user.info.birthday} icon="calendar_today" />
                            <InfoItem label="Giới tính" value={user.info.gender} />
                            <InfoItem label="Email" value={user.info.email} icon="mail" />
                            <InfoItem label="Dân tộc" value={user.info.ethnicity} />
                            <InfoItem label="Địa chỉ" value={user.info.address} className="md:col-span-2" />
                        </div>
                    </Card>
                </div>
            )}

            {/* Tab Content: Khen thưởng */}
            {activeTab === 'awards' && (
                <div className="space-y-4 animate-fade-in">
                    <Card title="Danh sách Khen thưởng" icon="emoji_events">
                        {user.awards && user.awards.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-100">
                                    <tr>
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Danh hiệu</th>
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Năm học</th>
                                        <th className="pb-3 text-xs font-bold text-gray-400 uppercase text-right">Ngày nhận</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {user.awards.map((award) => (
                                        <tr key={award.id}>
                                            <td className="py-4 font-semibold text-gray-900">{award.title}</td>
                                            <td className="py-4"><Badge variant="outline">{award.year}</Badge></td>
                                            <td className="py-4 text-right text-sm text-gray-500">{award.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500 py-4 text-center">Chưa có dữ liệu khen thưởng.</p>
                        )}
                    </Card>
                </div>
            )}
            
            {/* Modal Thẻ Đoàn (Giữ nguyên code cũ của bạn cho phần này) */}
            <Modal isOpen={isCardOpen} onClose={() => setIsCardOpen(false)} title="Thẻ Đoàn viên Điện tử">
                 {/* ... (Copy lại phần hiển thị thẻ từ code cũ) ... */}
                 <div className="text-center p-4">Code hiển thị thẻ ở đây...</div>
            </Modal>
        </div>
    );
};

// Component con để hiển thị từng dòng thông tin cho gọn
const InfoItem = ({ label, value, icon, className = "" }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2 font-medium">
            {icon && <span className="material-symbols-outlined text-gray-400 text-lg">{icon}</span>}
            {value}
        </div>
    </div>
);

export default Profile;