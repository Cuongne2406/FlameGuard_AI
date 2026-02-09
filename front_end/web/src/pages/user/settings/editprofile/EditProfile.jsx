import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Avatar, Toast } from '../../../../components/ui';

const EditProfile = () => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        address: '',
        avatar_url: '',
        mssv: '',
        class_name: '',
        full_name: '',
        role: '' 
    });

    // 1. LẤY DỮ LIỆU USER (GET)
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("access_token");
                // Dùng API chi tiết profile để lấy đủ thông tin
                const response = await fetch('http://127.0.0.1:8000/api/v1/users/me/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // --- LOGIC MAPPING DỮ LIỆU QUAN TRỌNG ---
                    // Ưu tiên lấy từ data.info nếu có, ngược lại lấy từ data cấp ngoài (fallback)
                    setFormData({
                        phone: data.info?.phone || data.phone || '',
                        email: data.email || '',
                        address: data.info?.address || data.address || '', // Lấy từ info.address
                        avatar_url: data.avatar || '',
                        mssv: data.studentId || '',
                        class_name: data.chidoan || '',
                        full_name: data.name || '',
                        role: data.role || ''
                    });

                    if (data.avatar) {
                        setAvatarPreview(data.avatar);
                    }
                }
            } catch (error) {
                console.error("Lỗi tải profile:", error);
            }
        };
        fetchUserProfile();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    // 2. CẬP NHẬT THÔNG TIN (PUT)
    const handleSave = async () => {
        setIsLoading(true);
        try {
            let finalAvatarUrl = formData.avatar_url;
            const token = localStorage.getItem("access_token");

            // Bước A: Upload ảnh (nếu có chọn file mới)
            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);

                const uploadRes = await fetch('http://127.0.0.1:8000/api/v1/upload/upload-image', {
                    method: 'POST',
                    body: uploadData
                });

                if (uploadRes.ok) {
                    const uploadResult = await uploadRes.json();
                    finalAvatarUrl = uploadResult.direct_link;
                } else {
                    throw new Error("Không thể upload ảnh đại diện.");
                }
            }

            // Bước B: Gửi dữ liệu cập nhật
            const updateRes = await fetch('http://127.0.0.1:8000/api/v1/users/me/profile', {
                method: 'PUT', // Dùng PUT theo đúng API Backend
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address,
                    avatar_url: finalAvatarUrl
                })
            });

            if (updateRes.ok) {
                setToastMessage("Cập nhật hồ sơ thành công!");
                setToastType("success");
                setShowToast(true);
                // Cập nhật lại state để UI đồng bộ ngay lập tức
                setFormData(prev => ({ ...prev, avatar_url: finalAvatarUrl }));
            } else {
                throw new Error("Lỗi khi cập nhật thông tin.");
            }

        } catch (error) {
            setToastMessage(`Lỗi: ${error.message}`);
            setToastType("error");
            setShowToast(true);
        } finally {
            setIsLoading(false);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    return (
        <div className="space-y-6 relative">
            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h1 className="text-xl font-bold text-gray-900">Chỉnh Sửa Hồ Sơ</h1>
                <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin cá nhân và quản lý tài khoản của bạn</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                {/* Avatar Section */}
                <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 mb-6">
                    <div className="relative mb-4">
                        <Avatar
                            src={avatarPreview || "https://i.pravatar.cc/150?u=default"}
                            size="xl"
                            className="w-24 h-24 ring-4 ring-blue-50 object-cover"
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    <h3 className="font-bold text-gray-900">Ảnh đại diện</h3>
                    <p className="text-xs text-gray-500 mt-1 mb-3">Hỗ trợ JPG, PNG. Tối đa 2MB.</p>
                    <Button variant="secondary" size="sm" onClick={handleUploadClick}>
                        {selectedFile ? "Đã chọn ảnh mới" : "Tải lên ảnh mới"}
                    </Button>
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
                            placeholder="Nhập số điện thoại..."
                        />
                        <Input
                            label="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Nhập email liên hệ..."
                        />
                    </div>
                    <Input
                        label="Địa Chỉ Liên Lạc"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Nhập địa chỉ hiện tại..."
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
                            value={formData.mssv}
                            readOnly
                            className="bg-gray-50 text-gray-500 cursor-not-allowed"
                            leftIcon={<span className="material-symbols-outlined text-sm">lock</span>}
                        />
                        <Input
                            label="Họ và Tên"
                            value={formData.full_name}
                            readOnly
                            className="bg-gray-50 text-gray-500 cursor-not-allowed"
                            leftIcon={<span className="material-symbols-outlined text-sm">badge</span>}
                        />
                         <Input
                            label="Chi Đoàn (Lớp)"
                            value={formData.class_name}
                            readOnly
                            className="bg-gray-50 text-gray-500 cursor-not-allowed"
                            leftIcon={<span className="material-symbols-outlined text-sm">group</span>}
                        />
                    </div>
                </div>

                {/* Action */}
                <div className="mt-8 flex justify-end">
                    <Button
                        variant="primary"
                        size="lg"
                        leftIcon={isLoading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined">save</span>}
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
                    </Button>
                </div>
            </div>

            {/* Hint */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">info</span>
                <div>
                    <h4 className="font-bold text-primary text-sm">Bạn gặp khó khăn trong việc thay đổi thông tin?</h4>
                    <p className="text-xs text-blue-700 mt-1">
                        Nếu các thông tin "Chỉ đọc" (MSSV, Lớp) bị sai lệch, vui lòng liên hệ Ban Chấp hành Đoàn Khoa hoặc phòng Đào tạo để được hỗ trợ điều chỉnh.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;