import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Search, LogIn } from "lucide-react";

const Navbar = () => {
  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Tin tức", path: "/tin-tuc" },
    { name: "Hoạt động", path: "/hoat-dong" },
    { name: "Học thuật", path: "/hoc-thuat" },
    { name: "Liên hệ", path: "/lien-he" },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        {/* Header (Logo) */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">
                school
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-primary text-sm">Đoàn Khoa</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                Hệ sinh thái số
              </span>
            </div>
          </div>
        </div>

        {/* Menu điều hướng */}
        <nav className="hidden lg:flex gap-8 text-[13px] font-semibold text-gray-600">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `transition-all py-5 border-b-2 ${
                  isActive
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-blue-600"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Thanh tìm kiếm & Nút Login */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="bg-gray-100 pl-10 pr-4 py-2 rounded-lg text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <Link
            to="/Login"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <LogIn size={14} /> Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
