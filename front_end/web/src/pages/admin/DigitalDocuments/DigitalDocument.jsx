import React, { useState } from "react"; // Bổ sung useState
import {
  FileText,
  Send,
  Clock,
  Plus,
  Search,
  Download,
  Printer,
  X,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Upload, // Thêm icon cho modal
} from "lucide-react";

const DigitalDocument = () => {
  // --- PHẦN BỔ SUNG: STATE QUẢN LÝ MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex gap-4 h-full animate-in fade-in slide-in-from-bottom-2 duration-500 relative">
      {/* CỘT TRÁI: DANH SÁCH VĂN BẢN (65%) */}
      <div className="w-[65%] flex flex-col gap-4">
        {/* Header & Stats */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <FileText className="text-blue-600" size={20} /> Hệ thống Quản lý
            Văn bản
          </h2>

          {/* SỰ KIỆN CLICK MỞ MODAL */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={16} /> Ban hành Văn bản mới
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatBox
            label="CÔNG VĂN ĐẾN"
            count="15"
            unread="3 unread"
            color="text-blue-600"
            icon={<FileText size={16} />}
          />
          <StatBox
            label="CÔNG VĂN ĐI"
            count="120"
            color="text-emerald-500"
            icon={<Send size={16} />}
          />
          <StatBox
            label="CHỜ KÝ DUYỆT"
            count="5"
            color="text-orange-500"
            icon={<Clock size={16} />}
          />
        </div>

        {/* Filter & Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between gap-4 bg-slate-50/30">
            <div className="flex bg-white p-1 rounded-xl border border-slate-200">
              <button className="px-4 py-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-600">
                Tất cả
              </button>
              <button className="px-4 py-1.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-lg shadow-sm">
                Công văn Đi
              </button>
              <button className="px-4 py-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-600">
                Văn bản nội bộ
              </button>
            </div>
            <div className="relative flex-1 max-w-xs">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Tìm số hiệu, trích yếu..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          <div className="overflow-auto flex-1">
            <table className="w-full border-collapse">
              <thead className="bg-white sticky top-0 z-10 border-b border-slate-100">
                <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Số hiệu</th>
                  <th className="px-6 py-4">Ngày ban hành</th>
                  <th className="px-6 py-4">Trích yếu</th>
                  <th className="px-6 py-4">Nơi nhận</th>
                  {/* <th className="px-6 py-4 text-right pr-10">Thao tác</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <DocRow
                  id="KH-102/ĐTN"
                  date="24/03/2026"
                  title="Kế hoạch tổ chức Hội trại Truyền thống 26/3"
                  target="Toàn trường"
                  active
                />
                <DocRow
                  id="QĐ-45/ĐTN"
                  date="23/03/2026"
                  title="Quyết định Khen thưởng Chiến dịch Mùa Hè Xanh"
                  target="Khoa CNTT, Kinh Tế"
                />
                <DocRow
                  id="TB-12/ĐTN"
                  date="22/03/2026"
                  title="Thông báo triệu tập Đại hội Đại biểu Đoàn trường"
                  target="BCH các cấp"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: XEM TRƯỚC VĂN BẢN (35%) - Giữ nguyên logic của bạn */}
      <div className="w-[35%] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="bg-red-50 text-red-600 p-1.5 rounded-lg shrink-0">
              <FileText size={14} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 truncate">
              KH-102-DTN_KeHoachHoi...
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <Download size={14} />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <Printer size={14} />
            </button>
            <button className="p-2 hover:bg-red-50 rounded-lg text-red-400">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="absolute top-16 right-4 left-4 z-20 bg-white/95 backdrop-blur-sm border border-slate-200 p-4 rounded-xl shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Trạng thái theo dõi
            </span>
            <span className="text-[10px] font-black text-blue-600">
              8/10 Khoa đã xem
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-[80%]"></div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-red-500 font-bold bg-red-50 p-2 rounded-lg">
            <AlertCircle size={12} /> Khoa Xây Dựng chưa xem văn bản này
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 bg-slate-200/50">
          <div className="bg-white w-full min-h-[800px] shadow-lg p-10 flex flex-col gap-6 relative">
            <div className="flex justify-between items-start text-[10px] font-bold text-slate-800">
              <div className="text-center">
                ĐOÀN TNCS HỒ CHÍ MINH
                <br />
                TRƯỜNG ĐH KỸ THUẬT
                <br />
                ***
              </div>
              <div className="text-center underline">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                <br />
                Độc lập - Tự do - Hạnh phúc
              </div>
            </div>
            <div className="text-center mt-10">
              <h3 className="text-sm font-black text-slate-900">KẾ HOẠCH</h3>
              <p className="text-[11px] font-bold text-slate-700 uppercase">
                Tổ chức Hội trại Truyền thống 26/3
              </p>
            </div>
            <div className="space-y-4 text-[11px] leading-relaxed text-slate-600">
              <p>
                Căn cứ Chương trình công tác Đoàn và phong trào thanh niên năm
                học 2025 - 2026...
              </p>
              <p>
                Thiết thực chào mừng kỷ niệm 95 năm ngày thành lập Đoàn TNCS Hồ
                Chí Minh (26/3/1931 - 26/3/2026)...
              </p>
              <p>
                <strong>I. MỤC ĐÍCH - YÊU CẦU:</strong>
                <br />
                1. Tạo sân chơi lành mạnh, bổ ích cho đoàn viên, thanh niên...
              </p>
            </div>
            <div className="absolute bottom-20 right-10 rotate-[-10deg] opacity-80 border-4 border-red-500 p-2 rounded-xl text-center select-none pointer-events-none">
              <div className="text-red-500 font-black text-[10px] uppercase">
                Ký bởi: LÊ TRỌNG PHÚC HẬU
              </div>
              <div className="text-red-500 font-bold text-[8px]">
                Ngày: 24/03/2026 08:30:15
              </div>
              <CheckCircle className="mx-auto mt-1 text-red-500" size={16} />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex gap-2">
          <button className="flex-1 py-2 rounded-xl text-[11px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100">
            Thu hồi
          </button>
          <button className="flex-[2] py-2 rounded-xl text-[11px] font-bold text-white bg-blue-600 shadow-md shadow-blue-100 hover:bg-blue-700">
            Gửi nhắc nhở
          </button>
        </div>
      </div>

      {/* --- PHẦN BỔ SUNG: MODAL BAN HÀNH VĂN BẢN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 leading-none">
                    Ban hành Văn bản mới
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                    Cung cấp thông tin văn bản điện tử
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setIsModalOpen(false);
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Số hiệu văn bản
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: KH-105/ĐTN"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Loại văn bản
                  </label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:border-blue-500 outline-none appearance-none">
                    <option>Kế hoạch</option>
                    <option>Quyết định</option>
                    <option>Thông báo</option>
                    <option>Công văn</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Trích yếu nội dung
                </label>
                <textarea
                  rows="3"
                  placeholder="Nhập tóm tắt nội dung văn bản..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:border-blue-500 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Tải lên văn bản (PDF/Docx)
                </label>
                <div className="border-2 border-dashed border-slate-100 rounded-2xl p-6 flex flex-col items-center gap-2 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                  <Upload className="text-slate-300" size={24} />
                  <span className="text-[10px] font-bold text-slate-400">
                    Kéo thả file hoặc nhấn để chọn
                  </span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Xác nhận ban hành <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Helper Components (Giữ nguyên từ code của bạn) ---

const StatBox = ({ label, count, unread, color, icon }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-all cursor-pointer">
    <div
      className={`absolute -right-2 -bottom-2 opacity-5 group-hover:scale-125 transition-transform ${color}`}
    >
      {icon}
    </div>
    <div className="flex items-center gap-2 mb-1">
      {React.cloneElement(icon, { size: 12, className: color })}
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className={`text-2xl font-black ${color}`}>{count}</span>
      {unread && (
        <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
          {unread}
        </span>
      )}
    </div>
  </div>
);

const DocRow = ({ id, date, title, target, active }) => (
  <tr
    className={`group transition-all cursor-pointer ${active ? "bg-blue-50/40" : "hover:bg-slate-50"}`}
  >
    <td
      className={`px-6 py-4 text-xs font-black ${active ? "text-blue-600" : "text-slate-700"}`}
    >
      {id}
    </td>
    <td className="px-6 py-4 text-[11px] text-slate-400 font-medium">{date}</td>
    <td className="px-6 py-4 max-w-xs">
      <div className="text-xs font-bold text-slate-700 leading-tight group-hover:text-blue-600 transition-colors">
        {title}
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <Users size={12} className="text-slate-300" />
        <span className="text-[11px] text-slate-500 font-medium">{target}</span>
      </div>
    </td>
    <td className="px-4 py-4 text-right">
      <ChevronRight
        size={14}
        className={`transition-transform ${active ? "text-blue-600 translate-x-1" : "text-slate-200"}`}
      />
    </td>
  </tr>
);

const Users = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default DigitalDocument;
