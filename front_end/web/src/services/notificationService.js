import { apiClient } from './apiClient';

export const notificationService = {
  getNotifications: async () => {
    try {
      const res = await apiClient('/notifications');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },
  
  markAsRead: async (id) => {
    return apiClient(`/notifications/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify({ is_read: true }) 
    });
  },

  createNotification: async (data) => {
    return apiClient('/notifications', { method: 'POST', body: JSON.stringify(data) });
  }
};
