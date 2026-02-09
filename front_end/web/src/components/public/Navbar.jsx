import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Search, LogIn } from "lucide-react";

const Navbar = () => {
  const navItems = [
    { name: "Trang chủ", path: "/trang-chu" }, // Đã sửa path theo yêu cầu trước đó
    { name: "Tin tức", path: "/tin-tuc" },
    { name: "Hoạt động", path: "/hoat-dong" },
    { name: "Học thuật", path: "/hoc-thuat" },
    { name: "Liên hệ", path: "/lien-he" },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ---  Nút Back + Logo --- */}
        <div className="absolute left-0 top-0 h-full flex items-center pl-6 z-20">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors group"
            title="Quay lại Dashboard quản lý">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
            </div>
            {/* Ẩn chữ trên màn hình nhỏ để đỡ rối */}
            <span className="text-sm font-bold hidden xl:block">Dashboard</span>
          </Link>
        </div>
        <div>

          {/* 2. Logo (Giữ nguyên) */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="material-symbols-outlined text-white text-xl">school</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-blue-600 text-sm">Đoàn Khoa</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Hệ sinh thái số</span>
            </div>
          </div>
        </div>

        {/* --- MENU ĐIỀU HƯỚNG (Giữ nguyên) --- */}
        <nav className="hidden lg:flex gap-8 text-[13px] font-semibold text-gray-600">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `transition-all py-5 border-b-2 ${isActive
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-blue-600"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* --- THANH TÌM KIẾM & LOGIN (Giữ nguyên) --- */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="bg-gray-100 pl-10 pr-4 py-2 rounded-lg text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;