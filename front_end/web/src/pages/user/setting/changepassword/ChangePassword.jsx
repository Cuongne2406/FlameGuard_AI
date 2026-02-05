import React from 'react';
import { useState } from 'react';
import { Button, Input } from '../../../../components/ui';

/**
 * ChangePassword - Trang đổi mật khẩu
 */
const ChangePassword = () => {
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

    const strength = getStrength(passwords.new);
    const strengthLabels = ['Yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
    const strengthColors = ['bg-gray-200', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return (
        <div className="space-y-6">
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
                    />

                    <div>
                        <Input
                            type="password"
                            label="Mật khẩu mới"
                            placeholder="Nhập mật khẩu mới"
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
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
                                    {strength < 3 && ' (Yêu cầu ít nhất 8 ký tự)'}
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
                    />

                    <Button variant="primary" fullWidth size="lg">
                        CẬP NHẬT MẬT KHẨU
                    </Button>

                    <div className="text-center">
                        <button className="text-sm text-primary font-medium hover:underline">
                            Bạn quên mật khẩu?
                        </button>
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
