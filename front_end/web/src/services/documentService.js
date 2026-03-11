import { apiClient } from './apiClient';

export const documentService = {
  getRequests: async () => {
    try {
      const res = await apiClient('/digital-documents');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },
  
  createRequest: async (type) => {
    return apiClient('/digital-documents', { 
      method: 'POST', 
      body: JSON.stringify({ document_type: type })
    });
  },

  getDocuments: async () => {
    try {
      const res = await apiClient('/digital-documents');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  }
};
