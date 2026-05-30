import { apiClient } from './apiClient';

export const notificationService = {
  getNotifications: (params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient(`/notifications/me${query}`, { method: 'GET' });
  },
  
  markAsRead: (id) => apiClient(`/notifications/${id}/read`, { method: 'PUT' }),
  
  markAllAsRead: () => apiClient('/notifications/read-all', { method: 'POST' }),

  // Helper to send common system notifications (if needed by frontend directly)
  sendSystemNotification: (userId, title, message) => apiClient('/notifications/', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, title, message })
  })
};
