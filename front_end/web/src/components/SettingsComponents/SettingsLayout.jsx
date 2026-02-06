import { Outlet } from 'react-router-dom';
import SettingsSidebar from './SettingsSidebar';

/**
 * SettingsLayout - Layout chung cho các trang cài đặt
 */
const SettingsLayout = () => {
    return (
        <div className="flex flex-col md:flex-row gap-6">
            <SettingsSidebar />
            <div className="flex-1 min-w-0">
                <Outlet />
            </div>
        </div>
    );
};

export default SettingsLayout;
