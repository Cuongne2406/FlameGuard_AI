import { apiClient } from './apiClient';

export const authService = {
  login: (data) => {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    return apiClient('/auth/login', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString() 
    });
  },
  register: (data) => apiClient('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  refresh: (data) => apiClient('/auth/refresh', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => apiClient('/auth/logout', { method: 'POST' }),
  logoutAllDevices: () => apiClient('/auth/logoutAllDevices', { method: 'POST' }),
  resetPassword: (email) => apiClient('/auth/resetPassword', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPasswordConfirm: (data) => apiClient('/auth/resetPassword/confirm', { method: 'POST', body: JSON.stringify(data) }),
  test: () => apiClient('/auth/test', { method: 'GET' }),
};
