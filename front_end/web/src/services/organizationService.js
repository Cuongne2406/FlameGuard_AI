import { apiClient } from './apiClient';

export const organizationService = {
  // Fetch all organizations, can filter by type (e.g. 'CLASS', 'CLUB')
  getOrganizations: async (type = null) => {
    try {
      const orgs = await apiClient('/organizations/');
      if (type && Array.isArray(orgs)) {
         return orgs.filter(o => o.type === type);
      }
      return Array.isArray(orgs) ? orgs : [];
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  },

  createOrganization: (data) => apiClient('/organizations/', { method: 'POST', body: JSON.stringify(data) }),
  updateOrganization: (id, data) => apiClient(`/organizations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOrganization: (id) => apiClient(`/organizations/${id}`, { method: 'DELETE' }),
  assignMember: (data) => apiClient('/organizations/assign-member', { method: 'POST', body: JSON.stringify(data) }),
  getOrgStats: async () => {
    try {
      return await apiClient('/organizations/stats');
    } catch {
      return { totalUnits: 0, totalLeaders: 0, totalMembers: 0, subInfo: '' };
    }
  },

  // Clubs detailed
  getClubsDetailed: () => apiClient('/organizations/clubs'),
  getClassesDetailed: () => apiClient('/organizations/classes'),
  getClubsStats: () => apiClient('/organizations/clubs/stats'),
  getClubProposals: () => apiClient('/organizations/clubs/proposals'),
  approveClubProposal: (id) => apiClient(`/organizations/clubs/proposals/${id}/approve`, { method: 'PUT' }),
  getOrganizationMembers: (id) => apiClient(`/organizations/${id}/members`),
};
