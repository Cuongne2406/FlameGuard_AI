import { apiClient } from './apiClient';

export const activityLogService = {
  getLogs: async (filters = {}) => {
    try {
      return await apiClient('/admin/activity-log', { params: filters });
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }
  }
};
