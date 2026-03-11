import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { Share2, MessageCircle, ChevronLeft } from "lucide-react";
import { publicService } from "../../services/publicService";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await publicService.getNewsDetail(id);
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news detail:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-slate-500">Đang tải...</div>;
  if (!news) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-red-500">Không tìm thấy bài viết.</div>;

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
            {news.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <img
              src={news.authorAvatar}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-bold text-gray-800">
                {news.author}
              </p>
              <p>{news.date} • {news.readTime}</p>
            </div>
          </div>
        </header>

        <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed space-y-6" dangerouslySetInnerHTML={{ __html: news.content }} />
        {/* Bình luận & Chia sẻ */}
        <footer className="mt-12 pt-8 border-t">
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                <Share2 size={16} /> Chia sẻ bài viết
              </button>
            </div>
            <div className="text-gray-400 flex items-center gap-2">
              <MessageCircle size={18} /> {news.commentsCount} Bình luận
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