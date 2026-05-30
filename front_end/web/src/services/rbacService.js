import { apiClient } from './apiClient';

export const rbacService = {
  getRoles: async () => {
    try {
      return await apiClient('/roles');
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },
  getPermissions: async () => {
    try {
      return await apiClient('/permissions');
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  },
  updateRole: async (id, data) => {
    return apiClient(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  createRole: async (data) => {
    return apiClient('/roles', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  deleteRole: async (id) => {
    return apiClient(`/roles/${id}`, {
      method: 'DELETE'
    });
  }
};
