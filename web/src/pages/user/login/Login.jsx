import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../../../components/ui';

/**
 * Login Page - Trang đăng nhập cho đoàn viên
 */
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        studentId: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Call API login
        console.log('Login:', formData);
        navigate('/home');
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80')`,
                }}
            >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-3xl">🏛️</span>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng Nhập</h1>
                        <p className="text-gray-500 text-sm">
                            Hệ sinh thái số quản lý hoạt động Đoàn
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Student ID */}
                        <Input
                            label="Mã số sinh viên / Đoàn viên"
                            placeholder="Nhập mã số của bạn"
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            leftIcon={<span className="material-symbols-outlined text-lg">person</span>}
                        />

                        {/* Password */}
                        <Input
                            type="password"
                            label="Mật khẩu"
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            leftIcon={<span className="material-symbols-outlined text-lg">lock</span>}
                        />

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.remember}
                                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-gray-600">Ghi nhớ đăng nhập</span>
                            </label>
                            <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" fullWidth size="lg"
                            rightIcon={<span className="material-symbols-outlined">arrow_forward</span>}
                        >
                            Đăng nhập
                        </Button>
                    </form>

                    {/* Register Link */}
                    <div className="text-center mt-6 text-sm text-gray-600">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="text-primary hover:underline font-semibold">
                            Đăng ký ngay
                        </Link>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            Hệ thống dành cho Đoàn viên và Cán bộ quản lý. Liên hệ Văn phòng Đoàn<br />
                            để được hỗ trợ kỹ thuật.
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <p className="text-center text-white/80 text-xs mt-4">
                    © 2024 Hệ thống Quản lý Đoàn Khoa. Developed for Digital Transformation.
                </p>
            </div>
        </div>
    );
};

export default Login;
