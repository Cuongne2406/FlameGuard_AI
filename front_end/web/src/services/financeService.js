import { apiClient } from './apiClient';

export const financeService = {
  // Thống kê dashboard tài chính
  getBudgetStats: async () => {
     try {
       return await apiClient('/finance/stats');
     } catch { 
       return { totalFund: 0, totalIncome: 0, totalExpense: 0, remaining: 0 }; 
     }
  },

  // Lịch sử giao dịch (Thu/Chi)
  getFacultyTransactions: async () => {
    try {
      const res = await apiClient('/finance/transactions');
      return Array.isArray(res) ? res.map(item => ({
        id: item.id, 
        type: item.type === 'INCOME' ? 'Thu' : 'Chi', 
        title: item.title, 
        detail: item.description || '', 
        user: item.performed_by_name || 'Hệ thống', 
        amount: `${item.type === 'INCOME' ? '+' : '-'}${parseFloat(item.amount).toLocaleString()}`, 
        status: item.status === 'COMPLETED' ? 'Đã thanh toán' : (item.status === 'PENDING' ? 'Chờ duyệt' : 'Đã hủy'), 
        statusColor: item.status === 'COMPLETED' ? 'emerald' : (item.status === 'PENDING' ? 'orange' : 'rose'), 
        icon: item.type === 'INCOME' ? 'payments' : 'shopping_bag', 
        color: item.type === 'INCOME' ? 'emerald' : 'rose',
        actionRequired: item.status === 'PENDING'
      })) : [];
    } catch { return []; }
  },

  // Lập phiếu Thu/Chi mới
  createFacultyTransaction: async (data) => {
    // Tìm budget_id phù hợp - ở đây ta giả định lấy budget đầu tiên hoặc có logic chọn
    const budgets = await financeService.getBudgets();
    if (budgets.length === 0) throw new Error("Không tìm thấy quỹ dự toán");

    const payload = {
        budget_id: budgets[0].id,
        type: data.type === 'Thu' ? 'INCOME' : 'EXPENSE',
        title: data.title,
        amount: parseFloat(data.amount.replace(/[^0-9.-]+/g,"")),
        description: data.detail,
        performed_by_name: data.user,
        status: data.type === 'Thu' ? 'COMPLETED' : 'PENDING'
    };

    return apiClient('/finance/transactions', { 
        method: 'POST', 
        body: JSON.stringify(payload) 
    });
  },

  // Duyệt phiếu chi
  approveFacultyTransaction: async (id) => {
    return apiClient(`/finance/transactions/${id}/approve`, { 
      method: 'PUT'
    });
  },

  getBudgets: async () => {
    try {
      const res = await apiClient('/budgets');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },

  getAssets: async () => {
    try {
      const res = await apiClient('/assets');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },

  createAsset: async (data) => {
    return apiClient('/assets', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
