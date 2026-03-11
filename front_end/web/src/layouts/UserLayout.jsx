import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UserSidebar from "../components/user/UserSideBar";
import { Bell, Info, ChevronRight, Check, Menu } from "lucide-react";
import GlobalChatbot from "../components/common/GlobalChatbot";

const UserLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const quickNotifications = [
    {
      id: 1,
      title: "Chiến dịch mới",
      desc: "Mùa Hè Xanh 2026...",
      time: "5 phút trước",
      isUnread: true,
    },
    {
      id: 2,
      title: "Cảnh báo ngân sách",
      desc: "Mặt trận Xây cầu...",
      time: "2 giờ trước",
      isUnread: true,
    },
    {
      id: 3,
      title: "Văn bản số",
      desc: "Có 1 văn bản mới...",
      time: "1 ngày trước",
      isUnread: false,
    },
  ];

  return (
    // 1. flex h-screen: Cố định chiều cao toàn màn hình, không cho cuộn cả trang
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* 2. SIDEBAR: Bên trái, sẽ đẩy nội dung sang phải nhờ md:sticky trong UserSidebar */}
      <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 3. KHỐI NỘI DUNG CHÍNH: Bên phải */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER: Giảm z-index xuống z-20 để không đè lên Popover của Sidebar (z-50+) */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 md:hidden text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            {/* Có thể thêm tiêu đề trang ở đây nếu muốn */}
            <h2 className="hidden md:block text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Hệ thống Đoàn viên
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Thông báo */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl transition-all relative ${
                  showNotifications
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                <Bell size={22} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white">
                      <h3 className="font-bold text-slate-800 text-sm">
                        Thông báo gần đây
                      </h3>
                      <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Check size={12} /> Đọc tất cả
                      </button>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto">
                      {quickNotifications.map((noti) => (
                        <div
                          key={noti.id}
                          className="p-4 border-b border-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer group relative"
                        >
                          {noti.isUnread && (
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-full"></div>
                          )}
                          <div className="flex gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <Info size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-bold text-slate-700 truncate group-hover:text-blue-600">
                                {noti.title}
                              </p>
                              <p className="text-[11px] text-slate-500 line-clamp-2">
                                {noti.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full p-3.5 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 border-t border-slate-50">
                      Xem tất cả <ChevronRight size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="h-8 w-px bg-slate-100 mx-2"></div>

            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm md:hidden">
              LH
            </div>
          </div>
        </header>

        {/* 4. MAIN AREA: Tách biệt việc cuộn nội dung */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 scroll-smooth">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      {/* 5. Gắn AI Chatbot vào gốc của UserLayout để nó trôi nổi trên mọi sub-routes */}
      <GlobalChatbot />
    </div>
  );
};

export default UserLayout;
