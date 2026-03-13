import { apiClient } from './apiClient';

export const chatbotService = {
  getHistory: async () => {
    return new Promise((resolve) => resolve([]));
  },
  sendMessage: async (message) => {
    try {
      return await apiClient('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) });
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      return { success: false, response: "Xin lỗi, hiện tại hệ thống AI đang bận. Vui lòng thử lại sau." };
    }
  }
};
