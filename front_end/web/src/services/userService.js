import { apiClient } from './apiClient';

export const userService = {
  getAllUsers: (params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient(`/users${query}`, { method: 'GET' });
  },
  getUser: (id) => apiClient(`/users/${id}`, { method: 'GET' }),
  getMe: () => apiClient('/users/me', { method: 'GET' }),
  getProfileStats: () => apiClient('/users/me/profile_stats', { method: 'GET' }),
  createUser: (data) => apiClient('/users/create', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => apiClient(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data) => apiClient('/users/changePassword', { method: 'POST', body: JSON.stringify(data) }),
  verifyEmail: (data) => apiClient('/users/verifyEmail', { method: 'POST', body: JSON.stringify(data) }),
  verifyEmailConfirm: (data) => apiClient('/users/verifyEmail/confirm', { method: 'POST', body: JSON.stringify(data) }),
  importUsers: (data) => apiClient('/users/import', { method: 'POST', body: JSON.stringify(data) }), // Note: this might need FormData depending on backend implementation
  enableUser: (data) => apiClient('/users/enabled', { method: 'POST', body: JSON.stringify(data) }),
};
