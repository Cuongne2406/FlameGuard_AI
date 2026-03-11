import { apiClient } from './apiClient';

export const awardService = {
  getAwardsList: async (timescale) => {
    try {
      const res = await apiClient('/awards');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },
  
  getAwardStats: async (timescale) => {
    try {
      return await apiClient(`/awards/stats?timescale=${timescale}`);
    } catch {
      return {
        stats: [],
        rankings: [],
        warningClass: null
      };
    }
  },

  updateAwardAssessment: async (studentId, data) => {
    return apiClient(`/awards/${studentId}`, { method: 'PUT', body: JSON.stringify(data) });
  }
};
