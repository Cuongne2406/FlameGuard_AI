import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { Share2, MessageCircle, ChevronLeft, Calendar, MapPin, Users } from "lucide-react";

const NewsDetail = () => {
  const { id } = useParams(); // Lấy ID sự kiện từ URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
        try {
            const token = localStorage.getItem("access_token");
            // Gọi API lấy chi tiết sự kiện (giả sử backend hỗ trợ get by ID)
            // Nếu backend chưa có api /events/{id}, bạn có thể fetch list rồi find (tạm thời)
            // Tốt nhất là backend nên có: GET /api/v1/events/{id}
            
            // Cách tạm thời (Fetch all rồi lọc - hơi chậm nhưng chạy được ngay với API hiện tại):
            const res = await fetch('http://127.0.0.1:8000/api/v1/events/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                const foundEvent = data.find(e => e.id.toString() === id);
                setEvent(foundEvent);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchEventDetail();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 italic">Đang tải nội dung...</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Không tìm thấy bài viết này.</div>;

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 py-6 flex items-center gap-2 text-sm text-gray-500 border-b border-gray-100 mb-8">
        <Link to="/" className="hover:text-blue-600 font-medium">Trang chủ</Link>
        <span>/</span>
        <Link to="/tin-tuc" className="hover:text-blue-600 font-medium">Tin tức</Link>
        <span>/</span>
        <span className="text-gray-400 truncate max-w-[200px]">{event.title}</span>
      </div>

      <article className="max-w-4xl mx-auto px-6">
        <header className="mb-10 text-center md:text-left">
            <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                Sự kiện đã diễn ra
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                {event.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-500 border-y border-gray-100 py-4">
                <div className="flex items-center gap-2">
                    <img src="https://ui-avatars.com/api/?name=Youth+Hub&background=0D8ABC&color=fff" className="w-8 h-8 rounded-full" alt="Author" />
                    <span className="font-bold text-gray-700">Ban Truyền Thông</span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{new Date(event.start_time).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{event.max_participants} người tham gia</span>
                </div>
            </div>
        </header>

        {/* Nội dung chính */}
        <div className="prose prose-blue prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
          
          <p className="text-xl font-medium text-gray-900 italic border-l-4 border-blue-500 pl-4">
             "{event.description?.split('.')[0]}..."
          </p>

          <img
            src={event.image_url}
            alt={event.title}
            className="w-full rounded-3xl shadow-2xl my-8"
          />

          <p className="whitespace-pre-line">
            {event.description}
          </p>

          {/* Block thông tin tóm tắt */}
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 not-prose mt-12">
            <h3 className="font-black text-gray-800 mb-4 uppercase text-sm tracking-widest flex items-center gap-2">
                <MapPin size={18} className="text-red-500"/> Tổng kết địa điểm & Thời gian
            </h3>
            <ul className="space-y-3 text-sm font-medium text-gray-600">
              <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Địa điểm tổ chức:</span>
                  <span className="font-bold text-gray-900">{event.location}</span>
              </li>
              <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Thời gian bắt đầu:</span>
                  <span className="font-bold text-gray-900">{new Date(event.start_time).toLocaleString('vi-VN')}</span>
              </li>
              <li className="flex justify-between">
                  <span>Điểm rèn luyện cấp:</span>
                  <span className="font-bold text-orange-600">+{event.points} điểm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bài viết */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-200">
              <Share2 size={18} /> Chia sẻ sự kiện này
            </button>
            <div className="text-gray-400 flex items-center gap-2 text-sm font-medium">
              <MessageCircle size={18} /> Tính năng bình luận đang bảo trì
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default NewsDetail;