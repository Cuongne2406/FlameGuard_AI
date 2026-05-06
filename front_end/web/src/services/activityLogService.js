import { apiClient } from './apiClient';

export const activityLogService = {
  getLogs: async (filters = {}) => {
    try {
      const query = new URLSearchParams();
      if (filters.skip !== undefined) query.append('skip', filters.skip);
      if (filters.limit !== undefined) query.append('limit', filters.limit);
      if (filters.date_from) query.append('date_from', filters.date_from);
      if (filters.date_to) query.append('date_to', filters.date_to);
      if (filters.role && filters.role !== "Tất cả vai trò") query.append('role', filters.role);

      const queryString = query.toString() ? `?${query.toString()}` : '';
      return await apiClient(`/audit-logs${queryString}`);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return { items: [], total: 0 };
    }
  },

  exportLogs: async (filters = {}) => {
    try {
      const query = new URLSearchParams();
      if (filters.date_from) query.append('date_from', filters.date_from);
      if (filters.date_to) query.append('date_to', filters.date_to);
      if (filters.role && filters.role !== "Tất cả vai trò") query.append('role', filters.role);

      const queryString = query.toString() ? `?${query.toString()}` : '';

      const token = localStorage.getItem('accessToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.10.35:8000/api/v1';

      const response = await fetch(`${API_URL}/audit-logs/export${queryString}`, {
        method: 'GET',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Audit_Logs_Report_${new Date().getTime()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      return true;
    } catch (error) {
      console.error('Error exporting activity logs:', error);
      return false;
    }
  }
};
