import React, { useState, useEffect } from 'react';
import AddTransactionModal from '../../../components/admin/AddTransactionModal';

const FinancialManager = () => {
  // 1. State quản lý dữ liệu
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    balance: 0,
    month_income: 0,
    month_expense: 0
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Hàm format tiền tệ (Vd: 500000 -> 500.000)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // 3. Hàm gọi API lấy dữ liệu
  const fetchData = async (search = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      let url = "http://127.0.0.1:8000/api/v1/transactions/";
      if (search) url += `?search=${search}`;

      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu tài chính:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM XUẤT BÁO CÁO RA EXCEL (CSV) ---
  const handleExport = () => {
    if (transactions.length === 0) {
      alert("Chưa có dữ liệu để xuất báo cáo!");
      return;
    }

    // 1. Tạo tiêu đề cột
    const headers = ["Nội dung", "Danh mục", "Loại", "Số tiền", "Ngày tạo", "Người duyệt"];

    // 2. Chuyển đổi dữ liệu thành dạng CSV
    const csvRows = [
      headers.join(","), // Dòng tiêu đề
      ...transactions.map(row => [
        `"${row.title}"`, 
        `"${row.category}"`,
        row.type,
        row.amount,
        `"${new Date(row.created_at).toLocaleString('vi-VN')}"`,
        `"${row.creator?.full_name || 'N/A'}"`
      ].join(","))
    ];

    // 3. Tạo file và tải về
    const csvContent = "\uFEFF" + csvRows.join("\n"); 
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Bao_cao_tai_chinh_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Gọi API khi vào trang
  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchData(searchTerm);
  };

  // Hàm tạo avatar chữ cái
  const getAvatarChar = (name) => {
    if (!name) return "U";
    const words = name.trim().split(' ');
    return words[words.length - 1].charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F7FA] dark:bg-slate-900 p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">

        {/* --- METRIC CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Tổng Quỹ Đoàn"
            amount={formatCurrency(stats.balance)}
            subtext="Cập nhật: Vừa xong"
            icon="account_balance"
            color="primary"
            infoIcon="info"
          />
          <MetricCard
            title="Đã Thu (Tháng Này)"
            amount={formatCurrency(stats.month_income)}
            subtext="Doanh thu hoạt động"
            icon="payments"
            color="success"
            trend="up"
          />
          <MetricCard
            title="Đã Chi (Tháng Này)"
            amount={formatCurrency(stats.month_expense)}
            subtext="Chi phí hoạt động"
            icon="shopping_cart_checkout"
            color="danger"
            trend="down"
          />
        </div>

        {/* --- MAIN TABLE SECTION --- */}
        <div className="flex flex-col bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-[#dae1e7] dark:border-gray-700 overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-[#dae1e7] dark:border-gray-700">
            <div className="flex items-center gap-3 flex-1 min-w-[300px] max-w-[600px]">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#5e788d]">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#dae1e7] dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-[#101518] dark:text-white placeholder:text-[#5e788d] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                  placeholder="Tìm kiếm giao dịch..."
                  type="text"
                />
              </div>
            </div>

            <div className="flex gap-3">
              {/* NÚT TẠO GIAO DỊCH MỚI */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-sm transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Tạo Giao Dịch
              </button>

              {/* NÚT XUẤT BÁO CÁO (ĐÃ GẮN SỰ KIỆN) */}
              <button 
                onClick={handleExport} 
                className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#FFAB00] hover:bg-[#e69a00] text-white text-sm font-bold shadow-sm transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                Xuất Báo Cáo
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-[#dae1e7] dark:border-gray-700">
                  <Th width="w-[40%]">Nội Dung Thu/Chi</Th>
                  <Th width="w-[20%]">Ngày Tháng</Th>
                  <Th width="w-[20%]">Số Tiền</Th>
                  <Th width="w-[20%]">Người Duyệt</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dae1e7] dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-400">Chưa có giao dịch nào</td></tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'INCOME' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'
                            }`}>
                            <span className="material-symbols-outlined text-[20px]">
                              {tx.type === 'INCOME' ? 'arrow_downward' : 'arrow_upward'}
                            </span>
                          </div>
                          <div>
                            <p className="text-[#101518] dark:text-white text-sm font-medium">{tx.title}</p>
                            <p className="text-[#5e788d] dark:text-slate-400 text-xs">{tx.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[#101518] dark:text-white text-sm">
                          {new Date(tx.created_at).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-[#5e788d] dark:text-slate-400 text-xs">
                          {new Date(tx.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold text-sm ${tx.type === 'INCOME' ? 'text-success' : 'text-danger'
                          }`}>
                          {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`size-8 rounded-full flex items-center justify-center font-bold text-white text-xs bg-gradient-to-tr from-blue-400 to-blue-600`}>
                            {getAvatarChar(tx.creator?.full_name)}
                          </div>
                          <span className="text-sm font-medium text-[#101518] dark:text-white">
                            {tx.creator?.full_name || "Unknown"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-[#dae1e7] dark:border-gray-700 bg-gray-50 dark:bg-slate-800">
            <p className="text-sm text-[#5e788d] dark:text-slate-400">Hiển thị {transactions.length} giao dịch gần nhất</p>
          </div>
        </div>

      </div>

      {/* MODAL THÊM GIAO DỊCH */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={() => fetchData(searchTerm)}
      />
    </div>
  );
};

// --- Sub-Components ---

const MetricCard = ({ title, amount, subtext, icon, color, trend, percent, infoIcon }) => {
  const colors = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    danger: "bg-danger/10 text-danger"
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-[#1e293b] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center size-12 rounded-full ${colors[color]}`}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <p className="text-[#5e788d] dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
        </div>
        {percent && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${colors[color]}`}>
            <span className="material-symbols-outlined text-sm">
              {trend === 'up' ? 'trending_up' : 'trending_down'}
            </span>
            {percent}
          </div>
        )}
      </div>
      <div>
        <p className="text-[#101518] dark:text-white text-3xl font-bold leading-tight">
          {amount} <span className="text-lg text-[#5e788d] dark:text-slate-500 font-normal">VND</span>
        </p>
        <p className="text-[#5e788d] dark:text-slate-400 text-sm mt-2 flex items-center gap-1">
          {infoIcon && <span className="material-symbols-outlined text-sm">{infoIcon}</span>}
          {subtext}
        </p>
      </div>
    </div>
  );
};

const Th = ({ children, width }) => (
  <th className={`px-6 py-4 text-xs font-semibold text-[#5e788d] dark:text-slate-400 uppercase tracking-wider ${width}`}>
    {children}
  </th>
);

export default FinancialManager;