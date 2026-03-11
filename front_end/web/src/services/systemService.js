import { apiClient } from './apiClient';

export const systemService = {
  getSystemDashboard: async ({ year, semester } = {}) => {
    try {
      const query = new URLSearchParams();
      if (year) query.append('year', year);
      if (semester) query.append('semester', semester);
      const url = `/system/dashboard${query.toString() ? `?${query.toString()}` : ''}`;
      
      const res = await apiClient(url);
      return res || {
        stats: {},
        timelines: [],
        risks: [],
        aiSentiment: [],
        aiKeywords: []
      };
    } catch (err) {
      console.error('Error fetching system dashboard:', err);
      return {
        stats: {},
        timelines: [],
        risks: [],
        aiSentiment: [],
        aiKeywords: []
      };
    }
  }
};
