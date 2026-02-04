import React from 'react';

const Home = () => {
  return (
    <div className="p-8 text-center">
      <h2 className="text-3xl font-bold text-blue-600">Trang Chủ Hệ Thống</h2>
      <p className="mt-4">Chào mừng đến với LHU YouthHub</p>
      <a href="/login" className="text-blue-500 underline mt-4 block">Đăng nhập ngay</a>
    </div>
  );
};

export default Home;