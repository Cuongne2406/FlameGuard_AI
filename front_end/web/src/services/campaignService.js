import { apiClient } from './apiClient';

export const campaignService = {
  getCampaigns: async () => {
    try {
      const campaigns = await apiClient('/campaigns');
      if (!Array.isArray(campaigns)) return [];
      
      return campaigns.map(camp => ({
        id: camp.id,
        name: camp.name,
        unit: camp.organization_name || "Đoàn trường",
        unitId: camp.organization_id,
        termId: camp.academic_term_id,
        termName: camp.academic_term_name,
        budget: `${camp.total_budget_allocated}tr`,
        progress: camp.status === 'COMPLETED' ? 100 : (camp.status === 'ONGOING' ? 50 : 0),
        status: camp.status === 'ONGOING' ? 'RUNNING' : camp.status,
        time: `${camp.start_date || "?"} - ${camp.end_date || "?"}`,
        start_date: camp.start_date,
        end_date: camp.end_date,
        subActivities: [] // Sẽ fetch event sau nếu cần
      }));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  },

  createCampaign: (data) => apiClient('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  updateCampaign: (id, data) => apiClient(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCampaign: (id) => apiClient(`/campaigns/${id}`, { method: 'DELETE' }),
};
