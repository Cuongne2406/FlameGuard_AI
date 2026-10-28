import { apiClient } from './apiClient';

export const awardService = {
  // ==========================================
  // Periods (Đợt khen thưởng)
  // ==========================================
  getPeriods: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.status && params.status !== 'ALL') query.append('status', params.status);
      if (params.year) query.append('year', params.year);
      if (params.keyword) query.append('keyword', params.keyword);
      if (params.skip !== undefined) query.append('skip', params.skip);
      if (params.limit !== undefined) query.append('limit', params.limit);
      
      const queryString = query.toString();
      const endpoint = `/awards/periods${queryString ? `?${queryString}` : ''}`;
      const res = await apiClient(endpoint);
      return Array.isArray(res) ? res : [];
    } catch (error) {
      console.error('Error fetching periods:', error);
      return [];
    }
  },

  getPeriodDetail: async (id) => {
    return await apiClient(`/awards/periods/${id}`);
  },

  createPeriod: async (data) => {
    return await apiClient('/awards/periods', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updatePeriod: async (id, data) => {
    return await apiClient(`/awards/periods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deletePeriod: async (id) => {
    return await apiClient(`/awards/periods/${id}`, {
      method: 'DELETE'
    });
  },

  // ==========================================
  // Standards (Tiêu chuẩn 5 Tốt)
  // ==========================================
  getStandards: async (periodId) => {
    try {
      const res = await apiClient(`/awards/periods/${periodId}/standards`);
      return Array.isArray(res) ? res : [];
    } catch (error) {
      console.error('Error fetching standards:', error);
      return [];
    }
  },

  createStandard: async (periodId, data) => {
    return await apiClient(`/awards/periods/${periodId}/standards`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateStandard: async (standardId, data) => {
    return await apiClient(`/awards/standards/${standardId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deleteStandard: async (standardId) => {
    return await apiClient(`/awards/standards/${standardId}`, {
      method: 'DELETE'
    });
  },

  // ==========================================
  // Applications (Hồ sơ xét chọn SV5T)
  // ==========================================
  getApplications: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.period_id) query.append('period_id', params.period_id);
      if (params.status && params.status !== 'ALL') query.append('status', params.status);
      if (params.year) query.append('year', params.year);
      if (params.target_type && params.target_type !== 'ALL') query.append('target_type', params.target_type);
      if (params.organization_id) query.append('organization_id', params.organization_id);
      if (params.keyword) query.append('keyword', params.keyword);
      if (params.skip !== undefined) query.append('skip', params.skip);
      if (params.limit !== undefined) query.append('limit', params.limit);

      const queryString = query.toString();
      const endpoint = `/awards/applications${queryString ? `?${queryString}` : ''}`;
      const res = await apiClient(endpoint);
      return Array.isArray(res) ? res : [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  },

  getApplicationDetail: async (id) => {
    return await apiClient(`/awards/applications/${id}`);
  },

  createApplication: async (data) => {
    return await apiClient('/awards/applications', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateApplication: async (id, data) => {
    return await apiClient(`/awards/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  submitApplication: async (id) => {
    return await apiClient(`/awards/applications/${id}/submit`, {
      method: 'POST'
    });
  },

  evaluateApplication: async (id, data) => {
    return await apiClient(`/awards/applications/${id}/evaluate`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  concludeApplication: async (id, data) => {
    return await apiClient(`/awards/applications/${id}/conclude`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  decisionApplication: async (id, data) => {
    return await apiClient(`/awards/applications/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  feedbackApplication: async (id, data) => {
    return await apiClient(`/awards/applications/${id}/feedback`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // ==========================================
  // Approval Histories & Dashboard Thống kê
  // ==========================================
  getHistories: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.period_id) query.append('period_id', params.period_id);
      if (params.actor_id) query.append('actor_id', params.actor_id);
      if (params.action && params.action !== 'ALL') query.append('action', params.action);
      if (params.status && params.status !== 'ALL') query.append('status', params.status);
      if (params.skip !== undefined) query.append('skip', params.skip);
      if (params.limit !== undefined) query.append('limit', params.limit);

      const queryString = query.toString();
      const endpoint = `/awards/histories${queryString ? `?${queryString}` : ''}`;
      const res = await apiClient(endpoint);
      return Array.isArray(res) ? res : [];
    } catch (error) {
      console.error('Error fetching histories:', error);
      return [];
    }
  },

  getSV5TDashboard: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.period_id) query.append('period_id', params.period_id);
      if (params.year) query.append('year', params.year);
      const queryString = query.toString();
      const endpoint = `/awards/sv5t-dashboard${queryString ? `?${queryString}` : ''}`;
      return await apiClient(endpoint);
    } catch (error) {
      console.error('Error fetching SV5T dashboard:', error);
      return {
        total_applications: 0,
        party_members_count: 0,
        union_members_count: 0,
        passed_count: 0,
        failed_count: 0,
        reviewing_count: 0,
        by_period: [],
        party_union_ratio: [],
        by_academic_year: [],
        by_education_level: []
      };
    }
  },

  uploadEvidenceFile: async (file) => {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/digital-documents/upload-file`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Tải file minh chứng thất bại');
    }
    const data = await res.json();
    return {
      name: file.name,
      url: data.file_url
    };
  },

  // ==========================================
  // Legacy APIs (Backward Compatibility)
  // ==========================================
  getAwardsList: async (timescale) => {
    try {
      const res = await apiClient('/awards');
      return Array.isArray(res) ? res : [];
    } catch { return []; }
  },
  
  getAwardStats: async (timescale = 'Tháng này') => {
    try {
      return await apiClient(`/awards/stats?timescale=${timescale}`);
    } catch {
      return {
        summary: { remainingDays: '0', submitted: '0', approved: '0', passRate: '0%' },
        stats: [],
        rankings: [],
        warningClass: null
      };
    }
  },

  getLeaderboard: async () => {
    try {
      const res = await apiClient('/awards/leaderboard');
      return Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  },

  updateAwardAssessment: async (studentId, data) => {
    return apiClient(`/awards/${studentId}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  createAward: async (data) => {
    return apiClient('/awards', { method: 'POST', body: JSON.stringify(data) });
  }
};
