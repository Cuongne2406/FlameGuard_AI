import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const News = () => {
  const [newsEvents, setNewsEvents] = useState([]);
  const [spotlightNews, setSpotlightNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch('http://127.0.0.1:8000/api/v1/events/', {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          const now = new Date();
          
          // 1. Lọc sự kiện ĐÃ QUA (Past Events)
          const pastEvents = data.filter(ev => new Date(ev.start_time) < now);

          // 2. Sắp xếp mới nhất lên đầu
          pastEvents.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

          if (pastEvents.length > 0) {
            setSpotlightNews(pastEvents[0]); // Tin mới nhất làm Banner
            setNewsEvents(pastEvents.slice(1)); // Các tin còn lại
          }
        }
      } catch (err) {
        console.error("Lỗi tải tin tức:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-8">
        
        {/* Cột trái: Nội dung chính */}
        <div className="col-span-12 lg:col-span-8">
          
          {/* Banner Tiêu điểm (Tin mới nhất) */}
          {loading ? (
             <div className="h-[400px] bg-gray-200 rounded-2xl animate-pulse mb-12"></div>
          ) : spotlightNews ? (
            <Link
              to={`/tin-tuc/${spotlightNews.id}`}
              className="block relative rounded-2xl overflow-hidden mb-12 group shadow-xl"
            >
              <img
                src={spotlightNews.image_url || "https://picsum.photos/800/400"}
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="bg-blue-600 w-fit px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg">
                  TIÊU ĐIỂM
                </span>
                <h1 className="text-2xl md:text-4xl font-black leading-tight mb-2 drop-shadow-md">
                  {spotlightNews.title}
                </h1>
                <p className="text-gray-300 text-sm line-clamp-2 md:w-3/4">
                    {spotlightNews.description}
                </p>
              </div>
            </Link>
          ) : (
             <div className="text-center py-20 text-gray-400">Chưa có tin tức nào.</div>
          )}

          {/* Grid bài viết nhỏ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newsEvents.map((item) => (
              <Link key={item.id} to={`/tin-tuc/${item.id}`} className="group flex flex-col h-full">
                <div className="rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100 relative h-52">
                    <img
                    src={item.image_url || `https://picsum.photos/seed/${item.id}/400/250`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={item.title}
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-gray-600 shadow-sm">
                        {new Date(item.start_time).toLocaleDateString('vi-VN')}
                    </div>
                </div>
                
                <span className="text-blue-600 text-[10px] font-black uppercase tracking-wider mb-1">
                  Hoạt động đã qua
                </span>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors leading-snug mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {item.description || "Xem chi tiết nội dung sự kiện..."}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Cột phải: Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-24">
            <h2 className="font-bold mb-6 border-l-4 border-orange-500 pl-3 uppercase text-sm tracking-widest">
              Tin đọc nhiều nhất
            </h2>
            <div className="space-y-6">
                {/* Giả lập tin đọc nhiều (Có thể lấy random từ newsEvents) */}
                {newsEvents.slice(0, 5).map((news, idx) => (
                    <Link key={idx} to={`/tin-tuc/${news.id}`} className="flex gap-4 group">
                        <span className="text-3xl font-black text-gray-200 group-hover:text-orange-500 transition-colors">0{idx+1}</span>
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                {news.title}
                            </h4>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                                {new Date(news.start_time).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
export default News;