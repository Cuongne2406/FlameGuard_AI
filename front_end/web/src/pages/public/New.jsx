import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { publicService } from "../../services/publicService";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await publicService.getNews();
        setNewsList(data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const featuredNews = newsList.find(n => n.isFeatured);
  const regularNews = newsList.filter(n => !n.isFeatured).slice(0, 4);

  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-8">
        {/* Cột trái: Nội dung chính */}
        <div className="col-span-12 lg:col-span-8">
          {loading ? (
            <div className="text-center py-10 font-bold text-slate-500">Đang tải tin tức...</div>
          ) : (
            <>
              {/* Banner nổi bật */}
              {featuredNews && (
                <Link
                  to={`/tin-tuc/${featuredNews.id}`}
                  className="block relative rounded-2xl overflow-hidden mb-12 group"
                >
                  <img
                    src={featuredNews.image}
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 text-white">
                    <span className="bg-blue-600 w-fit px-3 py-1 rounded text-xs mb-4">
                      {featuredNews.category.toUpperCase()}
                    </span>
                    <h1 className="text-2xl font-bold">
                      {featuredNews.title}
                    </h1>
                  </div>
                </Link>
              )}

              {/* Grid bài viết nhỏ */}
              <div className="grid grid-cols-2 gap-6">
                {regularNews.map((news) => (
                  <Link key={news.id} to={`/tin-tuc/${news.id}`} className="group">
                    <img
                      src={news.image}
                      className="rounded-xl mb-3 w-full h-44 object-cover"
                    />
                    <span className="text-blue-500 text-xs font-bold uppercase">
                      {news.category}
                    </span>
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors mt-1 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">
                      {news.date} • {(news.views / 1000).toFixed(1)}k lượt xem
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Cột phải: Sidebar (Tin đọc nhiều, Hashtag) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h2 className="font-bold mb-4 border-l-4 border-orange-500 pl-3">
              Tin đọc nhiều nhất
            </h2>
            <div className="space-y-4">
              {newsList.sort((a,b) => b.views - a.views).slice(0, 5).map(news => (
                <Link key={`popular-${news.id}`} to={`/tin-tuc/${news.id}`} className="block group">
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2 leading-snug">
                    {news.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1">{news.date} • {news.views} view</p>
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