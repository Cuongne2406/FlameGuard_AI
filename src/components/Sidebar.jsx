import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const activeStyle = "flex items-center gap-3 px-3 py-3 rounded-lg bg-white/10 text-white shadow-sm border-l-4 border-primary transition-all duration-200";
  const normalStyle = "flex items-center gap-3 px-3 py-3 rounded-lg text-blue-100 border-l-4 border-transparent hover:bg-white/10 hover:text-white transition-colors duration-200 group";

  return (
    <aside className="w-64 flex-shrink-0 bg-primary dark:bg-slate-900 flex flex-col transition-all duration-300 shadow-xl z-20">
      <div className="h-16 flex items-center px-6 border-b border-white/10 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-xl">school</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">LHU YouthHub</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-medium text-sm">Tổng Quan</span>
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
          <span className="material-symbols-outlined">notifications</span>
          <span className="font-medium text-sm">Thông Báo</span>
        </NavLink>
        <NavLink to="/events" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
          <span className="material-symbols-outlined">event_note</span>
          <span className="font-medium text-sm">Quản lý sự kiện</span>
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
          <span className="material-symbols-outlined">groups</span>
          <span className="font-medium text-sm">Quản lý Đoàn Viên</span>
        </NavLink>
        {/* Thêm các link khác tùy ý */}
      </nav>

      <div className="p-4 border-t border-white/10 dark:border-gray-700">
        <button className={normalStyle + " w-full"}>
           <span className="material-symbols-outlined">settings</span>
           <span className="font-medium text-sm">Cài Đặt</span>
        </button>
        <div className="mt-4 flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-md">AD</div>
            <div className="flex flex-col text-left">
                <span className="text-xs font-medium text-white">Admin LHU</span>
                <span className="text-[10px] text-blue-200">Quản trị viên</span>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;