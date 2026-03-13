import React, { useState } from "react";
import {
  Wallet,
  Coins,
  PiggyBank,
  Package,
  Plus,
  Search,
  Calendar,
  Bell,
  X, // Thêm icon đóng modal
} from "lucide-react";
import { financeService } from "../../../services/financeService";

const Finance = () => {
  // 1. STATE CHO TÌM KIẾM
  const [searchTerm, setSearchTerm] = useState("");

  // 2. STATE CHO MODAL NHẬP KHO
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. STATE DỮ LIỆU TỪ API
  const [assets, setAssets] = useState([]);
  const [budgetRows, setBudgetRows] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: "0", used: "0", remaining: "0", assetsCount: "0", usedPercent: 0 });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedAssets, budgetStats, fundRequests, budgets] = await Promise.all([
          financeService.getAssets(),
          financeService.getBudgetStats(),
          financeService.getFacultyTransactions(),
          apiClient('/budgets')
        ]);
        
        // Map Assets
        const mappedAssets = fetchedAssets.map(a => ({
          id: a.id,
          title: a.name || 'Tài sản',
          desc: a.description || '',
          status: a.status === 'AVAILABLE' ? "Sẵn sàng" : "Đang sử dụng",
          statusColor: a.status === 'AVAILABLE' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600",
          footer: `Vị trí: ${a.storage_location || 'Kho'}`
        }));
        setAssets(mappedAssets);

        // Map Stats
        const total = budgetStats.totalIncome || 0;
        const used = budgetStats.totalExpense || 0;
        const remaining = total - used;
        const usedPercent = total > 0 ? Math.round((used / total) * 100) : 0;
        
        setStats({
          total: (total / 1000000).toFixed(1), // Convert to Millions
          used: (used / 1000000).toFixed(1),
          remaining: (remaining / 1000000).toFixed(1),
          assetsCount: fetchedAssets.length.toString(),
          usedPercent
        });

        // Map Fund Requests
        setRequests(fundRequests.map(r => ({
          dept: r.user || 'N/A',
          time: 'Vừa xong',
          desc: r.title + ': ' + r.detail
        })));

        // Map Budgets for table
        setBudgetRows(budgets.map(b => ({
          name: b.name || 'Ngân sách',
          estimate: (b.total_amount / 1000000).toFixed(1),
          actual: (b.used_amount / 1000000).toFixed(1),
          diff: ((b.total_amount - b.used_amount) / 1000000).toFixed(1),
          status: b.used_amount > b.total_amount ? "danger" : (b.used_amount === b.total_amount ? "warning" : "success")
        })));

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tài chính:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 3. LOGIC LỌC TÀI SẢN
  const filteredAssets = assets.filter(
    (asset) =>
      asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.desc.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-1 space-y-6 animate-in fade-in duration-700 relative">
      {/* 1. TOP HEADER & YEAR SELECTOR */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-100">
            <Wallet size={20} />
          </div>
          Quản lý Tài chính & Hậu cần
        </h2>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <Calendar size={16} className="text-slate-400 ml-2" />
          <span className="text-xs font-bold text-slate-600">
            Năm tài chính: 2025
          </span>
          <button className="p-1 hover:bg-slate-100 rounded-md transition-colors">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* 2. STATS CARDS (API) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Tổng Ngân sách"
          value={stats.total}
          unit="Tr. VNĐ"
          sub="Đã duyệt cấp"
          subColor="text-emerald-500"
          icon={<Wallet className="text-slate-300" />}
        />
        <StatCard
          title="Đã giải ngân"
          value={stats.used}
          unit="Tr. VNĐ"
          progress={stats.usedPercent}
          sub={`${stats.usedPercent}% kế hoạch`}
          icon={<Coins className="text-blue-400" />}
        />
        <StatCard
          title="Quỹ tồn"
          value={stats.remaining}
          unit="Tr. VNĐ"
          sub="Khả dụng"
          icon={<PiggyBank className="text-emerald-400" />}
        />
        <StatCard
          title="Tài sản mượn"
          value={stats.assetsCount}
          unit="thiết bị"
          sub="Cần kiểm kê"
          subColor="text-red-500"
          icon={<Package className="text-orange-300" />}
        />
      </div>

      {/* 3. BẢNG ĐỐI SOÁT & YÊU CẦU (Giữ nguyên như cũ) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table content... */}
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-slate-700 text-sm flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
              Đối soát Ngân sách Sự kiện
            </h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">
                  Sự kiện
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase text-center">
                  Dự trù
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase text-center">
                  Thực chi
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase text-right">
                  Chênh lệch
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {budgetRows.length > 0 ? (
                budgetRows.map((row, i) => <BudgetRow key={i} {...row} />)
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-xs text-slate-400">Không có dữ liệu đối soát ngân sách.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-black text-slate-700 text-sm flex items-center gap-2">
            <Bell size={16} className="text-red-500" /> Yêu cầu cấp kinh phí
          </h3>
          {requests.length > 0 ? (
            requests.map((req, i) => (
              <RequestCard
                key={i}
                dept={req.dept}
                time={req.time}
                desc={req.desc}
                type="primary"
              />
            ))
          ) : (
             <div className="text-center py-8 text-xs text-slate-400">Không có yêu cầu nào.</div>
          )}
        </div>
      </div>

      {/* 4. KHO TÀI SẢN (PHẦN CÓ LOGIC MỚI) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
          <h3 className="font-black text-slate-700 text-sm flex items-center gap-2">
            <Package size={18} className="text-emerald-500" /> Kho Tài sản & Cơ
            sở vật chất
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Tìm tên hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // CẬP NHẬT TÌM KIẾM
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none w-48 focus:w-64 transition-all focus:border-blue-400"
              />
            </div>
            {/* NÚT MỞ MODAL */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-100 hover:bg-blue-700 transition-colors"
            >
              <Plus size={14} /> Nhập kho
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <AssetCard key={asset.id} {...asset} />
            ))
          ) : (
            <div className="col-span-3 py-10 text-center text-slate-400 text-xs italic">
              Không tìm thấy tài sản phù hợp với "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* 5. MODAL NHẬP KHO (POPUP) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <Plus size={18} className="text-blue-600" /> Nhập tài sản mới
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="p-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setIsModalOpen(false);
              }}
            >
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  Tên tài sản
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  placeholder="Ví dụ: Máy chiếu Sony VPL"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Đơn vị tính
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                    placeholder="Cái/Bộ..."
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  Vị trí lưu kho
                </label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500">
                  <option>Hầm B2</option>
                  <option>Phòng Đoàn Khoa</option>
                  <option>Hội trường A</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors"
                >
                  Xác nhận Nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Giữ các Helper Components của bạn (StatCard, BudgetRow, RequestCard, AssetCard) bên dưới...
const StatCard = ({
  title,
  value,
  unit,
  sub,
  subColor = "text-slate-400",
  progress,
  icon,
}) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-all">
    <div className="absolute top-4 right-4 opacity-20 group-hover:scale-110 transition-transform">
      {" "}
      {icon}{" "}
    </div>
    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
      {title}
    </h4>
    <div className="flex items-baseline gap-1 mb-3">
      <span className="text-2xl font-black text-slate-800 tracking-tight">
        {value}
      </span>
      <span className="text-xs font-bold text-slate-400">{unit}</span>
    </div>
    {progress && (
      <div className="w-full bg-slate-100 h-1 rounded-full mb-2 overflow-hidden">
        <div
          className="bg-blue-500 h-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    )}
    <p className={`text-[10px] font-bold ${subColor}`}>{sub}</p>
  </div>
);

const BudgetRow = ({ name, estimate, actual, diff, status }) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="px-6 py-4 font-bold text-slate-700 text-xs">{name}</td>
    <td className="px-6 py-4 text-center text-slate-500 text-xs">{estimate}</td>
    <td className="px-6 py-4 text-center font-black text-slate-700 text-xs">
      {actual}
    </td>
    <td
      className={`px-6 py-4 text-right text-xs font-black ${status === "danger" ? "text-red-500" : status === "success" ? "text-emerald-500" : "text-slate-400"}`}
    >
      {diff}
    </td>
  </tr>
);

const RequestCard = ({ dept, time, desc, type }) => (
  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 space-y-3">
    <div className="flex justify-between items-start">
      <div>
        <h5 className="text-[11px] font-black text-slate-800">{dept}</h5>
        <span className="text-[9px] text-slate-400 font-medium">{time}</span>
      </div>
    </div>
    <p className="text-[10px] text-slate-500 leading-relaxed italic">
      "{desc}"
    </p>
    <button className="w-full py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold">
      Duyệt chi
    </button>
  </div>
);

const AssetCard = ({ title, desc, status, statusColor, footer }) => (
  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border-l-4 border-l-transparent hover:border-l-blue-500">
    <div className="flex justify-between items-start gap-4">
      <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Package size={16} />
      </div>
      <span
        className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${statusColor}`}
      >
        {status}
      </span>
    </div>
    <div>
      <h5 className="text-xs font-black text-slate-800 mb-1">{title}</h5>
      <p className="text-[10px] text-slate-400 leading-tight font-medium">
        {desc}
      </p>
    </div>
    <div className="pt-3 border-t border-slate-100">
      <p className="text-[10px] font-bold text-blue-600 italic leading-tight">
        {footer}
      </p>
    </div>
  </div>
);

export default Finance;
