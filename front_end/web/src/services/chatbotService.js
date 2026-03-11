import { apiClient } from './apiClient';

export const chatbotService = {
  sendMessage: async (message) => {
    try {
      // return await apiClient('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) });

      // Mock Data 
      return new Promise((resolve) => {
        setTimeout(() => {
          let reply = "Xin chào! Mình là trợ lý ảo của Hệ thống thanh niên. Bạn cần giúp gì không ạ?";
          
          if (message.toLowerCase().includes("điểm rèn luyện")) {
            reply = "Điểm rèn luyện của bạn hiện tại là 85 điểm (Loại Tốt). Bạn có thể tham gia thêm các hoạt động tình nguyện sắp tới để cộng thêm điểm nhé!";
          } else if (message.toLowerCase().includes("mùa hè xanh")) {
            reply = "Chiến dịch Mùa hè xanh 2026 đang mở đăng ký. Bạn có thể chắp cánh cùng các bạn sinh viên khác tại Huyện Định Quán. Bạn muốn lấy link đăng ký không?";
          } else if (message.toLowerCase().includes("đoàn phí")) {
            reply = "Bạn đã hoàn thành đóng Đoàn phí kỳ 1 năm học 2025-2026. Nếu có thắc mắc, bạn có thể kiểm tra mục Ví Đoàn viên.";
          }

          resolve({
            success: true,
            response: reply
          });
        }, 1000);
      });
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      return { success: false, response: "Xin lỗi, hiện tại hệ thống AI đang bận. Vui lòng thử lại sau." };
    }
  }
};
