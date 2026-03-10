import { apiClient } from './apiClient';

export const studentService = {
  getAllStudents: (params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient(`/students/${query}`, { method: 'GET' });
  },
  getStudent: (id) => apiClient(`/students/${id}`, { method: 'GET' }),
};
