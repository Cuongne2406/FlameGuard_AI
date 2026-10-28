import { apiClient } from './apiClient';

export const publicService = {
  getHomeData: async () => {
    try {
      return await apiClient('/public/home');
    } catch (error) {
      console.error('Error fetching public home data:', error);
      return null;
    }
  },

  getActivities: async () => {
    try {
      return await apiClient('/public/activities');
    } catch (error) {
      console.error('Error fetching public activities:', error);
      return [];
    }
  },

  getAcademicDocs: async () => {
    try {
      return await apiClient('/public/academic');
    } catch (error) {
       console.error('Error fetching academic docs:', error);
       return [];
    }
  },

  getNews: async () => {
    try {
      return await apiClient('/public/news');
    } catch (error) {
       console.error('Error fetching news:', error);
       return [];
    }
  },

  getNewsDetail: async (id) => {
    try {
      return await apiClient(`/public/news/${id}`);
    } catch (error) {
      console.error('Error fetching news detail:', error);
      return null;
    }
  },

  submitContact: async (contactData) => {
    return await apiClient('/public/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  }
};
