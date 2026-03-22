import { apiClient } from './apiClient';

export const documentService = {
  getRequests: async () => {
    try {
      const res = await apiClient('/digital-documents/');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },
  
  createRequest: async (data) => {
    return apiClient('/digital-documents/', { 
      method: 'POST', 
      body: JSON.stringify(data)
    });
  },

  getDocuments: async () => {
    try {
      const res = await apiClient('/digital-documents/');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },

  getStats: async () => {
    try {
      return await apiClient('/digital-documents/stats');
    } catch {
      return { incoming: 0, outgoing: 0, pending: 0 };
    }
  },

  updateDocument: async (id, data) => {
    return apiClient(`/digital-documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deleteDocument: async (id) => {
    return apiClient(`/digital-documents/${id}`, {
      method: 'DELETE'
    });
  }
};
