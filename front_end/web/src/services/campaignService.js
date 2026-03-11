import { apiClient } from './apiClient';

export const campaignService = {
  getCampaigns: async () => {
    try {
      const campaigns = await apiClient('/campaigns');
      return Array.isArray(campaigns) ? campaigns : [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  },

  createCampaign: (data) => apiClient('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  updateCampaign: (id, data) => apiClient(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCampaign: (id) => apiClient(`/campaigns/${id}`, { method: 'DELETE' }),
};
