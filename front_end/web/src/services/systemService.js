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
  },

  getSettings: async () => {
    try {
      const res = await apiClient('/settings');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },

  updateSetting: async (id, data) => {
    return apiClient(`/settings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  updateSettingsBatch: async (settings) => {
    return apiClient('/settings/batch/update', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  createSetting: async (data) => {
    return apiClient('/settings/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getAcademicTerms: async () => {
    try {
      const res = await apiClient('/academic-terms');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },

  uploadSystemLogo: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient('/settings/logo', {
      method: 'POST',
      body: formData
    });
  }
};
