import React from 'react';
import { Link, useParams } from "react-router-dom";
import { Share2, MessageCircle, ChevronLeft } from "lucide-react";

const NewsDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumb chuyên nghiệp */}
      <div className="max-w-4xl mx-auto px-6 py-6 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">
          Trang chủ
        </Link>{" "}
        <span>/</span>
        <Link
          to="/tin-tuc"
          className="hover:text-blue-600 font-medium text-blue-600 flex items-center gap-1"
        >
          <ChevronLeft size={14} /> Tin tức hoạt động
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-6">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
            Chiến dịch Mùa hè xanh 2024: Khởi động hành trình tình nguyện tại xã
            Đắk Nông
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <img
              src="https://i.pravatar.cc/40"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-bold text-gray-800">
                Ban Thông tin - Truyền thông
              </p>
              <p>24/05/2024 • 5 phút đọc</p>
            </div>
          </div>
        </header>

        <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed space-y-6">
          <p className="text-lg font-medium">
            Hòa chung không khí sôi nổi của tuổi trẻ cả nước, Đoàn Khoa chính
            thức khởi động...
          </p>
          <img
            src="https://picsum.photos/900/500"
            className="w-full rounded-2xl shadow-lg"
          />
          <p>
            Năm nay, chiến dịch tập trung vào các công trình phần việc cụ thể
            thực tế như xây dựng đường nông thôn, lắp đặt hệ thống đèn năng
            lượng mặt trời...
          </p>

          <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-800 mb-2">
              Mục tiêu trọng điểm:
            </h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>Hoàn thành 2km đường bê tông liên thôn.</li>
              <li>Trao tặng 20 suất học bổng cho học sinh nghèo.</li>
            </ul>
          </div>
        </div>

        {/* Bình luận & Chia sẻ */}
        <footer className="mt-12 pt-8 border-t">
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                <Share2 size={16} /> Chia sẻ bài viết
              </button>
            </div>
            <div className="text-gray-400 flex items-center gap-2">
              <MessageCircle size={18} /> 12 Bình luận
            </div>
          </div>

          {/* Comment Box mẫu */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <textarea
              className="w-full p-4 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
              placeholder="Viết bình luận của bạn..."
            ></textarea>
            <button className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-xs float-right">
              Gửi bình luận
            </button>
            <div className="clear-both"></div>
          </div>
        </footer>
      </article>
    </div>
  );
};
export default NewsDetail;