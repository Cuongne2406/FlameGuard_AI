import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Flag,
  CornerDownRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const ListView = () => {
  // 1. State quản lý hiển thị Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. State quản lý tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  // 3. Dữ liệu mẫu (Data Source)
  const [activities] = useState([
    {
      id: 1,
      name: "Chiến dịch Mùa Hè Xanh 2026",
      unit: "Toàn trường",
      time: "01/06 - 15/08",
      budget: "500tr / 200tr",
      progress: 40,
      status: "RUNNING",
      subActivities: [
        {
          id: 11,
          name: "Mặt trận Xây cầu",
          unit: "Khoa Xây dựng",
          time: "05/06 - 20/06",
          budget: "50tr / 45tr",
          progress: 100,
          status: "COMPLETED",
        },
        {
          id: 12,
          name: "Mặt trận Dạy học",
          unit: "Khoa CNTT",
          time: "10/06 - 30/07",
          budget: "30tr / 10tr",
          progress: 30,
          status: "RUNNING",
        },
      ],
    },
    {
      id: 2,
      name: "Tháng Thanh Niên 2026",
      unit: "Toàn trường",
      time: "01/03 - 31/03",
      budget: "200tr / 180tr",
      progress: 100,
      status: "PENDING",
      subActivities: [],
    },
  ]);

  // 4. Logic lọc dữ liệu
  const filteredActivities = useMemo(() => {
    return activities.filter(
      (activity) =>
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.unit.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, activities]);

  return (
    <div className="relative space-y-4 animate-in fade-in duration-500">
      {/* --- THANH CÔNG CỤ (Search & Filters) --- */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Tìm kiếm chiến dịch/khoa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>

        <FilterDropdown label="Trạng thái: Tất cả" />
        <FilterDropdown label="Đơn vị: Tất cả" />

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#0061D5] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
        >
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      {/* --- BẢNG DỮ LIỆU --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Tên chiến dịch / Sự kiện
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                Đơn vị phụ trách
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center text-wrap w-32">
                Ngân sách
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                Tiến độ
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ParentRow {...activity} />
                  {activity.subActivities.map((sub) => (
                    <SubRow key={sub.id} {...sub} />
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-slate-400 text-sm italic"
                >
                  Không tìm thấy kết quả phù hợp...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL THÊM MỚI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-700">Tạo chiến dịch mới</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tên chiến dịch
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên chiến dịch..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Đơn vị
                  </label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500">
                    <option>Toàn trường</option>
                    <option>Khoa CNTT</option>
                    <option>Khoa Xây dựng</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Ngân sách dự trù
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 50tr"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
              >
                Hủy
              </button>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
                Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- GIỮ NGUYÊN CÁC HELPER COMPONENTS CỦA BẠN (CÓ CHỈNH SỬA NHẸ) ---

const FilterDropdown = ({ label }) => (
  <button className="flex items-center justify-between gap-4 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:border-slate-300 transition-all min-w-[140px]">
    <span className="truncate">{label}</span>
    <ChevronDown size={14} className="text-slate-400" />
  </button>
);

const ParentRow = ({ name, unit, budget, progress, status }) => (
  <tr className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <ChevronDown size={14} className="text-slate-300" />
        <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center text-[#0061D5]">
          <Flag size={12} fill="currentColor" />
        </div>
        <span className="font-bold text-slate-700 text-[13px]">{name}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-center">
      <span className="px-3 py-1 bg-blue-50 text-[#0061D5] rounded-full text-[10px] font-bold uppercase tracking-wider">
        {unit}
      </span>
    </td>
    <td className="px-6 py-4 text-center text-xs font-bold text-slate-700">
      {budget.split("/")[0]}{" "}
      <span className="text-slate-300 font-normal">
        / {budget.split("/")[1]}
      </span>
    </td>
    <td className="px-6 py-4 text-center">
      <div className="flex flex-col items-center gap-1">
        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full ${progress === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-[10px] font-black text-slate-400">
          {progress}%
        </span>
      </div>
    </td>
    <td className="px-6 py-4 text-right">
      <span
        className={`px-2 py-1 rounded-md text-[9px] font-black border ${status === "RUNNING" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}
      >
        {status}
      </span>
    </td>
  </tr>
);

const SubRow = ({ name, unit, budget, progress, status }) => (
  <tr className="bg-slate-50/20 hover:bg-slate-50 transition-colors border-l-2 border-transparent hover:border-blue-200">
    <td className="px-6 py-3 pl-14">
      <div className="flex items-center gap-2 text-slate-400">
        <CornerDownRight size={14} />
        <span className="text-xs font-semibold text-slate-600">{name}</span>
      </div>
    </td>
    <td className="px-6 py-3 text-center">
      <span className="text-[10px] font-bold text-slate-400 italic">
        {unit}
      </span>
    </td>
    <td className="px-6 py-3 text-center text-[11px] text-slate-400 font-medium">
      {budget}
    </td>
    <td className="px-6 py-3 text-center">
      <div className="flex flex-col items-center gap-1">
        <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
          <div
            className={`h-full ${progress === 100 ? "bg-emerald-400" : "bg-orange-400"}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-[9px] font-bold text-slate-300">{progress}%</span>
      </div>
    </td>
    <td className="px-6 py-3 text-right text-[9px] font-black text-slate-300 uppercase tracking-tighter">
      {status}
    </td>
  </tr>
);

export default ListView;
