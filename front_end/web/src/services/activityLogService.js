import { apiClient } from './apiClient';

export const activityLogService = {
  getLogs: async (filters = {}) => {
    try {
      // return await apiClient('/admin/activity-log', { params: filters });

      // Mock Data 
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              time: "26/10/2023 14:32:01",
              user: "Admin_Hau",
              initials: "AH",
              role: "Super Admin",
              action: "Xóa Chiến dịch",
              target: 'Chiến dịch "Mùa Hè Xanh 2024"',
              type: "danger",
            },
            {
              id: 2,
              time: "26/10/2023 14:30:15",
              user: "User_Khoa_CNTT",
              initials: "KC",
              role: "Bí thư Khoa",
              action: "Đăng nhập",
              target: "System Access",
              type: "info",
            },
            {
              id: 3,
              time: "26/10/2023 14:15:00",
              user: "System_Auto",
              initials: "SYS",
              role: "System",
              action: "Sao lưu tự động",
              target: "Database Snapshot",
              type: "success",
            },
            {
              id: 4,
              time: "26/10/2023 13:45:22",
              user: "BiThu_Lop18",
              initials: "BL",
              role: "Bí thư Lớp",
              action: "Cập nhật Hồ sơ",
              target: "Sinh viên: Nguyễn Văn A",
              type: "neutral",
            },
            {
              id: 5,
              time: "26/10/2023 10:12:05",
              user: "BanTruyenThong",
              initials: "BT",
              role: "Ban Truyền thông",
              action: "Đăng bài viết",
              target: 'Bài viết: "Chào tân sinh viên"',
              type: "neutral",
            },
          ]);
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }
  }
};
