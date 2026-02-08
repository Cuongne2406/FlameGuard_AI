import React, { useState, useEffect } from 'react';

const Achievements = () => {
  const [data, setData] = useState({ top3: [], classes: [] });
  const [loading, setLoading] = useState(true);

  // Gọi API Xếp hạng
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/v1/achievements/leaderboard", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
            setData(await response.json());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Format số điểm
  const formatPoint = (num) => new Intl.NumberFormat('en-US').format(num);

  return (
    <div className="flex flex-col h-full bg-[#F4F7FA] dark:bg-slate-900 p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1280px] mx-auto w-full">
        
        {/* HEADER */}
        <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-blue-700 dark:text-blue-400 uppercase tracking-tight">Bảng Xếp Hạng Thi Đua</h2>
            <p className="text-slate-500 mt-2">Vinh danh các cá nhân và tập thể xuất sắc nhất Học kỳ I</p>
        </div>

        {/* --- TOP 3 PODIUM (Bục vinh quang) --- */}
        <div className="flex justify-center items-end gap-4 mb-16 h-[350px]">
            {/* Hạng 2 (Bạc) */}
            {data.top3[1] && (
                <div className="flex flex-col items-center animate-fade-in-up delay-100">
                    <div className="relative mb-4">
                        <div className="size-20 rounded-full bg-slate-200 border-4 border-slate-300 flex items-center justify-center text-2xl font-bold text-slate-500 shadow-lg">
                            {data.top3[1].avatar_char}
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">#2</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-t-2xl shadow-sm border border-slate-100 dark:border-slate-700 w-64 text-center h-[240px] flex flex-col justify-center relative hover:-translate-y-2 transition-transform">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">{data.top3[1].full_name}</h3>
                        <p className="text-slate-500 text-sm mb-2">{data.top3[1].class_name}</p>
                        <p className="text-2xl font-black text-blue-600">{formatPoint(data.top3[1].points)} <span className="text-xs font-medium text-slate-400">PTS</span></p>
                    </div>
                </div>
            )}

            {/* Hạng 1 (Vàng) - Cao nhất */}
            {data.top3[0] && (
                <div className="flex flex-col items-center z-10 animate-fade-in-up">
                    <div className="relative mb-4">
                        <span className="material-symbols-outlined text-yellow-400 text-5xl absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">emoji_events</span>
                        <div className="size-28 rounded-full bg-yellow-100 border-4 border-yellow-400 flex items-center justify-center text-4xl font-bold text-yellow-600 shadow-xl ring-4 ring-yellow-400/20">
                            {data.top3[0].avatar_char}
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-sm font-bold px-3 py-0.5 rounded-full shadow-md">#1 CHAMPION</div>
                    </div>
                    <div className="bg-gradient-to-b from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-t-2xl shadow-xl border-t-4 border-yellow-400 w-72 text-center h-[280px] flex flex-col justify-center relative transform scale-105">
                        <h3 className="font-bold text-slate-900 dark:text-white text-xl">{data.top3[0].full_name}</h3>
                        <p className="text-slate-500 text-sm mb-3">{data.top3[0].class_name}</p>
                        <p className="text-4xl font-black text-yellow-500 drop-shadow-sm">{formatPoint(data.top3[0].points)}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Tổng điểm</p>
                    </div>
                </div>
            )}

            {/* Hạng 3 (Đồng) */}
            {data.top3[2] && (
                <div className="flex flex-col items-center animate-fade-in-up delay-200">
                    <div className="relative mb-4">
                        <div className="size-20 rounded-full bg-orange-100 border-4 border-orange-300 flex items-center justify-center text-2xl font-bold text-orange-600 shadow-lg">
                            {data.top3[2].avatar_char}
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">#3</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-t-2xl shadow-sm border border-slate-100 dark:border-slate-700 w-64 text-center h-[220px] flex flex-col justify-center relative hover:-translate-y-2 transition-transform">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">{data.top3[2].full_name}</h3>
                        <p className="text-slate-500 text-sm mb-2">{data.top3[2].class_name}</p>
                        <p className="text-2xl font-black text-blue-600">{formatPoint(data.top3[2].points)} <span className="text-xs font-medium text-slate-400">PTS</span></p>
                    </div>
                </div>
            )}
        </div>

        {/* --- DANH SÁCH CHI ĐOÀN --- */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Xếp Hạng Chi Đoàn</h3>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-lg">search</span>
                    <input className="pl-9 pr-4 py-1.5 border rounded-lg text-sm dark:bg-slate-900 dark:border-slate-600" placeholder="Tìm lớp..." />
                </div>
            </div>
            
            <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 font-bold">
                    <tr>
                        <th className="px-6 py-4 text-center w-16">Hạng</th>
                        <th className="px-6 py-4">Tên Chi Đoàn</th>
                        <th className="px-6 py-4">Tổng Điểm</th>
                        <th className="px-6 py-4">Xu Hướng</th>
                        <th className="px-6 py-4 text-right">Thành viên</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                    {loading ? (
                        <tr><td colSpan="5" className="p-8 text-center text-slate-400">Đang tính điểm...</td></tr>
                    ) : data.classes.length === 0 ? (
                        <tr><td colSpan="5" className="p-8 text-center text-slate-400">Chưa có dữ liệu thi đua</td></tr>
                    ) : (
                        data.classes.map((cls) => (
                            <tr key={cls.class_name} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4 text-center">
                                    <div className={`size-8 mx-auto flex items-center justify-center rounded-full font-bold ${
                                        cls.rank === 1 ? 'bg-yellow-100 text-yellow-600' : 
                                        cls.rank === 2 ? 'bg-slate-100 text-slate-600' :
                                        cls.rank === 3 ? 'bg-orange-100 text-orange-600' : 'text-slate-500'
                                    }`}>
                                        {cls.rank}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                                    Chi Đoàn {cls.class_name}
                                </td>
                                <td className="px-6 py-4 font-black text-lg text-slate-800 dark:text-white">
                                    {formatPoint(cls.total_points)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">
                                        <span className="material-symbols-outlined text-sm">trending_up</span>
                                        {cls.trend}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-slate-500">
                                    {cls.member_count} sinh viên
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
};

export default Achievements;