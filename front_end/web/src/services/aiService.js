import { apiClient } from './apiClient';

export const aiService = {
  getSubAdminAnalysis: async () => {
    try {
      const res = await apiClient('/ai-sentiments/sub-admin');
      return res || null;
    } catch (error) {
      console.error('Error fetching sub-admin AI analysis:', error);
      return null;
    }
  },

  getAdminAnalysis: async () => {
    try {
      const res = await apiClient('/ai-sentiments/admin');
      return res || null;
    } catch (error) {
      console.error('Error fetching admin AI analysis:', error);
      return null;
    }
  },

  getAudits: async () => {
    try {
      const res = await apiClient('/ai-audits/');
      return Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  },

  updateAuditAction: async (id, action_taken) => {
    return apiClient(`/ai-audits/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ action_taken })
    });
  }
};
