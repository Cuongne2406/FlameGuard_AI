import { apiClient } from './apiClient';

export const awardService = {
  getAwardsList: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.award_name) query.set('award_name', params.award_name);
      const suffix = query.toString() ? `?${query.toString()}` : '';
      const res = await apiClient(`/awards${suffix}`);
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },
  
  getAwardStats: async (timescale = 'all', params = {}) => {
    try {
      const query = new URLSearchParams({ timescale });
      if (params.award_name) query.set('award_name', params.award_name);
      return await apiClient(`/awards/stats?${query.toString()}`);
    } catch {
      return {
        summary: { remainingDays: '0', submitted: '0', approved: '0', passRate: '0%' },
        stats: [],
        rankings: [],
        warningClass: null
      };
    }
  },

  updateAwardAssessment: async (studentId, data) => {
    return apiClient(`/awards/${studentId}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  createAward: async (data) => {
    return apiClient('/awards', { method: 'POST', body: JSON.stringify(data) });
  },

  getCurrentCampaignConfig: async () => {
    return apiClient('/awards/config/current');
  },

  updateCurrentCampaignConfig: async (data) => {
    return apiClient('/awards/config/current', { method: 'PUT', body: JSON.stringify(data) });
  },

  getCampaignHistory: async (limit = 20) => {
    return apiClient(`/awards/config/history?limit=${limit}`);
  },
};
