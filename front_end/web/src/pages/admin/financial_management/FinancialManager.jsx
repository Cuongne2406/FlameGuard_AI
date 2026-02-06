import React from 'react';

const FinancialManager = () => {
  // Mock Data: Dữ liệu giao dịch
  const transactions = [
    {
      id: 1,
      content: "Thu hội phí Đoàn viên",
      subtext: "HK1 - Năm học 2023-2024",
      date: "10/10/2023",
      time: "09:30 AM",
      amount: "+500.000 VND",
      type: "income", // income hoặc expense
      approver: "Nguyễn Văn A",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAoCzUItV-XoxKpQkV_zSbhmxu3VdxeKOMLh3R4lAxOXEMV-cLAmhFfqRGbUfsbT_ZCidfBsm-Mj3IGjaiW5_TUY4g7cK3vgo9dSUbsurVqkhAhJWOsLUC_dpuuBKNbkq9aGBrcXf0ul1kXiQgKT68jYYYsWskBPd3fjPCwZZ5DKKg-l3eJEXx4zh73YAqoKRYWhH3MbmH0113WGfODHYD4sxk-ceDQHmGaW53BElzwCpPXwgLiOyYaIbs7EPeZtTyidMqk2lfVNorj')",
      icon: "assignment_turned_in"
    },
    {
      id: 2,
      content: "Chi phí in ấn poster",
      subtext: "Sự kiện Chào Tân Sinh Viên",
      date: "09/10/2023",
      time: "02:15 PM",
      amount: "-200.000 VND",
      type: "expense",
      approver: "Trần Thị B",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAW8cRtIVwR08qNx7GUKZJz0KN1YWD-QFrGfg389ncp-EGdzMP2kAclYh1RBgtJG9dn83gRExY4fVqkG4eDW-vU4YPcti6VfK2fJOI-8Yl3-oUaBJjdTUJmtp_VSXY4SFH0zdhWLU7pfwb-iTb7hNpZ03-HbjBSSBUTCxEVmUpLhItqcRkP513xjKlK3JmMcceiA7Z7KQbGVvKEMrGVOGQ-d9i1lLyjOHFdSOFQedDLKskixoVvqopd555IttFecwcHiUCGOjAcVPf_')",
      icon: "print"
    },
    {
      id: 3,
      content: "Tài trợ doanh nghiệp",
      subtext: "Công ty ABC tài trợ Học bổng",
      date: "08/10/2023",
      time: "10:00 AM",
      amount: "+2.000.000 VND",
      type: "income",
      approver: "Lê Văn C",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDjBsu7O7onSZMZrBO_9f6J6ZohVcuU9Xjxjzib2XvSCKQFmUOg7oIxfYMw2sjVY4g1UnqRwCEnFsNzZnOt2KrFj98FVEDegqVigmNmRXf3gtgbukARCH6Qqywtjdl0kE6oAb38HgeIMTJiYQXWhnW_6cR9ACoGhVvmER1hKH8gXM999q-4-NKHXN4ka7f0U6_wa58Dbh5txVI4eiW3xat-Na-umCCoKUdYQw37t_04l4c4dIgh_PeAZVoOCMJ3Com2wC-WtVQLX1Bj')",
      icon: "corporate_fare"
    },
    {
      id: 4,
      content: "Mua văn phòng phẩm",
      subtext: "Bút, giấy A4 cho VP Đoàn",
      date: "05/10/2023",
      time: "04:45 PM",
      amount: "-150.000 VND",
      type: "expense",
      approver: "Phạm Thị D",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPYrOkfwo5bbvwKhhhRX_127dKBcLdLocuh3rupOSNkWmdztqnTik7PG_gGURDEFci6YjjlbltXwzZB47SyQPC_32G7ryOATATMcyOQJJ_61gGjrORfVrG51Pg-T1LbSscrnSFwnOpclgyVUn4gAU5BCA2oeIDIa8Qs8Dr6qHE4BmS3piYnRiJBSkWw0VritNKqvy7TnVQr2lq1OUu3WyCKR0TLp_wsD2kgRXsNRFsuokYorWag4Bcnc5RrUayy5rEUCy3HuVfdpPf')",
      icon: "shopping_bag"
    },
    {
      id: 5,
      content: "Hỗ trợ sinh viên nghèo",
      subtext: "Quỹ Tấm Lòng Vàng",
      date: "01/10/2023",
      time: "08:00 AM",
      amount: "-1.000.000 VND",
      type: "expense",
      approver: "Nguyễn Văn A",
      avatar: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnc6cvrbkZtkCjeDVEfk2ZBki_yYjOYc_dQSCgc_ssimMe10LkAiM9bxbJaeZuTOSUldAePJ1R-GXM0ThiU_oYOflzxc9qFPzfqNMm3NgwtkOm0uv7pQYCBlULiyFaxW7yuSOGZIpns72muiAMYLS7w1iVKJNZFWDLfshY0zx08-sr1q8wJlJRzXevMM9nW3LRhWLEpA0watXIbfd0mIfOJ05dmqhr03Puw_KymPGwAYA4h8iaGsfwOto6wgzmk5Sb7MZmEj3D2hD1')",
      icon: "volunteer_activism"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F4F7FA] dark:bg-background-dark p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
        
        {/* --- METRIC CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="Tổng Quỹ Đoàn" 
            amount="150.000.000" 
            subtext="Cập nhật: 10 phút trước" 
            icon="account_balance" 
            color="primary" 
            infoIcon="info"
          />
          <MetricCard 
            title="Đã Thu (Tháng 10)" 
            amount="45.000.000" 
            subtext="So với tháng trước" 
            icon="payments" 
            color="success" 
            trend="up" 
            percent="12%"
          />
          <MetricCard 
            title="Đã Chi (Tháng 10)" 
            amount="12.500.000" 
            subtext="Trong giới hạn ngân sách" 
            icon="shopping_cart_checkout" 
            color="danger" 
            trend="down" 
            percent="5%"
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#dae1e7] dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-[#101518] dark:text-white placeholder:text-[#5e788d] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" 
                  placeholder="Tìm kiếm giao dịch theo nội dung..." 
                  type="text"
                />
              </div>
              {/* Date Filter */}
              <div className="relative min-w-[160px]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#5e788d]">
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                </div>
                <input 
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#dae1e7] dark:border-gray-600 bg-white dark:bg-slate-800 text-[#101518] dark:text-white placeholder:text-[#5e788d] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" 
                  placeholder="Tháng 10, 2023" 
                  type="text"
                />
              </div>
            </div>
            <button className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg bg-[#FFAB00] hover:bg-[#e69a00] text-white text-sm font-bold shadow-sm transition-all active:scale-95">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Xuất Báo Cáo
            </button>
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
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                          tx.type === 'income' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'
                        }`}>
                          <span className="material-symbols-outlined text-[20px]">{tx.icon}</span>
                        </div>
                        <div>
                          <p className="text-[#101518] dark:text-white text-sm font-medium">{tx.content}</p>
                          <p className="text-[#5e788d] dark:text-slate-400 text-xs">{tx.subtext}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#101518] dark:text-white text-sm">{tx.date}</p>
                      <p className="text-[#5e788d] dark:text-slate-400 text-xs">{tx.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold text-sm ${
                        tx.type === 'income' ? 'text-success' : 'text-danger'
                      }`}>
                        {tx.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="size-8 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-600" 
                          style={{ backgroundImage: tx.avatar }}
                        ></div>
                        <span className="text-sm font-medium text-[#101518] dark:text-white">{tx.approver}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-[#dae1e7] dark:border-gray-700 bg-gray-50 dark:bg-slate-800">
            <p className="text-sm text-[#5e788d] dark:text-slate-400">Hiển thị 1-5 trên 24 giao dịch</p>
            <div className="flex items-center gap-2">
              <PaginationBtn icon="chevron_left" disabled />
              <PaginationBtn text="1" active />
              <PaginationBtn text="2" />
              <PaginationBtn text="3" />
              <PaginationBtn icon="chevron_right" />
            </div>
          </div>
        </div>

      </div>
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

const PaginationBtn = ({ text, icon, active, disabled }) => {
  const baseClass = "size-8 flex items-center justify-center rounded text-sm transition-colors";
  const activeClass = "bg-primary text-white font-medium";
  const normalClass = "border border-[#dae1e7] dark:border-gray-600 bg-white dark:bg-slate-700 text-[#5e788d] dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 font-medium";
  const disabledClass = "border border-[#dae1e7] dark:border-gray-600 bg-white dark:bg-slate-800 text-[#5e788d]/50 dark:text-slate-500 cursor-not-allowed";

  return (
    <button className={`${baseClass} ${active ? activeClass : disabled ? disabledClass : normalClass}`} disabled={disabled}>
      {icon ? <span className="material-symbols-outlined text-sm">{icon}</span> : text}
    </button>
  );
};

export default FinancialManager;