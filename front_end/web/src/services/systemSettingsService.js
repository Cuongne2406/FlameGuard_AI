import { apiClient } from './apiClient';

export const systemSettingsService = {
  getSettings: async () => {
    try {
      const settings = await apiClient('/settings');
      // If backend returns an array of settings, we might need to parse it, 
      // but returning empty object if not found. Let the API handle merging or parsing based on response.
      return settings || {};
    } catch (error) {
      console.error('Error fetching system settings:', error);
      return { general: {}, security: {} };
    }
  },

  updateSettings: (data) => apiClient('/settings', { method: 'PUT', body: JSON.stringify(data) })
};
