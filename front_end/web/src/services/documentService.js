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

  uploadFile: async (file) => {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://192.168.10.51:8000/api/v1'}/digital-documents/upload-file`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Upload thất bại');
    }
    return res.json();
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
