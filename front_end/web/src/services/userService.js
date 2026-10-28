import { apiClient } from './apiClient';

export const userService = {
  getMe: async () => {
    try {
      return await apiClient('/users/me');
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  updateMe: async (userData) => {
    try {
      return await apiClient('/users/me', {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      return await apiClient('/users/me/avatar', {
        method: 'POST',
        body: formData,
        // Let the browser set the Content-Type with boundary for FormData
        headers: {} 
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  getDevices: async () => {
    try {
      return await apiClient('/users/me/devices');
    } catch (error) {
      console.error('Error fetching devices:', error);
      return [];
    }
  },

  logoutAllDevices: async () => {
    try {
      return await apiClient('/users/me/devices', { method: 'DELETE' });
    } catch (error) {
      console.error('Error logging out all devices:', error);
      throw error;
    }
  },

  logoutDevice: async (deviceId) => {
    try {
      return await apiClient(`/users/me/devices/${deviceId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error logging out device:', error);
      throw error;
    }
  },

  getTeam: async () => {
    try {
      return await apiClient('/users/me/team');
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  },

  searchUsers: async (q) => {
    try {
      if (!q) return [];
      return await apiClient(`/users/search?q=${encodeURIComponent(q)}`);
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  addTeamMember: async (data) => {
    try {
      return await apiClient('/users/me/team', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  },

  removeTeamMember: async (id) => {
    try {
      return await apiClient(`/users/me/team/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  },

  updateTeamPermissions: async (id, permissions) => {
    try {
      return await apiClient(`/users/me/team/${id}/permissions`, {
        method: 'PUT',
        body: JSON.stringify(permissions)
      });
    } catch (error) {
      console.error('Error updating permissions:', error);
      throw error;
    }
  },

  getProfileStats: async () => {
    try {
      return await apiClient('/users/me/profile_stats');
    } catch (error) {
      console.error('Error fetching profile stats:', error);
      return { skills: [], recent_certificates: [], experiences: [] };
    }
  },

  getObligations: async () => {
    try {
      return await apiClient('/users/me/obligations');
    } catch (error) {
      console.error('Error fetching obligations:', error);
      return [];
    }
  },

  getSpendingStats: async () => {
    try {
      return await apiClient('/users/me/spending_stats');
    } catch (error) {
      console.error('Error fetching spending stats:', error);
      return { total_expense: 0, data: [] };
    }
  },

  getAllUsers: async () => {
    try {
      const res = await apiClient('/users');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },

  createUser: async (userData) => {
    return apiClient('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  updateUser: async (id, userData) => {
    return apiClient(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  changePassword: async (passwordData) => {
    return apiClient('/users/me/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });
  }
};
