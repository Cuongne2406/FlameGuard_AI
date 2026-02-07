import React, { useState, useEffect } from 'react';
import { Input } from '../ui';

/**
 * ForgotPasswordForm - Nội dung form quên mật khẩu
 */
const ForgotPasswordForm = ({ onSuccess, onToggleLogin }) => {
    const [step, setStep] = useState(1); // 1: Info, 2: OTP, 3: New Password
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let timer;
        if (step === 2 && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);

    const handleResend = () => {
        if (canResend) {
            setCountdown(60);
            setCanResend(false);
            // Logic gửi lại OTP ở đây
        }
    };

    return (
        <div className="p-2">
            {step === 1 && (
                /* GIAI ĐOẠN 1: NHẬP THÔNG TIN CÁ NHÂN */
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <section className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Khôi phục mật khẩu</h3>
                            <p className="text-sm text-gray-500">Vui lòng nhập thông tin để nhận mã xác thực</p>
                        </div>

                        <div className="space-y-4">
                            <Input label="Họ và tên" placeholder="Nhập họ tên đầy đủ" />
                            <Input
                                label="Mã số sinh viên (MSSV)"
                                placeholder="Ví dụ: 2112345"
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1e293b]">Chi đoàn</label>
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                                    <option value="">Chọn chi đoàn của bạn</option>
                                    <option value="cntt">CNTT K21</option>
                                    <option value="khmt">KHMT K22</option>
                                </select>
                            </div>
                            <Input label="Email sinh viên" placeholder="email@student.university.edu.vn" />
                        </div>
                    </section>

                    <div className="space-y-4 text-center">
                        <button
                            onClick={() => setStep(2)}
                            className="w-full bg-[#007bff] hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-100 transition-all font-display uppercase tracking-wider active:scale-95"
                        >
                            Gửi mã xác thực (OTP)
                        </button>
                        {onToggleLogin && (
                            <p className="text-sm text-gray-500 font-medium font-display">
                                Nhớ mật khẩu? <button onClick={onToggleLogin} className="text-[#007bff] font-bold hover:underline">Quay lại đăng nhập</button>
                            </p>
                        )}
                    </div>
                </div>
            )}

            {step === 2 && (
                /* GIAI ĐOẠN 2: XÁC THỰC OTP */
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <section className="space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">mark_email_read</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Xác thực OTP</h3>
                            <p className="text-sm text-gray-500 px-6">
                                Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã bên dưới.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* OTP Input Boxes */}
                            <div className="flex justify-between gap-2 max-w-sm mx-auto">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        maxLength="1"
                                        className="w-10 h-10 md:w-12 md:h-12 border-2 border-gray-100 rounded-lg text-center font-bold text-lg focus:border-[#007bff] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                                    />
                                ))}
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400">
                                    Không nhận được mã?{' '}
                                    <button
                                        onClick={handleResend}
                                        disabled={!canResend}
                                        className={`font-bold hover:underline ${canResend ? 'text-primary' : 'text-gray-400 cursor-not-allowed'}`}
                                    >
                                        Gửi lại {!canResend && `(${countdown}s)`}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="space-y-4">
                        <button
                            onClick={() => setStep(3)}
                            className="w-full bg-[#007bff] hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-100 transition-all font-display uppercase tracking-wider active:scale-95"
                        >
                            Xác nhận OTP
                        </button>
                        <button
                            onClick={() => setStep(1)}
                            className="w-full text-gray-400 font-bold py-2 text-sm hover:text-gray-600 transition-colors"
                        >
                            Quay lại bước trước
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                /* GIAI ĐOẠN 3: TẠO MẬT KHẨU MỚI */
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <section className="space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">lock_reset</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Thiết lập mật khẩu mới</h3>
                            <p className="text-sm text-gray-500">Mã xác thực chính xác! Vui lòng tạo mật khẩu mới cực kỳ bảo mật.</p>
                        </div>

                        <div className="space-y-4">
                            <Input label="Mật khẩu mới" type="password" placeholder="Nhập ít nhất 8 ký tự" />
                            <Input label="Xác nhận mật khẩu mới" type="password" placeholder="Nhập lại mật khẩu mới" />
                        </div>
                    </section>

                    <div className="space-y-4 text-center">
                        <button
                            onClick={onSuccess}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl shadow-xl shadow-green-100 transition-all font-display uppercase tracking-wider active:scale-95"
                        >
                            Hoàn tất & Đăng nhập
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPasswordForm;
