import React from 'react';
import { Link } from "react-router-dom";

const News = () => {
  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-8">
        {/* Cột trái: Nội dung chính */}
        <div className="col-span-12 lg:col-span-8">
          {/* Banner nổi bật */}
          <Link
            to="/tin-tuc/1"
            className="block relative rounded-2xl overflow-hidden mb-12 group"
          >
            <img
              src="https://picsum.photos/800/400"
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 text-white">
              <span className="bg-blue-600 w-fit px-3 py-1 rounded text-xs mb-4">
                TIÊU ĐIỂM
              </span>
              <h1 className="text-2xl font-bold">
                Lễ ra quân Chiến dịch Tình nguyện Hè 2024: Nhiệt huyết tuổi trẻ
              </h1>
            </div>
          </Link>

          {/* Grid bài viết nhỏ */}
          <div className="grid grid-cols-2 gap-6">
            {[2, 3, 4, 5].map((id) => (
              <Link key={id} to={`/tin-tuc/${id}`} className="group">
                <img
                  src={`https://picsum.photos/seed/${id}/400/250`}
                  className="rounded-xl mb-3 w-full h-44 object-cover"
                />
                <span className="text-blue-500 text-xs font-bold uppercase">
                  Hoạt động
                </span>
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors mt-1">
                  Chương trình "Áo ấm cho em" tại vùng cao 2024
                </h3>
                <p className="text-xs text-gray-400 mt-2">
                  20/05/2024 • 1.2k lượt xem
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Cột phải: Sidebar (Tin đọc nhiều, Hashtag) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h2 className="font-bold mb-4 border-l-4 border-orange-500 pl-3">
              Tin đọc nhiều nhất
            </h2>
            {/* List tin nhỏ ở đây */}
          </div>
        </div>
      </main>
    </div>
  );
};
export default News;