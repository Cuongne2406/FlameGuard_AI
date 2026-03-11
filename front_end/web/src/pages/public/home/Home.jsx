import React, { useState, useEffect } from "react";
import { QrCode, CreditCard, BookOpen } from "lucide-react";
import { publicService } from "../../../services/publicService";

// 1. Định nghĩa Component QuickAction
const QuickAction = ({ icon: Icon, title, desc, color }) => (
  <div
    className={`${color} p-6 rounded-[2rem] border border-transparent hover:border-blue-200 hover:shadow-xl transition-all group cursor-pointer`}
  >
    <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
      <Icon className="text-blue-600" size={24} />
    </div>
    <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

// 2. Định nghĩa Component EventItem
const EventItem = ({ day, month, title, category }) => (
  <div className="flex items-center gap-4 mb-6 last:mb-0 group cursor-pointer">
    <div className="bg-blue-50 w-14 h-14 rounded-2xl flex flex-col items-center justify-center border border-blue-100 group-hover:bg-blue-600 transition-colors">
      <span className="text-lg font-black text-blue-600 group-hover:text-white leading-none">
        {day}
      </span>
      <span className="text-[10px] font-bold text-blue-400 group-hover:text-blue-100 uppercase">
        Th{month}
      </span>
    </div>
    <div className="flex-1">
      <span className="text-[10px] font-black text-blue-600/50 uppercase tracking-widest">
        {category}
      </span>
      <h4 className="text-sm font-bold text-gray-700 leading-tight group-hover:text-blue-600 transition-colors">
        {title}
      </h4>
    </div>
  </div>
);
const PublicHome = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeData = await publicService.getHomeData();
        setData(homeData);
      } catch (error) {
        console.error("Failed to fetch public home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Đang tải dữ liệu...</div>;
  if (!data) return <div className="p-8 text-center text-red-500 font-bold">Lỗi tải dữ liệu.</div>;

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 2. Hero Banner */}
        <section className="relative rounded-[32px] overflow-hidden bg-slate-900 h-[450px] mb-12 shadow-2xl">
          <img
            src={data.featuredEvent?.image || "https://images.unsplash.com/photo-1523240715630-34160408b495?auto=format&fit=crop&q=80"}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 max-w-2xl text-white">
            <span className="bg-blue-500 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest">
              Tin nổi bật
            </span>
            <h1 className="text-4xl font-bold mt-4 leading-tight">
              {data.featuredEvent?.title}
            </h1>
            <p className="mt-4 text-gray-300 text-sm leading-relaxed">
              {data.featuredEvent?.desc}
            </p>
            <div className="flex gap-4 mt-8">
              <button className="bg-blue-600 px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                Xem chi tiết &rarr;
              </button>
              <button className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-xl font-bold text-sm border border-white/20 hover:bg-white/20">
                Lịch trình
              </button>
            </div>
          </div>
        </section>

        {/* 3. Lối tắt nhanh */}
        <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-6 uppercase text-xs tracking-wider">
          <span className="text-blue-600">⚡</span> Lối tắt nhanh cho Đoàn viên
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <QuickAction
            icon={QrCode}
            title="Điểm danh QR"
            desc="Quét mã nhanh để ghi nhận tham gia các hoạt động, sự kiện."
            color="bg-blue-50"
          />
          <QuickAction
            icon={CreditCard}
            title="Thẻ điện tử"
            desc="Xem thông tin định danh Đoàn viên số của bạn ngay tại đây."
            color="bg-cyan-50"
          />
          <QuickAction
            icon={BookOpen}
            title="Nhật ký Đoàn viên"
            desc="Theo dõi quá trình rèn luyện cá nhân và các hoạt động."
            color="bg-indigo-50"
          />
        </div>

        {/* 4. Tin tức & Sự kiện */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cột trái: Tin tức */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                Tin tức hoạt động
              </h2>
              <a
                href="#"
                className="text-blue-600 text-xs font-bold hover:underline"
              >
                VÀO TIN TỨC &rarr;
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.news?.map((newsItem) => (
                <div
                  key={newsItem.id}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="h-44 overflow-hidden bg-gray-200 relative">
                    <img
                      src={newsItem.image}
                      className="w-full h-full object-cover group-hover:scale-110 transition-duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold">
                      {newsItem.date}
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] text-blue-600 font-black uppercase">
                      {newsItem.category}
                    </span>
                    <h3 className="font-bold text-gray-800 mt-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {newsItem.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic leading-relaxed">
                      {newsItem.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột phải: Lịch sự kiện */}
          <aside>
            <h2 className="text-xl font-bold text-gray-800 mb-8 tracking-tight">
              Lịch sự kiện sắp tới
            </h2>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              {data.upcomingEvents?.map((evt, idx) => (
                <EventItem
                  key={idx}
                  day={evt.day}
                  month={evt.month}
                  title={evt.title}
                  category={evt.category}
                />
              ))}
              <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 hover:text-blue-600 transition-all">
                XEM TẤT CẢ LỊCH
              </button>
            </div>
          </aside>
        </div>

        {/* 5. Gương mặt tiêu biểu (Dương mặt trẻ) */}
        <section className="mt-20 bg-blue-50/50 rounded-[40px] p-10 border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src={data.featuredStudent?.image || "https://i.pravatar.cc/300?img=32"}
                    alt="Leader"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-blue-600 p-3 rounded-2xl shadow-lg text-white">
                  <BookOpen size={20} />
                </div>
              </div>
            </div>
            <div className="md:col-span-8">
              <span className="text-blue-600 text-[11px] font-black uppercase tracking-widest">
                Gương mặt tiêu biểu của tuần
              </span>
              <h2 className="text-4xl font-black text-slate-800 mt-2">
                {data.featuredStudent?.name}
              </h2>
              <p className="text-blue-600 font-bold mt-1 text-sm">
                Bí thư Chi đoàn CNTT-01 • Sinh viên năm 3
              </p>
              <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm italic text-gray-600 text-sm leading-relaxed border-l-4 border-blue-500">
                "Với tinh thần 'Đâu cần thanh niên có, việc gì khó có thanh
                niên', Nam đã xuất sắc dẫn dắt đội tình nguyện hoàn thành 3 dự
                án hỗ trợ cộng đồng trong tháng 9, nhận danh hiệu Chiến sĩ thi
                đua cấp Đoàn trường."
              </div>
              <div className="flex gap-4 mt-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-700">
                    GPA: 3.8/4.0
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">
                    Học tập
                  </p>
                </div>
                <div className="w-px h-10 bg-gray-200 mx-2" />
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-700">100+</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">
                    Ngày CTXH
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PublicHome;
