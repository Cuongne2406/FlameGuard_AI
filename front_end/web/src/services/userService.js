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

  getDevices: async () => {
    try {
      return await apiClient('/users/me/devices');
    } catch (error) {
      console.error('Error fetching devices:', error);
      return [];
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
  }
};
