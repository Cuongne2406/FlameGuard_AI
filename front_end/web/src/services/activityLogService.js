import { apiClient } from './apiClient';

export const activityLogService = {
  getLogs: async (filters = {}) => {
    try {
      const query = new URLSearchParams();
      if (filters.skip !== undefined) query.append('skip', filters.skip);
      if (filters.limit !== undefined) query.append('limit', filters.limit);
      
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return await apiClient(`/audit-logs${queryString}`);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return { items: [], total: 0 };
    }
  }
};
