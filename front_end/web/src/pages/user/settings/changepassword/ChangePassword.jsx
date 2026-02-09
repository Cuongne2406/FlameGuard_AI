import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Toast } from '../../../../components/ui';

/**
 * ChangePassword - Trang đổi mật khẩu
 */
const ChangePassword = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [isLoading, setIsLoading] = useState(false);

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const getStrength = (pass) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    const handleUpdate = async () => {
        // 1. KIỂM TRA LOGIC CƠ BẢN TẠI FRONTEND
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            setToastMessage("Vui lòng nhập đầy đủ thông tin.");
            setToastType("error");
            setShowToast(true);
            return;
        }

        if (passwords.new !== passwords.confirm) {
            setToastMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            setToastType("error");
            setShowToast(true);
            return;
        }

        const strength = getStrength(passwords.new);
        if (strength < 3) {
             setToastMessage("Mật khẩu mới quá yếu. Vui lòng chọn mật khẩu mạnh hơn.");
             setToastType("warning");
             setShowToast(true);
             return;
        }

        if (passwords.current === passwords.new) {
             setToastMessage("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
             setToastType("warning");
             setShowToast(true);
             return;
        }

        // 2. GỌI API CẬP NHẬT MẬT KHẨU
        setIsLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            // Giả sử API đổi mật khẩu là POST /api/v1/auth/change-password
            // Hoặc PUT /api/v1/users/me/password tùy backend của bạn
            const response = await fetch('http://127.0.0.1:8000/api/v1/auth/change-password', { // Hãy thay đổi URL API cho đúng với backend của bạn
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_password: passwords.current,
                    new_password: passwords.new
                })
            });

            if (response.ok) {
                setToastMessage("Cập nhật mật khẩu mới thành công! Vui lòng đăng nhập lại.");
                setToastType("success");
                setShowToast(true);
                setPasswords({ current: '', new: '', confirm: '' });
                
                // Tùy chọn: Đăng xuất người dùng sau khi đổi pass thành công
                setTimeout(() => {
                    localStorage.clear();
                    navigate('/login');
                }, 2000);

            } else {
                const errorData = await response.json();
                // Xử lý lỗi từ backend (ví dụ: Mật khẩu hiện tại không đúng)
                throw new Error(errorData.detail || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
            }

        } catch (error) {
            setToastMessage(error.message);
            setToastType("error");
            setShowToast(true);
        } finally {
            setIsLoading(false);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const strength = getStrength(passwords.new);
    const strengthLabels = ['Yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
    const strengthColors = ['bg-gray-200', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

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
                <h1 className="text-xl font-bold text-gray-900">Đổi Mật Khẩu</h1>
                <p className="text-sm text-gray-500 mt-1">Vui lòng nhập mật khẩu hiện tại để thay đổi mật khẩu mới</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="max-w-xl mx-auto space-y-6">
                    <Input
                        type="password"
                        label="Mật khẩu hiện tại"
                        placeholder="Nhập mật khẩu hiện tại"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        disabled={isLoading}
                    />

                    <div>
                        <Input
                            type="password"
                            label="Mật khẩu mới"
                            placeholder="Nhập mật khẩu mới"
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            disabled={isLoading}
                        />
                        {/* Strength meter */}
                        {passwords.new && (
                            <div className="mt-2">
                                <div className="flex gap-1 h-1.5 mb-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`flex-1 rounded-full ${level <= strength ? strengthColors[strength] : 'bg-gray-100'}`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-xs font-medium ${strength < 3 ? 'text-red-500' : 'text-green-600'}`}>
                                    Độ bảo mật: {strengthLabels[strength]}
                                    {strength < 3 && ' (Yêu cầu ít nhất 8 ký tự, chữ hoa, số)'}
                                </p>
                            </div>
                        )}
                    </div>

                    <Input
                        type="password"
                        label="Xác nhận mật khẩu mới"
                        placeholder="Nhập lại mật khẩu mới"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        disabled={isLoading}
                    />

                    <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        onClick={handleUpdate}
                        disabled={isLoading}
                        leftIcon={isLoading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : null}
                    >
                        {isLoading ? "ĐANG CẬP NHẬT..." : "CẬP NHẬT MẬT KHẨU"}
                    </Button>

                    <div className="text-center">
                        <Link
                            to="/forgot-password" // Đảm bảo đường dẫn này đúng trong router của bạn
                            className="text-sm text-primary font-medium hover:underline"
                        >
                            Bạn quên mật khẩu?
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">security</span>
                <div>
                    <h4 className="font-bold text-primary text-sm">Lời khuyên bảo mật</h4>
                    <p className="text-xs text-blue-700 mt-1">
                        Sử dụng ít nhất 8 ký tự, bao gồm cả chữ cái, số và ký tự đặc biệt để tài khoản của bạn được bảo vệ tốt nhất.
                        Không nên sử dụng lại mật khẩu cũ.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;