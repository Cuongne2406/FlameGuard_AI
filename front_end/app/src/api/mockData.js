export const mockEvents = [
  {
    id: '1',
    title: 'Mùa Hè Xanh 2026',
    organizer: 'Đoàn Trường ĐH Lạc Hồng',
    date: '15/07/2026',
    location: 'Huyện Xuân Lộc, Đồng Nai',
    image: 'https://res.cloudinary.com/dtb6uvcw7/image/upload/v1/events/mhx_default.jpg',
    points: 15,
    status: 'Upcoming',
    description: 'Chiến dịch tình nguyện lớn nhất năm dành cho sinh viên.'
  },
  {
    id: '2',
    title: 'Hội thảo AI & Bạn',
    organizer: 'Đoàn Khoa CNTT',
    date: '20/04/2026',
    location: 'Hội trường G',
    image: 'https://res.cloudinary.com/dtb6uvcw7/image/upload/v1/events/ai_workshop.jpg',
    points: 5,
    status: 'Registration Open',
    description: 'Tìm hiểu về ứng dụng AI trong học tập và công việc.'
  }
];

export const mockUser = {
  id: 'user-123',
  full_name: 'Nguyễn Văn A',
  student_id: '123000999',
  class_name: '23CT112',
  university: 'ĐH Lạc Hồng',
  phone_number: '0901234567',
  email: 'sv.demo@lhu.edu.vn',
  device_id: 'YH-DEV-7788-9900',
  training_score: 85,
  level: 3,
  avatar_url: 'https://i.pravatar.cc/150?u=user-123',
  skills: {
    leadership: 80,
    technical: 75,
    communication: 90,
    creativity: 65,
    analysis: 85
  },
  certificates: [
    { id: 'c1', title: 'Chứng nhận Mùa Hè Xanh 2025', date: '20/08/2025', issuer: 'Đoàn Trường' },
    { id: 'c2', title: 'Tiếng Anh B1', date: '10/01/2026', issuer: 'Trung tâm Ngoại ngữ' }
  ]
};
