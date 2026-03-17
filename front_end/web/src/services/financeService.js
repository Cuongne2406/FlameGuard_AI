import { apiClient } from './apiClient';

export const financeService = {
  getAssets: async () => {
    try {
      const res = await apiClient('/assets');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },

  getTransactions: async () => {
    try {
      const res = await apiClient('/users/me/wallet_transactions');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },
  
  getBudgetStats: async () => {
     try {
       return await apiClient('/budgets/stats');
     } catch { return { totalIncome: 0, totalExpense: 0 }; }
  },

  getFacultyTransactions: async () => {
    try {
      const res = await apiClient('/fund-requests');
      return Array.isArray(res) ? res.map(item => ({
        id: item.id, type: 'Chi', title: item.title || 'Chi hoạt động', 
        detail: item.description || '', user: item.requested_by, 
        amount: item.amount, status: item.status, statusColor: 'orange', 
        icon: 'pending_actions', color: 'orange'
      })) : [];
    } catch { return []; }
  },

  approveFacultyTransaction: async (id) => {
    return apiClient(`/fund-requests/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify({ status: 'APPROVED' }) 
    });
  },

  createFacultyTransaction: async (data) => {
    return apiClient('/fund-requests', { method: 'POST', body: JSON.stringify(data) });
  },

  getBudgets: async () => {
    try {
      const res = await apiClient('/budgets');
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
