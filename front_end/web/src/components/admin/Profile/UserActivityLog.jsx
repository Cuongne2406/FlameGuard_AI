import React from "react";
import {
  Search,
  Download,
  History,
  ChevronDown,
  LogIn,
  FileCheck,
  FileText,
  UserCog,
  AlertCircle,
} from "lucide-react";

const UserActivityLog = () => {
  // Dữ liệu mẫu dựa trên ảnh thiết kế của bạn
  const logData = [
    {
      date: "14/02/2026",
      isToday: true,
      activities: [
        {
          id: 1,
          time: "09:45",
          action: "Đăng nhập hệ thống",
          details: "IP: 113.161.x.x • Trình duyệt Chrome (Windows 11)",
          type: "login",
          color: "bg-blue-500",
        },
        {
          id: 2,
          time: "09:50",
          action: (
            <>
              Phê duyệt ngân sách cho{" "}
              <span className="text-blue-600 font-bold">
                Chiến dịch Mùa Hè Xanh
              </span>
            </>
          ),
          details: "Thao tác duyệt cấp 2 (Final Approval)",
          type: "approve",
          color: "bg-emerald-500",
        },
        {
          id: 3,
          time: "10:15",
          action: (
            <>
              Ban hành văn bản mới:{" "}
              <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-mono">
                KH-102/ĐTN
              </span>{" "}
              - Kế hoạch Hiến máu
            </>
          ),
          details: (
            <div className="flex gap-2 mt-2">
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                Công khai
              </span>
              <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md text-[10px] font-bold">
                File PDF đính kèm
              </span>
            </div>
          ),
          type: "document",
          color: "bg-indigo-500",
          icon: <FileText size={14} className="text-white" />,
        },
      ],
    },
    {
      date: "13/02/2026",
      isToday: false,
      activities: [
        {
          id: 4,
          time: "14:20",
          action: "Cập nhật thông tin Ban Chấp Hành Khoa CNTT",
          details: "Thay đổi nhân sự: Bí thư Đoàn khoa",
          type: "update",
          color: "bg-orange-500",
        },
        {
          id: 5,
          time: "16:00",
          action: "Xóa một bài viết vi phạm",
          details: "Lý do: AI detected toxic content (Mức độ tin cậy: 98%)",
          type: "alert",
          color: "bg-red-500",
          isWarning: true,
        },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <History className="text-blue-600" size={24} />
            Nhật ký Hoạt động Cá nhân
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Danh sách các thao tác bạn đã thực hiện trên hệ thống trong 30 ngày
            qua.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0056D2] text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
          <Download size={16} /> Xuất báo cáo cá nhân
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm thao tác..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-2xl border border-transparent hover:border-slate-200 cursor-pointer transition-all">
          <span className="text-[11px] font-black text-slate-400 uppercase">
            Lọc theo:
          </span>
          <span className="text-sm font-bold text-slate-700">
            Tất cả loại thao tác
          </span>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>

      {/* Timeline Content */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        {/* Decorative background line */}
        <div className="absolute left-[111px] top-0 bottom-0 w-0.5 bg-slate-100 hidden md:block"></div>

        <div className="space-y-12">
          {logData.map((group, gIdx) => (
            <div key={gIdx} className="relative">
              {/* Date Header */}
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div
                  className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${group.isToday ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  {group.isToday ? "Hôm nay" : "Hôm qua"}
                </div>
                <span className="text-sm font-bold text-slate-400">
                  {group.date}
                </span>
              </div>

              {/* Activities under this date */}
              <div className="space-y-8">
                {group.activities.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row gap-4 md:gap-8 relative group"
                  >
                    {/* Time & Dot */}
                    <div className="flex items-center md:w-20 shrink-0">
                      <span className="text-sm font-black text-slate-800">
                        {item.time}
                      </span>
                      <div
                        className={`absolute left-[103px] w-4 h-4 rounded-full border-4 border-white shadow-sm z-20 transition-transform group-hover:scale-125 hidden md:block ${item.color}`}
                      ></div>
                    </div>

                    {/* Content Card */}
                    <div
                      className={`flex-1 p-5 rounded-[24px] border transition-all ${
                        item.isWarning
                          ? "bg-red-50/50 border-red-100 hover:bg-red-50"
                          : "bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-100 hover:shadow-xl hover:shadow-slate-100/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {item.isWarning && (
                          <AlertCircle
                            className="text-red-500 shrink-0 mt-0.5"
                            size={18}
                          />
                        )}
                        <div className="flex-1">
                          <h4
                            className={`text-[14px] font-bold ${item.isWarning ? "text-red-700" : "text-slate-800"}`}
                          >
                            {item.action}
                          </h4>
                          <div
                            className={`text-xs mt-1 font-medium ${item.isWarning ? "text-red-500" : "text-slate-500"}`}
                          >
                            {item.details}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-12 pt-6 border-t border-slate-50 text-center">
          <p className="text-[11px] font-bold text-slate-400 italic">
            * Hiển thị dữ liệu 30 ngày gần nhất
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserActivityLog;
