import { useState } from 'react';
import { Toggle, Button } from '../../../../components/ui';

/**
 * Privacy - Trang cài đặt quyền riêng tư
 */
const Privacy = () => {
    const [settings, setSettings] = useState({
        showEmail: true,
        showPhone: false,
        searchable: true,
        shareScore: true,
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h1 className="text-xl font-bold text-gray-900">Cài Đặt Quyền Riêng Tư</h1>
                <p className="text-sm text-gray-500 mt-1">Quản lý khả năng hiển thị thông tin và chia sẻ dữ liệu của bạn</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-8">
                {/* Info Visibility */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-4 border-l-4 border-primary pl-2">Hiển thị thông tin</h3>
                    <div className="space-y-6">
                        <Toggle
                            checked={settings.showEmail}
                            onChange={() => handleToggle('showEmail')}
                            label="Hiển thị Email cho người khác"
                            description="Cho phép các sinh viên khác nhìn thấy email của bạn"
                        />
                        <div className="border-t border-gray-100" />
                        <Toggle
                            checked={settings.showPhone}
                            onChange={() => handleToggle('showPhone')}
                            label="Hiển thị Số điện thoại"
                            description="Giữ số điện thoại của bạn ở chế độ riêng tư"
                        />
                        <div className="border-t border-gray-100" />
                        <Toggle
                            checked={settings.searchable}
                            onChange={() => handleToggle('searchable')}
                            label="Cho phép tìm kiếm theo tên"
                            description="Người khác có thể tìm thấy bạn qua thanh tìm kiếm chung"
                        />
                    </div>
                </div>

                {/* Activity Data */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-4 border-l-4 border-primary pl-2">Dữ liệu hoạt động</h3>
                    <div className="space-y-6">
                        <Toggle
                            checked={settings.shareScore}
                            onChange={() => handleToggle('shareScore')}
                            label="Chia sẻ thành tích lên Bảng vàng thi đua"
                            description="Hiển thị điểm số và thứ hạng của bạn trong các phong trào"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button variant="primary" leftIcon={<span className="material-symbols-outlined">save</span>}>
                        LƯU CÀI ĐẶT
                    </Button>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">policy</span>
                <div>
                    <h4 className="font-bold text-primary text-sm">Quyền riêng tư của bạn là ưu tiên hàng đầu</h4>
                    <p className="text-xs text-blue-700 mt-1">
                        Các thay đổi sẽ được áp dụng ngay lập tức trên toàn hệ thống sau khi lưu.
                        Một số thông tin bắt buộc do Nhà trường quy định sẽ luôn được hiển thị cho quản trị viên.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
