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
        summary: { remainingDays: '0', submitted: '0', approved: '0', passRate: '0%' },
        stats: [],
        rankings: [],
        warningClass: null
      };
    }
  },

  getLeaderboard: async () => {
    try {
      const res = await apiClient('/awards/leaderboard');
      return Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  },

  updateAwardAssessment: async (studentId, data) => {
    return apiClient(`/awards/${studentId}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  createAward: async (data) => {
    return apiClient('/awards', { method: 'POST', body: JSON.stringify(data) });
  }
};
