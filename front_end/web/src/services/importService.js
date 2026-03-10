import { apiClient } from './apiClient';

export const importService = {
  importWard: (data) => apiClient('/imports/ward', { method: 'POST', body: JSON.stringify(data) }),
  importUser: (data) => apiClient('/imports/user', { method: 'POST', body: JSON.stringify(data) }),
  importProvince: (data) => apiClient('/imports/province', { method: 'POST', body: JSON.stringify(data) }),
  importDistrict: (data) => apiClient('/imports/district', { method: 'POST', body: JSON.stringify(data) }),
};
