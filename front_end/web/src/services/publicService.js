import { apiClient } from './apiClient';

export const publicService = {
  getHomeData: async () => {
    try {
      // return await apiClient('/public/home');
      
      // Mock Data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            featuredEvent: {
              title: "Đại hội Đại biểu Đoàn TNCS Hồ Chí Minh Nhiệm kỳ 2024 - 2027",
              desc: "Hành trình kết nối sức trẻ, sáng tạo và khát vọng cống hiến của sinh viên Khoa CNTT.",
              image: "https://images.unsplash.com/photo-1523240715630-34160408b495?auto=format&fit=crop&q=80"
            },
            news: [
              {
                id: 1,
                date: "12/10/2024",
                category: "Tình nguyện",
                title: "Ra quân Chiến dịch Mùa hè xanh 2024: Hành trình 30 ngày cống hiến",
                desc: "Lễ ra quân đã thu hút hơn 300 tình nguyện viên tham gia với mục tiêu hỗ trợ cộng đồng vùng sâu vùng xa...",
                image: "https://picsum.photos/seed/11/600/400"
              },
              {
                id: 2,
                date: "15/10/2024",
                category: "Học thuật",
                title: "Cuộc thi Lập trình sinh viên quốc tế ICPC vòng loại miền Trung",
                desc: "Đội tuyển sinh viên đại diện tham dự vòng thi quốc tế tại khu vực miền Trung và đạt nhiều thành tích tốt...",
                image: "https://picsum.photos/seed/12/600/400"
              }
            ],
            upcomingEvents: [
              { day: "20", month: "10", title: "Giải bóng đá Đại hội Khoa CNTT 2024", category: "Bóng đá nam" },
              { day: "25", month: "10", title: "Hội diễn Văn nghệ Truyền thống lần IV", category: "Văn nghệ" },
              { day: "02", month: "11", title: "Hiến máu tình nguyện đợt 2 năm 2024", category: "Nhân đạo" }
            ],
            featuredStudent: {
              name: "Nguyễn Hoàng Nam",
              title: "Sinh viên 5 tốt cấp Thành phố",
              desc: "Với điểm học tập xuất sắc đạt 3.8/4.0 cùng hàng loạt thành tích nổi bật trong công tác Đoàn - Hội.",
              image: "https://i.pravatar.cc/300?img=32"
            }
          });
        }, 300);
      });
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
      // return await apiClient('/public/academic');

      // Mock Data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 1, title: "Đề thi mẫu Cấu trúc dữ liệu & Giải thuật 2024", type: "PDF", size: "2.4 MB", downloads: 1200 },
            { id: 2, title: "Slide Bài giảng Nhập môn Công nghệ Phần mềm", type: "PPTX", size: "15.2 MB", downloads: 850 },
            { id: 3, title: "Hướng dẫn thực hành Cơ sở phân tán", type: "PDF", size: "5.1 MB", downloads: 420 },
            { id: 4, title: "Tài liệu ôn thi Lập trình mạng", type: "DOCX", size: "1.8 MB", downloads: 2100 }
          ]);
        }, 300);
      });
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
      // return await apiClient(`/public/news/${id}`);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Number(id),
            title: `Tin tức chi tiết số ${id}`,
            category: 'Hoạt động',
            date: '24/05/2024',
            readTime: '5 phút đọc',
            author: 'Ban Thông tin - Truyền thông',
            authorAvatar: 'https://i.pravatar.cc/40',
            image: `https://picsum.photos/seed/${id}/900/500`,
            content: `
              <p class="text-lg font-medium mb-4">Hòa chung không khí sôi nổi của tuổi trẻ cả nước, Đoàn Khoa chính thức khởi động...</p>
              <img src="https://picsum.photos/seed/${id + 10}/900/500" class="w-full rounded-2xl shadow-lg my-6" />
              <p class="mb-4">Năm nay, chiến dịch tập trung vào các công trình phần việc cụ thể thực tế như xây dựng đường nông thôn, lắp đặt hệ thống đèn năng lượng mặt trời...</p>
              <div class="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500 my-6">
                <h3 class="font-bold text-blue-800 mb-2">Mục tiêu trọng điểm:</h3>
                <ul class="list-disc ml-5 space-y-1">
                  <li>Hoàn thành 2km đường bê tông liên thôn.</li>
                  <li>Trao tặng 20 suất học bổng cho học sinh nghèo.</li>
                </ul>
              </div>
            `,
            commentsCount: 12
          });
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching news detail:', error);
      return null;
    }
  }
};
