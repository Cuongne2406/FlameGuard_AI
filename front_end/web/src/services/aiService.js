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
  }
};
